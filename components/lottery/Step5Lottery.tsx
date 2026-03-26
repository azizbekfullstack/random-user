'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check } from 'lucide-react';
import { Participant } from '@/lib/lottery-types';
import { Confetti } from './Confetti';

interface Step5LotteryProps {
  participants: Participant[];
  winnerCount: number;
  selectedColumns: string[];
  onComplete: (winners: Participant[]) => void;
}

interface RankWinner {
  rank: number;
  participant: Participant;
  selected: boolean;
}

export default function Step5Lottery({
  participants,
  winnerCount,
  selectedColumns,
  onComplete,
}: Step5LotteryProps) {
  const [rankWinners, setRankWinners] = useState<RankWinner[]>([]);
  const [currentRank, setCurrentRank] = useState(1);
  const [displayedParticipants, setDisplayedParticipants] = useState<Participant[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [completedRanks, setCompletedRanks] = useState<number[]>([]);

  useEffect(() => {
    // Initialize rank winners with empty state
    const initialRankWinners: RankWinner[] = Array.from({ length: winnerCount }, (_, i) => ({
      rank: i + 1,
      participant: {} as Participant,
      selected: false,
    }));
    setRankWinners(initialRankWinners);
  }, [winnerCount]);

  const getDisplayValue = (participant: Participant) => {
    const firstColumn = selectedColumns[0];
    return participant[firstColumn]?.toString() || 'N/A';
  };

  const getInitial = (participant: Participant) => {
    const value = getDisplayValue(participant);
    return value.charAt(0).toUpperCase();
  };

  const selectWinnerForRank = async () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setProgress(0);

    // Spinning animation with shuffling
    let frameCount = 0;
    const totalFrames = 150;
    const spinInterval = setInterval(() => {
      const shuffled = [...participants].sort(() => Math.random() - 0.5);
      const displayed = shuffled.slice(0, Math.min(8, participants.length));
      setDisplayedParticipants(displayed);

      frameCount++;
      setProgress((frameCount / totalFrames) * 100);

      if (frameCount >= totalFrames) {
        clearInterval(spinInterval);

        // Select the winner
        const finalShuffled = [...participants].sort(() => Math.random() - 0.5);
        const selectedWinner = finalShuffled[0];

        // Update rank winners
        const updatedRankWinners = [...rankWinners];
        updatedRankWinners[currentRank - 1] = {
          rank: currentRank,
          participant: selectedWinner,
          selected: true,
        };
        setRankWinners(updatedRankWinners);

        // Trigger confetti
        setTriggerConfetti(true);
        setTimeout(() => setTriggerConfetti(false), 3000);

        // Add to completed ranks
        setCompletedRanks([...completedRanks, currentRank]);

        setIsSpinning(false);
        setDisplayedParticipants([]);
      }
    }, 1000 / 30);
  };

  const goToNextRank = () => {
    if (currentRank < winnerCount) {
      setCurrentRank(currentRank + 1);
      setProgress(0);
    } else {
      // All winners selected
      const finalWinners = rankWinners
        .filter((rw) => rw.selected)
        .map((rw) => rw.participant);
      onComplete(finalWinners);
    }
  };

  const currentRankWinner = rankWinners[currentRank - 1];
  const isCurrentRankComplete = currentRankWinner?.selected;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6 relative overflow-hidden">
      <Confetti active={triggerConfetti} />

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
            Rang {currentRank} g'olibini tanlang
          </motion.h1>

          <p className="text-3xl text-blue-200">
            {currentRank} / {winnerCount}
          </p>
        </motion.div>

        {/* Rank Progress Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-3 mb-12 flex-wrap"
        >
          {rankWinners.map((rw) => (
            <motion.div
              key={rw.rank}
              whileHover={{ scale: 1.1 }}
              className={`px-6 py-3 rounded-full font-bold text-lg transition-all ${
                rw.selected
                  ? 'bg-green-500 text-white shadow-lg'
                  : rw.rank === currentRank
                  ? 'bg-yellow-400 text-black shadow-lg ring-2 ring-white'
                  : 'bg-white/20 text-white backdrop-blur-sm'
              }`}
            >
              {rw.selected ? (
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Rang {rw.rank}
                </div>
              ) : (
                `Rang ${rw.rank}`
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Lottery Wheel */}
        {!isCurrentRankComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative mb-12"
          >
            {/* Spinning Indicator */}
            {isSpinning && (
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
            )}

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

                {displayedParticipants.length === 0 && !isSpinning && (
                  <div className="col-span-2 md:col-span-4 py-12 text-center">
                    <p className="text-white text-2xl font-semibold">
                      Boshlashga tayyor
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Winner Display for Current Rank */}
        {isCurrentRankComplete && currentRankWinner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mb-12"
          >
            <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-3xl p-10 shadow-2xl border-4 border-white">
              <div className="text-center">
                <p className="text-white text-2xl font-semibold mb-6">
                  Rang {currentRank} g'olibni topildi! 🎉
                </p>

                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                  className="w-32 h-32 rounded-full bg-white/30 backdrop-blur-sm mx-auto mb-6 flex items-center justify-center shadow-lg"
                >
                  <span className="text-8xl font-bold text-white">
                    {getInitial(currentRankWinner.participant)}
                  </span>
                </motion.div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  {selectedColumns.map((column) => (
                    <p key={column} className="text-white text-2xl font-bold mb-2">
                      {column}: {currentRankWinner.participant[column] || 'N/A'}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Bar */}
        {isSpinning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative mb-8"
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
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-6 flex-wrap"
        >
          {!isCurrentRankComplete && !isSpinning && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={selectWinnerForRank}
              className="px-12 py-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-2xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all uppercase tracking-widest"
            >
              🎯 AYLANDIR
            </motion.button>
          )}

          {isCurrentRankComplete && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToNextRank}
              className={`px-12 py-6 text-2xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all uppercase tracking-widest ${
                currentRank < winnerCount
                  ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white'
                  : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
              }`}
            >
              {currentRank < winnerCount ? '➜ Keyingi Rang' : '✓ TAYYORLASH'}
            </motion.button>
          )}
        </motion.div>

        {/* Live Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
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
