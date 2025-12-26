
import React from 'react';
import { Movie } from '../types';
import { Icons } from '../constants';

interface HeroProps {
  movie: Movie | null;
  onInfoClick: (movie: Movie) => void;
}

const Hero: React.FC<HeroProps> = ({ movie, onInfoClick }) => {
  if (!movie) return (
    <div className="relative h-[85vh] w-full flex items-center justify-center">
      <div className="h-20 w-20 animate-pulse rounded-full border-4 border-violet-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="relative min-h-[90vh] w-full pt-20 px-6 lg:px-24 flex items-center overflow-hidden">
      {/* Background with Ambient Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img 
          src={movie.thumbnail} 
          alt="" 
          className="h-full w-full object-cover scale-105 blur-[80px] opacity-20"
        />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-[500px] w-[500px] bg-violet-600/20 blur-[120px] rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full max-w-7xl mx-auto">
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-bold uppercase tracking-widest border border-violet-500/20">
              Featured This Week
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white tracking-tight">
              {movie.title}
            </h1>
            <div className="flex items-center space-x-4 text-gray-400 text-sm font-medium">
              <span>{movie.year}</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full" />
              <span className="border border-white/20 px-2 rounded">{movie.rating}</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full" />
              <span>{movie.duration}</span>
            </div>
            <p className="max-w-xl text-lg text-gray-300/90 leading-relaxed font-light">
              {movie.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onInfoClick(movie)}
              className="flex items-center space-x-3 rounded-full bg-white px-10 py-4 text-black font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
            >
              <Icons.Play className="h-5 w-5 fill-current" />
              <span>Start Watching</span>
            </button>
            <button 
              onClick={() => onInfoClick(movie)}
              className="flex items-center space-x-3 rounded-full bg-white/5 border border-white/10 px-10 py-4 text-white font-bold transition-all hover:bg-white/10 backdrop-blur-md"
            >
              <Icons.Info className="h-5 w-5" />
              <span>See Details</span>
            </button>
          </div>
        </div>

        <div className="hidden lg:col-span-5 lg:flex items-center justify-center">
          <div className="relative group cursor-pointer float-animation" onClick={() => onInfoClick(movie)}>
            <div className="absolute inset-0 bg-violet-500/20 blur-2xl group-hover:bg-violet-500/40 transition-all rounded-3xl" />
            <img 
              src={movie.thumbnail} 
              alt={movie.title} 
              className="relative h-[480px] w-80 rounded-3xl object-cover border border-white/10 shadow-2xl transition-transform group-hover:scale-[1.02]" 
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="h-16 w-16 rounded-full glass flex items-center justify-center">
                 <Icons.Play className="h-8 w-8 text-white ml-1" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
