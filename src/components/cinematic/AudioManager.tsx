import React, { useEffect, useRef } from 'react';

interface AudioManagerProps {
  currentScene: 'headphones' | 'transition' | 'text' | 'ending';
}

const AudioManager: React.FC<AudioManagerProps> = ({ currentScene }) => {
  const ambientRef = useRef<HTMLAudioElement>(null);
  const musicRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Create audio context for ambient sound (heartbeat/wind)
    const ambientAudio = new Audio();
    ambientAudio.loop = true;
    ambientAudio.volume = 0.3;
    ambientRef.current = ambientAudio;

    // Create audio context for cinematic music
    const musicAudio = new Audio();
    musicAudio.src = '/audio/background-music.mp3'; // Put your MP3 file here
    musicAudio.loop = true;
    musicAudio.volume = 0.4;
    musicRef.current = musicAudio;

    // For now, we'll use data URLs for simple tones
    // In a real implementation, you'd load actual audio files
    
    return () => {
      ambientAudio.pause();
      musicAudio.pause();
    };
  }, []);

  useEffect(() => {
    const playAmbient = () => {
      if (ambientRef.current && currentScene === 'headphones') {
        // Create a simple ambient tone using Web Audio API
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(60, audioContext.currentTime); // Low frequency for heartbeat
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        // Create pulsing effect
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        
        oscillator.start();
        
        setTimeout(() => {
          oscillator.stop();
          audioContext.close();
        }, 1000);
      }
    };

    const playMusic = () => {
      if (musicRef.current && currentScene === 'text') {
        musicRef.current.play().catch(console.error);
      }
    };

    if (currentScene === 'headphones') {
      playAmbient();
    } else if (currentScene === 'text') {
      playMusic();
    }
  }, [currentScene]);

  return null; // This component doesn't render anything visible
};

export default AudioManager;