import React from 'react';
import { Seed } from '../types';
import { COLORS } from '../constants';

interface GardenViewProps {
  mySeeds: Seed[];
}

const GardenView: React.FC<GardenViewProps> = ({ mySeeds }) => {
  return (
    <div className="w-full h-full bg-canvas p-6 pt-12 overflow-y-auto organic-scroll">
      <header className="mb-10">
        <h1 className="text-3xl font-serif text-primary tracking-wide">我的角落</h1>
        <p className="text-sm text-text/60 font-serif italic mt-2">
          {mySeeds.length === 0 ? "土壤正等待着你的第一颗种子。" : `你已经种下了 ${mySeeds.length} 个回忆。`}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
        {mySeeds.map((seed) => (
          <div 
            key={seed.id} 
            className="relative bg-white/50 border border-primary/10 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="absolute top-4 right-4 w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.MOOD[seed.mood] }} />
            
            <p className="text-text font-serif text-lg mb-4 line-clamp-3">
              "{seed.text}"
            </p>
            
            <div className="flex justify-between items-center text-xs text-text/40 font-sans mt-4">
              <span>{new Date(seed.timestamp).toLocaleDateString()}</span>
              <div className="flex items-center gap-1 text-primary">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                <span>{seed.resonates}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GardenView;