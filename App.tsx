
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Row from './components/Row';
import DetailModal from './components/DetailModal';
import { fetchMoviesByCategory } from './services/geminiService';
import { Movie, CategoryData } from './types';
import { CATEGORIES } from './constants';

const App: React.FC = () => {
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
          const firstCat = validCategories[0];
          setFeaturedMovie(firstCat.movies[0]);
        }
      } catch (error) {
        console.error("Load failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-white">
      <Navbar />
      
      <main className="relative pb-32">
        <Hero movie={featuredMovie} onInfoClick={setSelectedMovie} />
        
        <div className="relative z-10 space-y-8 lg:-mt-24">
          {isLoading && categoriesData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
              <p className="mt-6 text-gray-400 font-light tracking-widest uppercase text-xs">Calibrating cinematic experience...</p>
            </div>
          ) : (
            categoriesData.map((category) => (
              <Row 
                key={category.title} 
                title={category.title} 
                movies={category.movies} 
                onMovieClick={setSelectedMovie}
              />
            ))
          )}
        </div>
      </main>

      {selectedMovie && (
        <DetailModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      <footer className="border-t border-white/5 bg-[#0a0a0c] py-20 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 text-sm text-gray-500">
          <div className="space-y-4 col-span-2">
            <h3 className="text-white font-bold text-lg">NETTUBE</h3>
            <p className="max-w-sm font-light">
              Experience the future of streaming powered by Gemini API and global YouTube content. 
              Designed for high-performance cinematic discovery.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Discovery</h4>
            <ul className="space-y-2 font-light">
              <li className="hover:text-white cursor-pointer">New Releases</li>
              <li className="hover:text-white cursor-pointer">Top Trailers</li>
              <li className="hover:text-white cursor-pointer">Public Domain</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Support</h4>
            <ul className="space-y-2 font-light">
              <li className="hover:text-white cursor-pointer">Help Center</li>
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 uppercase tracking-[0.2em]">
          <span>© 2025 NETTUBE MEDIA GROUP</span>
          <span className="mt-4 md:mt-0">Powered by Gemini-3-Flash & YouTube Search Grounding</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
