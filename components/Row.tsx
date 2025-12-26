
import React, { useRef } from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';
import { Icons } from '../constants';

interface RowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const Row: React.FC<RowProps> = ({ title, movies, onMovieClick }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const amount = dir === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      rowRef.current.scrollTo({ left: scrollLeft + amount, behavior: 'smooth' });
    }
  };

  if (movies.length === 0) return null;

  return (
    <div className="space-y-6 px-6 lg:px-24 mb-16">
      <div className="flex items-center justify-between">
        <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center space-x-3">
          <span className="h-4 w-1 bg-violet-500 rounded-full" />
          <span>{title}</span>
        </h2>
        <div className="flex space-x-2">
           <button onClick={() => scroll('left')} className="p-2 rounded-full glass hover:bg-white/10 transition">
             <Icons.ChevronLeft className="h-4 w-4" />
           </button>
           <button onClick={() => scroll('right')} className="p-2 rounded-full glass hover:bg-white/10 transition">
             <Icons.ChevronRight className="h-4 w-4" />
           </button>
        </div>
      </div>
      
      <div 
        ref={rowRef}
        className="flex items-center space-x-6 overflow-x-scroll no-scrollbar py-4"
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
        ))}
      </div>
    </div>
  );
};

export default Row;
