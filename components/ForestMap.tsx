import React, { useEffect, useMemo, useState } from 'react';
import { Coordinates, Seed, MoodType } from '../types';
import { COLORS, GATHER_DISTANCE_METERS } from '../constants';

interface ForestMapProps {
  userLocation: Coordinates;
  seeds: Seed[];
  onSelectSeed: (seed: Seed) => void;
}

// Helper to calculate distance in meters (Haversine approximation)
const getDistanceFromLatLonInM = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ1) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

const ForestMap: React.FC<ForestMapProps> = ({ userLocation, seeds, onSelectSeed }) => {
  const [scale] = useState(200000); // Scale factor for visualization

  // Organic terrain lines (static for now, could be dynamic based on Perlin noise)
  const terrainPaths = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => (
      <path
        key={i}
        d={`M ${-100 + i * 50} 300 Q ${150 + i * 20} ${100 + i * 50} 400 ${350 + i * 40}`}
        fill="none"
        stroke="#5D8572"
        strokeWidth="0.5"
        opacity="0.2"
        className="animate-drift"
        style={{ animationDuration: `${15 + i * 5}s` }}
      />
    ));
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-canvas">
      {/* Abstract Map Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        {terrainPaths}
        <circle cx="200" cy="400" r="150" fill="url(#grad1)" opacity="0.1" />
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: '#5D8572', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#F9F7F2', stopOpacity: 0 }} />
          </radialGradient>
        </defs>
      </svg>

      {/* User Indicator (Center) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="w-4 h-4 rounded-full bg-primary animate-breathe shadow-lg shadow-primary/30"></div>
        <div className="absolute -inset-4 border border-primary/20 rounded-full animate-ping opacity-20"></div>
      </div>

      {/* Seeds */}
      {seeds.map((seed) => {
        // Calculate relative position to user
        // Note: This is a simplified projection for the "Radar" view
        const latDiff = seed.location.latitude - userLocation.latitude;
        const lngDiff = seed.location.longitude - userLocation.longitude;
        
        const distMeters = getDistanceFromLatLonInM(
            userLocation.latitude, userLocation.longitude,
            seed.location.latitude, seed.location.longitude
        );

        // Convert to pixel offset (Center is 50%, 50%)
        // Amplify small differences to make them visible on screen
        const xOffset = lngDiff * scale; 
        const yOffset = -latDiff * scale; // Latitude goes up (negative Y in CSS)

        // Limit visibility to "nearby" visual range
        if (Math.abs(xOffset) > 200 || Math.abs(yOffset) > 350) return null;

        const isReachable = distMeters < GATHER_DISTANCE_METERS;
        const color = COLORS.MOOD[seed.mood];

        return (
          <div
            key={seed.id}
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out cursor-pointer flex flex-col items-center justify-center`}
            style={{
              marginLeft: `${xOffset}px`,
              marginTop: `${yOffset}px`,
              opacity: isReachable ? 1 : 0.4,
              scale: isReachable ? '1' : '0.6',
              zIndex: isReachable ? 30 : 10
            }}
            onClick={() => isReachable && onSelectSeed(seed)}
          >
             {/* The Seed Visual */}
             <div 
                className={`relative rounded-full transition-all duration-500 ${isReachable ? 'animate-breathe' : ''}`}
                style={{
                  width: isReachable ? '24px' : '12px',
                  height: isReachable ? '24px' : '12px',
                  backgroundColor: color,
                  boxShadow: isReachable ? `0 0 15px 2px ${color}` : 'none'
                }}
             >
             </div>
             {isReachable && (
               <span className="mt-2 text-[10px] font-serif text-text opacity-90 tracking-widest bg-white/50 px-2 py-0.5 rounded-full backdrop-blur-sm">拾起</span>
             )}
          </div>
        );
      })}

      <div className="absolute bottom-24 left-0 w-full text-center pointer-events-none">
        <p className="font-serif italic text-primary/60 text-sm tracking-wide">
           {seeds.filter(s => getDistanceFromLatLonInM(userLocation.latitude, userLocation.longitude, s.location.latitude, s.location.longitude) < GATHER_DISTANCE_METERS).length > 0 
            ? "风里传来了一些回响..." 
            : "附近的土壤很安静"}
        </p>
      </div>
    </div>
  );
};

export default ForestMap;