import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, style, postType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const styleDescriptions: Record<string, string> = {
      elegant: "luxury style, gold accents, dark background, serif fonts, premium sophisticated feel",
      vibrant: "bold neon colors, gradient backgrounds, modern sans-serif fonts, energetic pop style",
      minimal: "clean white background, minimal elements, thin modern fonts, lots of whitespace, editorial",
      rustic: "warm earth tones, kraft paper textures, handwritten fonts, cozy artisan feel",
    };

    const postTypeDescriptions: Record<string, string> = {
      tip: "a business TIP post with a short catchy headline and a brief tip text. Include a lightbulb or tip icon element",
      promo: "a PROMOTIONAL post announcing a special offer or new flavor. Include price or discount badge element",
      recipe: "a RECIPE CARD post showing ingredients list and a small step-by-step. Beautiful food styling",
      motivational: "an INSPIRATIONAL quote post with a motivational phrase about entrepreneurship or food business",
      beforeAfter: "a BEFORE/AFTER transformation post showing plain corn vs gorgeous gourmet popcorn",
      carousel: "a CAROUSEL COVER slide post with a catchy title that makes people want to swipe",
    };

    const styleDesc = styleDescriptions[style] || styleDescriptions.vibrant;
    const typeDesc = postTypeDescriptions[postType] || postTypeDescriptions.tip;

    const imagePrompt = `Create a professional Instagram post design (square 1:1) for a gourmet popcorn business called "Palomitas Redonditas".

This is ${typeDesc}.

Topic/Content: ${prompt}

Visual Style: ${styleDesc}

IMPORTANT DESIGN RULES:
- This is a DESIGNED POST, not just a photo. It should look like a professional Canva/graphic design post.
- Include TEXT ON THE IMAGE with a headline and short body text in SPANISH.
- Use beautiful typography hierarchy (big headline, smaller body text).
- Include decorative elements like icons, shapes, borders, or badges.
- Include the brand name "Palomitas Redonditas" subtly at the bottom.
- Make it look like a real business Instagram post that gets high engagement.
- The text should be readable and well-positioned.
- Include popcorn imagery as part of the design composition.
- Make it scroll-stopping and professional.`;

    // Generate image
    const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: imagePrompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!imageResponse.ok) {
      if (imageResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Límite de solicitudes excedido. Intenta de nuevo en unos segundos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (imageResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await imageResponse.text();
      console.error("Image generation error:", imageResponse.status, t);
      throw new Error("Error generating image");
    }

    const imageData = await imageResponse.json();
    
    let imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      const content = imageData.choices?.[0]?.message?.content;
      if (typeof content === "string" && content.startsWith("data:image")) {
        imageUrl = content;
      } else if (Array.isArray(content)) {
        const imgPart = content.find((p: any) => p.type === "image_url" || p.type === "image");
        imageUrl = imgPart?.image_url?.url || imgPart?.url;
      }
    }

    if (!imageUrl) {
      console.error("Full API response:", JSON.stringify(imageData).substring(0, 2000));
      throw new Error("No image generated");
    }

    // Generate caption for the feed
    const captionResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Eres una community manager experta para "Palomitas Redonditas", un negocio de palomitas gourmet.

Genera el CAPTION que va en la descripción del post de Instagram (NO en la imagen, sino abajo del post).

Reglas:
- Primera línea: un hook que capture atención (pregunta, dato curioso, o frase impactante)
- Segundo párrafo: contenido de valor relacionado al tema
- Tercer párrafo: call-to-action claro (guardar, compartir, comentar, o comprar)
- Último bloque: 15-20 hashtags relevantes mezclando populares y de nicho
- Usa emojis estratégicamente (no excesivos)
- Tono: cercano, profesional, apasionado por las palomitas
- Escribe en español

Formato exacto:
CAPTION:
[hook + contenido + CTA]

HASHTAGS:
[hashtags]`,
          },
          {
            role: "user",
            content: `Tipo de post: ${postType || "tip"}. Tema: ${prompt}.`,
          },
        ],
      }),
    });

    let caption = "🍿 ¡Palomitas gourmet que enamoran! ✨\n\nGuarda este post para después 📌\n\n#PalomitasGourmet #Popcorn #Emprendimiento";
    if (captionResponse.ok) {
      const captionData = await captionResponse.json();
      caption = captionData.choices?.[0]?.message?.content || caption;
    }

    return new Response(JSON.stringify({ imageUrl, caption }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("instagram-generator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
