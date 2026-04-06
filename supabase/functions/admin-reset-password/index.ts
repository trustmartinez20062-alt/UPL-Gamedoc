import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
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

    // Get user from Authorization header to check if they are an admin
    const authHeader = req.headers.get("Authorization")!;
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader.replace("Bearer ", ""));

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

    const { action, userId, email, password, nombre, role } = await req.json();

    if (action === "create") {
      // 1. Create user in Auth
      const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createError) throw createError;

      // 2. Create profile
      const { error: insertError } = await supabaseClient.from("profiles").insert({
        id: newUser.user.id,
        nombre,
        role: role || "subadmin",
        email,
      });

      if (insertError) throw insertError;

      return new Response(JSON.stringify({ message: "Usuario creado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (action === "update") {
      if (!userId) throw new Error("userId es requerido");

      // Update Auth
      const updateData: any = {};
      if (email) updateData.email = email;
      if (password) updateData.password = password;

      if (Object.keys(updateData).length > 0) {
        const { error: updateAuthError } = await supabaseClient.auth.admin.updateUserById(userId, updateData);
        if (updateAuthError) throw updateAuthError;
      }

      // Update Profile
      const { error: updateProfileError } = await supabaseClient
        .from("profiles")
        .update({ nombre, email })
        .eq("id", userId);

      if (updateProfileError) throw updateProfileError;

      return new Response(JSON.stringify({ message: "Usuario actualizado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (action === "delete") {
      if (!userId) throw new Error("userId es requerido");

      // Delete Auth user (Cascade will delete profile)
      const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(userId);
      if (deleteError) throw deleteError;

      return new Response(JSON.stringify({ message: "Usuario eliminado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    throw new Error("Acción no reconocida");
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
