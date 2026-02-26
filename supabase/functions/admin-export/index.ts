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
        data = [
          { name: "soporte-chat", verify_jwt: false, status: "deployed" },
          { name: "instagram-generator", verify_jwt: false, status: "deployed" },
          { name: "admin-export", verify_jwt: false, status: "deployed" },
        ];
        break;
      }
      case "secrets": {
        // We list known secret names (values are never exposed for security)
        const knownSecrets = [
          "LOVABLE_API_KEY",
          "SUPABASE_URL",
          "SUPABASE_ANON_KEY",
          "SUPABASE_SERVICE_ROLE_KEY",
          "SUPABASE_DB_URL",
          "SUPABASE_PUBLISHABLE_KEY",
        ];
        data = knownSecrets.map((name) => ({
          name,
          status: "configured",
          note: "Valor oculto por seguridad",
        }));
        break;
      }
      case "logs": {
        // Fetch recent auth audit logs
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Get recent sign-in activity from users
        const { data: users } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
        const logEntries: any[] = [];
        for (const u of users?.users || []) {
          if (u.last_sign_in_at) {
            logEntries.push({
              type: "sign_in",
              user_email: u.email,
              user_id: u.id,
              timestamp: u.last_sign_in_at,
            });
          }
          logEntries.push({
            type: "user_created",
            user_email: u.email,
            user_id: u.id,
            timestamp: u.created_at,
          });
        }
        data = logEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      }
      case "database": {
        // Since there are no public tables, generate a useful migration SQL
        // that documents the current project setup for replication
        const { data: users } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
        const { data: buckets } = await supabaseAdmin.storage.listBuckets();

        const sqlParts: string[] = [];

        sqlParts.push("-- =============================================");
        sqlParts.push("-- SQL DE MIGRACIÓN - Lovable Cloud Export");
        sqlParts.push("-- Generado: " + new Date().toISOString());
        sqlParts.push("-- =============================================\n");

        // Auth users as INSERT statements (for reference/migration)
        sqlParts.push("-- USUARIOS REGISTRADOS");
        sqlParts.push("-- (Para importar en otro proyecto, usa la API de Auth admin)");
        sqlParts.push("-- Total: " + (users?.users?.length || 0) + " usuarios\n");

        for (const u of users?.users || []) {
          sqlParts.push(`-- Usuario: ${u.email}`);
          sqlParts.push(`--   ID: ${u.id}`);
          sqlParts.push(`--   Creado: ${u.created_at}`);
          sqlParts.push(`--   Último login: ${u.last_sign_in_at || 'nunca'}`);
          sqlParts.push(`--   Provider: ${u.app_metadata?.provider || 'email'}`);
          sqlParts.push("");
        }

        // Storage buckets
        if (buckets && buckets.length > 0) {
          sqlParts.push("\n-- STORAGE BUCKETS");
          for (const b of buckets) {
            sqlParts.push(`INSERT INTO storage.buckets (id, name, public) VALUES ('${b.id}', '${b.name}', ${b.public});`);
          }
        } else {
          sqlParts.push("\n-- STORAGE: Sin buckets configurados");
        }

        // Edge functions info
        sqlParts.push("\n-- EDGE FUNCTIONS DESPLEGADAS");
        sqlParts.push("-- soporte-chat (verify_jwt: false)");
        sqlParts.push("-- instagram-generator (verify_jwt: false)");
        sqlParts.push("-- admin-export (verify_jwt: false)");

        // Secrets list
        sqlParts.push("\n-- SECRETS CONFIGURADOS");
        sqlParts.push("-- LOVABLE_API_KEY");
        sqlParts.push("-- SUPABASE_URL");
        sqlParts.push("-- SUPABASE_ANON_KEY");
        sqlParts.push("-- SUPABASE_SERVICE_ROLE_KEY");
        sqlParts.push("-- SUPABASE_DB_URL");
        sqlParts.push("-- SUPABASE_PUBLISHABLE_KEY");

        // Note about public schema
        sqlParts.push("\n-- ESQUEMA PÚBLICO");
        sqlParts.push("-- No hay tablas en el esquema público.");
        sqlParts.push("-- Este proyecto usa solo Auth + Edge Functions + Storage.");

        data = [{ sql: sqlParts.join("\n") }];
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