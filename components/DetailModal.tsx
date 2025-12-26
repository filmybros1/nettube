
import React, { useState, useMemo } from 'react';
import { Movie } from '../types';
import { Icons } from '../constants';

interface DetailModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ movie, onClose }) => {
  const [hasError, setHasError] = useState(false);
  
  if (!movie) return null;

  const origin = window.location.origin;

  const playerConfig = useMemo(() => {
    const url = movie.videoUrl;
    
    // YouTube specific logic with strict parameters for Error 153 mitigation
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch) {
      return {
        type: 'iframe',
        url: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&mute=0&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}&widget_referrer=${encodeURIComponent(origin)}`
      };
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) {
      return {
        type: 'iframe',
        url: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
      };
    }

    // Dailymotion
    const dailyMatch = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
    if (dailyMatch) {
      return {
        type: 'iframe',
        url: `https://www.dailymotion.com/embed/video/${dailyMatch[1]}?autoplay=1&mute=0`
      };
    }

    // Direct Video Files
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      return { type: 'video', url };
    }

    // Fallback for everything else
    return { type: 'fallback', url };
  }, [movie.videoUrl, origin]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      {/* Dynamic Background Blur */}
      <div 
        className="absolute inset-0 bg-[#0a0a0c]/95 backdrop-blur-2xl transition-opacity animate-in fade-in duration-500"
        onClick={onClose}
      />

      <div className="relative h-full w-full max-w-6xl overflow-y-auto no-scrollbar glass shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-12 duration-500 lg:h-[90vh] lg:rounded-3xl lg:border lg:border-white/10">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 z-[110] flex h-12 w-12 items-center justify-center rounded-full glass text-white transition hover:bg-white/10 hover:scale-110 active:scale-90"
        >
          <Icons.Close className="h-6 w-6" />
        </button>

        <div className="flex flex-col">
          {/* Player Shell */}
          <div className="relative aspect-video w-full bg-black">
            {playerConfig.type === 'iframe' && !hasError ? (
              <iframe
                key={movie.id}
                className="h-full w-full lg:rounded-t-3xl"
                src={playerConfig.url}
                title={movie.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                onError={() => setHasError(true)}
              ></iframe>
            ) : playerConfig.type === 'video' ? (
              <video 
                src={playerConfig.url} 
                controls 
                autoPlay 
                playsInline
                className="h-full w-full lg:rounded-t-3xl"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center space-y-8 bg-zinc-900 lg:rounded-t-3xl p-12 text-center relative overflow-hidden">
                <img src={movie.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover opacity-10 blur-2xl" />
                <div className="z-10 space-y-4">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-600/10 border border-violet-500/20">
                     <Icons.Play className="h-10 w-10 text-violet-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold uppercase tracking-widest text-white">Enhanced Playback Recommended</h3>
                    <p className="text-gray-400 max-w-md mx-auto font-light">
                      This content is hosted on a platform that requires direct verification to ensure the highest streaming quality and license protection.
                    </p>
                  </div>
                  <a 
                    href={movie.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="z-10 inline-flex items-center space-x-3 rounded-full bg-white px-10 py-4 font-bold text-black transition hover:bg-gray-200 shadow-2xl"
                  >
                    <Icons.Play className="h-5 w-5 fill-current" />
                    <span>Watch on {movie.sourceType.toUpperCase()}</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Metadata Section */}
          <div className="p-8 lg:p-16 space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 text-[10px] font-bold uppercase tracking-[0.2em] border border-violet-500/20">
                      {movie.sourceType} Original
                    </span>
                    <span className="text-green-400 text-sm font-semibold tracking-wide">99% Match for you</span>
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

              <div className="flex flex-wrap gap-4">
                <button className="flex h-12 w-12 items-center justify-center rounded-full glass border-white/10 hover:bg-white/10 transition">
                  <span className="text-xl">+</span>
                </button>
                <button className="flex h-12 w-12 items-center justify-center rounded-full glass border-white/10 hover:bg-white/10 transition">
                  <Icons.Bell className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 space-y-8">
                <p className="text-xl text-gray-300 leading-relaxed font-light lg:text-2xl">
                  {movie.description}
                </p>
                
                <div className="flex flex-wrap gap-3">
                  {["IMAX Experience", "Dolby Vision", movie.category || "New Content", "Breathtaking"].map(tag => (
                    <span key={tag} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em] shadow-sm">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-10 border-l border-white/5 pl-12 hidden lg:block">
                <div className="space-y-3">
                  <span className="text-gray-600 text-[10px] uppercase font-bold tracking-[0.3em] block">Distribution</span>
                  <p className="text-base text-gray-300 font-medium capitalize flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-violet-500" />
                    <span>{movie.sourceType} Network</span>
                  </p>
                </div>
                <div className="space-y-3">
                  <span className="text-gray-600 text-[10px] uppercase font-bold tracking-[0.3em] block">Audio / Visual</span>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Available in Ultra HD 4K, HDR10+, and Surround Sound 7.1 where supported by hardware.
                  </p>
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
