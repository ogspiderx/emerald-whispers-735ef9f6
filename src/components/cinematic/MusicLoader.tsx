import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import gsap from 'gsap';

interface MusicLoaderProps {
  onLoadComplete: () => void;
}

const MusicLoader: React.FC<MusicLoaderProps> = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate music file loading with realistic progress
    const audio = new Audio('/audio/background-music.mp3');
    let progressInterval: NodeJS.Timeout;

    const handleCanPlayThrough = () => {
      setProgress(100);
      setIsComplete(true);
      
      // Fade out after completion
      setTimeout(() => {
        const container = document.querySelector('.music-loader');
        if (container) {
          gsap.to(container, {
            opacity: 0,
            duration: 0.5,
            onComplete: onLoadComplete
          });
        }
      }, 800);
    };

    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        const duration = audio.duration || 1;
        const loadedProgress = Math.min((bufferedEnd / duration) * 100, 95);
        setProgress(loadedProgress);
      }
    };

    // Fallback progress simulation if real progress isn't available
    progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('progress', handleProgress);
    audio.load();

    return () => {
      clearInterval(progressInterval);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('progress', handleProgress);
    };
  }, [onLoadComplete]);

  return (
    <div className="music-loader fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      {/* Ambient background particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-glow-primary rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-80 text-center">
        {/* Loading title */}
        <div className="mb-8">
          <h2 className="text-2xl font-light text-white mb-2 animate-fade-in">
            Preparing the Experience
          </h2>
          <p className="text-glow-primary/70 text-sm animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Loading cinematic audio...
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <Progress 
            value={progress} 
            className="h-2 bg-white/10 animate-fade-in" 
            style={{ animationDelay: '1s' }}
          />
        </div>

        {/* Progress text */}
        <div className="text-white/60 text-sm animate-fade-in" style={{ animationDelay: '1.2s' }}>
          {Math.round(progress)}%
        </div>

        {/* Completion message */}
        {isComplete && (
          <div className="mt-4 text-glow-primary animate-fade-in">
            ✓ Ready to begin
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicLoader;