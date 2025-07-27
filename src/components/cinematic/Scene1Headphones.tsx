import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface Scene1HeadphonesProps {
  onBegin: () => void;
}

const Scene1Headphones: React.FC<Scene1HeadphonesProps> = ({ onBegin }) => {
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Fade in container
    tl.from(containerRef.current, {
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    });

    // Typing effect for the text
    if (textRef.current) {
      const text = "🎧 Kindly wear your headphones";
      const textElement = textRef.current;
      textElement.innerHTML = "";
      
      let i = 0;
      const typeText = () => {
        if (i < text.length) {
          textElement.innerHTML += text.charAt(i);
          i++;
          setTimeout(typeText, 100);
        } else {
          // Show button after typing is complete
          setTimeout(() => {
            setShowButton(true);
          }, 2000);
        }
      };
      
      setTimeout(typeText, 1000);
    }
  }, []);

  useEffect(() => {
    if (showButton && buttonRef.current) {
      gsap.from(buttonRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 20,
        duration: 0.8,
        ease: "back.out(1.7)"
      });
    }
  }, [showButton]);

  const handleBegin = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: onBegin
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full px-8"
    >
      <div 
        ref={textRef}
        className="text-2xl md:text-4xl font-ui text-glow-primary text-center mb-12 typing-text"
        style={{
          textShadow: '0 0 30px hsl(var(--glow-primary) / 0.8)',
        }}
      />
      
      {showButton && (
        <button
          ref={buttonRef}
          onClick={handleBegin}
          className="cinematic-button text-lg font-semibold group relative overflow-hidden"
        >
          <span className="relative z-10">Begin</span>
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-glow-primary/20 to-transparent 
                       transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          />
        </button>
      )}
    </div>
  );
};

export default Scene1Headphones;