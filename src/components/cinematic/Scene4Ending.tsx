import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface Scene4EndingProps {
  onReplay: () => void;
}

const Scene4Ending: React.FC<Scene4EndingProps> = ({ onReplay }) => {
  const [showReplay, setShowReplay] = useState(false);
  const heartRef = useRef<HTMLDivElement>(null);
  const replayRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Fade in container
    tl.from(containerRef.current, {
      opacity: 0,
      duration: 2,
      ease: "power2.out"
    });

    // Animate heart
    if (heartRef.current) {
      tl.from(heartRef.current, {
        scale: 0,
        rotation: 180,
        duration: 1.5,
        ease: "back.out(1.7)"
      }, "-=1")
      .to(heartRef.current, {
        scale: 1.1,
        duration: 0.8,
        yoyo: true,
        repeat: -1,
        ease: "power2.inOut"
      });
    }

    // Show replay button after delay
    const timeout = setTimeout(() => {
      setShowReplay(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (showReplay && replayRef.current) {
      gsap.from(replayRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out"
      });
    }
  }, [showReplay]);

  const handleReplay = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: onReplay
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full px-8"
    >
      <div
        ref={heartRef}
        className="text-8xl md:text-9xl mb-12 heartbeat"
        style={{
          filter: 'drop-shadow(0 0 40px hsl(var(--glow-primary) / 0.8))',
          color: 'hsl(var(--glow-primary))'
        }}
      >
        💚
      </div>
      
      {showReplay && (
        <button
          ref={replayRef}
          onClick={handleReplay}
          className="cinematic-button text-lg font-semibold group relative overflow-hidden"
        >
          <span className="relative z-10">Replay?</span>
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-glow-primary/20 to-transparent 
                       transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          />
        </button>
      )}
    </div>
  );
};

export default Scene4Ending;