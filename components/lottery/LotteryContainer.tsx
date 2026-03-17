'use client';

import { useState } from 'react';
import { Participant, Step } from '@/lib/lottery-types';
import ProgressBar from './ProgressBar';
import Step1Upload from './Step1Upload';
import Step2Filter from './Step2Filter';
import Step3WinnerCount from './Step3WinnerCount';
import Step4Ready from './Step4Ready';
import Step5Lottery from './Step5Lottery';
import Step6Winner from './Step6Winner';

export default function LotteryContainer() {
  const [currentStep, setCurrentStep] = useState<Step>(Step.UPLOAD);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [winnerCount, setWinnerCount] = useState(1);
  const [winners, setWinners] = useState<Participant[]>([]);

  const stepNames = [
    'Yuklash',
    'Filterlash',
    'Soni',
    'Tasdiqlash',
    'Loterеya',
    'Natija',
  ];

  const handleUploadComplete = (newParticipants: Participant[], newColumns: string[]) => {
    setParticipants(newParticipants);
    setColumns(newColumns);
    setSelectedColumns(newColumns);
    setCurrentStep(Step.FILTER);
  };

  const handleColumnsChange = (newColumns: string[]) => {
    setSelectedColumns(newColumns);
  };

  const handleWinnerCountChange = (count: number) => {
    setWinnerCount(count);
  };

  const handleLotteryComplete = (newWinners: Participant[]) => {
    setWinners(newWinners);
    setCurrentStep(Step.WINNER);
  };

  const handleRestart = () => {
    setCurrentStep(Step.UPLOAD);
    setParticipants([]);
    setColumns([]);
    setSelectedColumns([]);
    setWinnerCount(1);
    setWinners([]);
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Progress Bar - Faqat 1-4 bosqichlarda ko'rsatiladi */}
      {currentStep <= Step.READY && (
        <div className="container mx-auto px-6 py-8">
          <ProgressBar currentStep={currentStep} steps={stepNames} />
        </div>
      )}

      {/* Step Content */}
      <div className="container mx-auto px-6 py-8">
        {/* STEP 1: Upload Excel */}
        {currentStep === Step.UPLOAD && (
          <Step1Upload onNext={handleUploadComplete} />
        )}

        {/* STEP 2: Filter Columns */}
        {currentStep === Step.FILTER && (
          <Step2Filter
            participants={participants}
            columns={columns}
            selectedColumns={selectedColumns}
            onColumnsChange={handleColumnsChange}
            onNext={() => goToStep(Step.WINNER_COUNT)}
            onBack={() => goToStep(Step.UPLOAD)}
          />
        )}

        {/* STEP 3: Winner Count */}
        {currentStep === Step.WINNER_COUNT && (
          <Step3WinnerCount
            participantCount={participants.length}
            winnerCount={winnerCount}
            onWinnerCountChange={handleWinnerCountChange}
            onNext={() => goToStep(Step.READY)}
            onBack={() => goToStep(Step.FILTER)}
          />
        )}

        {/* STEP 4: Ready/Confirmation */}
        {currentStep === Step.READY && (
          <Step4Ready
            participantCount={participants.length}
            winnerCount={winnerCount}
            selectedColumns={selectedColumns}
            onStart={() => goToStep(Step.LOTTERY)}
            onBack={() => goToStep(Step.WINNER_COUNT)}
          />
        )}

        {/* STEP 5: Lottery Animation */}
        {currentStep === Step.LOTTERY && (
          <Step5Lottery
            participants={participants}
            winnerCount={winnerCount}
            selectedColumns={selectedColumns}
            onComplete={handleLotteryComplete}
          />
        )}

        {/* STEP 6: Winner Announcement */}
        {currentStep === Step.WINNER && (
          <Step6Winner
            winners={winners}
            selectedColumns={selectedColumns}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
