import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Participant } from '@/lib/lottery-types';

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
  const [displayedParticipants, setDisplayedParticipants] = useState<Participant[]>([]);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    let frameCount = 0;
    const totalFrames = 150;
    const interval = setInterval(() => {
      const shuffled = [...participants].sort(() => Math.random() - 0.5);
      const displayed = shuffled.slice(0, Math.min(8, participants.length));
      setDisplayedParticipants(displayed);

      frameCount++;
      setProgress((frameCount / totalFrames) * 100);

      if (frameCount >= totalFrames) {
        clearInterval(interval);

        const finalShuffled = [...participants].sort(() => Math.random() - 0.5);
        const winners = finalShuffled.slice(0, winnerCount);

        setTimeout(() => {
          onComplete(winners);
        }, 1000);
      }
    }, 1000 / 30);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [participants, winnerCount, onComplete]);

  const getDisplayValue = (participant: Participant) => {
    const firstColumn = selectedColumns[0];
    return participant[firstColumn]?.toString() || 'N/A';
  };

  const getInitial = (participant: Participant) => {
    const value = getDisplayValue(participant);
    return value.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Stars Background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Falling Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: -20,
            }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 20 : 1000,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 2,
            }}
          >
            <div className="w-3 h-3 bg-yellow-400 rounded-full opacity-70" />
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-8 shadow-2xl"
          >
            <Sparkles className="w-14 h-14 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-7xl font-bold text-white mb-6 drop-shadow-2xl"
          >
            G'olib aniqlanmoqda...
          </motion.h1>

          {countdown > 0 && (
            <motion.div
              key={countdown}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              className="text-9xl font-bold text-yellow-400 mb-4"
            >
              {countdown}
            </motion.div>
          )}

          <p className="text-3xl text-blue-200">Loterеya aylanmoqda! Kuting...</p>
        </motion.div>

        {/* Lottery Wheel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative mb-12"
        >
          {/* Spinning Indicator */}
          <motion.div
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-20"
            animate={{
              y: [0, 30, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          >
            <div className="text-8xl drop-shadow-2xl">🎰</div>
          </motion.div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border-2 border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {displayedParticipants.map((participant, index) => (
                  <motion.div
                    key={`${index}-${getDisplayValue(participant)}-${Math.random()}`}
                    initial={{ opacity: 0, scale: 0, rotateY: -180 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0, rotateY: 180 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl p-8 shadow-2xl"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <span className="text-4xl font-bold text-white">
                          {getInitial(participant)}
                        </span>
                      </div>
                      <p className="text-white text-2xl font-bold truncate">
                        {getDisplayValue(participant)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative"
        >
          <div className="h-6 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border-2 border-white/30 shadow-xl">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 relative"
              style={{ width: `${progress}%` }}
            >
              <motion.div
                className="absolute inset-0 bg-white/30"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>
          </div>
          <div className="mt-3 text-center">
            <span className="text-white text-xl font-semibold">
              {Math.round(progress)}%
            </span>
          </div>
        </motion.div>

        {/* Live Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-red-500/90 backdrop-blur-sm rounded-full shadow-xl border-2 border-white/30">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
              className="w-4 h-4 bg-white rounded-full"
            />
            <span className="text-white text-xl font-bold uppercase tracking-wider">
              LIVE ЕФИР
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
