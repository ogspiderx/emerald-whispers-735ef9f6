import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Scene2TransitionProps {
  onComplete: () => void;
}

const Scene2Transition: React.FC<Scene2TransitionProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple fade transition - no button breaking
    const tl = gsap.timeline();
    
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        setTimeout(onComplete, 500);
      }
    });

  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="text-glow-primary/80 text-xl font-dancing-script">
        ✨ Let the magic begin...
      </div>
    </div>
  );
};

export default Scene2Transition;