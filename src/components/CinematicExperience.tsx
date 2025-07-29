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

  return (
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
    </div>
  );
};

export default CinematicExperience;