import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Scene2TransitionProps {
  onComplete: () => void;
}

const Scene2Transition: React.FC<Scene2TransitionProps> = ({ onComplete }) => {
  const leftHalfRef = useRef<HTMLDivElement>(null);
  const rightHalfRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Create button slicing effect
    tl.to([leftHalfRef.current, rightHalfRef.current], {
      duration: 1.2,
      ease: "power2.inOut",
      onStart: () => {
        // Slice animation
        if (leftHalfRef.current) {
          gsap.to(leftHalfRef.current, {
            x: "-100vw",
            rotation: -45,
            duration: 1.2,
            ease: "power2.inOut"
          });
        }
        if (rightHalfRef.current) {
          gsap.to(rightHalfRef.current, {
            x: "100vw", 
            rotation: 45,
            duration: 1.2,
            ease: "power2.inOut"
          });
        }
      }
    })
    .to(flashRef.current, {
      opacity: 1,
      duration: 0.1,
      ease: "power2.out"
    }, "-=0.5")
    .to(flashRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out"
    })
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        setTimeout(onComplete, 1000);
      }
    });

  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center"
    >
      {/* Flash effect */}
      <div
        ref={flashRef}
        className="absolute inset-0 bg-white opacity-0 z-50"
      />
      
      {/* Button halves */}
      <div className="relative">
        <div
          ref={leftHalfRef}
          className="absolute w-32 h-16 bg-glow-primary/20 border border-glow-primary/50"
          style={{
            clipPath: 'polygon(0% 0%, 50% 0%, 100% 100%, 0% 100%)',
            left: '-64px',
            top: '-32px'
          }}
        />
        <div
          ref={rightHalfRef}
          className="absolute w-32 h-16 bg-glow-primary/20 border border-glow-primary/50"
          style={{
            clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%)',
            left: '0px',
            top: '-32px'
          }}
        />
        
        {/* Original button (hidden) */}
        <div className="w-32 h-16 opacity-0" />
      </div>
    </div>
  );
};

export default Scene2Transition;