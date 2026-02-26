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
        // Get table definitions with SQL DDL from information_schema
        const dbUrl = Deno.env.get("SUPABASE_DB_URL");
        if (!dbUrl) {
          data = [{ table_name: "(SUPABASE_DB_URL not configured)", sql: "" }];
          break;
        }

        // Use PostgREST to query information_schema via a database function
        // Since we can't run raw SQL, we'll use the REST API openapi spec
        const res = await fetch(
          `${Deno.env.get("SUPABASE_URL")}/rest/v1/`,
          {
            headers: {
              apikey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
              Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
              Accept: "application/openapi+json",
            },
          }
        );

        if (res.ok) {
          const spec = await res.json();
          const definitions = spec.definitions || {};
          const sqlStatements: string[] = [];

          for (const [tableName, def] of Object.entries(definitions) as any[]) {
            if (tableName.startsWith("_") || tableName === "rpc") continue;
            const props = def.properties || {};
            const required = def.required || [];
            const columns: string[] = [];

            for (const [colName, colDef] of Object.entries(props) as any[]) {
              let colType = "text";
              const fmt = colDef.format || "";
              const pgType = colDef.description?.match(/Note:\nThis is a Primary Key/i) ? "" : "";

              if (fmt === "uuid") colType = "uuid";
              else if (fmt === "timestamp with time zone" || fmt === "timestamptz") colType = "timestamptz";
              else if (fmt === "timestamp without time zone") colType = "timestamp";
              else if (fmt === "bigint") colType = "bigint";
              else if (fmt === "integer" || colDef.type === "integer") colType = "integer";
              else if (fmt === "smallint") colType = "smallint";
              else if (fmt === "boolean" || colDef.type === "boolean") colType = "boolean";
              else if (fmt === "numeric" || fmt === "double precision") colType = fmt;
              else if (fmt === "text") colType = "text";
              else if (fmt === "jsonb" || fmt === "json") colType = fmt;
              else if (fmt === "date") colType = "date";
              else if (colDef.type === "string") colType = "text";
              else if (colDef.type === "number") colType = "numeric";

              const isPK = colDef.description?.includes("Primary Key");
              const hasDefault = colDef.default !== undefined;
              const notNull = required.includes(colName) ? " NOT NULL" : "";
              const defaultVal = isPK && colType === "uuid" ? " DEFAULT gen_random_uuid()" :
                hasDefault ? ` DEFAULT ${colDef.default}` : "";
              const pkStr = isPK ? " PRIMARY KEY" : "";

              columns.push(`  ${colName} ${colType}${pkStr}${defaultVal}${notNull}`);
            }

            const sql = `CREATE TABLE IF NOT EXISTS public.${tableName} (\n${columns.join(",\n")}\n);`;
            sqlStatements.push(sql);
          }

          if (sqlStatements.length === 0) {
            data = [{ info: "No hay tablas públicas en el esquema" }];
          } else {
            data = sqlStatements.map((sql) => {
              const match = sql.match(/public\.(\w+)/);
              return { table_name: match?.[1] || "unknown", sql };
            });
          }
        } else {
          await res.text();
          data = [{ table_name: "(sin tablas)", sql: "" }];
        }
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