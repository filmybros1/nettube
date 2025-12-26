
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import Row from './components/Row.tsx';
import DetailModal from './components/DetailModal.tsx';
import { fetchMoviesByCategory } from './services/geminiService.ts';
import { Movie, CategoryData } from './types.ts';
import { CATEGORIES } from './constants.tsx';

const App: React.FC = () => {
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsApiKey, setNeedsApiKey] = useState(false);

  const getAIStudio = () => (window as any).aistudio;

  const checkApiKey = async () => {
    try {
      const aistudio = getAIStudio();
      const hasKey = aistudio ? await aistudio.hasSelectedApiKey() : false;
      
      if (!hasKey && !process.env.API_KEY) {
        setNeedsApiKey(true);
      } else {
        setNeedsApiKey(false);
        loadContent();
      }
    } catch (e) {
      loadContent();
    }
  };

  const handleOpenKeyDialog = async () => {
    const aistudio = getAIStudio();
    if (aistudio) {
      await aistudio.openSelectKey();
    }
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
        // Pick a truly random featured movie from the first valid category
        const randomMovie = validCategories[0].movies[Math.floor(Math.random() * validCategories[0].movies.length)];
        setFeaturedMovie(randomMovie);
      }
    } catch (err) {
      console.error("Critical content load failure:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkApiKey();
  }, []);

  if (needsApiKey) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/20 via-transparent to-pink-900/10 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center">
            <div className="mb-14 relative group">
                <div className="absolute -inset-8 bg-violet-600/30 blur-3xl rounded-full group-hover:bg-violet-500/50 transition-all duration-700" />
                <div className="relative h-32 w-32 rounded-[2.5rem] bg-gradient-to-tr from-violet-600 to-fuchsia-500 shadow-2xl flex items-center justify-center">
                   <div className="h-16 w-16 text-white flex items-center justify-center">
                        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M10 15.17L19.19 6 21 7.83 10 18.83 3 11.83 4.83 10 10 15.17z"/></svg>
                   </div>
                </div>
            </div>
            <h1 className="mb-6 text-6xl font-black tracking-tighter text-white">MIDNIGHT <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">CINEMA</span></h1>
            <p className="mb-14 max-w-sm text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px] leading-[2.2]">
              A premium artificial intelligence interface for global cinematic discovery.
            </p>
            <button 
              onClick={handleOpenKeyDialog}
              className="group relative px-14 py-6 rounded-full bg-white transition-all hover:scale-105 active:scale-95 shadow-[0_30px_60px_rgba(255,255,255,0.1)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-violet-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative text-sm font-black uppercase tracking-[0.3em] text-black">Establish Uplink</span>
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-12 text-[9px] font-black text-gray-700 uppercase tracking-[0.6em] hover:text-violet-400 transition-colors duration-500"
            >
              Protocol Documentation
            </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-violet-500 selection:text-white">
      <Navbar />
      
      <main className="relative pb-60">
        <Hero movie={featuredMovie} onInfoClick={setSelectedMovie} />
        
        <div className="relative z-10 space-y-40 -mt-40 lg:-mt-80">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-80 space-y-8">
              <div className="relative h-20 w-20">
                  <div className="absolute inset-0 rounded-full border-2 border-violet-500/10" />
                  <div className="absolute inset-0 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
              </div>
              <p className="text-gray-600 font-black tracking-[0.6em] uppercase text-[9px] animate-pulse">Syncing Visual Repository</p>
            </div>
          ) : (
            <div className="space-y-32">
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

      <footer className="border-t border-white/5 bg-[#030303] py-60 px-8 lg:px-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24">
          <div className="space-y-12 col-span-1 lg:col-span-2">
            <h3 className="text-white font-black text-5xl tracking-tighter">MIDNIGHT<span className="text-violet-500">CINEMA</span></h3>
            <p className="max-w-md font-bold text-gray-600 leading-loose text-sm uppercase tracking-widest">
              Automated cinematic curation powered by deep reasoning models and the global open-web repository.
            </p>
          </div>
          <div className="space-y-10">
            <h4 className="text-white/30 font-black uppercase tracking-[0.6em] text-[10px]">Curation</h4>
            <ul className="space-y-6 text-xs font-black text-gray-500 uppercase tracking-[0.3em]">
              <li className="hover:text-violet-400 cursor-pointer transition-all hover:translate-x-2">Full English</li>
              <li className="hover:text-violet-400 cursor-pointer transition-all hover:translate-x-2">Hindi Cinema</li>
              <li className="hover:text-violet-400 cursor-pointer transition-all hover:translate-x-2">Premium Originals</li>
            </ul>
          </div>
          <div className="space-y-10">
            <h4 className="text-white/30 font-black uppercase tracking-[0.6em] text-[10px]">Security</h4>
            <ul className="space-y-6 text-xs font-black text-gray-500 uppercase tracking-[0.3em]">
              <li className="hover:text-violet-400 cursor-pointer transition-all hover:translate-x-2">Privacy</li>
              <li className="hover:text-violet-400 cursor-pointer transition-all hover:translate-x-2">Legal</li>
              <li className="hover:text-violet-400 cursor-pointer transition-all hover:translate-x-2">License</li>
            </ul>
          </div>
        </div>
        <div className="mt-60 pt-14 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[9px] text-gray-800 font-black uppercase tracking-[0.8em]">
          <span>© 2025 MIDNIGHT MEDIA ARCHIVE</span>
          <span className="mt-8 md:mt-0 opacity-40">GEMINI HYBRID UPLINK SYNC</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
