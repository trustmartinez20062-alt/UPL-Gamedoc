import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// ── CORS — restrict to production domains ─────────────────────────────
const ALLOWED_ORIGINS = [
  "https://gamedoctor.uy",
  "https://www.gamedoctor.uy",
  "https://game-doctor.vercel.app",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") ?? "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
}

// ── Rate Limiter (in-memory, per-IP, 5 req / 15 min) ──────────────────
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 5;
const ipBuckets = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  let timestamps = ipBuckets.get(ip) ?? [];
  timestamps = timestamps.filter((t) => now - t < RATE_WINDOW_MS);

  if (timestamps.length >= RATE_MAX) {
    ipBuckets.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  ipBuckets.set(ip, timestamps);
  return false;
}

// ── Input Validation ───────────────────────────────────────────────────
function sanitize(str: unknown, maxLen = 500): string {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim().slice(0, maxLen);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function isValidAction(action: string): action is "create" | "update" | "delete" {
  return ["create", "update", "delete"].includes(action);
}

// ── Main Handler ───────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método no permitido" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  }

  try {
    // ── Rate Limit Check ──────────────────────────────────────────────
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("cf-connecting-ip") ??
      "unknown";

    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ error: "Demasiadas solicitudes. Intenta de nuevo en 15 minutos." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 429,
        }
      );
    }

    // ── Payload Size Check ────────────────────────────────────────────
    const contentLength = parseInt(req.headers.get("content-length") ?? "0");
    if (contentLength > 10_000) {
      return new Response(
        JSON.stringify({ error: "Payload demasiado grande" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 413,
        }
      );
    }

    // ── Auth ──────────────────────────────────────────────────────────
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No autorizado — falta Authorization header");
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("No autorizado");
    }

    // Check if user is admin in public.profiles
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      throw new Error("Solo los administradores pueden realizar esta acción");
    }

    // ── Parse & Validate Body ─────────────────────────────────────────
    const body = await req.json() as Record<string, unknown>;
    const action = sanitize(body.action, 10);

    if (!isValidAction(action)) {
      throw new Error("Acción no reconocida. Valores permitidos: create, update, delete");
    }

    // ── CREATE ─────────────────────────────────────────────────────────
    if (action === "create") {
      const email = sanitize(body.email, 254);
      const password = body.password;
      const nombre = sanitize(body.nombre, 100);
      const role = sanitize(body.role, 10);

      if (!email || !isValidEmail(email)) throw new Error("Email inválido");
      if (!password || typeof password !== "string" || password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres");
      }
      if (password.length > 128) throw new Error("Contraseña demasiado larga");
      if (!nombre) throw new Error("Nombre es requerido");
      if (role !== "admin" && role !== "subadmin") throw new Error("Rol inválido");

      const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createError) throw createError;

      const { error: insertError } = await supabaseClient.from("profiles").insert({
        id: newUser.user.id,
        nombre,
        role,
        email,
      });

      if (insertError) throw insertError;

      return new Response(JSON.stringify({ message: "Usuario creado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // ── UPDATE ─────────────────────────────────────────────────────────
    if (action === "update") {
      const userId = sanitize(body.userId, 36);
      if (!userId) throw new Error("userId es requerido");

      const updateData: Record<string, string> = {};
      if (body.email) {
        const email = sanitize(body.email, 254);
        if (!isValidEmail(email)) throw new Error("Email inválido");
        updateData.email = email;
      }
      if (body.password) {
        if (typeof body.password !== "string" || body.password.length < 8) {
          throw new Error("La contraseña debe tener al menos 8 caracteres");
        }
        if (body.password.length > 128) throw new Error("Contraseña demasiado larga");
        updateData.password = body.password;
      }

      if (Object.keys(updateData).length > 0) {
        const { error: updateAuthError } = await supabaseClient.auth.admin.updateUserById(
          userId,
          updateData
        );
        if (updateAuthError) throw updateAuthError;
      }

      // Update Profile
      const nombre = body.nombre ? sanitize(body.nombre, 100) : undefined;
      const email = body.email ? sanitize(body.email, 254) : undefined;
      const profileUpdate: Record<string, string> = {};
      if (nombre) profileUpdate.nombre = nombre;
      if (email) profileUpdate.email = email;

      if (Object.keys(profileUpdate).length > 0) {
        const { error: updateProfileError } = await supabaseClient
          .from("profiles")
          .update(profileUpdate)
          .eq("id", userId);

        if (updateProfileError) throw updateProfileError;
      }

      return new Response(JSON.stringify({ message: "Usuario actualizado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // ── DELETE ─────────────────────────────────────────────────────────
    if (action === "delete") {
      const userId = sanitize(body.userId, 36);
      if (!userId) throw new Error("userId es requerido");

      // Prevent self-deletion
      if (userId === user.id) {
        throw new Error("No puedes eliminar tu propia cuenta");
      }

      const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(userId);
      if (deleteError) throw deleteError;

      return new Response(JSON.stringify({ message: "Usuario eliminado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    throw new Error("Acción no reconocida");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      status: 400,
    });
  }
});
