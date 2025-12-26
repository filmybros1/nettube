
export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  sourceType: 'youtube' | 'vimeo' | 'dailymotion' | 'direct' | 'other';
  year?: string;
  rating?: string;
  duration?: string;
  category?: string;
}

export interface CategoryData {
  title: string;
  movies: Movie[];
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}
