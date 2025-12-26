
import React from 'react';
import { Movie } from '../types.ts';
import { Icons } from '../constants.tsx';

interface HeroProps {
  movie: Movie | null;
  onInfoClick: (movie: Movie) => void;
}

const Hero: React.FC<HeroProps> = ({ movie, onInfoClick }) => {
  if (!movie) return (
    <div className="relative h-[90vh] w-full flex items-center justify-center bg-black">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="relative min-h-[100vh] w-full pt-20 px-6 lg:px-24 flex items-center overflow-hidden">
      {/* Immersive Ambient Glow Background */}
      <div className="absolute inset-0 -z-10 bg-black">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={movie.thumbnail} 
            alt="" 
            className="h-full w-full object-cover scale-125 blur-[120px] opacity-40 ambient-glow"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full max-w-7xl mx-auto z-10">
        <div className="lg:col-span-8 flex flex-col justify-center space-y-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-1">
                {[1,2,3].map(i => (
                  <div key={i} className="h-2 w-2 rounded-full bg-violet-500 border border-black" />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-400">
                Premium Selection
              </span>
            </div>
            
            <h1 className="text-7xl lg:text-[120px] font-black leading-[0.85] text-white tracking-tighter text-glow">
              {movie.title}
            </h1>

            <div className="flex items-center space-x-8 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              <span className="text-white bg-white/10 px-3 py-1 rounded">{movie.year}</span>
              <span className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                {movie.rating}
              </span>
              <span>{movie.duration}</span>
            </div>

            <p className="max-w-xl text-lg text-gray-300 font-medium leading-relaxed opacity-80">
              {movie.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            <button 
              onClick={() => onInfoClick(movie)}
              className="group relative flex items-center space-x-6 rounded-full bg-white px-14 py-6 text-black transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
            >
              <Icons.Play className="h-6 w-6 fill-current" />
              <span className="font-black uppercase tracking-widest text-sm">Experience</span>
            </button>
            <button 
              onClick={() => onInfoClick(movie)}
              className="flex items-center space-x-6 rounded-full glass px-14 py-6 text-white font-bold transition-all hover:bg-white/10"
            >
              <Icons.Info className="h-6 w-6" />
              <span className="font-black uppercase tracking-widest text-sm">Overview</span>
            </button>
          </div>
        </div>

        <div className="hidden lg:col-span-4 lg:flex items-center justify-center">
          <div className="relative group cursor-pointer" onClick={() => onInfoClick(movie)}>
            <div className="absolute inset-0 bg-violet-600/40 blur-[80px] rounded-full group-hover:bg-violet-500/60 transition-all duration-700" />
            <div className="relative h-[500px] w-80 overflow-hidden rounded-[2.5rem] border border-white/20 shadow-2xl transition-transform duration-700 group-hover:rotate-2 group-hover:scale-105">
              <img 
                src={movie.thumbnail} 
                alt={movie.title} 
                className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
