import React, { useMemo, useState } from 'react';
import { Coordinates, Seed, WeatherType } from '../types';
import { COLORS, GATHER_DISTANCE_METERS } from '../constants';

interface ForestMapProps {
  userLocation: Coordinates;
  seeds: Seed[];
  onSelectSeed: (seed: Seed) => void;
  weather: WeatherType;
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

const WeatherOverlay: React.FC<{ weather: WeatherType }> = ({ weather }) => {
  if (weather === 'SUNNY') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sun Flare */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-100/30 rounded-full blur-3xl animate-sun-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-yellow-50/10 to-transparent mix-blend-soft-light"></div>
      </div>
    );
  }

  if (weather === 'RAINY') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {/* Rain Drops */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] bg-blue-300/40 animate-rain"
            style={{
              height: `${Math.random() * 20 + 10}vh`, // Varying lengths
              left: `${Math.random() * 100}vw`,
              animationDuration: `${0.8 + Math.random() * 0.5}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
        {/* Gloomy overlay */}
        <div className="absolute inset-0 bg-blue-900/5 mix-blend-multiply"></div>
      </div>
    );
  }

  if (weather === 'WINDY') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {/* Flying Leaves/Particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-tl-full rounded-br-full animate-leaf"
            style={{
              top: `${Math.random() * 80}vh`,
              left: `-10vw`, // Start off screen
              animationDuration: `${4 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `scale(${0.5 + Math.random() * 0.5})`
            }}
          />
        ))}
      </div>
    );
  }

  // Cloudy is just default/subtle
  return (
    <div className="absolute inset-0 pointer-events-none bg-gray-100/10 mix-blend-multiply z-10"></div>
  );
};

const ForestMap: React.FC<ForestMapProps> = ({ userLocation, seeds, onSelectSeed, weather }) => {
  const [scale] = useState(200000); // Scale factor for visualization

  // Organic terrain lines
  const terrainPaths = useMemo(() => {
    // If windy, animations could be faster or more pronounced
    const speedMultiplier = weather === 'WINDY' ? 0.5 : 1;
    
    return Array.from({ length: 5 }).map((_, i) => (
      <path
        key={i}
        d={`M ${-100 + i * 50} 300 Q ${150 + i * 20} ${100 + i * 50} 400 ${350 + i * 40}`}
        fill="none"
        stroke="#5D8572"
        strokeWidth="0.5"
        opacity="0.2"
        className="animate-drift"
        style={{ animationDuration: `${(15 + i * 5) * speedMultiplier}s` }}
      />
    ));
  }, [weather]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-canvas transition-colors duration-1000">
      
      {/* Weather Effects Layer */}
      <WeatherOverlay weather={weather} />

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
        const latDiff = seed.location.latitude - userLocation.latitude;
        const lngDiff = seed.location.longitude - userLocation.longitude;
        
        const distMeters = getDistanceFromLatLonInM(
            userLocation.latitude, userLocation.longitude,
            seed.location.latitude, seed.location.longitude
        );

        // Convert to pixel offset
        const xOffset = lngDiff * scale; 
        const yOffset = -latDiff * scale;

        // Limit visibility
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

      <div className="absolute bottom-24 left-0 w-full text-center pointer-events-none z-20">
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