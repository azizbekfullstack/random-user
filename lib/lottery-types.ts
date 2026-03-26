// Barcha tipler bir joyda
export type Participant = Record<string, any>;

export interface MaskingConfig {
  phone: boolean;
  fio: boolean;
  id: boolean;
}

export interface LotteryState {
  currentStep: number;
  participants: Participant[];
  columns: string[];
  selectedColumns: string[];
  winnerCount: number;
  winners: Participant[];
  maskingConfig: MaskingConfig;
  selectedRank: number;
}

export enum Step {
  UPLOAD = 1,
  FILTER = 2,
  WINNER_COUNT = 3,
  READY = 4,
  LOTTERY = 5,
  WINNER = 6,
}
