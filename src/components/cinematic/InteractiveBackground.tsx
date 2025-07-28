import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface InteractiveBackgroundProps {
  children: React.ReactNode;
}

const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseTrailRef = useRef<HTMLDivElement[]>([]);
  const parallaxLayersRef = useRef<HTMLDivElement[]>([]);
  const breathingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Mouse trail particles
    const createTrailParticle = (x: number, y: number) => {
      const particle = document.createElement('div');
      particle.className = 'absolute w-2 h-2 bg-green-400/60 rounded-full pointer-events-none';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.transform = 'translate(-50%, -50%)';
      container.appendChild(particle);

      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => particle.remove()
      });
    };

    // Mouse move handler for parallax and trail
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Parallax effect
      const moveX = (clientX / innerWidth - 0.5) * 20;
      const moveY = (clientY / innerHeight - 0.5) * 20;

      parallaxLayersRef.current.forEach((layer, index) => {
        if (layer) {
          const depth = (index + 1) * 0.1;
          gsap.to(layer, {
            x: moveX * depth,
            y: moveY * depth,
            duration: 0.6,
            ease: "power2.out"
          });
        }
      });

      // Mouse trail (throttled)
      if (Math.random() > 0.7) {
        createTrailParticle(clientX, clientY);
      }
    };

    // Breathing effect
    const breathingAnimation = gsap.to(breathingRef.current, {
      scale: 1.02,
      duration: 3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    // Interactive particles that react to hover
    const createInteractiveParticles = () => {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 bg-green-400/40 rounded-full pointer-events-none interactive-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        container.appendChild(particle);

        // Floating animation
        gsap.to(particle, {
          x: `+=${Math.random() * 200 - 100}`,
          y: `+=${Math.random() * 200 - 100}`,
          duration: 10 + Math.random() * 10,
          ease: "none",
          repeat: -1,
          yoyo: true
        });

        // Pulse animation
        gsap.to(particle, {
          scale: 1.5,
          opacity: 0.8,
          duration: 2 + Math.random() * 3,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1
        });
      }
    };

    // Click ripple effect
    const handleClick = (e: MouseEvent) => {
      const ripple = document.createElement('div');
      ripple.className = 'absolute border-2 border-green-400/30 rounded-full pointer-events-none';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      ripple.style.transform = 'translate(-50%, -50%)';
      container.appendChild(ripple);

      gsap.fromTo(ripple, 
        { width: 0, height: 0, opacity: 1 },
        { 
          width: 200, 
          height: 200, 
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          onComplete: () => ripple.remove()
        }
      );
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);
    createInteractiveParticles();

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      breathingAnimation.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      {/* Parallax layers */}
      <div 
        ref={el => { if (el) parallaxLayersRef.current[0] = el; }}
        className="absolute inset-0 opacity-20"
      >
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div 
        ref={el => { if (el) parallaxLayersRef.current[1] = el; }}
        className="absolute inset-0 opacity-15"
      >
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Breathing container */}
      <div ref={breathingRef} className="w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default InteractiveBackground;