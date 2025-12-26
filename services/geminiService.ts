
import { GoogleGenAI } from "@google/genai";
import { Movie } from "../types.ts";

const FALLBACK_DATA: Record<string, any[]> = {
  "Global Trending Music Videos": [
    { id: "h8nIHZ-0kS4", title: "Starboy - The Weeknd ft. Daft Punk", year: "2024", duration: "4:33", thumbnail: "https://img.youtube.com/vi/h8nIHZ-0kS4/maxresdefault.jpg" },
    { id: "kJQP7kiw5Fk", title: "Despacito - Luis Fonsi ft. Daddy Yankee", year: "2024", duration: "4:41", thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg" },
    { id: "09R8_2nJtjg", title: "Sugar - Maroon 5", year: "2023", duration: "5:01", thumbnail: "https://img.youtube.com/vi/09R8_2nJtjg/maxresdefault.jpg" }
  ],
  "Pop Chart Toppers": [
    { id: "fHI8X4OXluQ", title: "Blinding Lights - The Weeknd", year: "2024", duration: "4:22", thumbnail: "https://img.youtube.com/vi/fHI8X4OXluQ/maxresdefault.jpg" },
    { id: "TUVcZfQe-Kw", title: "Levitating - Dua Lipa", year: "2024", duration: "3:50", thumbnail: "https://img.youtube.com/vi/TUVcZfQe-Kw/maxresdefault.jpg" }
  ]
};

export const fetchMoviesByCategory = async (category: string): Promise<Movie[]> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API_KEY_MISSING");

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Search for 10 high-definition OFFICIAL MUSIC VIDEOS on YouTube for: "${category}".
    Return valid JSON list with: title, description, videoUrl, thumbnail, year, duration.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const jsonMatch = text.match(/\[\s?\{[\s\S]*?\}\s?\]/);
    
    let rawItems: any[] = [];
    if (jsonMatch) {
      try {
        rawItems = JSON.parse(jsonMatch[0]);
      } catch (e) { /* ignore parse error */ }
    }

    if (rawItems.length === 0) {
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      rawItems = chunks
        .map((c: any) => ({
          title: c.web?.title,
          videoUrl: c.web?.uri,
          description: "Premium visual experience."
        }))
        .filter(m => m.videoUrl && (m.videoUrl.includes('youtube.com') || m.videoUrl.includes('youtu.be')));
    }

    if (rawItems.length === 0) throw new Error("NO_RESULTS");

    return rawItems
      .map((m: any, idx: number): Movie | null => {
        if (!m.videoUrl) return null;
        const ytIdMatch = m.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (!ytIdMatch) return null;
        const videoId = ytIdMatch[1];
        return {
          id: videoId,
          title: (m.title || "Untitled Track").split(' - YouTube')[0],
          description: m.description || "Immersive cinematic audio-visual journey.",
          videoUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1`,
          thumbnail: m.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          year: m.year || "2025",
          rating: "4K UHD",
          duration: m.duration || "4:00",
          sourceType: 'youtube',
          category: category
        };
      })
      .filter((m): m is Movie => m !== null);
  } catch (error: any) {
    console.warn(`Gemini API failed for ${category}, using fallback.`, error);
    
    const fallbacks = FALLBACK_DATA[category] || FALLBACK_DATA["Global Trending Music Videos"];
    return fallbacks.map(f => ({
      id: f.id,
      title: f.title,
      description: "Experience the ultimate audio-visual masterpiece in high fidelity.",
      videoUrl: `https://www.youtube.com/embed/${f.id}?autoplay=1`,
      thumbnail: f.thumbnail,
      year: f.year,
      rating: "HD",
      duration: f.duration,
      sourceType: 'youtube',
      category: category
    }));
  }
};
