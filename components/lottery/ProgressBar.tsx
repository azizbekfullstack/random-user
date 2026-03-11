'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  steps: string[];
}

export default function ProgressBar({ currentStep, steps }: ProgressBarProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/30'
                      : isCurrent
                      ? 'bg-accent/20 border-2 border-accent text-accent shadow-lg scale-110'
                      : 'bg-secondary border-2 border-border text-muted-foreground'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                </motion.div>
                <span
                  className={`mt-2 text-xs text-center max-w-[80px] ${
                    isCurrent ? 'text-foreground font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 mb-8">
                  <div className="h-full bg-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-accent"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
