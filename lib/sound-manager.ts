/**
 * Web Audio API synthesized sound effects for the cinematic animation.
 * All sounds are procedurally generated -- no external files needed.
 */

let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

let masterGain: GainNode | null = null
let soundEnabled = true

function getMasterGain(): GainNode {
  const ctx = getCtx()
  if (!masterGain) {
    masterGain = ctx.createGain()
    masterGain.gain.value = soundEnabled ? 0.5 : 0
    masterGain.connect(ctx.destination)
  }
  return masterGain
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled
  if (masterGain) {
    masterGain.gain.value = enabled ? 0.5 : 0
  }
}

export function setSoundVolume(vol: number) {
  if (masterGain) {
    masterGain.gain.value = soundEnabled ? Math.max(0, Math.min(1, vol)) : 0
  }
}

export function isSoundEnabled(): boolean {
  return soundEnabled
}

/** Deep bass activation rumble */
export function playActivation() {
  const ctx = getCtx()
  const gain = getMasterGain()
  const now = ctx.currentTime

  // Sub bass
  const osc = ctx.createOscillator()
  const oscGain = ctx.createGain()
  osc.type = "sine"
  osc.frequency.setValueAtTime(40, now)
  osc.frequency.exponentialRampToValueAtTime(80, now + 2)
  oscGain.gain.setValueAtTime(0.6, now)
  oscGain.gain.exponentialRampToValueAtTime(0.01, now + 3)
  osc.connect(oscGain).connect(gain)
  osc.start(now)
  osc.stop(now + 3)

  // White noise burst
  const bufferSize = ctx.sampleRate * 2
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    const arr = new Uint32Array(1)
    crypto.getRandomValues(arr)
    data[i] = (arr[0] / 4294967295) * 2 - 1
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  const noiseGain = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  filter.type = "lowpass"
  filter.frequency.value = 200
  noiseGain.gain.setValueAtTime(0.3, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 2)
  noise.connect(filter).connect(noiseGain).connect(gain)
  noise.start(now)
  noise.stop(now + 2)
}

/** Scanning beep loop -- returns a stop function */
export function playScanningLoop(): () => void {
  const ctx = getCtx()
  const gain = getMasterGain()
  let running = true

  function tick() {
    if (!running) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.value = 800 + (crypto.getRandomValues(new Uint32Array(1))[0] % 400)
    oscGain.gain.setValueAtTime(0.15, now)
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08)
    osc.connect(oscGain).connect(gain)
    osc.start(now)
    osc.stop(now + 0.08)
    setTimeout(tick, 100 + (crypto.getRandomValues(new Uint32Array(1))[0] % 100))
  }

  tick()
  return () => {
    running = false
  }
}

/** Fast ticking for highlight cycling */
export function playTickingLoop(): () => void {
  const ctx = getCtx()
  const gain = getMasterGain()
  let running = true

  function tick() {
    if (!running) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = "square"
    osc.frequency.value = 1200 + (crypto.getRandomValues(new Uint32Array(1))[0] % 600)
    oscGain.gain.setValueAtTime(0.1, now)
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.04)
    osc.connect(oscGain).connect(gain)
    osc.start(now)
    osc.stop(now + 0.04)
    setTimeout(tick, 40 + (crypto.getRandomValues(new Uint32Array(1))[0] % 30))
  }

  tick()
  return () => {
    running = false
  }
}

/** Dramatic reveal chord */
export function playReveal() {
  const ctx = getCtx()
  const gain = getMasterGain()
  const now = ctx.currentTime

  // Major chord: C4, E4, G4
  const freqs = [261.63, 329.63, 392.0]
  freqs.forEach((freq) => {
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.value = freq
    oscGain.gain.setValueAtTime(0.2, now)
    oscGain.gain.setValueAtTime(0.25, now + 0.1)
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 3)
    osc.connect(oscGain).connect(gain)
    osc.start(now)
    osc.stop(now + 3)
  })
}

/** Short victory fanfare */
export function playVictory() {
  const ctx = getCtx()
  const gain = getMasterGain()
  const now = ctx.currentTime

  // Ascending notes
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = "triangle"
    osc.frequency.value = freq
    const start = now + i * 0.15
    oscGain.gain.setValueAtTime(0, start)
    oscGain.gain.linearRampToValueAtTime(0.2, start + 0.05)
    oscGain.gain.exponentialRampToValueAtTime(0.01, start + 0.4)
    osc.connect(oscGain).connect(gain)
    osc.start(start)
    osc.stop(start + 0.4)
  })
}

/** Resume audio context (required after user gesture) */
export function resumeAudio() {
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume()
  }
}
