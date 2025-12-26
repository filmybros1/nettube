
import React from 'react';
import { Movie } from '../types.ts';
import { Icons } from '../constants.tsx';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div 
      onClick={() => onClick(movie)}
      className="group relative h-48 min-w-[320px] cursor-pointer transition-all duration-700 hover:scale-[1.03] active:scale-95 md:h-52 md:min-w-[380px]"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl blur-xl opacity-0 transition-opacity duration-700 group-hover:opacity-30" />
      
      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 shadow-2xl transition-all duration-500 group-hover:border-violet-500/50">
        <img 
          src={movie.thumbnail} 
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="space-y-3">
            <h4 className="text-lg font-black text-white leading-tight drop-shadow-lg line-clamp-2">
              {movie.title}
            </h4>
            
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                  <span className="text-violet-400">{movie.year}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span>{movie.duration}</span>
               </div>
               
               <div className="h-10 w-10 rounded-full glass border border-white/10 flex items-center justify-center translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                 <Icons.Play className="h-5 w-5 text-white fill-current ml-0.5" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
