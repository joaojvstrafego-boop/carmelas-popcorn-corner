import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the caller is authenticated
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify caller is authenticated
    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );
    const { data: { user }, error: authError } = await anonClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { type } = await req.json();

    let data: any[] = [];

    switch (type) {
      case "users": {
        const { data: users, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
        if (error) throw error;
        data = (users?.users || []).map((u: any) => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          email_confirmed_at: u.email_confirmed_at,
          provider: u.app_metadata?.provider || "email",
          role: u.role,
        }));
        break;
      }
      case "storage": {
        const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();
        if (error) throw error;
        const allFiles: any[] = [];
        for (const bucket of buckets || []) {
          const { data: files } = await supabaseAdmin.storage.from(bucket.id).list("", { limit: 1000 });
          for (const file of files || []) {
            allFiles.push({
              bucket: bucket.id,
              name: file.name,
              created_at: file.created_at,
              updated_at: file.updated_at,
              size: file.metadata?.size || 0,
              mimetype: file.metadata?.mimetype || "",
            });
          }
        }
        data = allFiles;
        break;
      }
      case "edge_functions": {
        // List edge functions from config - we return what we know
        data = [
          { name: "soporte-chat", verify_jwt: false, status: "deployed" },
          { name: "instagram-generator", verify_jwt: false, status: "deployed" },
          { name: "admin-export", verify_jwt: false, status: "deployed" },
        ];
        break;
      }
      default:
        return new Response(JSON.stringify({ error: "Tipo no válido" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
