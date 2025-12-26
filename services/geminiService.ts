
import { GoogleGenAI } from "@google/genai";
import { Movie } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchMoviesByCategory = async (category: string): Promise<Movie[]> => {
  try {
    const prompt = `Find 10 high-quality, popular videos for the category: "${category}". 
    
    CRITICAL INSTRUCTIONS FOR EMBEDDABILITY:
    1. PRIORITIZE: Official Trailers (from Rotten Tomatoes, Movieclips, or Studio channels), Documentaries, and Public Domain films.
    2. SOURCES: YouTube, Vimeo, Dailymotion, or Archive.org.
    3. STRICTLY AVOID: "YouTube Movies & TV" (Paid/Rentals) as they NEVER allow embedding. 
    4. Ensure the content is publicly accessible and allows third-party player embedding.
    
    Return a JSON array of objects with:
    - title: Clear title.
    - description: One line summary.
    - videoUrl: The direct link to the video.
    - thumbnail: High-res poster image URL.
    - year: Release year (e.g. 2024).
    - rating: Maturity rating (e.g. PG-13).
    - duration: Runtime (e.g. 2h 15m).
    - platform: One of 'youtube', 'vimeo', 'dailymotion', or 'direct'.
    
    Format:
    \`\`\`json
    [
      { "title": "...", "description": "...", "videoUrl": "...", "thumbnail": "...", "year": "...", "rating": "...", "duration": "...", "platform": "..." }
    ]
    \`\`\``;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const jsonMatch = text.match(/```json\s?([\s\S]*?)\s?```/) || text.match(/\[\s?\{[\s\S]*?\}\s?\]/);
    
    let rawMovies: any[] = [];
    if (jsonMatch) {
      try {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        rawMovies = JSON.parse(jsonStr);
      } catch (e) { console.error("JSON parse error:", e); }
    }

    if (rawMovies.length === 0) {
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      rawMovies = chunks.map((c: any) => ({
        title: c.web?.title,
        videoUrl: c.web?.uri,
        description: "Experience this cinematic content from across the web.",
        platform: 'other'
      })).filter(m => m.videoUrl);
    }

    return rawMovies
      .map((m: any, idx: number): Movie | null => {
        if (!m.videoUrl) return null;

        const url = m.videoUrl;
        let sourceType: Movie['sourceType'] = 'other';

        // Robust Platform Detection
        const ytIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        const vimeoIdMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
        const dailyIdMatch = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
        const isDirect = url.match(/\.(mp4|webm|ogg)$/i);

        if (ytIdMatch) sourceType = 'youtube';
        else if (vimeoIdMatch) sourceType = 'vimeo';
        else if (dailyIdMatch) sourceType = 'dailymotion';
        else if (isDirect) sourceType = 'direct';

        const videoId = ytIdMatch ? ytIdMatch[1] : 
                        vimeoIdMatch ? vimeoIdMatch[1] : 
                        dailyIdMatch ? dailyIdMatch[1] : 
                        `ext-${idx}-${category.replace(/\s/g, '')}`;

        return {
          id: videoId,
          title: (m.title || "Untitled Cinematic").replace(/ - YouTube$/, '').split(' | ')[0],
          description: m.description || "A highly rated title curated specifically for your profile.",
          videoUrl: url,
          thumbnail: m.thumbnail || (ytIdMatch ? `https://img.youtube.com/vi/${ytIdMatch[1]}/maxresdefault.jpg` : `https://picsum.photos/seed/${videoId}/800/450`),
          year: m.year || "2024",
          rating: m.rating || "PG-13",
          duration: m.duration || "2h",
          sourceType,
          category: category
        };
      })
      .filter((m): m is Movie => m !== null);
  } catch (error) {
    console.error("Gemini Multi-Source Fetch Error:", error);
    return [];
  }
};
