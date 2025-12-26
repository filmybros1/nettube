
import React from 'react';

export const CATEGORIES = [
  "Global Trending Music Videos",
  "Pop Chart Toppers",
  "Hip Hop & Rap Essentials",
  "Electronic & Dance Anthems",
  "K-Pop World Stage",
  "Rock & Alternative Classics",
  "Acoustic & Unplugged Sessions",
  "R&B/Soul Melodies"
];

export const NETTUBE_VIOLET = "#8B5CF6";
export const NETTUBE_PINK = "#EC4899";

export const Icons = {
  Play: ({ className, onClick }: { className?: string; onClick?: () => void }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className} onClick={onClick}>
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Info: ({ className, onClick }: { className?: string; onClick?: () => void }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className={className} onClick={onClick}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Search: ({ className, onClick }: { className?: string; onClick?: () => void }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className={className} onClick={onClick}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Bell: ({ className, onClick }: { className?: string; onClick?: () => void }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className={className} onClick={onClick}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  ChevronRight: ({ className, onClick }: { className?: string; onClick?: () => void }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} className={className} onClick={onClick}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  ChevronLeft: ({ className, onClick }: { className?: string; onClick?: () => void }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} className={className} onClick={onClick}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  ),
  Close: ({ className, onClick }: { className?: string; onClick?: () => void }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className={className} onClick={onClick}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Music: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
};
