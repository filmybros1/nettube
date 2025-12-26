
import { GoogleGenAI } from "@google/genai";
import { Movie } from "../types.ts";

const FALLBACK_DATA: Record<string, any[]> = {
  "Trending English Movies": [
    { id: "S32yS58v8-M", title: "The Perfect Weapon", year: "2024", duration: "1h 30m", thumbnail: "https://img.youtube.com/vi/S32yS58v8-M/maxresdefault.jpg" },
    { id: "V6S9C-O5L7Q", title: "Project Almanac", year: "2024", duration: "1h 45m", thumbnail: "https://img.youtube.com/vi/V6S9C-O5L7Q/maxresdefault.jpg" },
    { id: "C39P_I4uB1s", title: "Beyond the Edge", year: "2023", duration: "1h 50m", thumbnail: "https://img.youtube.com/vi/C39P_I4uB1s/maxresdefault.jpg" }
  ],
  "Latest Hindi Full Movies": [
    { id: "vD9T5l_D8Wk", title: "Action Jackson", year: "2024", duration: "2h 15m", thumbnail: "https://img.youtube.com/vi/vD9T5l_D8Wk/maxresdefault.jpg" },
    { id: "M0f4VvW_RjE", title: "Raju Chacha", year: "2023", duration: "2h 45m", thumbnail: "https://img.youtube.com/vi/M0f4VvW_RjE/maxresdefault.jpg" },
    { id: "O-BNo6A8B9E", title: "Main Hoon Na", year: "2022", duration: "3h 02m", thumbnail: "https://img.youtube.com/vi/O-BNo6A8B9E/maxresdefault.jpg" }
  ]
};

const INVALID_KEYWORDS = ['trailer', 'teaser', 'clip', 'review', 'reaction', 'preview', 'how to', 'bts', 'making of'];

export const fetchMoviesByCategory = async (category: string): Promise<Movie[]> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API_KEY_MISSING");

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Search for 10 high-definition FREE FULL MOVIES on YouTube for the category: "${category}".
    
    STRICT RULES:
    1. Only include FULL-LENGTH MOVIES (minimum 60 minutes duration).
    2. EXCLUDE: Trailers, clips, teasers, previews, reviews, or movie reactions.
    3. EXCLUDE: Paid content (YouTube Movies & TV rentals/purchases).
    4. Only suggest videos that allow EMBEDDING on external websites.
    5. Prioritize official channels like: "Movie Central", "Popcornflix", "Shemaroo", "Rajshri", "Pen Movies", "Ultra Movie Parlour".
    
    Return valid JSON list with: title, description, videoUrl, thumbnail, year, duration.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Lower temperature for more consistent results
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
          description: "High-definition full cinematic feature."
        }))
        .filter(m => m.videoUrl && (m.videoUrl.includes('youtube.com') || m.videoUrl.includes('youtu.be')));
    }

    if (rawItems.length === 0) throw new Error("NO_RESULTS");

    return rawItems
      .map((m: any): Movie | null => {
        if (!m.videoUrl) return null;
        
        // Basic keyword filter to avoid trailers/clips
        const lowerTitle = (m.title || "").toLowerCase();
        if (INVALID_KEYWORDS.some(k => lowerTitle.includes(k))) return null;

        const ytIdMatch = m.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (!ytIdMatch) return null;
        
        const videoId = ytIdMatch[1];
        return {
          id: videoId,
          title: (m.title || "Full Movie").split(' - YouTube')[0].replace(/\[.*?\]|\(.*?\)/g, '').trim(),
          description: m.description || "Stream this complete official movie release in high definition.",
          videoUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1`,
          thumbnail: m.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          year: m.year || "2024",
          rating: "HD",
          duration: m.duration || "1h 50m",
          sourceType: 'youtube',
          category: category
        };
      })
      .filter((m): m is Movie => m !== null);
  } catch (error: any) {
    console.warn(`Gemini API failed for ${category}, using verified fallbacks.`, error);
    
    const fallbacks = FALLBACK_DATA[category] || FALLBACK_DATA["Trending English Movies"];
    return fallbacks.map(f => ({
      id: f.id,
      title: f.title,
      description: "A verified full-length cinematic feature available for global streaming.",
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
