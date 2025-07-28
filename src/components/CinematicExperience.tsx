import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import Scene1Headphones from './cinematic/Scene1Headphones';
import Scene2Transition from './cinematic/Scene2Transition';
import Scene3TextReveal from './cinematic/Scene3TextReveal';
import Scene4Ending from './cinematic/Scene4Ending';
import InteractiveBackground from './cinematic/InteractiveBackground';
import AudioManager from './cinematic/AudioManager';

type Scene = 'headphones' | 'transition' | 'text' | 'ending';

const CinematicExperience: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<Scene>('headphones');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const filmGrainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial setup
    if (containerRef.current) {
      gsap.set(containerRef.current, { opacity: 0 });
      gsap.to(containerRef.current, { opacity: 1, duration: 1 });
    }

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const transitionToScene = (nextScene: Scene, delay = 0) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentScene(nextScene);
      setIsTransitioning(false);
    }, delay);
  };

  const resetExperience = () => {
    setCurrentScene('headphones');
    setIsTransitioning(false);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen bg-black overflow-hidden"
    >
      {/* Film Grain Effect */}
      <div ref={filmGrainRef} className="film-grain" />
      
      {/* Interactive WebGL Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <InteractiveBackground 
            mousePosition={mousePosition} 
            isClicking={isClicking}
          />
        </Canvas>
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 z-10">
        {currentScene === 'headphones' && (
          <Scene1Headphones 
            onBegin={() => transitionToScene('transition', 500)}
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
      <AudioManager currentScene={currentScene} />
    </div>
  );
};

export default CinematicExperience;