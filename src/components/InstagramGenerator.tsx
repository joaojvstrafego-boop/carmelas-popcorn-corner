import { useState } from "react";
import { Sparkles, Download, Copy, Check, Loader2, Image, Wand2 } from "lucide-react";
import { toast } from "sonner";

const STYLES = [
  { id: "vibrant", label: "Vibrante", emoji: "🎨", desc: "Colores neon, llamativo" },
  { id: "elegant", label: "Elegante", emoji: "✨", desc: "Lujo, dorado, premium" },
  { id: "minimal", label: "Minimalista", emoji: "🤍", desc: "Limpio, editorial" },
  { id: "rustic", label: "Rústico", emoji: "🪵", desc: "Artesanal, cálido" },
];

const PROMPTS = [
  "Palomitas de chocolate con lluvia de chispas",
  "Palomitas de fresa en cono de papel kraft",
  "Mesa de palomitas gourmet para evento",
  "Palomitas caramelo derretido close-up",
  "Box de palomitas con lazo de regalo",
  "Palomitas Oreo con topping crujiente",
];

const InstagramGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("vibrant");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imageUrl: string; caption: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) {
      toast.error("Escribe una descripción para tu imagen");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/instagram-generator`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt, style }),
        }
      );
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Error al generar");
      }
      const data = await resp.json();
      setResult(data);
      toast.success("¡Imagen generada! 🎉");
    } catch (e: any) {
      toast.error(e.message || "Error al generar la imagen");
    } finally {
      setLoading(false);
    }
  };

  const copyCaption = () => {
    if (!result?.caption) return;
    navigator.clipboard.writeText(result.caption);
    setCopied(true);
    toast.success("Caption copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = () => {
    if (!result?.imageUrl) return;
    const link = document.createElement("a");
    link.href = result.imageUrl;
    link.download = `palomitas-instagram-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Imagen descargada");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Wand2 className="w-4 h-4" />
          Generador con IA
        </div>
        <h3 className="font-display text-2xl md:text-3xl tracking-wider text-foreground">
          CREA POSTS INCREÍBLES
        </h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Describe lo que quieres y la IA generará una imagen profesional con caption listo para publicar
        </p>
      </div>

      {/* Style selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STYLES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStyle(s.id)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              style === s.id
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                : "border-border bg-card hover:border-muted-foreground/30"
            }`}
          >
            <span className="text-2xl">{s.emoji}</span>
            <p className="font-display text-base tracking-wider text-foreground mt-2">{s.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
            {style === s.id && (
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Prompt input */}
      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe tu imagen... Ej: Palomitas de Nutella con topping de chocolate derretido en un bowl elegante"
            className="w-full min-h-[100px] p-4 pr-12 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none text-sm"
          />
          <Image className="absolute top-4 right-4 w-5 h-5 text-muted-foreground" />
        </div>

        {/* Quick prompts */}
        <div className="flex flex-wrap gap-2">
          {PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => setPrompt(p)}
              className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs hover:bg-secondary/80 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={generate}
        disabled={loading || !prompt.trim()}
        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display text-xl tracking-wider hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            GENERANDO MAGIA...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            GENERAR IMAGEN
          </>
        )}
      </button>

      {/* Result */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Image preview */}
          <div className="relative group rounded-xl overflow-hidden border border-border bg-card">
            <img
              src={result.imageUrl}
              alt="Instagram post generado"
              className="w-full aspect-square object-cover"
            />
            <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-300 flex items-center justify-center">
              <button
                onClick={downloadImage}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display tracking-wider flex items-center gap-2 shadow-xl"
              >
                <Download className="w-5 h-5" />
                DESCARGAR
              </button>
            </div>
          </div>

          {/* Caption */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-lg tracking-wider text-foreground">CAPTION LISTO</h4>
              <button
                onClick={copyCaption}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
            <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
              {result.caption}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={downloadImage}
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-display tracking-wider flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Download className="w-5 h-5" />
              DESCARGAR IMAGEN
            </button>
            <button
              onClick={copyCaption}
              className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-display tracking-wider flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
            >
              <Copy className="w-5 h-5" />
              COPIAR CAPTION
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramGenerator;
