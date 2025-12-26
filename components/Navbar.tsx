
import React from 'react';
import { Icons } from '../constants';

const Navbar: React.FC = () => {
  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[#0a0a0c]/40 lg:px-10 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-900/20" />
          <h1 className="text-xl font-bold tracking-tight text-white lg:text-2xl">NET<span className="text-violet-500">TUBE</span></h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="hidden items-center space-x-6 md:flex text-sm font-medium text-gray-400">
            <button className="hover:text-white transition">Movies</button>
            <button className="hover:text-white transition">Series</button>
            <button className="hover:text-white transition">Originals</button>
          </div>
          <div className="flex items-center space-x-4">
            <Icons.Search className="h-5 w-5 text-gray-400 cursor-pointer hover:text-white" />
            <div className="h-8 w-8 rounded-full border border-white/10 p-0.5">
              <img src="https://picsum.photos/32/32?random=profile" className="rounded-full" alt="User" />
            </div>
          </div>
        </div>
      </header>

      {/* Floating Sidebar (for large screens) */}
      <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-[60] hidden flex-col items-center space-y-8 rounded-2xl glass p-4 lg:flex">
        <div className="group relative">
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 h-1 w-1 rounded-full bg-violet-500 group-hover:h-4 transition-all" />
          <Icons.Play className="h-6 w-6 text-violet-500 cursor-pointer" />
        </div>
        <Icons.Bell className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white transition" />
        <Icons.Info className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white transition" />
        <div className="h-[1px] w-4 bg-white/10" />
        <div className="h-6 w-6 rounded border border-gray-400 text-xs flex items-center justify-center text-gray-400 cursor-pointer hover:border-white hover:text-white">
          4K
        </div>
      </aside>
    </>
  );
};

export default Navbar;
