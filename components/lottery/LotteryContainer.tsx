'use client';

import { useState } from 'react';
import { Participant, Step } from '@/lib/lottery-types';
import { useTranslation } from '@/lib/i18n';
import ProgressBar from './ProgressBar';
import Step1Upload from './Step1Upload';
import Step2Filter from './Step2Filter';
import Step3WinnerCount from './Step3WinnerCount';
import Step4Ready from './Step4Ready';
import LiveDrawStage from './LiveDrawStage';
import Step6Winner from './Step6Winner';

export default function LotteryContainer() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<Step>(Step.UPLOAD);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [winnerCount, setWinnerCount] = useState(1);
  const [winners, setWinners] = useState<Participant[]>([]);

  const stepNames = [
    t('dashboard.upload.title'),
    t('dashboard.dedup.title'),
    t('draw.winner_count'),
    t('dashboard.lottery.review.title'),
    t('dashboard.liveDraw.title'),
    t('result.title'),
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

  const handleLiveDrawComplete = (newWinners: Participant[]) => {
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
    <div className="min-h-screen bg-background">
      {/* Progress Bar - Only shown in steps 1-4 */}
      {currentStep <= Step.READY && (
        <div className="border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <ProgressBar currentStep={currentStep} steps={stepNames} />
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="max-w-5xl mx-auto px-4">
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

        {/* STEP 5: Live Draw Stage */}
        {currentStep === Step.LOTTERY && (
          <LiveDrawStage
            participants={participants}
            winnerCount={winnerCount}
            selectedColumns={selectedColumns}
            onComplete={handleLiveDrawComplete}
            onRestart={() => goToStep(Step.UPLOAD)}
            spinDuration={30}
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
