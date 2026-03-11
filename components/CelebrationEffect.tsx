'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  duration: number;
  size: number;
  color: 'gold' | 'yellow' | 'white';
  delay: number;
}

export function CelebrationEffect() {
  // Generate confetti with physics-like motion
  const particles: ConfettiParticle[] = Array.from({ length: 80 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 80; // Distribute around circle
    const velocity = 2 + Math.random() * 3;
    const colors: Array<'gold' | 'yellow' | 'white'> = ['gold', 'yellow', 'white'];

    return {
      id: i,
      x: Math.cos(angle) * (30 + Math.random() * 20),
      y: Math.sin(angle) * (30 + Math.random() * 20) - 40,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 0.5,
      angle: Math.random() * Math.PI * 2,
      duration: 2.2 + Math.random() * 0.8,
      size: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: i * 0.02,
    };
  });

  const getColorClass = (color: string): string => {
    switch (color) {
      case 'gold':
        return 'bg-yellow-400';
      case 'yellow':
        return 'bg-yellow-300';
      case 'white':
        return 'bg-white';
      default:
        return 'bg-yellow-400';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Elegant center glow pulse */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1, 2],
        }}
        transition={{
          duration: 1.8,
          ease: 'easeOut',
        }}
      >
        <div className="w-32 h-32 bg-gradient-to-r from-yellow-400/50 via-yellow-300/30 to-transparent rounded-full blur-2xl" />
      </motion.div>

      {/* Radiant rings */}
      {[0, 1, 2].map((ring) => (
        <motion.div
          key={`ring-${ring}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-400/40"
          style={{
            width: `${60 + ring * 40}px`,
            height: `${60 + ring * 40}px`,
          }}
          animate={{
            opacity: [0.6, 0.2, 0],
            scale: [0.8, 1.3, 1.5],
          }}
          transition={{
            duration: 1.5,
            delay: ring * 0.15,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Sparkling stars */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 30;
        const radius = 80 + Math.random() * 40;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-lg"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
            }}
            animate={{
              opacity: [0, 1, 0.5, 1, 0],
              scale: [0, 1.2, 0.8, 1.2, 0],
            }}
            transition={{
              duration: 1.6 + i * 0.03,
              delay: i * 0.04,
              ease: 'easeOut',
            }}
          />
        );
      })}

      {/* Gold confetti particles falling and rotating */}
      {particles.map((particle) => (
        <motion.div
          key={`confetti-${particle.id}`}
          className={`absolute ${getColorClass(particle.color)} rounded-sm shadow-lg`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: '50%',
            top: '50%',
            marginLeft: `${-particle.size / 2}px`,
            marginTop: `${-particle.size / 2}px`,
            boxShadow:
              particle.color === 'gold'
                ? '0 0 6px rgba(250, 204, 21, 0.8)'
                : particle.color === 'yellow'
                  ? '0 0 4px rgba(253, 224, 71, 0.6)'
                  : '0 0 4px rgba(255, 255, 255, 0.6)',
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            x: particle.vx * 200 + (Math.random() - 0.5) * 100,
            y: particle.vy * 200 + 300,
            opacity: [1, 0.8, 0],
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Bottom light burst effect */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-t from-yellow-400/20 via-yellow-300/10 to-transparent blur-3xl"
        animate={{
          opacity: [0, 0.4, 0],
          scale: [0.5, 1.2, 1],
        }}
        transition={{
          duration: 1.8,
          ease: 'easeOut',
        }}
      />
    </div>
  );
}

export default CelebrationEffect;

