import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

interface ClickEffect {
  id: number;
  x: number;
  y: number;
}

const ClickEffects: React.FC = () => {
  const [effects, setEffects] = useState<ClickEffect[]>([]);

  useEffect(() => {
    let effectId = 0;

    const handleClick = (e: MouseEvent) => {
      const newEffect: ClickEffect = {
        id: effectId++,
        x: e.clientX,
        y: e.clientY
      };

      setEffects(prev => [...prev, newEffect]);

      // Remove effect after animation
      setTimeout(() => {
        setEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
      }, 800);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {effects.map(effect => (
        <ClickRipple key={effect.id} x={effect.x} y={effect.y} />
      ))}
    </div>
  );
};

interface ClickRippleProps {
  x: number;
  y: number;
}

const ClickRipple: React.FC<ClickRippleProps> = ({ x, y }) => {
  const rippleRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rippleRef.current) {
      // Create ripple animation
      gsap.fromTo(rippleRef.current, 
        { 
          scale: 0,
          opacity: 1
        },
        {
          scale: 4,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out"
        }
      );

      // Create particles
      const particles = rippleRef.current.querySelectorAll('.particle');
      particles.forEach((particle, index) => {
        const angle = (index / particles.length) * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        const particleX = Math.cos(angle) * distance;
        const particleY = Math.sin(angle) * distance;

        gsap.to(particle, {
          x: particleX,
          y: particleY,
          opacity: 0,
          scale: 0,
          duration: 0.6 + Math.random() * 0.4,
          ease: "power2.out",
          delay: Math.random() * 0.1
        });
      });
    }
  }, []);

  return (
    <div
      ref={rippleRef}
      className="absolute pointer-events-none"
      style={{
        left: x - 20,
        top: y - 20,
        width: 40,
        height: 40
      }}
    >
      {/* Main ripple */}
      <div className="absolute inset-0 border-2 border-glow-primary/50 rounded-full" />
      
      {/* Particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="particle absolute w-1 h-1 bg-glow-primary rounded-full"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
};

export default ClickEffects;