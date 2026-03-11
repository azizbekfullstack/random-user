'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Participant } from '@/lib/lottery-types';
import { useTranslation } from '@/lib/i18n';

interface Step5LotteryProps {
  participants: Participant[];
  winnerCount: number;
  selectedColumns: string[];
  onComplete: (winners: Participant[]) => void;
}

export default function Step5Lottery({
  participants,
  winnerCount,
  selectedColumns,
  onComplete,
}: Step5LotteryProps) {
  const { t } = useTranslation();
  const [displayedParticipants, setDisplayedParticipants] = useState<Participant[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentWinner, setCurrentWinner] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<'scanning' | 'analyzing' | 'revealing' | 'complete'>('scanning');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const timePerWinner = (currentWinner === 0 ? 30 : 10) * 1000;
    let frameCount = 0;
    
    // Determine total frames based on phase
    const totalFrames = currentWinner === 0 ? 1800 : 600; // 30s @ 60fps or 10s @ 60fps
    
    const interval = setInterval(() => {
      // Scanning phase
      if (frameCount < totalFrames * 0.6) {
        setAnimationPhase('scanning');
        const shuffled = [...participants].sort(() => Math.random() - 0.5);
        const displayed = shuffled.slice(0, Math.min(6, participants.length));
        setDisplayedParticipants(displayed);
      }
      // Analyzing phase
      else if (frameCount < totalFrames * 0.85) {
        setAnimationPhase('analyzing');
      }
      // Reveal phase
      else {
        setAnimationPhase('revealing');
      }

      frameCount++;
      setProgress((frameCount / totalFrames) * 100);

      if (frameCount >= totalFrames) {
        clearInterval(interval);
        
        // Select winner
        const finalShuffled = [...participants].sort(() => Math.random() - 0.5);
        const winner = finalShuffled[0];
        setDisplayedParticipants([winner]);
        setAnimationPhase('complete');

        // Check if more winners needed
        if (currentWinner + 1 < winnerCount) {
          setTimeout(() => {
            setCurrentWinner(currentWinner + 1);
            setProgress(0);
            setAnimationPhase('scanning');
          }, 2000);
        } else {
          // All winners selected
          setTimeout(() => {
            const allWinners = [winner];
            onComplete(allWinners);
          }, 2000);
        }
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [currentWinner, participants, winnerCount, onComplete, isClient]);

  const getDisplayValue = (participant: Participant) => {
    const firstColumn = selectedColumns[0];
    return participant[firstColumn]?.toString() || 'N/A';
  };

  const getInitial = (participant: Participant) => {
    const value = getDisplayValue(participant);
    return value.charAt(0).toUpperCase();
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-lg">{t('system.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Scanning background effect */}
      {animationPhase === 'scanning' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      <div className="w-full max-w-3xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              scale: animationPhase === 'revealing' ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 0.5,
              repeat: animationPhase === 'revealing' ? Infinity : 0,
            }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mb-6 shadow-lg shadow-accent/30"
          >
            <Sparkles className="w-10 h-10 text-accent-foreground" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-foreground mb-4"
          >
            {animationPhase === 'scanning' && t('dashboard.animation.scanning')}
            {animationPhase === 'analyzing' && t('dashboard.animation.analyzing')}
            {animationPhase === 'revealing' && t('dashboard.animation.winner')}
            {animationPhase === 'complete' && t('dashboard.animation.victoryMessage')}
          </motion.h1>

          <p className="text-lg text-muted-foreground">
            {t('winner.first_draw')}: {currentWinner + 1} / {winnerCount}
          </p>
        </motion.div>

        {/* Participants Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-card border border-border rounded-lg p-8">
            {displayedParticipants.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {displayedParticipants.map((participant, index) => (
                    <motion.div
                      key={`${index}-${getDisplayValue(participant)}`}
                      initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                      animate={{ 
                        opacity: 1, 
                        scale: animationPhase === 'revealing' ? 1.1 : 1, 
                        rotateY: 0,
                        boxShadow: animationPhase === 'revealing' 
                          ? '0 0 40px rgba(34, 197, 94, 0.6)' 
                          : '0 0 20px rgba(34, 197, 94, 0.1)',
                      }}
                      transition={{ duration: 0.3 }}
                      className="bg-secondary border border-border rounded-lg p-6 text-center hover:scale-105 transition-transform"
                    >
                      <div className="w-16 h-16 rounded-full bg-accent/20 mx-auto mb-3 flex items-center justify-center">
                        <span className="text-3xl font-bold text-accent">
                          {getInitial(participant)}
                        </span>
                      </div>
                      <p className="text-foreground font-semibold truncate">
                        {getDisplayValue(participant)}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                {t('dashboard.table.noData')}
              </div>
            )}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="h-3 bg-secondary rounded-full overflow-hidden border border-border">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-accent/60 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear', duration: 0.1 }}
            />
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% - {currentWinner === 0 ? '30' : '10'}{t('dashboard.liveDraw.timerLabel')}
            </span>
          </div>
        </motion.div>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{
              scale: progress > 90 ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 0.8,
              repeat: progress > 90 ? Infinity : 0,
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 text-accent border border-accent rounded-lg font-semibold"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
              className="w-2 h-2 bg-accent rounded-full"
            />
            {t('dashboard.liveDraw.drawConfiguration')}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
