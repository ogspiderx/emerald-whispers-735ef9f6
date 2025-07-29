import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface Scene3TextRevealProps {
  onComplete: () => void;
}

const textLines = [
  { text: "First of all...", font: "font-dancing", size: "text-2xl md:text-4xl" },
  { text: "Relax, sit back...", font: "font-dancing", size: "text-2xl md:text-4xl" },
  { text: "Happy first anniversary my love 💕", font: "font-dancing", size: "text-3xl md:text-5xl" },
  { text: "One month down, forever to go...", font: "font-dancing", size: "text-xl md:text-3xl" },
  { text: "I will always be here for you...", font: "font-dancing", size: "text-2xl md:text-4xl" },
  { text: "To support you, to love you, and to annoy you 😁", font: "font-dancing", size: "text-xl md:text-3xl" },
  { text: "I know we have our ups and downs...", font: "font-dancing", size: "text-2xl md:text-4xl" },
  { text: "And I know I get annoying sometimes 🤭", font: "font-dancing", size: "text-xl md:text-3xl" },
  { text: "But I promise to always try my best...", font: "font-dancing", size: "text-2xl md:text-4xl" },
  { text: "Even when we argue,", font: "font-dancing", size: "text-lg md:text-2xl" },
  { text: "I never stop caring... not even for a second.", font: "font-dancing", size: "text-2xl md:text-4xl" },
  { text: "You're not just my girlfriend — you're my peace and my chaos.", font: "font-dancing", size: "text-2xl md:text-4xl" },
  { text: "Through every laugh, every tear, every silence...", font: "font-dancing", size: "text-xl md:text-3xl" },
  { text: "I choose you. Over and over again.", font: "font-dancing", size: "text-xl md:text-3xl" },
  { text: "I know the past wasn't good for both of us...", font: "font-dancing", size: "text-xl md:text-3xl" },
  { text: "And I appreciate you for still letting me in...", font: "font-dancing", size: "text-xl md:text-3xl" },
  { text: "I know I can be a pain sometimes...", font: "font-dancing", size: "text-2xl md:text-4xl" },
  { text: "But that's just because I care so much about you...", font: "font-dancing", size: "text-2xl md:text-4xl" },
  { text: "I was worried that we argue a lot...", font: "font-dancing", size: "text-xl md:text-3xl" },
  { text: "And what if we break up...", font: "font-dancing", size: "text-xl md:text-3xl" },
  { text: "But I am sure now that it will never happen...", font: "font-dancing", size: "text-2xl md:text-4xl" },
  { text: "As long as we have each other, we will always be together.", font: "font-dancing", size: "text-2xl md:text-4xl" },
  { text: "I am sorry for the times I made you cry...", font: "font-dancing", size: "text-xl md:text-3xl" },
  { text: "I am not perfect, but I am trying to be better...", font: "font-dancing", size: "text-xl md:text-3xl" },
  { text: "Thanks for understanding me 🤭😁", font: "font-dancing", size: "text-2xl md:text-4xl" },
  { text: "I love you so much, and I am so grateful for you.", font: "font-dancing", size: "text-3xl md:text-5xl" },
  { text: "Happy 1st, my love — let's keep writing this story together. 💞", font: "font-dancing", size: "text-2xl md:text-4xl" },
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
              ${currentLine?.text.includes('💞') ? 'mb-0' : ''}
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