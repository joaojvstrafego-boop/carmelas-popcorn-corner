import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, style } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const styleDescriptions: Record<string, string> = {
      elegant: "luxurious, elegant food photography style with golden tones, soft bokeh background, warm lighting, premium feel",
      vibrant: "vibrant, colorful pop-art style with bold neon colors, high contrast, energetic and eye-catching for social media",
      minimal: "clean minimalist style with white/neutral background, centered composition, modern typography space, editorial feel",
      rustic: "cozy rustic style with wooden textures, warm earth tones, handcrafted feel, artisan vibes",
    };

    const styleDesc = styleDescriptions[style] || styleDescriptions.vibrant;

    const imagePrompt = `Create a stunning Instagram post image for a gourmet popcorn business. 
Theme: ${prompt}. 
Style: ${styleDesc}. 
The image should be square (1:1 ratio), perfect for Instagram. 
Include beautiful gourmet popcorn as the main subject. 
Make it look professional, mouth-watering, and scroll-stopping. 
DO NOT include any text or words in the image.`;

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
    console.log("Image API response keys:", JSON.stringify(Object.keys(imageData)));
    console.log("Choice message keys:", JSON.stringify(Object.keys(imageData.choices?.[0]?.message || {})));
    
    // Try multiple paths to find the image
    let imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      // Sometimes the image is inline in content as base64
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

    // Generate caption
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
            content: `Eres una experta en marketing de Instagram para un negocio de palomitas gourmet llamado "Palomitas Redonditas". 
Genera captions creativos, emocionales y que generen engagement. 
Incluye emojis relevantes, call-to-action, y hashtags populares en español.
La respuesta debe tener este formato exacto:

CAPTION:
[el caption aquí]

HASHTAGS:
[los hashtags aquí]`,
          },
          {
            role: "user",
            content: `Genera un caption para Instagram sobre: ${prompt}. Estilo: ${style}.`,
          },
        ],
      }),
    });

    let caption = "🍿 ¡Palomitas gourmet que enamoran! ✨\n\n#PalomitasGourmet #Popcorn";
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
