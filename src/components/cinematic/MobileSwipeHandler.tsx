import React, { useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import gsap from 'gsap';

interface MobileSwipeHandlerProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const MobileSwipeHandler: React.FC<MobileSwipeHandlerProps> = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  children,
  disabled = false
}) => {
  const [swipeIndicators, setSwipeIndicators] = useState<Array<{
    id: number;
    direction: string;
    x: number;
    y: number;
  }>>([]);
  
  const indicatorId = useRef(0);

  const createSwipeIndicator = (direction: string, x: number, y: number) => {
    const id = indicatorId.current++;
    const indicator = { id, direction, x, y };
    
    setSwipeIndicators(prev => [...prev, indicator]);
    
    // Remove indicator after animation
    setTimeout(() => {
      setSwipeIndicators(prev => prev.filter(i => i.id !== id));
    }, 800);
  };

  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      if (!disabled && onSwipeLeft) {
        createSwipeIndicator('left', eventData.initial[0], eventData.initial[1]);
        onSwipeLeft();
      }
    },
    onSwipedRight: (eventData) => {
      if (!disabled && onSwipeRight) {
        createSwipeIndicator('right', eventData.initial[0], eventData.initial[1]);
        onSwipeRight();
      }
    },
    onSwipedUp: (eventData) => {
      if (!disabled && onSwipeUp) {
        createSwipeIndicator('up', eventData.initial[0], eventData.initial[1]);
        onSwipeUp();
      }
    },
    onSwipedDown: (eventData) => {
      if (!disabled && onSwipeDown) {
        createSwipeIndicator('down', eventData.initial[0], eventData.initial[1]);
        onSwipeDown();
      }
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50,
    preventScrollOnSwipe: true,
    rotationAngle: 0,
  });

  return (
    <div {...handlers} className="relative w-full h-full">
      {children}
      
      {/* Swipe Indicators */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {swipeIndicators.map(indicator => (
          <SwipeIndicator
            key={indicator.id}
            direction={indicator.direction}
            x={indicator.x}
            y={indicator.y}
          />
        ))}
      </div>
    </div>
  );
};

interface SwipeIndicatorProps {
  direction: string;
  x: number;
  y: number;
}

const SwipeIndicator: React.FC<SwipeIndicatorProps> = ({ direction, x, y }) => {
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (indicatorRef.current) {
      const distance = 100;
      let deltaX = 0;
      let deltaY = 0;

      switch (direction) {
        case 'left':
          deltaX = -distance;
          break;
        case 'right':
          deltaX = distance;
          break;
        case 'up':
          deltaY = -distance;
          break;
        case 'down':
          deltaY = distance;
          break;
      }

      gsap.fromTo(indicatorRef.current,
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1
        },
        {
          x: deltaX,
          y: deltaY,
          opacity: 0,
          scale: 0.5,
          duration: 0.8,
          ease: "power2.out"
        }
      );
    }
  }, [direction]);

  const getArrow = () => {
    switch (direction) {
      case 'left': return '←';
      case 'right': return '→';
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '•';
    }
  };

  return (
    <div
      ref={indicatorRef}
      className="absolute pointer-events-none"
      style={{
        left: x - 20,
        top: y - 20,
        width: 40,
        height: 40
      }}
    >
      <div className="w-full h-full bg-glow-primary/30 border border-glow-primary/70 rounded-full flex items-center justify-center text-glow-primary text-xl font-bold backdrop-blur-sm">
        {getArrow()}
      </div>
    </div>
  );
};

export default MobileSwipeHandler;