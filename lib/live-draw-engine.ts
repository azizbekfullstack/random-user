/**
 * Live Draw Engine - Determines winners during the 60-second broadcast animation
 * Winners are NOT pre-calculated, but selected in real-time using crypto randomness
 */

export interface DrawState {
  currentCandidate: number
  animationProgress: number // 0 to 100
  isRunning: boolean
  elapsedSeconds: number
  finalWinners: number[]
}

export interface DrawConfig {
  totalParticipants: number
  winnerCount: number
  durationSeconds: number
  updateFrequency: number // milliseconds between updates
}

/**
 * Generate a cryptographically secure random index
 */
export function getSecureRandomIndex(max: number): number {
  if (max <= 0) throw new Error("Max must be greater than 0")
  if (max === 1) return 0

  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return array[0] % max
}

/**
 * Get multiple unique random indices for multiple winners
 */
export function getSecureRandomIndices(max: number, count: number): number[] {
  if (count > max) {
    throw new Error(`Cannot select ${count} winners from ${max} participants`)
  }

  const selected = new Set<number>()
  while (selected.size < count) {
    const index = getSecureRandomIndex(max)
    selected.add(index)
  }

  return Array.from(selected)
}

/**
 * Create a draw state manager for real-time animation
 * Winners are selected AT the 60-second mark, not before
 */
export class LiveDrawEngine {
  private config: DrawConfig
  private state: DrawState
  private finalWinnersLocked: boolean = false
  private intervalId: NodeJS.Timeout | null = null
  private startTime: number = 0

  constructor(config: DrawConfig) {
    this.config = config
    this.state = {
      currentCandidate: 0,
      animationProgress: 0,
      isRunning: false,
      elapsedSeconds: 0,
      finalWinners: [],
    }
  }

  /**
   * Start the 60-second draw animation
   * Winners will be calculated at the end of the animation
   */
  start(onUpdate: (state: DrawState) => void): void {
    if (this.state.isRunning) return

    this.state.isRunning = true
    this.state.elapsedSeconds = 0
    this.state.animationProgress = 0
    this.state.currentCandidate = 0
    this.finalWinnersLocked = false
    this.state.finalWinners = []

    this.startTime = Date.now()

    this.intervalId = setInterval(() => {
      const elapsed = Date.now() - this.startTime
      const elapsedSeconds = elapsed / 1000

      // Calculate animation progress (0-100%)
      const progress = Math.min((elapsedSeconds / this.config.durationSeconds) * 100, 100)

      // Update current candidate (cycling through participants rapidly)
      const cycleSpeed = 5 // How many candidates per second during animation
      this.state.currentCandidate = Math.floor((elapsedSeconds * cycleSpeed) % this.config.totalParticipants)

      this.state.elapsedSeconds = Math.floor(elapsedSeconds)
      this.state.animationProgress = progress

      // Lock winners at 60-second mark
      if (elapsedSeconds >= this.config.durationSeconds && !this.finalWinnersLocked) {
        this.finalWinnersLocked = true
        // NOW select the winners
        this.state.finalWinners = getSecureRandomIndices(
          this.config.totalParticipants,
          this.config.winnerCount
        ).sort((a, b) => a - b)
      }

      onUpdate(this.state)

      if (progress >= 100) {
        this.stop()
      }
    }, this.config.updateFrequency)
  }

  /**
   * Stop the animation and lock final winners
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.state.isRunning = false

    // Ensure winners are locked
    if (!this.finalWinnersLocked && this.state.finalWinners.length === 0) {
      this.finalWinnersLocked = true
      this.state.finalWinners = getSecureRandomIndices(
        this.config.totalParticipants,
        this.config.winnerCount
      ).sort((a, b) => a - b)
    }
  }

  /**
   * Get current state
   */
  getState(): DrawState {
    return { ...this.state }
  }

  /**
   * Check if animation is complete and winners are locked
   */
  isComplete(): boolean {
    return !this.state.isRunning && this.finalWinnersLocked
  }

  /**
   * Get final winners (only after animation completes)
   */
  getFinalWinners(): number[] {
    return [...this.state.finalWinners]
  }
}
