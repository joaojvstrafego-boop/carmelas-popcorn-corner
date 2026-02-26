import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Users, HardDrive, Zap, ArrowLeft, Loader2, KeyRound, ScrollText, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type ExportType = "users" | "storage" | "edge_functions" | "secrets" | "logs" | "database";

interface ExportSection {
  type: ExportType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const sections: ExportSection[] = [
  {
    type: "users",
    label: "Usuarios",
    description: "ID, email, fecha de registro, último login, proveedor de auth",
    icon: <Users className="h-6 w-6" />,
  },
  {
    type: "storage",
    label: "Storage / Archivos",
    description: "Buckets, archivos, tamaño, tipo MIME",
    icon: <HardDrive className="h-6 w-6" />,
  },
  {
    type: "edge_functions",
    label: "Edge Functions",
    description: "Funciones desplegadas, estado, configuración JWT",
    icon: <Zap className="h-6 w-6" />,
  },
  {
    type: "secrets",
    label: "Secrets",
    description: "Nombres de secrets configurados (valores ocultos por seguridad)",
    icon: <KeyRound className="h-6 w-6" />,
  },
  {
    type: "logs",
    label: "Logs / Actividad",
    description: "Registros de login, creación de cuentas y actividad reciente",
    icon: <ScrollText className="h-6 w-6" />,
  },
  {
    type: "database",
    label: "Database / Tablas",
    description: "Tablas del esquema público, columnas y estructura",
    icon: <Database className="h-6 w-6" />,
  },
];

function convertToCSV(data: Record<string, any>[]): string {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const val = row[h] ?? "";
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      })
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

function downloadCSV(csv: string, filename: string) {
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminExport() {
  const [loading, setLoading] = useState<ExportType | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExport = async (type: ExportType) => {
    setLoading(type);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const { data, error } = await supabase.functions.invoke("admin-export", {
        body: { type },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw error;

      const rows = data?.data || [];
      if (rows.length === 0) {
        toast({
          title: "Sin datos",
          description: `No hay datos de "${type}" para exportar.`,
        });
        return;
      }

      const csv = convertToCSV(rows);
      const date = new Date().toISOString().slice(0, 10);
      downloadCSV(csv, `${type}_export_${date}.csv`);

      toast({
        title: "Exportado ✓",
        description: `${rows.length} registros exportados como CSV.`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Error al exportar datos",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleExportAll = async () => {
    for (const section of sections) {
      await handleExport(section.type);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-display tracking-wide text-foreground">
              Exportar Datos
            </h1>
            <p className="text-muted-foreground text-sm">
              Descarga los datos del backend en formato CSV
            </p>
          </div>
          <Button
            onClick={handleExportAll}
            disabled={loading !== null}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar Todo
          </Button>
        </div>

        <div className="grid gap-4">
          {sections.map((section) => (
            <Card key={section.type} className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-lg font-body font-semibold text-foreground">
                  <span className="text-primary">{section.icon}</span>
                  {section.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground flex-1">
                  {section.description}
                </p>
                <Button
                  onClick={() => handleExport(section.type)}
                  disabled={loading !== null}
                  className="shrink-0 gap-2"
                >
                  {loading === section.type ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Exportar CSV
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}