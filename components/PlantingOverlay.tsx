import React, { useState } from 'react';
import { MoodType } from '../types';
import { COLORS } from '../constants';

interface PlantingOverlayProps {
  onClose: () => void;
  onPlant: (data: { mood: MoodType; text: string; audioBlob?: Blob }) => void;
}

const MoodSelector: React.FC<{ selected: MoodType; onSelect: (m: MoodType) => void }> = ({ selected, onSelect }) => {
  return (
    <div className="flex justify-center gap-6 mb-8">
      {(Object.keys(COLORS.MOOD) as MoodType[]).map((mood) => (
        <button
          key={mood}
          onClick={() => onSelect(mood)}
          className={`w-12 h-12 rounded-full transition-transform duration-300 ${selected === mood ? 'scale-125 ring-2 ring-offset-2 ring-primary/30' : 'opacity-60 hover:opacity-100'}`}
          style={{ backgroundColor: COLORS.MOOD[mood] }}
          aria-label={mood}
        />
      ))}
    </div>
  );
};

const PlantingOverlay: React.FC<PlantingOverlayProps> = ({ onClose, onPlant }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [mood, setMood] = useState<MoodType>(MoodType.CALM);
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | undefined>(undefined);
  const [isExiting, setIsExiting] = useState(false);

  // Mock Audio Logic (No real microphone access)
  const startRecording = () => {
    setIsRecording(true);
    // Simulate recording duration or state
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Create a dummy blob to simulate captured audio
    const mockBlob = new Blob(["Simulated audio content"], { type: 'audio/webm' });
    setAudioBlob(mockBlob);
  };

  const handlePlant = () => {
    setIsExiting(true);
    // Play sound effect could go here
    setTimeout(() => {
        onPlant({ mood, text, audioBlob });
    }, 800); // Wait for animation
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas/95 backdrop-blur-sm transition-opacity duration-500 ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Close Button */}
      <button onClick={onClose} className="absolute top-6 right-6 text-text/50 hover:text-text p-2 font-serif text-lg">
        关闭
      </button>

      <div className={`w-full max-w-md px-8 transition-transform duration-700 ${isExiting ? 'translate-y-full' : 'translate-y-0'}`}>
        
        {step === 1 && (
          <div className="text-center animate-breathe">
            <h2 className="text-3xl font-serif text-primary mb-2 tracking-wide">感知此刻</h2>
            <p className="text-text/60 italic mb-8 font-serif">此刻的风，是什么颜色的？</p>
            <MoodSelector selected={mood} onSelect={setMood} />
            <button 
                onClick={() => setStep(2)}
                className="mt-8 px-8 py-3 bg-primary text-white rounded-full font-serif text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all tracking-widest"
            >
              继续
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center w-full">
            <h2 className="text-2xl font-serif text-primary mb-6 tracking-wide">埋下一颗种子</h2>
            
            <textarea
              className="w-full bg-transparent border-b border-primary/30 text-text font-serif text-xl p-4 focus:outline-none focus:border-primary placeholder-text/30 resize-none h-32 text-center"
              placeholder="写下你的心事..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="mt-8 flex flex-col items-center">
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-red-400 scale-110' : 'bg-primary text-white'}`}
                >
                    {isRecording ? (
                        <div className="w-4 h-4 bg-white rounded-sm" />
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    )}
                    {isRecording && (
                        <div className="absolute inset-0 rounded-full border border-red-400 animate-ping opacity-75"></div>
                    )}
                </button>
                <p className="mt-4 text-sm text-text/50 font-serif italic">
                    {audioBlob ? "声音已采集(模拟)" : (isRecording ? "正在聆听环境..." : "点击采集环境音")}
                </p>
            </div>

            <button 
                onClick={handlePlant}
                disabled={!text && !audioBlob}
                className="mt-12 px-12 py-3 bg-text text-white rounded-full font-serif text-lg shadow-lg hover:scale-105 transition-all disabled:opacity-30 disabled:hover:scale-100 tracking-[0.2em]"
            >
              埋藏
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PlantingOverlay;