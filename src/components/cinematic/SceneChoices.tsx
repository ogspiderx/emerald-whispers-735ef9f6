import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface SceneChoicesProps {
  onChoice: (choice: 'romantic' | 'playful' | 'sentimental') => void;
}

const SceneChoices: React.FC<SceneChoicesProps> = ({ onChoice }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const choicesRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const choices = [
    {
      id: 'romantic',
      title: 'Romantic Journey',
      description: 'Explore our most tender moments',
      emoji: '💕'
    },
    {
      id: 'playful',
      title: 'Fun Adventures',
      description: 'Relive our silly and joyful times',
      emoji: '🎉'
    },
    {
      id: 'sentimental',
      title: 'Memory Lane',
      description: 'Journey through our special memories',
      emoji: '✨'
    }
  ];

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.to(containerRef.current, {
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    })
    .to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.5")
    .to(choicesRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => setIsVisible(true)
    }, "-=0.3");

  }, []);

  const handleChoice = (choiceId: 'romantic' | 'playful' | 'sentimental') => {
    const tl = gsap.timeline();
    
    tl.to(containerRef.current, {
      scale: 0.9,
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => onChoice(choiceId)
    });
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 flex flex-col items-center justify-center opacity-0"
    >
      <div
        ref={titleRef}
        className="text-center mb-12 opacity-0 transform translate-y-8"
      >
        <h2 className="font-dancing text-6xl md:text-7xl text-green-400 mb-4 glow-text">
          Choose Our Path
        </h2>
        <p className="font-poppins text-lg text-green-300/80">
          How would you like to experience our story?
        </p>
      </div>

      <div
        ref={choicesRef}
        className="flex flex-col md:flex-row gap-6 opacity-0 transform translate-y-8"
      >
        {choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => handleChoice(choice.id as 'romantic' | 'playful' | 'sentimental')}
            className="group relative bg-black/40 backdrop-blur-sm border border-green-400/30 rounded-xl p-6 md:p-8 
                     transition-all duration-300 hover:border-green-400/60 hover:bg-green-400/10 
                     hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {choice.emoji}
              </div>
              <h3 className="font-dancing text-2xl md:text-3xl text-green-400 mb-2 glow-text">
                {choice.title}
              </h3>
              <p className="font-poppins text-sm md:text-base text-green-300/70">
                {choice.description}
              </p>
            </div>
            
            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 
                          bg-gradient-to-r from-green-400 to-emerald-400 transition-opacity duration-300" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SceneChoices;