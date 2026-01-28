import React, { useState } from 'react';
import { Seed } from '../types';
import { COLORS } from '../constants';

interface SeedDetailProps {
  seed: Seed;
  onClose: () => void;
  onResonate: (id: string) => void;
}

const SeedDetail: React.FC<SeedDetailProps> = ({ seed, onClose, onResonate }) => {
  const [resonated, setResonated] = useState(false);
  const color = COLORS.MOOD[seed.mood];

  const handleResonate = () => {
    if (!resonated) {
      setResonated(true);
      onResonate(seed.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md p-6">
      <div 
        className="relative w-full max-w-sm bg-canvas rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center overflow-hidden"
        style={{ borderTop: `4px solid ${color}` }}
      >
        {/* Organic texture overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

        <button onClick={onClose} className="absolute top-4 right-4 text-text/40 hover:text-text transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <span className="text-xs font-serif uppercase tracking-widest text-text/40 mb-6">
            {new Date(seed.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>

        <p className="font-serif text-xl md:text-2xl text-text leading-relaxed mb-8 relative z-10">
          "{seed.text}"
        </p>

        {seed.hasAudio && (
          <div className="w-full h-12 bg-primary/10 rounded-full flex items-center justify-center mb-8 cursor-pointer hover:bg-primary/20 transition-colors group">
             <svg className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
             <span className="ml-2 text-xs font-sans text-primary">播放声景</span>
          </div>
        )}

        <button
          onClick={handleResonate}
          className={`group flex items-center justify-center gap-2 px-6 py-2 rounded-full border transition-all duration-500 ${resonated ? 'bg-primary border-primary text-white' : 'border-primary/40 text-primary hover:bg-primary/5'}`}
        >
          <svg className={`w-5 h-5 transition-transform ${resonated ? 'scale-110' : 'group-hover:scale-110'}`} fill={resonated ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="font-serif italic tracking-widest">{resonated ? "已共鸣" : "共鸣"}</span>
        </button>
        
        {resonated && <p className="mt-4 text-xs text-primary/60 italic animate-pulse">有人听到了你的心声。</p>}
      </div>
    </div>
  );
};

export default SeedDetail;