
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants.tsx';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 py-5 transition-all duration-500 lg:px-12 ${
        isScrolled ? 'backdrop-blur-2xl bg-[#0a0a0c]/80 py-4 border-b border-white/5' : 'bg-transparent'
      }`}>
        <div className="flex items-center space-x-10">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-600/20 group-hover:scale-110 transition-transform duration-500">
              <Icons.Music className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white lg:text-3xl">
              NET<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">TUBE</span>
            </h1>
          </div>
          
          <nav className="hidden items-center space-x-8 md:flex text-xs font-black uppercase tracking-[0.2em] text-gray-500">
            <button className="hover:text-white transition-colors duration-300">Trending</button>
            <button className="hover:text-white transition-colors duration-300">New Hits</button>
            <button className="hover:text-white transition-colors duration-300">Library</button>
          </nav>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <Icons.Search className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white transition-colors duration-300" />
          </div>
          <div className="hidden sm:flex items-center space-x-4">
             <div className="h-10 w-10 rounded-full border border-white/10 p-1 hover:border-violet-500 transition-colors duration-500 cursor-pointer overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
             </div>
          </div>
        </div>
      </header>

      {/* Modern Sidebar with tooltips */}
      <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-[60] hidden flex-col items-center space-y-10 rounded-3xl glass p-5 lg:flex border border-white/5">
        <div className="group relative">
          <Icons.Play className="h-7 w-7 text-violet-500 cursor-pointer hover:scale-110 transition-transform" />
        </div>
        <Icons.Bell className="h-7 w-7 text-gray-400 cursor-pointer hover:text-white transition-all" />
        <div className="h-px w-6 bg-white/10" />
        <Icons.Music className="h-7 w-7 text-gray-400 cursor-pointer hover:text-white transition-all" />
        <div className="h-px w-6 bg-white/10" />
        <div className="h-8 w-8 rounded-lg border border-gray-600 text-[10px] flex items-center justify-center text-gray-500 font-black cursor-pointer hover:border-violet-400 hover:text-violet-400 transition-all">
          HD
        </div>
      </aside>
    </>
  );
};

export default Navbar;
