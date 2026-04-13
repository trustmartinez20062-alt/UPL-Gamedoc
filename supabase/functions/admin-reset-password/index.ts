import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// ── CORS — restrict to production domains ─────────────────────────────
const ALLOWED_ORIGINS = [
  "https://gamed-one.vercel.app",
  "https://game-doctor.vercel.app",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") ?? "";
  const isLocal = origin.includes("localhost") || origin.includes("127.0.0.1");
  const allowedOrigin = (ALLOWED_ORIGINS.includes(origin) || isLocal) ? origin : ALLOWED_ORIGINS[0];
  
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

  try {
    if (req.method !== "POST") throw new Error("Método no permitido");

    // ── Client Init ──────────────────────────────────────────────────
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      throw new Error("Configuración del servidor incompleta");
    }

    const supabaseClient = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No autorizado");

    // ── Get Caller Identity ──────────────────────────────────────────
    const { data: { user: caller }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !caller) throw new Error("Token inválido");

    const { data: callerProfile } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", caller.id)
      .single();

    // ── Parse Request ────────────────────────────────────────────────
    const body = await req.json() as any;
    const action = sanitize(body.action, 10);
    const userId = body.userId ? sanitize(String(body.userId), 36).toLowerCase() : null;
    const isSelf = (userId === caller.id.toLowerCase());
    const isAdmin = (callerProfile?.role === "admin");

    // Security Check: Admin can do anything, Subadmin can only update SELF
    if (!isAdmin && (!isSelf || action !== "update")) {
      return new Response(JSON.stringify({ error: "Permiso denegado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // ── CREATE ────────────────────────────────────────────────────────
    if (action === "create") {
      const email = sanitize(body.email, 254);
      const password = body.password as string;
      const nombre = sanitize(body.nombre, 100);

      const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createError) throw createError;

      // Anti-Trigger Delay: Es frecuente que triggers de BD inserten el perfil 
      // automáticamente. Esperamos 200ms para asegurar que nuestra sobreescritura funcione.
      await new Promise(resolve => setTimeout(resolve, 200));

      const { error: profileError } = await supabaseClient.from("profiles").upsert({
        id: newUser.user.id,
        nombre,
        role: "subadmin", // Siempre subadmin al crear
        email,
      }, { onConflict: 'id' });

      if (profileError) {
        console.error("Error al sincronizar perfil:", profileError);
        throw new Error(`Usuario creado pero perfil falló: ${profileError.message}`);
      }

      return new Response(JSON.stringify({ message: "Usuario creado con éxito", id: newUser.user.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // ── UPDATE ────────────────────────────────────────────────────────
    if (action === "update") {
      if (!userId) throw new Error("userId es requerido");

      const authUpdates: Record<string, string> = {};
      if (body.email) authUpdates.email = sanitize(body.email, 254);
      if (body.password) authUpdates.password = body.password as string;

      if (Object.keys(authUpdates).length > 0) {
        const { error: authUpErr } = await supabaseClient.auth.admin.updateUserById(userId, authUpdates);
        if (authUpErr) throw authUpErr;
      }

      const profileUpdates: Record<string, string> = {};
      if (body.nombre) profileUpdates.nombre = sanitize(body.nombre, 100);
      if (body.email) profileUpdates.email = sanitize(body.email, 254);

      if (Object.keys(profileUpdates).length > 0) {
        const { error: profUpErr } = await supabaseClient.from("profiles").upsert({
          id: userId,
          ...profileUpdates
        }, { onConflict: 'id' });
        if (profUpErr) throw profUpErr;
      }

      return new Response(JSON.stringify({ message: "Perfil actualizado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // ── DELETE ────────────────────────────────────────────────────────
    if (action === "delete") {
      if (!userId) throw new Error("userId es requerido");
      if (isSelf) throw new Error("No puedes eliminarte a ti mismo");

      const { error: delError } = await supabaseClient.auth.admin.deleteUser(userId);
      if (delError) throw delError;

      return new Response(JSON.stringify({ message: "Usuario eliminado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    throw new Error("Operación no permitida");

  } catch (error: any) {
    console.error("[Function Error]:", error.message);
    return new Response(JSON.stringify({ 
      error: error.message,
      code: error.code || null
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
