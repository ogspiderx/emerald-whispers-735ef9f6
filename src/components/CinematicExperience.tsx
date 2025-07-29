import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import Scene1Headphones from './cinematic/Scene1Headphones';
import Scene2Transition from './cinematic/Scene2Transition';
import Scene3TextReveal from './cinematic/Scene3TextReveal';
import Scene4Ending from './cinematic/Scene4Ending';
import ParticleField from './cinematic/ParticleField';
import AudioManager from './cinematic/AudioManager';
import MusicLoader from './cinematic/MusicLoader';
import MusicControls from './cinematic/MusicControls';
import ClickEffects from './cinematic/ClickEffects';
import MobileSwipeHandler from './cinematic/MobileSwipeHandler';

type Scene = 'loading' | 'headphones' | 'transition' | 'text' | 'ending';

const CinematicExperience: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<Scene>('loading');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.4);
  const containerRef = useRef<HTMLDivElement>(null);
  const filmGrainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial setup
    if (containerRef.current) {
      gsap.set(containerRef.current, { opacity: 0 });
      gsap.to(containerRef.current, { opacity: 1, duration: 1 });
    }
  }, []);

  const transitionToScene = (nextScene: Scene, delay = 0) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentScene(nextScene);
      setIsTransitioning(false);
    }, delay);
  };

  const resetExperience = () => {
    setCurrentScene('loading');
    setIsTransitioning(false);
    setMusicStarted(false);
    setIsPlaying(true);
  };

  const handleMusicLoadComplete = () => {
    setCurrentScene('headphones');
  };

  const handleBeginExperience = () => {
    setMusicStarted(true);
    transitionToScene('transition', 500);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSwipeLeft = () => {
    // Skip to next scene or speed up animation
    if (currentScene === 'text') {
      transitionToScene('ending', 500);
    }
  };

  const handleSwipeRight = () => {
    // Go back to previous scene (if applicable)
    if (currentScene === 'text') {
      transitionToScene('transition', 500);
    } else if (currentScene === 'ending') {
      transitionToScene('text', 500);
    }
  };

  const handleSwipeUp = () => {
    // Increase volume
    setVolume(prev => Math.min(1, prev + 0.1));
  };

  const handleSwipeDown = () => {
    // Decrease volume
    setVolume(prev => Math.max(0, prev - 0.1));
  };

  return (
    <MobileSwipeHandler
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      onSwipeUp={handleSwipeUp}
      onSwipeDown={handleSwipeDown}
      disabled={currentScene === 'loading' || isTransitioning}
    >
      <div 
        ref={containerRef}
        className="fixed inset-0 w-screen h-screen bg-black overflow-hidden"
      >
        {/* Film Grain Effect */}
        <div ref={filmGrainRef} className="film-grain" />
        
        {/* WebGL Particle Background */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ParticleField />
          </Canvas>
        </div>

        {/* Main Content */}
        <div className="absolute inset-0 z-10">
          {currentScene === 'loading' && (
            <MusicLoader onLoadComplete={handleMusicLoadComplete} />
          )}
          
          {currentScene === 'headphones' && (
            <Scene1Headphones 
              onBegin={handleBeginExperience}
            />
          )}
          
          {currentScene === 'transition' && (
            <Scene2Transition 
              onComplete={() => transitionToScene('text', 1000)}
            />
          )}
          
          {currentScene === 'text' && (
            <Scene3TextReveal 
              onComplete={() => transitionToScene('ending', 1000)}
            />
          )}
          
          {currentScene === 'ending' && (
            <Scene4Ending 
              onReplay={resetExperience}
            />
          )}
        </div>

        {/* Audio Manager */}
        <AudioManager 
          currentScene={currentScene}
          musicStarted={musicStarted}
          isPlaying={isPlaying}
          volume={volume}
        />

        {/* Music Controls */}
        {currentScene !== 'loading' && currentScene !== 'headphones' && (
          <MusicControls
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            volume={volume}
            onVolumeChange={setVolume}
          />
        )}

        {/* Click Effects */}
        <ClickEffects />

        {/* Mobile swipe hints */}
        {currentScene !== 'loading' && currentScene !== 'headphones' && (
          <div className="fixed bottom-20 right-6 z-30 text-glow-primary/50 text-xs text-right select-none pointer-events-none md:hidden">
            <div>← Skip forward</div>
            <div>→ Go back</div>
            <div>↑ Volume up</div>
            <div>↓ Volume down</div>
          </div>
        )}
      </div>
    </MobileSwipeHandler>
  );
};

export default CinematicExperience;