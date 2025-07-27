import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleCount = 200;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
      
      // Velocity
      velocities[i * 3] = (Math.random() - 0.5) * 0.02; // x velocity
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02; // y velocity
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02; // z velocity
    }
    
    return { positions, velocities };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Floating motion
        positions[i3 + 1] += Math.sin(time + i * 0.1) * 0.001; // y movement
        positions[i3] += Math.cos(time + i * 0.05) * 0.0005; // x movement
        
        // Boundary check and reset
        if (positions[i3 + 1] > 10) positions[i3 + 1] = -10;
        if (positions[i3 + 1] < -10) positions[i3 + 1] = 10;
        if (positions[i3] > 10) positions[i3] = -10;
        if (positions[i3] < -10) positions[i3] = 10;
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Rotate the entire particle field slowly
      pointsRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <Points
      ref={pointsRef}
      positions={particles.positions}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#00ff00"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export default ParticleField;