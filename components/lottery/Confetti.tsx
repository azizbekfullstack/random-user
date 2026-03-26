'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Confetto {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

interface ConfettiProps {
  active: boolean;
  count?: number;
  duration?: number;
}

export function Confetti({
  active,
  count = 50,
  duration = 2.5,
}: ConfettiProps) {
  const [confetti, setConfetti] = useState<Confetto[]>([]);

  useEffect(() => {
    if (!active) {
      setConfetti([]);
      return;
    }

    // Generate confetti pieces
    const pieces: Confetto[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.2,
      duration: duration + Math.random() * 0.5,
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
    }));

    setConfetti(pieces);

    // Clear confetti after animation completes
    const timer = setTimeout(() => {
      setConfetti([]);
    }, (duration + 0.5) * 1000);

    return () => clearTimeout(timer);
  }, [active, count, duration]);

  if (confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: 0,
            y: -20,
            opacity: 1,
            rotate: piece.rotation,
          }}
          animate={{
            x: (Math.random() - 0.5) * 200,
            y: window.innerHeight + 100,
            opacity: 0,
            rotate: piece.rotation + Math.random() * 360,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn',
          }}
          className="absolute"
          style={{
            left: `${piece.left}%`,
            top: 0,
          }}
        >
          {piece.id % 2 === 0 ? (
            // Rectangle
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-400"
              style={{
                width: piece.size,
                height: piece.size,
                borderRadius: Math.random() > 0.5 ? '2px' : '0px',
              }}
            />
          ) : (
            // Circle
            <div
              className="bg-gradient-to-r from-pink-400 to-orange-400 rounded-full"
              style={{
                width: piece.size,
                height: piece.size,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
