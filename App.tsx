
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import Row from './components/Row.tsx';
import DetailModal from './components/DetailModal.tsx';
import { fetchMoviesByCategory } from './services/geminiService.ts';
import { Movie, CategoryData } from './types.ts';
import { CATEGORIES } from './constants.tsx';

// Removed conflicting window.aistudio declaration to resolve TypeScript errors as the type is provided by the global environment

const App: React.FC = () => {
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsApiKey, setNeedsApiKey] = useState(false);

  // Safely access aistudio from the window object
  const getAIStudio = () => (window as any).aistudio;

  const checkApiKey = async () => {
    try {
      const aistudio = getAIStudio();
      // Check if the user has already selected a paid API key via the dialog
      const hasKey = aistudio ? await aistudio.hasSelectedApiKey() : false;
      
      if (!hasKey && !process.env.API_KEY) {
        setNeedsApiKey(true);
      } else {
        setNeedsApiKey(false);
        loadContent();
      }
    } catch (e) {
      // Fallback to load content if aistudio check fails or is not present
      loadContent();
    }
  };

  const handleOpenKeyDialog = async () => {
    const aistudio = getAIStudio();
    if (aistudio) {
      // Open the API key selection dialog for users to provide a paid GCP project key
      await aistudio.openSelectKey();
    }
    // CRITICAL: Assume key selection was successful to avoid race conditions and proceed to the app
    setNeedsApiKey(false);
    loadContent();
  };

  const loadContent = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.all(
        CATEGORIES.map(async (cat) => {
          const movies = await fetchMoviesByCategory(cat);
          return { title: cat, movies };
        })
      );
      
      const validCategories = results.filter(r => r.movies.length > 0);
      setCategoriesData(validCategories);

      if (validCategories.length > 0) {
        setFeaturedMovie(validCategories[0].movies[0]);
      }
    } catch (err) {
      console.error("Content Load Failure:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkApiKey();
  }, []);

  if (needsApiKey) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6 text-center">
        <div className="mb-12 h-24 w-24 rounded-3xl bg-gradient-to-tr from-violet-600 to-pink-500 shadow-[0_0_50px_rgba(139,92,246,0.5)] animate-pulse" />
        <h1 className="mb-4 text-5xl font-black tracking-tighter text-white">NETTUBE MUSIC</h1>
        <p className="mb-10 max-w-sm text-gray-500 font-medium uppercase tracking-widest text-xs leading-relaxed">
          Premium cinematic experience requires a valid Gemini API connection.
        </p>
        <button 
          onClick={handleOpenKeyDialog}
          className="rounded-full bg-white px-12 py-5 text-sm font-black uppercase tracking-widest text-black transition hover:scale-105 active:scale-95"
        >
          Connect API Key
        </button>
        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-8 text-[10px] font-bold text-gray-700 uppercase tracking-widest hover:text-white transition"
        >
          Billing Documentation
        </a>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-violet-500 selection:text-white">
      <Navbar />
      
      <main className="relative pb-40">
        <Hero movie={featuredMovie} onInfoClick={setSelectedMovie} />
        
        <div className="relative z-10 space-y-24 -mt-32 lg:-mt-64">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-60 space-y-6">
              <div className="h-16 w-16 animate-spin rounded-full border-[2px] border-violet-500/20 border-t-violet-500" />
              <p className="text-gray-500 font-black tracking-[0.5em] uppercase text-[9px] animate-pulse">Syncing Visual Frequencies</p>
            </div>
          ) : (
            <div className="space-y-20">
              {categoriesData.map((category) => (
                <Row 
                  key={category.title} 
                  title={category.title} 
                  movies={category.movies} 
                  onMovieClick={setSelectedMovie}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedMovie && (
        <DetailModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      <footer className="border-t border-white/5 bg-black py-40 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
          <div className="space-y-10 col-span-1 lg:col-span-2">
            <h3 className="text-white font-black text-4xl tracking-tighter">NET<span className="text-violet-500">TUBE</span></h3>
            <p className="max-w-md font-medium text-gray-500 leading-relaxed">
              Curating the world's most evocative music videos through the lens of advanced generative intelligence.
            </p>
          </div>
          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-[0.4em] text-[10px]">Ecosystem</h4>
            <ul className="space-y-4 text-xs font-black text-gray-500 uppercase tracking-widest">
              <li className="hover:text-violet-400 cursor-pointer transition-colors">Charts</li>
              <li className="hover:text-violet-400 cursor-pointer transition-colors">Originals</li>
              <li className="hover:text-violet-400 cursor-pointer transition-colors">Labs</li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-[0.4em] text-[10px]">Company</h4>
            <ul className="space-y-4 text-xs font-black text-gray-500 uppercase tracking-widest">
              <li className="hover:text-violet-400 cursor-pointer transition-colors">Privacy</li>
              <li className="hover:text-violet-400 cursor-pointer transition-colors">Terms</li>
              <li className="hover:text-violet-400 cursor-pointer transition-colors">Contact</li>
            </ul>
          </div>
        </div>
        <div className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[8px] text-gray-700 font-black uppercase tracking-[0.5em]">
          <span>© 2025 NETTUBE MEDIA STUDIO</span>
          <span className="mt-6 md:mt-0 opacity-40">GEMINI HYBRID SYNC</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
