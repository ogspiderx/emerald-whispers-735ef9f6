import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface InteractiveBackgroundProps {
  mousePosition: { x: number; y: number };
  isClicking: boolean;
}

const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ mousePosition, isClicking }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const mouseTrailRef = useRef<THREE.Points>(null);
  const breathingRef = useRef<THREE.Group>(null);
  
  const particleCount = 800;
  const trailCount = 50;
  
  const [mouseTrail, setMouseTrail] = useState<Array<{ x: number; y: number; age: number }>>([]);

  // Main interactive particles
  const particles = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 25;
      const y = (Math.random() - 0.5) * 25;
      const z = (Math.random() - 0.5) * 25;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;
    }
    
    return { positions, originalPositions };
  }, []);

  // Mouse trail particles
  const trailPositions = React.useMemo(() => {
    return new Float32Array(trailCount * 3);
  }, []);

  // Update mouse trail
  useEffect(() => {
    const newTrail = [...mouseTrail];
    
    // Add new position
    newTrail.unshift({
      x: (mousePosition.x / window.innerWidth) * 2 - 1,
      y: -(mousePosition.y / window.innerHeight) * 2 + 1,
      age: 0
    });
    
    // Age existing positions and remove old ones
    const updatedTrail = newTrail
      .map(point => ({ ...point, age: point.age + 1 }))
      .slice(0, trailCount);
    
    setMouseTrail(updatedTrail);
  }, [mousePosition.x, mousePosition.y]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Breathing effect
    if (breathingRef.current) {
      const breathScale = 1 + Math.sin(time * 0.8) * 0.05;
      breathingRef.current.scale.setScalar(breathScale);
    }
    
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const originalPositions = particles.originalPositions;
      
      // Mouse interaction effect
      const mouseX = (mousePosition.x / window.innerWidth) * 2 - 1;
      const mouseY = -(mousePosition.y / window.innerHeight) * 2 + 1;
      const mouseZ = 0;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        const originalX = originalPositions[i3];
        const originalY = originalPositions[i3 + 1];
        const originalZ = originalPositions[i3 + 2];
        
        // Distance from mouse
        const dx = originalX - mouseX * 5;
        const dy = originalY - mouseY * 5;
        const dz = originalZ - mouseZ;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Repulsion effect
        const force = Math.max(0, 3 - distance) * 0.3;
        const pushX = (dx / distance) * force;
        const pushY = (dy / distance) * force;
        const pushZ = (dz / distance) * force;
        
        // Click attraction effect
        const clickForce = isClicking ? -force * 2 : 0;
        
        // Apply effects
        positions[i3] = originalX + pushX + (clickForce * -pushX);
        positions[i3 + 1] = originalY + pushY + (clickForce * -pushY) + Math.sin(time + i * 0.1) * 0.001;
        positions[i3 + 2] = originalZ + pushZ + (clickForce * -pushZ);
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y = time * 0.02;
    }
    
    // Update mouse trail
    if (mouseTrailRef.current && mouseTrail.length > 0) {
      const trailPos = mouseTrailRef.current.geometry.attributes.position.array as Float32Array;
      
      mouseTrail.forEach((point, index) => {
        if (index < trailCount) {
          trailPos[index * 3] = point.x * 5;
          trailPos[index * 3 + 1] = point.y * 5;
          trailPos[index * 3 + 2] = Math.sin(time + index * 0.5) * 0.5;
        }
      });
      
      mouseTrailRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={breathingRef}>
      {/* Main interactive particles */}
      <Points
        ref={pointsRef}
        positions={particles.positions}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#00ff88"
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Mouse trail particles */}
      <Points
        ref={mouseTrailRef}
        positions={trailPositions}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#22ff88"
          size={0.12}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

export default InteractiveBackground;