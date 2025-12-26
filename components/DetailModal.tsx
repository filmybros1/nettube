
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

  const playerUrl = useMemo(() => {
    const ytMatch = movie.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch) {
      const videoId = ytMatch[1];
      // Use youtube-nocookie and add origin/widget_referrer to satisfy restrictions
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}&widget_referrer=${encodeURIComponent(origin)}&fs=1`;
    }
    return movie.videoUrl;
  }, [movie.videoUrl, origin]);

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [movie.id]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-2xl transition-opacity animate-in fade-in duration-700"
        onClick={onClose}
      />

      <div className="relative h-full w-full max-w-6xl overflow-y-auto no-scrollbar glass shadow-[0_0_120px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-16 duration-700 lg:h-[92vh] lg:rounded-[2rem] lg:border lg:border-white/10">
        <button 
          onClick={onClose}
          className="absolute right-8 top-8 z-[110] flex h-14 w-14 items-center justify-center rounded-full glass text-white/50 transition-all hover:text-white hover:bg-white/10 hover:scale-110 active:scale-95 shadow-2xl"
        >
          <Icons.Close className="h-7 w-7" />
        </button>

        <div className="flex flex-col">
          {/* Video / Player Section */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group">
            {isLoading && !hasError && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-6 bg-zinc-950">
                <div className="relative h-16 w-16">
                    <div className="absolute inset-0 rounded-full border-4 border-violet-500/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
                </div>
                <div className="flex flex-col items-center space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-400">Cinematic Linkage</p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600 animate-pulse">Establishing secure handshake</p>
                </div>
              </div>
            )}

            {!hasError ? (
              <iframe
                key={movie.id}
                className={`h-full w-full transition-all duration-1000 ${isLoading ? 'opacity-0 scale-95 blur-xl' : 'opacity-100 scale-100 blur-0'}`}
                src={playerUrl}
                title={movie.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => {
                   // A brief delay to ensure the iframe actually renders before hiding loader
                   setTimeout(() => setIsLoading(false), 500);
                }}
                onError={() => {
                  setHasError(true);
                  setIsLoading(false);
                }}
              ></iframe>
            ) : (
              <div className="relative flex h-full w-full flex-col items-center justify-center space-y-10 bg-[#070708] p-12 text-center lg:rounded-t-[2rem]">
                <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                    <img src={movie.thumbnail} className="w-full h-full object-cover blur-3xl opacity-30" alt="" />
                </div>
                <div className="z-10 flex flex-col items-center space-y-6 max-w-lg">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-red-600/10 border border-red-500/20 shadow-inner">
                     <Icons.Video className="h-10 w-10 text-red-500" />
                  </div>
                  <div className="space-y-4">
                      <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Streaming Restriction</h3>
                      <p className="text-gray-400 font-medium leading-relaxed">
                        This official provider has restricted embedding for this title. To ensure the best viewing experience, please watch it directly on their platform.
                      </p>
                  </div>
                  <a 
                    href={`https://www.youtube.com/watch?v=${movie.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center space-x-4 rounded-full bg-white px-12 py-5 font-black text-black transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                  >
                    <Icons.Play className="h-5 w-5 fill-current" />
                    <span className="uppercase tracking-[0.2em] text-xs">Play on YouTube</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Metadata Section */}
          <div className="p-10 lg:p-20 space-y-16">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
              <div className="space-y-8 flex-1">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 rounded bg-violet-600/10 text-violet-400 text-[10px] font-black uppercase tracking-[0.3em] border border-violet-500/20">
                      Feature Film
                    </span>
                    <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">Verified Distribution</span>
                  </div>
                  <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-white leading-[0.9] drop-shadow-2xl">
                    {movie.title}
                  </h2>
                </div>

                <div className="flex items-center space-x-8 text-gray-500 font-black text-[10px] uppercase tracking-[0.2em]">
                  <span className="text-white bg-white/5 px-4 py-2 rounded-lg border border-white/10">{movie.year}</span>
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    {movie.rating}
                  </span>
                  <span>{movie.duration}</span>
                </div>
              </div>

              <div className="hidden lg:block w-px h-32 bg-white/5 self-center" />

              <div className="lg:max-w-xs space-y-6">
                 <h4 className="text-white/30 text-[9px] font-black uppercase tracking-[0.5em]">Content Tags</h4>
                 <div className="flex flex-wrap gap-2">
                    {[movie.category || "General", "Ad-Supported", "Global Rights", "HD Stream"].map(tag => (
                      <span key={tag} className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-[9px] text-gray-400 uppercase font-black tracking-[0.2em]">{tag}</span>
                    ))}
                 </div>
              </div>
            </div>

            <div className="space-y-10">
                <div className="flex items-center space-x-4">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.5em]">Synopsis</span>
                    <div className="h-px flex-1 bg-white/5" />
                </div>
                <p className="text-2xl text-gray-300/80 leading-relaxed font-light lg:text-3xl lg:max-w-4xl italic">
                  "{movie.description}"
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
