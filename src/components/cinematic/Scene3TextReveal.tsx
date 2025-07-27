import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface Scene3TextRevealProps {
  onComplete: () => void;
}

const textLines = [
  "First of all...",
  "Happy first month anniversary, my sexy gurl.",
  "You've survived 30 days of me 😈",
  "I know we argue.",
  "I know I can be annoying.",
  "But I want you to know this...",
  "Your laugh hits deeper than music.",
  "Your stubbornness? Even that I love.",
  "The way you say \"idiot\" makes me smile.",
  "You're the only person I want to fight and fix with.",
  "You calm my storms and cause them too.",
  "You're my peace.",
  "My chaos.",
  "My person.",
  "This isn't a message.",
  "This is a movie for you.",
  "A moment you can replay forever.",
  "Because forever?",
  "Isn't long enough for us.",
  "💚",
  "OGSpiderX 🕷️"
];

const Scene3TextReveal: React.FC<Scene3TextRevealProps> = ({ onComplete }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    
    const revealNextLine = (index: number) => {
      if (index >= textLines.length) {
        // All lines revealed, wait then complete
        const finalTimeout = setTimeout(() => {
          onComplete();
        }, 3000);
        timeouts.push(finalTimeout);
        return;
      }

      setCurrentLineIndex(index);
      
      // Animate the current line
      const currentLineRef = lineRefs.current[index];
      if (currentLineRef) {
        gsap.fromTo(currentLineRef, 
          {
            opacity: 0,
            y: 50,
            scale: 0.8
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power2.out"
          }
        );
      }

      // Schedule next line
      const delay = index === 0 ? 2000 : // First line longer delay
                   index === textLines.length - 2 ? 3000 : // Before signature longer delay
                   index === textLines.length - 1 ? 2000 : // Signature delay
                   2500; // Normal delay

      const timeout = setTimeout(() => revealNextLine(index + 1), delay);
      timeouts.push(timeout);
    };

    // Start the sequence after a brief delay
    const startTimeout = setTimeout(() => {
      revealNextLine(0);
    }, 1000);
    timeouts.push(startTimeout);

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full px-8 py-16 overflow-hidden"
    >
      <div className="max-w-4xl w-full text-center space-y-8">
        {textLines.map((line, index) => (
          <div
            key={index}
            ref={el => lineRefs.current[index] = el}
            className={`
              font-cinematic text-glow-primary opacity-0
              ${line.includes('💚') ? 'text-4xl md:text-6xl' : 
                line.includes('OGSpiderX') ? 'text-lg md:text-xl' :
                line.length < 30 ? 'text-2xl md:text-4xl' : 
                'text-xl md:text-3xl'}
              ${line.includes('💚') || line.includes('OGSpiderX') ? 'mt-12' : ''}
            `}
            style={{
              textShadow: '0 0 40px hsl(var(--glow-primary) / 0.8)',
              lineHeight: 1.4,
              letterSpacing: '0.05em'
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scene3TextReveal;