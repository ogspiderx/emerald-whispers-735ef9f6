import React, { useState, useRef, useEffect } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import gsap from 'gsap';

interface MusicControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const MusicControls: React.FC<MusicControlsProps> = ({
  isPlaying,
  onTogglePlay,
  volume,
  onVolumeChange
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const controlsRef = useRef<HTMLDivElement>(null);
  const volumeSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show controls after a delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (controlsRef.current) {
        gsap.from(controlsRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out"
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (volumeSliderRef.current) {
      if (showVolumeSlider) {
        gsap.to(volumeSliderRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        gsap.to(volumeSliderRef.current, {
          opacity: 0,
          x: -20,
          duration: 0.3,
          ease: "power2.in"
        });
      }
    }
  }, [showVolumeSlider]);

  const handlePlayClick = () => {
    // Add click ripple effect
    if (controlsRef.current) {
      const ripple = document.createElement('div');
      ripple.className = 'absolute inset-0 bg-glow-primary/30 rounded-full animate-ping';
      controlsRef.current.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
    onTogglePlay();
  };

  if (!isVisible) return null;

  return (
    <div 
      ref={controlsRef}
      className="fixed bottom-6 left-6 z-40 flex items-center gap-4"
    >
      {/* Play/Pause Button */}
      <button
        onClick={handlePlayClick}
        className="relative w-12 h-12 bg-glow-primary/20 border border-glow-primary/50 rounded-full flex items-center justify-center hover:bg-glow-primary/30 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-glow-primary" />
        ) : (
          <Play className="w-5 h-5 text-glow-primary ml-0.5" />
        )}
      </button>

      {/* Volume Controls */}
      <div className="relative flex items-center">
        <button
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
          onClick={() => onVolumeChange(volume > 0 ? 0 : 0.4)}
          className="w-10 h-10 bg-glow-primary/20 border border-glow-primary/50 rounded-full flex items-center justify-center hover:bg-glow-primary/30 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        >
          {volume > 0 ? (
            <Volume2 className="w-4 h-4 text-glow-primary" />
          ) : (
            <VolumeX className="w-4 h-4 text-glow-primary" />
          )}
        </button>

        {/* Volume Slider */}
        <div
          ref={volumeSliderRef}
          className="absolute left-12 opacity-0 -translate-x-5"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <div className="bg-black/50 backdrop-blur-sm border border-glow-primary/30 rounded-lg px-3 py-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-20 h-1 bg-glow-primary/20 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicControls;