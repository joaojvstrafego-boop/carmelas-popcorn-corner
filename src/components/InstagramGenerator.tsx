import { useState } from "react";
import { Sparkles, Download, Copy, Check, Loader2, Wand2, Lightbulb, Tag, BookOpen, Heart, ArrowLeftRight, Layers } from "lucide-react";
import { toast } from "sonner";

const STYLES = [
  { id: "vibrant", label: "Vibrante", emoji: "🎨", desc: "Neon, moderno" },
  { id: "elegant", label: "Elegante", emoji: "✨", desc: "Lujo, premium" },
  { id: "minimal", label: "Minimalista", emoji: "🤍", desc: "Limpio, editorial" },
  { id: "rustic", label: "Rústico", emoji: "🪵", desc: "Artesanal, cálido" },
];

const POST_TYPES = [
  { id: "tip", label: "Dica / Tip", icon: Lightbulb, desc: "Post con consejo o tip útil", color: "text-yellow-400" },
  { id: "promo", label: "Promoción", icon: Tag, desc: "Oferta, descuento o novedad", color: "text-green-400" },
  { id: "recipe", label: "Receta", icon: BookOpen, desc: "Receta o ingredientes", color: "text-orange-400" },
  { id: "motivational", label: "Inspiración", icon: Heart, desc: "Frase motivacional", color: "text-pink-400" },
  { id: "beforeAfter", label: "Antes/Después", icon: ArrowLeftRight, desc: "Transformación del producto", color: "text-blue-400" },
  { id: "carousel", label: "Portada Carrusel", icon: Layers, desc: "Cover de carrusel", color: "text-purple-400" },
];

const PROMPTS: Record<string, string[]> = {
  tip: [
    "3 tips para conservar tus palomitas frescas por más tiempo",
    "Cómo elegir el mejor maíz para palomitas gourmet",
    "El secreto de la caramelización perfecta",
  ],
  promo: [
    "Nuevo sabor de temporada: Fresa con chocolate",
    "Promoción 2x1 en palomitas de Nutella",
    "Pack regalo para San Valentín",
  ],
  recipe: [
    "Receta de palomitas de Oreo paso a paso",
    "Cómo hacer palomitas de leche nido en casa",
    "Ingredientes para palomitas de coco y chocolate",
  ],
  motivational: [
    "Emprender con palomitas gourmet es posible",
    "De mi cocina a un negocio rentable",
    "Cada palomita cuenta: la constancia es la clave",
  ],
  beforeAfter: [
    "De maíz simple a palomitas gourmet premium",
    "Antes: palomitas normales. Después: obra de arte",
    "Transformación de sabor: antes y después del caramelo",
  ],
  carousel: [
    "5 errores al emprender con palomitas",
    "Guía completa de sabores gourmet",
    "Todo lo que necesitas para empezar tu negocio",
  ],
};

const InstagramGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("vibrant");
  const [postType, setPostType] = useState("tip");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imageUrl: string; caption: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) {
      toast.error("Escribe una descripción para tu post");
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
          body: JSON.stringify({ prompt, style, postType }),
        }
      );
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Error al generar");
      }
      const data = await resp.json();
      setResult(data);
      toast.success("¡Post generado! 🎉");
    } catch (e: any) {
      toast.error(e.message || "Error al generar el post");
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
    link.download = `palomitas-post-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Imagen descargada");
  };

  const currentPrompts = PROMPTS[postType] || PROMPTS.tip;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Wand2 className="w-4 h-4" />
          Generador con IA
        </div>
        <h3 className="font-display text-2xl md:text-3xl tracking-wider text-foreground">
          CREA POSTS PROFESIONALES
        </h3>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Posts con diseño, texto y legendas listos para publicar. Como si tuvieras un diseñador profesional.
        </p>
      </div>

      {/* Post Type Selector */}
      <div>
        <p className="text-sm text-muted-foreground mb-3 font-medium">Tipo de post:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {POST_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => { setPostType(t.id); setPrompt(""); }}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  postType === t.id
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                    : "border-border bg-card hover:border-muted-foreground/30"
                }`}
              >
                <Icon className={`w-6 h-6 ${t.color} mb-2`} />
                <p className="font-display text-base tracking-wider text-foreground">{t.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                {postType === t.id && (
                  <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Style selector */}
      <div>
        <p className="text-sm text-muted-foreground mb-3 font-medium">Estilo visual:</p>
        <div className="grid grid-cols-4 gap-3">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`p-3 rounded-xl border-2 transition-all duration-300 text-center ${
                style === s.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              <span className="text-xl">{s.emoji}</span>
              <p className="font-display text-sm tracking-wider text-foreground mt-1">{s.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt input */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground font-medium">¿De qué trata tu post?</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: 3 tips para conservar tus palomitas frescas por más tiempo..."
          className="w-full min-h-[90px] p-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none text-sm"
        />

        {/* Quick prompts */}
        <div className="flex flex-wrap gap-2">
          {currentPrompts.map((p) => (
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
            CREANDO TU POST...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            GENERAR POST
          </>
        )}
      </button>

      {loading && (
        <p className="text-center text-muted-foreground text-sm animate-pulse">
          Diseñando imagen con texto + generando caption... esto puede tomar unos segundos ⏳
        </p>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Image preview */}
          <div className="relative group rounded-xl overflow-hidden border border-border bg-card shadow-2xl">
            <img
              src={result.imageUrl}
              alt="Post de Instagram generado"
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
              <div>
                <h4 className="font-display text-lg tracking-wider text-foreground">CAPTION PARA EL POST</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Copia y pega en la descripción de Instagram</p>
              </div>
              <button
                onClick={copyCaption}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "¡Copiado!" : "Copiar"}
              </button>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {result.caption}
              </p>
            </div>
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
              onClick={() => { setResult(null); setPrompt(""); }}
              className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-display tracking-wider flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              CREAR OTRO
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramGenerator;
