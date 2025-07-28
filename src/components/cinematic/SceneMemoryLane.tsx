import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface SceneMemoryLaneProps {
  pathType: 'romantic' | 'playful' | 'sentimental';
  onComplete: () => void;
}

const SceneMemoryLane: React.FC<SceneMemoryLaneProps> = ({ pathType, onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentMemory, setCurrentMemory] = useState(0);

  const memories = {
    romantic: [
      { text: "Our first dance under the stars", icon: "💃" },
      { text: "The way you smiled on our first date", icon: "😊" },
      { text: "Those quiet moments just holding hands", icon: "👫" },
      { text: "Every sunset we watched together", icon: "🌅" }
    ],
    playful: [
      { text: "Our silly photo booth adventures", icon: "📸" },
      { text: "Dancing in the rain like kids", icon: "🌧️" },
      { text: "Those random midnight pizza runs", icon: "🍕" },
      { text: "Making each other laugh until we cried", icon: "😂" }
    ],
    sentimental: [
      { text: "The day we knew this was forever", icon: "💝" },
      { text: "How you held me when I needed it most", icon: "🤗" },
      { text: "Building our dreams together", icon: "🏠" },
      { text: "Every 'I love you' that made time stop", icon: "⏰" }
    ]
  };

  const currentMemories = memories[pathType];

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.to(containerRef.current, {
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    });

    // Animate through memories
    const memoryTimeline = gsap.timeline({ repeat: currentMemories.length - 1 });
    
    currentMemories.forEach((_, index) => {
      memoryTimeline
        .call(() => setCurrentMemory(index))
        .to(".memory-card", {
          scale: 1.1,
          rotationY: 360,
          duration: 0.8,
          ease: "power2.inOut"
        })
        .to(".memory-card", {
          scale: 1,
          duration: 0.4,
          ease: "power2.out"
        })
        .to({}, { duration: 1.5 }); // Hold for reading
    });

    memoryTimeline.call(() => {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: "power2.inOut",
        onComplete
      });
    });

  }, [pathType, currentMemories, onComplete]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center opacity-0"
    >
      <div className="text-center">
        <h2 className="font-dancing text-5xl md:text-6xl text-green-400 mb-12 glow-text">
          Memory Lane
        </h2>
        
        <div
          ref={carouselRef}
          className="memory-card relative bg-black/50 backdrop-blur-sm border border-green-400/40 
                   rounded-2xl p-8 md:p-12 max-w-lg mx-auto transform-gpu"
        >
          <div className="text-6xl mb-6">
            {currentMemories[currentMemory]?.icon}
          </div>
          <p className="font-dancing text-2xl md:text-3xl text-green-300 leading-relaxed glow-text">
            {currentMemories[currentMemory]?.text}
          </p>
          
          {/* Memory counter */}
          <div className="flex justify-center mt-8 space-x-2">
            {currentMemories.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentMemory 
                    ? 'bg-green-400 shadow-lg shadow-green-400/50' 
                    : 'bg-green-400/30'
                }`}
              />
            ))}
          </div>
          
          {/* Floating particles around memory card */}
          <div className="absolute -inset-4 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-green-400/60 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneMemoryLane;