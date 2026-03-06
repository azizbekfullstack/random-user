import { motion } from 'framer-motion';
import { ArrowLeft, Users, Trophy, CheckCircle2, Play } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';
import { SparklesCore } from '@/components/ui/sparkles';

interface Step4ReadyProps {
  participantCount: number;
  winnerCount: number;
  selectedColumns: string[];
  onStart: () => void;
  onBack: () => void;
}

export default function Step4Ready({
  participantCount,
  winnerCount,
  selectedColumns,
  onStart,
  onBack,
}: Step4ReadyProps) {
  const { t } = useTranslation();

  const getSummaryText = () => {
    const template = t('lottery.review.summary');
    return template
      .replace('{participants}', `${participantCount}`)
      .replace('{winners}', `${winnerCount}`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      {/* CTA Section with Animated Gradient */}
      <section className="relative w-full py-12 overflow-hidden">
        <AnimatedGradientBackground
          Breathing={true}
          gradientColors={['#0A0A0A', '#2979FF', '#00E5FF', '#1DE9B6', '#0A0A0A', '#2979FF', '#00B8D4']}
          gradientStops={[35, 50, 60, 70, 80, 90, 100]}
        />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header with Sparkles */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative h-24 w-full flex flex-col items-center justify-center mb-8"
            >
              <div className="w-full absolute inset-0">
                <SparklesCore
                  id="step4-particles"
                  background="transparent"
                  minSize={0.6}
                  maxSize={1.4}
                  particleDensity={80}
                  className="w-full h-full"
                  particleColor="#FFFFFF"
                  speed={0.8}
                />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 relative z-20 text-balance">
                {t('lottery.review.title')}
              </h2>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-3 gap-4 mb-8"
            >
              {/* Participants Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/20 mb-4">
                  <Users className="w-7 h-7 text-blue-300" />
                </div>
                <p className="text-gray-300 text-sm mb-1">{t('lottery.review.participants')}</p>
                <p className="text-3xl font-bold text-white">{participantCount}</p>
              </motion.div>

              {/* Winners Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-500/20 mb-4">
                  <Trophy className="w-7 h-7 text-purple-300" />
                </div>
                <p className="text-gray-300 text-sm mb-1">{t('lottery.review.winners')}</p>
                <p className="text-3xl font-bold text-white">{winnerCount}</p>
              </motion.div>

              {/* Columns Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/20 mb-4">
                  <CheckCircle2 className="w-7 h-7 text-emerald-300" />
                </div>
                <p className="text-gray-300 text-sm mb-1">{t('lottery.review.columns')}</p>
                <p className="text-3xl font-bold text-white">{selectedColumns.length}</p>
              </motion.div>
            </motion.div>

            {/* Selected Columns */}
            {selectedColumns.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-6 mb-8"
              >
                <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  {t('lottery.review.selectedColumns')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedColumns.map((column, index) => (
                    <motion.span
                      key={column}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-medium"
                    >
                      {column}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-8"
            >
              <p className="text-gray-200 text-lg">
                {getSummaryText()}
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-all duration-300 font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('lottery.review.back')}
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-white to-gray-100 text-black rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-bold"
              >
                <Play className="w-5 h-5" />
                {t('lottery.review.start')}
              </motion.button>
            </motion.div>

            {/* Live Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-300 text-sm">
                ⚡ {t('lottery.review.liveInfo')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
