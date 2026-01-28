import React, { useState, useEffect, useCallback } from 'react';
import ForestMap from './components/ForestMap';
import PlantingOverlay from './components/PlantingOverlay';
import SeedDetail from './components/SeedDetail';
import GardenView from './components/GardenView';
import { generatePoeticLocation } from './services/geminiService';
import { Coordinates, MoodType, Seed, ViewState } from './types';
import { MOCK_SEEDS } from './constants';

const App: React.FC = () => {
  // State
  const [view, setView] = useState<ViewState>(ViewState.WALK);
  const [userLocation, setUserLocation] = useState<Coordinates>({ latitude: 0, longitude: 0 }); // Default
  const [poeticLocation, setPoeticLocation] = useState<string>("正在定位...");
  const [seeds, setSeeds] = useState<Seed[]>(MOCK_SEEDS);
  const [selectedSeed, setSelectedSeed] = useState<Seed | null>(null);
  const [mySeeds, setMySeeds] = useState<Seed[]>([]);
  
  // Initialize Geolocation
  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const newCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(newCoords);
          
          // Debounce poetic generation or check distance change to avoid API spam
          // For demo, we just run it once or periodically. 
          // Here strictly only running if location changes significantly effectively.
        },
        (error) => {
          console.error("Geo error:", error);
          setPoeticLocation("未知地点");
        },
        { enableHighAccuracy: true }
      );
      
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setPoeticLocation("无法获取位置");
    }
  }, []);

  // Effect to update poetic location periodically (every 2 minutes) or on significant move
  useEffect(() => {
    let isMounted = true;
    const updatePoetic = async () => {
       const desc = await generatePoeticLocation(userLocation.latitude, userLocation.longitude);
       if (isMounted) setPoeticLocation(desc);
    };
    
    // Initial call after small delay to ensure location is ready
    const timer = setTimeout(updatePoetic, 2000);
    return () => { isMounted = false; clearTimeout(timer); };
  }, [userLocation.latitude, userLocation.longitude]);

  // Actions
  const handlePlant = (data: { mood: MoodType; text: string; audioBlob?: Blob }) => {
    const newSeed: Seed = {
      id: Date.now().toString(),
      authorId: 'me',
      location: { ...userLocation },
      mood: data.mood,
      text: data.text,
      hasAudio: !!data.audioBlob,
      timestamp: Date.now(),
      resonates: 0,
    };

    // Add to global seeds and my seeds
    setSeeds(prev => [...prev, newSeed]);
    setMySeeds(prev => [newSeed, ...prev]);
    setView(ViewState.WALK);
  };

  const handleResonate = (id: string) => {
    setSeeds(prev => prev.map(s => s.id === id ? { ...s, resonates: s.resonates + 1 } : s));
  };

  const NavButton: React.FC<{ active: boolean; label: string; onClick: () => void; icon: React.ReactNode }> = ({ active, label, onClick, icon }) => (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 transition-colors duration-300 w-16 ${active ? 'text-primary' : 'text-primary/40'}`}
    >
      {icon}
      <span className="text-[10px] font-serif uppercase tracking-widest mt-1">{label}</span>
    </button>
  );

  return (
    <div className="relative w-full h-screen bg-[#F9F7F2] overflow-hidden flex flex-col">
      
      {/* Top Bar - Poetic Location */}
      {view === ViewState.WALK && (
        <div className="absolute top-0 left-0 w-full z-10 pt-12 pb-8 px-6 bg-gradient-to-b from-[#F9F7F2] to-transparent pointer-events-none text-center">
            <h1 className="text-xl font-serif text-text tracking-wide shadow-sm">{poeticLocation}</h1>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 relative z-0">
        {view === ViewState.WALK && (
          <ForestMap 
            userLocation={userLocation} 
            seeds={seeds} 
            onSelectSeed={setSelectedSeed} 
          />
        )}
        
        {view === ViewState.GARDEN && (
          <GardenView mySeeds={mySeeds} />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="relative z-20 h-24 bg-gradient-to-t from-[#F9F7F2] via-[#F9F7F2]/90 to-transparent flex items-end justify-center pb-8 gap-12">
        
        <NavButton 
          active={view === ViewState.WALK} 
          label="漫步" 
          onClick={() => setView(ViewState.WALK)}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />

        {/* Central Plant Button */}
        <button 
          onClick={() => setView(ViewState.PLANTING)}
          className="mb-4 w-16 h-16 rounded-full bg-primary text-[#F9F7F2] shadow-xl shadow-primary/30 flex items-center justify-center transform transition-transform hover:scale-110 active:scale-95"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>

        <NavButton 
          active={view === ViewState.GARDEN} 
          label="角落" 
          onClick={() => setView(ViewState.GARDEN)}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
        />

      </div>

      {/* Modals/Overlays */}
      {view === ViewState.PLANTING && (
        <PlantingOverlay 
          onClose={() => setView(ViewState.WALK)} 
          onPlant={handlePlant} 
        />
      )}

      {selectedSeed && (
        <SeedDetail 
          seed={selectedSeed} 
          onClose={() => setSelectedSeed(null)} 
          onResonate={handleResonate}
        />
      )}
    </div>
  );
};

export default App;