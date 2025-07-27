import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface Scene3TextRevealProps {
  onComplete: () => void;
}

const textLines = [
  { text: "First of all...", font: "font-poppins", size: "text-2xl md:text-4xl" },
  { text: "Happy first month anniversary, my sexy gurl.", font: "font-dancing", size: "text-3xl md:text-5xl" },
  { text: "You've survived 30 days of me 😈", font: "font-poppins", size: "text-xl md:text-3xl" },
  { text: "I know we argue.", font: "font-playfair", size: "text-2xl md:text-4xl" },
  { text: "I know I can be annoying.", font: "font-playfair", size: "text-2xl md:text-4xl" },
  { text: "But I want you to know this...", font: "font-poppins", size: "text-2xl md:text-4xl" },
  { text: "Your laugh hits deeper than music.", font: "font-dancing", size: "text-2xl md:text-4xl" },
  { text: "Your stubbornness? Even that I love.", font: "font-poppins", size: "text-xl md:text-3xl" },
  { text: "The way you say \"idiot\" makes me smile.", font: "font-poppins", size: "text-xl md:text-3xl" },
  { text: "You're the only person I want to fight and fix with.", font: "font-playfair", size: "text-lg md:text-2xl" },
  { text: "You calm my storms and cause them too.", font: "font-dancing", size: "text-2xl md:text-4xl" },
  { text: "You're my peace.", font: "font-playfair", size: "text-3xl md:text-5xl" },
  { text: "My chaos.", font: "font-playfair", size: "text-3xl md:text-5xl" },
  { text: "My person.", font: "font-dancing", size: "text-4xl md:text-6xl" },
  { text: "This isn't a message.", font: "font-poppins", size: "text-xl md:text-3xl" },
  { text: "This is a movie for you.", font: "font-poppins", size: "text-xl md:text-3xl" },
  { text: "A moment you can replay forever.", font: "font-dancing", size: "text-2xl md:text-4xl" },
  { text: "Because forever?", font: "font-playfair", size: "text-2xl md:text-4xl" },
  { text: "Isn't long enough for us.", font: "font-playfair", size: "text-2xl md:text-4xl" },
  { text: "💚", font: "font-poppins", size: "text-6xl md:text-8xl" },
  { text: "OGSpiderX 🕷️", font: "font-dancing", size: "text-xl md:text-2xl" }
];

const Scene3TextReveal: React.FC<Scene3TextRevealProps> = ({ onComplete }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    
    const typeText = (text: string, callback: () => void) => {
      setDisplayText("");
      setIsTyping(true);
      
      let i = 0;
      const typing = () => {
        if (i < text.length) {
          setDisplayText(text.substring(0, i + 1));
          i++;
          const timeout = setTimeout(typing, 80); // Typing speed
          timeouts.push(timeout);
        } else {
          setIsTyping(false);
          callback();
        }
      };
      typing();
    };

    const showNextLine = (index: number) => {
      if (index >= textLines.length) {
        // All lines completed
        const finalTimeout = setTimeout(() => {
          onComplete();
        }, 3000);
        timeouts.push(finalTimeout);
        return;
      }

      setCurrentLineIndex(index);
      
      // Fade in the text container
      if (textRef.current) {
        gsap.fromTo(textRef.current, 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5 }
        );
      }

      // Type the text
      typeText(textLines[index].text, () => {
        // Text typing complete, wait then fade out
        const holdTimeout = setTimeout(() => {
          if (textRef.current) {
            gsap.to(textRef.current, {
              opacity: 0,
              y: -30,
              duration: 0.8,
              ease: "power2.in",
              onComplete: () => {
                // Move to next line
                const nextTimeout = setTimeout(() => {
                  showNextLine(index + 1);
                }, 300);
                timeouts.push(nextTimeout);
              }
            });
          }
        }, index === textLines.length - 2 ? 4000 : // Heart emoji longer
             index === textLines.length - 1 ? 3000 : // Signature longer
             2500); // Normal hold time
        timeouts.push(holdTimeout);
      });
    };

    // Start the sequence
    const startTimeout = setTimeout(() => {
      showNextLine(0);
    }, 1000);
    timeouts.push(startTimeout);

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [onComplete]);

  const currentLine = textLines[currentLineIndex];

  return (
    <div 
      ref={containerRef}
      className="flex items-center justify-center h-full px-8"
    >
      <div className="max-w-4xl w-full text-center">
        {currentLineIndex >= 0 && (
          <div
            ref={textRef}
            className={`
              text-glow-primary
              ${currentLine?.font || 'font-poppins'}
              ${currentLine?.size || 'text-2xl md:text-4xl'}
              ${currentLine?.text.includes('💚') ? 'mb-0' : ''}
              ${isTyping ? 'border-r-2 border-glow-primary' : ''}
            `}
            style={{
              textShadow: '0 0 40px hsl(var(--glow-primary) / 0.8)',
              lineHeight: 1.4,
              letterSpacing: currentLine?.font === 'font-dancing' ? '0.02em' : '0.05em',
              minHeight: '1.5em'
            }}
          >
            {displayText}
            {isTyping && (
              <span 
                className="animate-pulse ml-1"
                style={{ 
                  borderColor: 'hsl(var(--glow-primary))',
                  animation: 'blink 1s step-end infinite'
                }}
              >
                |
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scene3TextReveal;