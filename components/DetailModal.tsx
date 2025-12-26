
import React, { useState, useMemo, useEffect } from 'react';
import { Movie } from '../types.ts';
import { Icons } from '../constants.tsx';

interface DetailModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ movie, onClose }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  if (!movie) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const playerConfig = useMemo(() => {
    const url = movie.videoUrl;
    
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch) {
      const videoId = ytMatch[1];
      // Robust YouTube embed config
      return {
        type: 'iframe',
        url: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}&widget_referrer=${encodeURIComponent(origin)}&fs=1&cc_load_policy=1`
      };
    }

    return { type: 'iframe', url };
  }, [movie.videoUrl, origin]);

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [movie.id]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-[#0a0a0c]/98 backdrop-blur-2xl transition-opacity animate-in fade-in duration-500"
        onClick={onClose}
      />

      <div className="relative h-full w-full max-w-6xl overflow-y-auto no-scrollbar glass shadow-[0_0_100px_rgba(0,0,0,0.9)] animate-in slide-in-from-bottom-12 duration-500 lg:h-[90vh] lg:rounded-3xl lg:border lg:border-white/10">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 z-[110] flex h-12 w-12 items-center justify-center rounded-full glass text-white transition hover:bg-white/10 hover:scale-110 active:scale-90"
        >
          <Icons.Close className="h-6 w-6" />
        </button>

        <div className="flex flex-col">
          <div className="relative aspect-video w-full bg-black flex items-center justify-center">
            {isLoading && !hasError && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-4 bg-black">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Preparing Cinematic Stream</p>
              </div>
            )}

            {playerConfig.type === 'iframe' && !hasError ? (
              <iframe
                key={movie.id}
                className={`h-full w-full lg:rounded-t-3xl transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                src={playerConfig.url}
                title={movie.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setHasError(true);
                  setIsLoading(false);
                }}
              ></iframe>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center space-y-8 bg-zinc-900 lg:rounded-t-3xl p-12 text-center">
                <div className="z-10 space-y-4">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-600/10 border border-red-500/20">
                     <Icons.Play className="h-10 w-10 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-widest text-white">Playback Error</h3>
                  <p className="text-gray-400 max-w-md mx-auto">This official source might have specific viewing restrictions for your region or embedding limits.</p>
                  <a 
                    href={`https://www.youtube.com/watch?v=${movie.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="z-10 inline-flex items-center space-x-3 rounded-full bg-white px-10 py-4 font-bold text-black transition hover:bg-gray-200 shadow-2xl"
                  >
                    <Icons.Play className="h-5 w-5 fill-current" />
                    <span>Watch Full Movie on YouTube</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 lg:p-16 space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 text-[10px] font-bold uppercase tracking-[0.2em] border border-violet-500/20">
                      Full Length Feature
                    </span>
                    <span className="text-green-400 text-sm font-semibold tracking-wide uppercase">Official Release</span>
                  </div>
                  <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                    {movie.title}
                  </h2>
                </div>

                <div className="flex items-center space-x-6 text-gray-400 font-medium text-sm lg:text-base">
                  <span className="text-white">{movie.year}</span>
                  <span className="h-1 w-1 bg-white/20 rounded-full" />
                  <span className="border border-white/20 px-2.5 py-0.5 rounded-md bg-white/5 uppercase tracking-wider">{movie.rating}</span>
                  <span className="h-1 w-1 bg-white/20 rounded-full" />
                  <span>{movie.duration}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 space-y-8">
                <p className="text-xl text-gray-300 leading-relaxed font-light lg:text-2xl">
                  {movie.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {["Verified Provider", "Full Movie", movie.category || "Cinema", "Ad-Supported"].map(tag => (
                    <span key={tag} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em] shadow-sm">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
