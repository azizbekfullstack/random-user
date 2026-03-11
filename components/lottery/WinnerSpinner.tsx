'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';
import { Participant } from '@/lib/lottery-types';

interface WinnerSpinnerProps {
  participants: Participant[];
  winnerCount: number;
  onComplete: (winners: Participant[]) => void;
  duration?: number; // in seconds, default 30
}

export default function WinnerSpinner({
  participants,
  winnerCount,
  onComplete,
  duration = 30,
}: WinnerSpinnerProps) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<'searching' | 'analyzing' | 'finalizing' | 'revealed'>('searching');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [winners, setWinners] = useState<Participant[]>([]);

  // Simulate scanning through participants
  useEffect(() => {
    if (duration <= 0) return;

    const durationMs = duration * 1000;
    const startTime = Date.now();

    const scanInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
      setTimeLeft(remaining);

      // Randomly highlight some participants during scanning
      if (remaining > duration * 0.6) {
        setPhase('searching');
        const randomIndices = Array.from({ length: 5 }, () =>
          Math.floor(Math.random() * participants.length)
        );
        setHighlightedIndices(randomIndices);
      }
      // Transition to analyzing phase
      else if (remaining > duration * 0.3) {
        setPhase('analyzing');
        setHighlightedIndices([]);
      }
      // Transition to finalizing phase
      else if (remaining > 1) {
        setPhase('finalizing');
        // Start selecting winners
        if (winners.length === 0) {
          const selectedWinners: Participant[] = [];
          const selectedIndices = new Set<number>();

          while (selectedIndices.size < winnerCount && selectedIndices.size < participants.length) {
            selectedIndices.add(Math.floor(Math.random() * participants.length));
          }

          selectedIndices.forEach((idx) => {
            selectedWinners.push(participants[idx]);
          });

          setWinners(selectedWinners);
          setHighlightedIndices(Array.from(selectedIndices));
        }
      }
      // Animation complete
      else if (remaining === 0) {
        setPhase('revealed');
        clearInterval(scanInterval);
        setTimeout(() => {
          onComplete(winners);
        }, 500);
      }
    }, 100);

    return () => clearInterval(scanInterval);
  }, [participants, winnerCount, onComplete, duration, winners.length]);

  const getPhaseMessage = () => {
    switch (phase) {
      case 'searching':
        return t('dashboard.spinner.searching');
      case 'analyzing':
        return t('dashboard.spinner.analyzing');
      case 'finalizing':
        return t('dashboard.spinner.finalizing');
      case 'revealed':
        return t('dashboard.spinner.revealed');
      default:
        return '';
    }
  };

  const getPhaseOpacity = () => {
    if (phase === 'searching') return 0.4;
    if (phase === 'analyzing') return 0.6;
    if (phase === 'finalizing') return 0.8;
    return 1;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 py-8">
      {/* Central Spinner Container */}
      <motion.div
        className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30 flex items-center justify-center"
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Inner rotating element */}
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-transparent border-t-accent border-r-accent"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Center content */}
        <div className="text-center z-10">
          <motion.div
            animate={{ opacity: getPhaseOpacity() }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
              {timeLeft}
            </div>
            <div className="text-sm text-muted-foreground">
              {t('dashboard.liveDraw.timerLabel').replace('60', duration.toString())}
            </div>
          </motion.div>
        </div>

        {/* Outer glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full border border-accent/20"
          animate={{
            boxShadow: [
              '0 0 20px rgba(34, 197, 94, 0.3)',
              '0 0 40px rgba(34, 197, 94, 0.5)',
              '0 0 20px rgba(34, 197, 94, 0.3)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </motion.div>

      {/* Phase indicator and message */}
      <motion.div
        key={phase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {getPhaseMessage()}
        </h2>
        <p className="text-sm text-muted-foreground">
          {phase === 'searching' && `${highlightedIndices.length} ${t('dashboard.liveDraw.scanningParticipants')}`}
          {phase === 'analyzing' && `${t('dashboard.liveDraw.randomizationProgress')}`}
          {phase === 'finalizing' && `${winners.length}/${winnerCount} ${t('dashboard.liveDraw.selectedWinners')}`}
          {phase === 'revealed' && `${winnerCount} ${t('dashboard.liveDraw.selectedWinners')}`}
        </p>
      </motion.div>

      {/* Participant sampling visualization */}
      {phase !== 'revealed' && (
        <motion.div
          className="flex gap-2 flex-wrap justify-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Array.from({ length: Math.min(20, participants.length) }).map((_, idx) => {
            const isHighlighted = highlightedIndices.includes(idx);
            const isWinner = highlightedIndices.includes(idx) && phase === 'finalizing';

            return (
              <motion.div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all ${
                  isWinner
                    ? 'bg-accent scale-125'
                    : isHighlighted
                    ? 'bg-accent/60 scale-110'
                    : 'bg-secondary'
                }`}
                animate={{
                  scale: isWinner ? [1, 1.2, 1] : 1,
                  opacity: isWinner || isHighlighted ? 1 : 0.3,
                }}
                transition={{
                  duration: 0.3,
                  repeat: isWinner ? Infinity : 0,
                }}
              />
            );
          })}
        </motion.div>
      )}

      {/* Stats during spin */}
      <motion.div
        className="grid grid-cols-3 gap-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-2xl font-bold text-accent">{participants.length}</div>
          <div className="text-xs text-muted-foreground">
            {t('dashboard.lottery.review.participants')}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-2xl font-bold text-accent">{winnerCount}</div>
          <div className="text-xs text-muted-foreground">
            {t('dashboard.lottery.review.winners')}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-2xl font-bold text-accent">{timeLeft}s</div>
          <div className="text-xs text-muted-foreground">
            {t('dashboard.animation.analyzing')}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
