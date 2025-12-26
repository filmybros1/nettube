
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Movie } from '../types.ts';
import { Icons } from '../constants.tsx';

interface DetailModalProps {
  movie: Movie | null;
  onClose: () => void;
}

declare global {
  interface Window {
    Hls: any;
  }
}

const DetailModal: React.FC<DetailModalProps> = ({ movie, onClose }) => {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  if (!movie) return null;

  const origin = window.location.origin;

  const playerConfig = useMemo(() => {
    const url = movie.videoUrl;
    
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch) {
      return {
        type: 'iframe',
        url: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&mute=0&rel=0&modestbranding=1&enablejsapi=1`
      };
    }

    // Direct HLS or MP4
    if (url.match(/\.(m3u8|mp4|webm|ogg)$/i) || url.includes('.m3u8')) {
      return { type: 'video', url };
    }

    // Embeds (Fmovies style usually uses iframe embeds or direct streams)
    // If it looks like a streaming site URL that isn't a direct file, we try to iframe it
    if (url.includes('fmovies') || url.includes('vidsrc') || url.includes('2embed') || url.includes('embed')) {
        return { type: 'iframe', url: url };
    }

    // Fallback to iframe for other web sources
    return { type: 'iframe', url };
  }, [movie.videoUrl]);

  useEffect(() => {
    if (playerConfig.type === 'video' && videoRef.current && movie.videoUrl.includes('.m3u8')) {
      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls();
        hls.loadSource(movie.videoUrl);
        hls.attachMedia(videoRef.current);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current?.play().catch(e => console.log("Auto-play blocked"));
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        videoRef.current.src = movie.videoUrl;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current?.play().catch(e => console.log("Auto-play blocked"));
        });
      }
    }
  }, [playerConfig, movie.videoUrl]);

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
                referrerPolicy="no-referrer"
                onError={() => setHasError(true)}
              ></iframe>
            ) : playerConfig.type === 'video' ? (
              <video 
                ref={videoRef}
                src={movie.videoUrl.includes('.m3u8') ? undefined : movie.videoUrl} 
                controls 
                autoPlay 
                playsInline
                className="h-full w-full lg:rounded-t-3xl"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center space-y-8 bg-zinc-900 lg:rounded-t-3xl p-12 text-center">
                <div className="z-10 space-y-4">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-600/10 border border-violet-500/20">
                     <Icons.Play className="h-10 w-10 text-violet-500" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-widest text-white">Stream Unavailable in Player</h3>
                  <p className="text-gray-400 max-w-md mx-auto">This title may require a direct secure connection or is currently updating its streaming mirrors.</p>
                  <a 
                    href={movie.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="z-10 inline-flex items-center space-x-3 rounded-full bg-white px-10 py-4 font-bold text-black transition hover:bg-gray-200 shadow-2xl"
                  >
                    <Icons.Play className="h-5 w-5 fill-current" />
                    <span>Watch Externally</span>
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
                      High Quality Stream
                    </span>
                    <span className="text-green-400 text-sm font-semibold tracking-wide">ULTRA HD Available</span>
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
                  {["Premium Stream", "No Ads", movie.category || "Full Movie", "HDR10"].map(tag => (
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