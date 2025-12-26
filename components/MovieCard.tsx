
import React from 'react';
import { Movie } from '../types';
import { Icons } from '../constants';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div 
      onClick={() => onClick(movie)}
      className="group relative h-40 min-w-[280px] cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95 md:h-48 md:min-w-[340px]"
    >
      <div className="absolute inset-0 bg-violet-600/20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <img 
        src={movie.thumbnail} 
        alt={movie.title}
        className="h-full w-full rounded-2xl object-cover border border-white/5 shadow-lg group-hover:border-white/20"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-5">
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-white truncate drop-shadow-md">{movie.title}</h4>
          <div className="flex items-center justify-between text-[10px] text-gray-300">
             <div className="flex items-center space-x-2">
                <span className="text-violet-400 font-bold uppercase tracking-tighter">{movie.rating}</span>
                <span>{movie.duration}</span>
             </div>
             <div className="h-6 w-6 rounded-full glass flex items-center justify-center">
               <Icons.Play className="h-3 w-3 text-white fill-current ml-0.5" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
