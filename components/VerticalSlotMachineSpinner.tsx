'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Participant } from '@/lib/lottery-types';
import { useTranslation } from '@/lib/i18n';
import { calculateSpinnerDimensions } from '@/lib/winner-selection-engine';

interface VerticalSlotMachineSpinnerProps {
  virtualParticipants: Participant[]; // 50-100 item virtual subset
  winnerIndex: number; // Position of winner in virtual subset
  isSpinning: boolean;
  duration?: number; // Default 30 seconds
  onSpinComplete: () => void;
  columnName?: string; // Which column to display (default: first visible)
}

const ROW_HEIGHT = 56; // Fixed row height in pixels

export default function VerticalSlotMachineSpinner({
  virtualParticipants,
  winnerIndex,
  isSpinning,
  duration = 30,
  onSpinComplete,
  columnName,
}: VerticalSlotMachineSpinnerProps) {
  const { t } = useTranslation();
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [visibleRows, setVisibleRows] = useState<number>(7);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate responsive dimensions based on viewport
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const viewportHeight = window.innerHeight;
        const dims = calculateSpinnerDimensions(viewportHeight);
        setVisibleRows(dims.visibleRows);
        setContainerHeight(dims.totalHeight);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Animation logic: scroll to winner position over 30 seconds
  useEffect(() => {
    if (!isSpinning) {
      setScrollPosition(0);
      return;
    }

    const centerOffset = Math.floor(visibleRows / 2);
    const animationSteps = 1000; // Update position every frame
    const totalDuration = duration * 1000; // Convert to milliseconds
    const frameDuration = totalDuration / animationSteps;

    let currentStep = 0;
    const animationInterval = setInterval(() => {
      currentStep++;
      const progress = currentStep / animationSteps;

      // Easing function: ease-out-cubic for natural deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      // Calculate distance to scroll
      // Add multiple rotations for visual excitement
      const totalRotations = 15;
      const totalDistance =
        (totalRotations * virtualParticipants.length + winnerIndex - centerOffset) *
        ROW_HEIGHT;

      const currentScroll = totalDistance * easeProgress;
      setScrollPosition(currentScroll);

      if (currentStep >= animationSteps) {
        clearInterval(animationInterval);
        // Final position: center the winner
        const finalScroll = (winnerIndex - centerOffset) * ROW_HEIGHT;
        setScrollPosition(finalScroll);
        onSpinComplete();
      }
    }, frameDuration);

    return () => clearInterval(animationInterval);
  }, [isSpinning, duration, visibleRows, winnerIndex, virtualParticipants.length, onSpinComplete]);

  // Extract display value from participant
  const getDisplayValue = (participant: Participant): string => {
    if (!columnName) {
      // Default to first key if not specified
      const firstKey = Object.keys(participant)[0];
      return participant[firstKey]?.toString() || '---';
    }
    return participant[columnName]?.toString() || '---';
  };

  // Calculate center offset for positioning
  const centerOffset = Math.floor(visibleRows / 2);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center gap-4 w-full"
    >
      {/* Timer Display */}
      {isSpinning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-sm font-bold text-accent tracking-wide uppercase"
        >
          {t('winnerSelection.spinner.spinning')}
        </motion.div>
      )}

      {/* Spinner Container - Professional Broadcast Frame */}
      <div
        className="relative rounded-lg overflow-hidden bg-gradient-to-b from-background/50 to-background/80 border border-accent/30 shadow-lg"
        style={{ height: `${containerHeight}px`, width: '100%', maxWidth: '500px' }}
      >
        {/* Broadcast-style frame decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Top border glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <div className="absolute top-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        
        {/* Fade overlay on top */}
        <div className="absolute top-0 left-0 right-0 z-10 h-12 bg-gradient-to-b from-background to-transparent pointer-events-none" />

        {/* Fade overlay on bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        {/* Center highlight bar - Winner Position */}
        <div
          className="absolute left-0 right-0 z-20 border-t-2 border-b-2 border-accent bg-gradient-to-r from-accent/20 via-accent/30 to-accent/20 shadow-lg shadow-accent/20"
          style={{
            top: `${centerOffset * ROW_HEIGHT}px`,
            height: `${ROW_HEIGHT}px`,
          }}
        />

        {/* Scrolling content */}
        <motion.div
          className="flex flex-col w-full"
          style={{
            transform: `translateY(-${scrollPosition}px)`,
          }}
        >
          {virtualParticipants.map((participant, index) => {
            const distanceFromCenter = Math.abs(index - (winnerIndex - centerOffset));
            const opacity = Math.max(0.2, 1 - distanceFromCenter * 0.15);

            return (
              <div
                key={index}
                className="flex items-center justify-center flex-shrink-0 border-b border-border/20 bg-gradient-to-r from-background/50 via-background/70 to-background/50 hover:bg-accent/10 transition-all duration-100"
                style={{
                  height: `${ROW_HEIGHT}px`,
                  opacity,
                }}
              >
                <div className="text-center px-4 py-2">
                  <p className="text-lg font-bold text-foreground truncate">
                    {getDisplayValue(participant)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    #{String(index + 1).padStart(3, '0')}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Status Message */}
      {!isSpinning && winnerIndex >= 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-accent font-bold uppercase tracking-widest">
            {t('winnerSelection.spinner.completed')}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {getDisplayValue(virtualParticipants[winnerIndex])}
          </p>
        </motion.div>
      )}
    </div>
  );
}
