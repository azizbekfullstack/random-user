'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  angle: number;
  duration: number;
}

export function CelebrationEffect() {
  const particles: ConfettiParticle[] = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    angle: Math.random() * Math.PI * 2,
    duration: 1.5 + Math.random() * 0.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Sparkling effect - multiple layers */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1 h-1 bg-accent rounded-full"
          style={{
            left: `${20 + i * 4}%`,
            top: `${30 + (i % 3) * 15}%`,
          }}
          animate={{
            opacity: [0, 1, 0.5, 1, 0],
            scale: [0, 1.5, 1, 1.5, 0],
          }}
          transition={{
            duration: 0.8 + i * 0.05,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Confetti falling */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-accent"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: '-4px',
            marginTop: '-4px',
          }}
          animate={{
            x: particle.x * 100,
            y: particle.y * 100,
            opacity: [1, 0],
            rotate: particle.angle * 360,
          }}
          transition={{
            duration: particle.duration,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Radiant glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-accent/30 via-accent/10 to-transparent"
        animate={{
          opacity: [0.5, 0, 0.5],
          scale: [0.5, 2, 1],
        }}
        transition={{
          duration: 1.2,
          ease: 'easeOut',
        }}
        style={{
          borderRadius: '50%',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
}

export default CelebrationEffect;
