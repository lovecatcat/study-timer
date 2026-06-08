let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

/**
 * 播放一个简单的 beep 音
 */
function playBeep(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.3,
  delay: number = 0
): Promise<void> {
  return new Promise((resolve) => {
    try {
      const ctx = getAudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay)
      gainNode.gain.setValueAtTime(volume, ctx.currentTime + delay)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration)

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.start(ctx.currentTime + delay)
      oscillator.stop(ctx.currentTime + delay + duration)
      oscillator.onended = () => resolve()
    } catch {
      resolve() // 静默失败（如 context 未初始化）
    }
  })
}

/**
 * 专注时间结束音效 - 三声清脆的叮
 */
export async function playFocusCompleteSound(): Promise<void> {
  await playBeep(880, 0.15, 'sine', 0.3, 0)
  await playBeep(1100, 0.15, 'sine', 0.3, 0.12)
  await playBeep(1320, 0.2, 'sine', 0.3, 0.24)
}

/**
 * 休息时间结束音效 - 两声柔和的叮
 */
export async function playBreakCompleteSound(): Promise<void> {
  await playBeep(660, 0.2, 'sine', 0.25, 0)
  await playBeep(880, 0.25, 'sine', 0.25, 0.2)
}
