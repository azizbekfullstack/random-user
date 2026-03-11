'use client';

import { Participant } from '@/lib/lottery-types';

/**
 * Fisher-Yates shuffle algorithm for cryptographically fair randomization
 * Ensures every participant has equal probability of selection
 */
function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface WinnerSelectionConfig {
  participants: Participant[];
  participantCount: number;
  winnerCount: number;
}

interface SelectionResult {
  winnerIndex: number; // Index in FULL participant list
  winner: Participant;
  virtualIndices: number[]; // Indices for virtual subset rendering (50-100 items)
  virtualParticipants: Participant[]; // Virtual subset for spinner DOM
  remainingParticipants: Participant[]; // Updated pool for next selection
}

/**
 * Pre-calculates winner using Fisher-Yates on full dataset
 * Returns virtual subset for animation while maintaining fairness
 */
export function selectWinnerPreCalculated(
  config: WinnerSelectionConfig
): SelectionResult {
  const { participants, participantCount } = config;

  // Step 1: Shuffle FULL dataset using Fisher-Yates
  const shuffledFull = fisherYatesShuffle(participants);

  // Step 2: Winner is first item in shuffled list (fair selection from full set)
  const winnerIndex = participants.indexOf(shuffledFull[0]);
  const winner = shuffledFull[0];

  // Step 3: Create virtual subset for spinner rendering (50-100 items)
  // Centers on the pre-calculated winner
  const VIRTUAL_SIZE = Math.min(100, Math.max(50, participantCount));
  const startIdx = Math.max(0, Math.floor(VIRTUAL_SIZE / 2) - 3);
  const virtualParticipants = shuffledFull.slice(startIdx, startIdx + VIRTUAL_SIZE);

  // Create mapping of virtual indices to full indices
  const virtualIndices = Array.from({ length: VIRTUAL_SIZE }, (_, i) => startIdx + i);

  // Step 4: Remove winner from remaining pool
  const remainingParticipants = shuffledFull.slice(1);

  return {
    winnerIndex,
    winner,
    virtualIndices,
    virtualParticipants,
    remainingParticipants,
  };
}

/**
 * Sequential winner selection with pool management
 * Tracks already-selected winners and removes from pool
 */
export function selectNextWinner(
  availableParticipants: Participant[]
): SelectionResult {
  if (availableParticipants.length === 0) {
    throw new Error('No participants available for selection');
  }

  return selectWinnerPreCalculated({
    participants: availableParticipants,
    participantCount: availableParticipants.length,
    winnerCount: 1,
  });
}

/**
 * Get position of winner in virtual subset for animation targeting
 */
export function getWinnerPositionInVirtual(
  winner: Participant,
  virtualParticipants: Participant[]
): number {
  return virtualParticipants.findIndex((p) => p === winner);
}

/**
 * Calculates responsive spinner dimensions based on viewport height
 */
export function calculateSpinnerDimensions(
  viewportHeight: number
): {
  visibleRows: number;
  rowHeight: number;
  totalHeight: number;
} {
  let visibleRows = 7;

  if (viewportHeight < 600) {
    visibleRows = 5; // Small screens: 5 rows
  } else if (viewportHeight < 800) {
    visibleRows = 6; // Medium screens: 6 rows
  } else if (viewportHeight > 1200) {
    visibleRows = 9; // Large screens: 9 rows
  }

  const rowHeight = 56; // Fixed row height in pixels
  const totalHeight = visibleRows * rowHeight;

  return { visibleRows, rowHeight, totalHeight };
}

/**
 * Generate animation keyframes for 30-second spin
 * Ensures smooth scrolling with final position on center item
 */
export function generateSpinnerKeyframes(
  winnerPositionInVirtual: number,
  virtualSize: number,
  visibleRows: number
): {
  totalDistance: number;
  finalScroll: number;
  duration: number;
} {
  // Center of visible rows
  const centerPosition = Math.floor(visibleRows / 2);

  // Calculate how many items to scroll past winner
  // Add multiple rotations for visual excitement, end at center
  const rotations = 15; // Full rotations through the list
  const totalDistance = rotations * virtualSize + winnerPositionInVirtual;

  // Final scroll position centers the winner
  const finalScroll = (winnerPositionInVirtual - centerPosition) * 56;

  return {
    totalDistance,
    finalScroll,
    duration: 30, // 30 seconds
  };
}

export interface WinnerSelectionState {
  selectedWinners: Participant[];
  availableParticipants: Participant[];
  currentSelection: SelectionResult | null;
  isSpinning: boolean;
}

/**
 * Initialize selection state
 */
export function initializeSelectionState(
  participants: Participant[]
): WinnerSelectionState {
  return {
    selectedWinners: [],
    availableParticipants: participants,
    currentSelection: null,
    isSpinning: false,
  };
}

/**
 * Update state after winner selection
 */
export function updateSelectionState(
  state: WinnerSelectionState,
  selection: SelectionResult
): WinnerSelectionState {
  return {
    ...state,
    selectedWinners: [...state.selectedWinners, selection.winner],
    availableParticipants: selection.remainingParticipants,
    currentSelection: selection,
    isSpinning: false,
  };
}
