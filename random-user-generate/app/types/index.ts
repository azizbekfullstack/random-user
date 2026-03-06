// Barcha tipler bir joyda
export type Participant = Record<string, any>;

export interface LotteryState {
  currentStep: number;
  participants: Participant[];
  columns: string[];
  selectedColumns: string[];
  winnerCount: number;
  winners: Participant[];
}

export enum Step {
  UPLOAD = 1,
  FILTER = 2,
  WINNER_COUNT = 3,
  READY = 4,
  LOTTERY = 5,
  WINNER = 6,
}
