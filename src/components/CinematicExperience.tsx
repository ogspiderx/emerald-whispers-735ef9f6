import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import Scene1Headphones from './cinematic/Scene1Headphones';
import Scene2Transition from './cinematic/Scene2Transition';
import SceneChoices from './cinematic/SceneChoices';
import SceneMemoryLane from './cinematic/SceneMemoryLane';
import Scene3TextReveal from './cinematic/Scene3TextReveal';
import Scene4Ending from './cinematic/Scene4Ending';
import ParticleField from './cinematic/ParticleField';
import AudioManager from './cinematic/AudioManager';
import InteractiveBackground from './cinematic/InteractiveBackground';

type Scene = 'headphones' | 'transition' | 'choices' | 'memory' | 'text' | 'ending';

const CinematicExperience: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<Scene>('headphones');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [chosenPath, setChosenPath] = useState<'romantic' | 'playful' | 'sentimental'>('romantic');
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
    setCurrentScene('headphones');
    setIsTransitioning(false);
    setChosenPath('romantic');
  };

  const handleChoice = (choice: 'romantic' | 'playful' | 'sentimental') => {
    setChosenPath(choice);
    transitionToScene('memory', 500);
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
        <InteractiveBackground>
          {currentScene === 'headphones' && (
            <Scene1Headphones 
              onBegin={() => transitionToScene('transition', 500)}
            />
          )}
          
          {currentScene === 'transition' && (
            <Scene2Transition 
              onComplete={() => transitionToScene('choices', 1000)}
            />
          )}
          
          {currentScene === 'choices' && (
            <SceneChoices 
              onChoice={handleChoice}
            />
          )}
          
          {currentScene === 'memory' && (
            <SceneMemoryLane 
              pathType={chosenPath}
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
        </InteractiveBackground>
      </div>

      {/* Audio Manager */}
      <AudioManager currentScene={currentScene} />
    </div>
  );
};

export default CinematicExperience;