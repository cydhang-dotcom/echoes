import React, { useMemo, useState, useEffect } from 'react';
import { Coordinates, Seed, WeatherType } from '../types';
import { COLORS, GATHER_DISTANCE_METERS, VISIBILITY_DISTANCE_METERS } from '../constants';

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
  // Increased scale to make 50m feel like a meaningful "room" size on screen
  // 1 deg Lat approx 111km. 
  // With scale 600,000 -> 1m approx 5.4px. 
  // 50m radius -> ~270px from center.
  const [scale] = useState(600000); 
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [hintTimeout, setHintTimeout] = useState<NodeJS.Timeout | null>(null);

  const showHint = (msg: string) => {
    if (hintTimeout) clearTimeout(hintTimeout);
    setHintMessage(msg);
    const timeout = setTimeout(() => setHintMessage(null), 3000);
    setHintTimeout(timeout);
  };

  // Organic terrain lines
  const terrainPaths = useMemo(() => {
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
        <div className="absolute -inset-12 border border-primary/5 rounded-full"></div>
        <div className="absolute -inset-24 border border-primary/5 rounded-full border-dashed"></div>
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

        // If further than visibility range, do not render (keep it sparse and aesthetic)
        if (distMeters > VISIBILITY_DISTANCE_METERS) return null;

        // Convert to pixel offset
        const xOffset = lngDiff * scale; 
        const yOffset = -latDiff * scale;

        // Interaction Logic
        const isReachable = distMeters < GATHER_DISTANCE_METERS;
        
        // Visual Logic (Interpolation)
        // Range: 0m to 50m
        // Opacity: 1 (at 0m) -> 0.2 (at 50m)
        // Scale: 1 (at 0m) -> 0.4 (at 50m)
        const visibilityFactor = 1 - (distMeters / VISIBILITY_DISTANCE_METERS);
        const dynamicOpacity = 0.2 + (visibilityFactor * 0.8);
        const dynamicScale = 0.4 + (visibilityFactor * 0.6);

        const color = COLORS.MOOD[seed.mood];

        return (
          <div
            key={seed.id}
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out cursor-pointer flex flex-col items-center justify-center`}
            style={{
              marginLeft: `${xOffset}px`,
              marginTop: `${yOffset}px`,
              zIndex: isReachable ? 30 : 10
            }}
            onClick={() => {
              if (isReachable) {
                onSelectSeed(seed);
              } else {
                showHint("太远了，只有风声...");
              }
            }}
          >
             {/* The Seed Visual */}
             {isReachable ? (
                // Interactable State: Big Light Point
                <div className="relative flex flex-col items-center animate-breathe">
                   <div 
                      className="rounded-full blur-[2px]"
                      style={{
                        width: '28px',
                        height: '28px',
                        backgroundColor: color,
                        boxShadow: `0 0 20px 4px ${color}`
                      }}
                   />
                   <div className="absolute top-0 left-0 w-full h-full bg-white/50 rounded-full animate-ping opacity-30"></div>
                </div>
             ) : (
                // Distant State: Faint Seed
                <div 
                  className="rounded-full animate-pulse"
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: color,
                    opacity: dynamicOpacity,
                    transform: `scale(${dynamicScale})`,
                    boxShadow: `0 0 10px 1px ${color}`
                  }}
                />
             )}
          </div>
        );
      })}

      <div className="absolute bottom-24 left-0 w-full text-center pointer-events-none z-20 px-4">
        <p className={`font-serif italic text-sm tracking-wide transition-all duration-500 ${hintMessage ? 'text-primary' : 'text-primary/60'}`}>
           {hintMessage ? hintMessage : (
             seeds.some(s => getDistanceFromLatLonInM(userLocation.latitude, userLocation.longitude, s.location.latitude, s.location.longitude) < GATHER_DISTANCE_METERS)
              ? "这里有一颗种子在呼吸..." 
              : seeds.some(s => getDistanceFromLatLonInM(userLocation.latitude, userLocation.longitude, s.location.latitude, s.location.longitude) < VISIBILITY_DISTANCE_METERS)
                ? "远处有微弱的光点..."
                : "附近的土壤很安静"
           )}
        </p>
      </div>
    </div>
  );
};

export default ForestMap;