import { useState, useRef, useCallback, useEffect } from 'react'
import type { TimerState, TimerMode, TimerSession } from '../types'
import { useAppContext } from '../context/AppContext'
import { playFocusCompleteSound, playBreakCompleteSound } from '../utils/sound'

export function useTimer() {
  const { state, addSession } = useAppContext()
  const { settings } = state

  const [timer, setTimer] = useState<TimerState>({
    status: 'idle',
    mode: 'focus',
    remainingSeconds: settings.focusDuration,
    currentTaskId: null,
    sessionStartTime: null,
    completedSessions: 0,
  })

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // 用 ref 追踪最新状态，避免闭包陷阱
  const timerRef = useRef(timer)
  timerRef.current = timer
  const settingsRef = useRef(settings)
  settingsRef.current = settings

  // 清理 interval
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // 完成当前 session
  const completeSession = useCallback(
    (mode: TimerMode, startTime: number, taskId: string | null) => {
      const now = Date.now()
      const s = settingsRef.current
      const duration = mode === 'focus' ? s.focusDuration : s.breakDuration

      // 记录 session
      const session: TimerSession = {
        id: crypto.randomUUID(),
        taskId: mode === 'focus' ? taskId : null, // 休息不计入任务
        startTime,
        endTime: now,
        duration,
        type: mode,
        completed: true,
      }
      addSession(session)

      // 播放音效
      if (s.soundEnabled) {
        if (mode === 'focus') {
          playFocusCompleteSound()
        } else {
          playBreakCompleteSound()
        }
      }

      // 发送系统通知
      try {
        if (window.electronAPI) {
          if (mode === 'focus') {
            window.electronAPI.showNotification('🍅 专注时间结束！', '太棒了！休息一下吧~')
          } else {
            window.electronAPI.showNotification('☕ 休息时间结束', '准备好开始新的番茄了吗？')
          }
        }
      } catch {
        // 静默失败
      }
    },
    [addSession]
  )

  // 切换到下一个模式
  const switchMode = useCallback(
    (prevMode: TimerMode, prevStartTime: number, prevTaskId: string | null) => {
      const s = settingsRef.current
      const wasFocus = prevMode === 'focus'

      // 完成当前 session
      completeSession(prevMode, prevStartTime, prevTaskId)

      const newMode: TimerMode = wasFocus ? 'break' : 'focus'
      const newDuration = wasFocus ? s.breakDuration : s.focusDuration
      const shouldAutoStart = wasFocus ? s.autoStartBreak : s.autoStartFocus

      setTimer((prev) => ({
        status: shouldAutoStart ? 'running' : 'idle',
        mode: newMode,
        remainingSeconds: newDuration,
        currentTaskId: wasFocus ? null : prev.currentTaskId,
        sessionStartTime: shouldAutoStart ? Date.now() : null,
        completedSessions: wasFocus ? prev.completedSessions + 1 : prev.completedSessions,
      }))
    },
    [completeSession]
  )

  // Tick：每秒执行
  const tick = useCallback(() => {
    const current = timerRef.current

    if (current.remainingSeconds <= 1) {
      // 时间到！
      clearTimer()
      if (current.sessionStartTime) {
        switchMode(current.mode, current.sessionStartTime, current.currentTaskId)
      }
    } else {
      setTimer((prev) => ({
        ...prev,
        remainingSeconds: prev.remainingSeconds - 1,
      }))
    }
  }, [clearTimer, switchMode])

  // 开始计时
  const start = useCallback(() => {
    clearTimer()
    const now = Date.now()
    setTimer((prev) => ({
      ...prev,
      status: 'running',
      sessionStartTime: prev.sessionStartTime ?? now,
    }))
    intervalRef.current = setInterval(tick, 1000)
  }, [clearTimer, tick])

  // 暂停
  const pause = useCallback(() => {
    clearTimer()
    setTimer((prev) => ({ ...prev, status: 'paused' }))
  }, [clearTimer])

  // 重置
  const reset = useCallback(() => {
    clearTimer()
    const s = settingsRef.current
    setTimer((prev) => ({
      ...prev,
      status: 'idle',
      remainingSeconds: prev.mode === 'focus' ? s.focusDuration : s.breakDuration,
      sessionStartTime: null,
    }))
  }, [clearTimer])

  // 跳过当前 session
  const skip = useCallback(() => {
    clearTimer()
    const current = timerRef.current
    // 记录为未完成（如果已经开始）
    if (current.sessionStartTime && current.status !== 'idle') {
      const now = Date.now()
      const elapsed = Math.floor((now - current.sessionStartTime) / 1000)
      const session: TimerSession = {
        id: crypto.randomUUID(),
        taskId: current.mode === 'focus' ? current.currentTaskId : null,
        startTime: current.sessionStartTime,
        endTime: now,
        duration: elapsed,
        type: current.mode,
        completed: false,
      }
      addSession(session)
    }

    // 切换到下一个模式
    const s = settingsRef.current
    const newMode: TimerMode = current.mode === 'focus' ? 'break' : 'focus'
    setTimer((prev) => ({
      status: 'idle',
      mode: newMode,
      remainingSeconds: newMode === 'focus' ? s.focusDuration : s.breakDuration,
      currentTaskId: newMode === 'focus' ? prev.currentTaskId : null,
      sessionStartTime: null,
      completedSessions: current.mode === 'focus' ? prev.completedSessions + 1 : prev.completedSessions,
    }))
  }, [clearTimer, addSession])

  // 选择任务
  const setCurrentTask = useCallback((taskId: string | null) => {
    setTimer((prev) => ({ ...prev, currentTaskId: taskId }))
  }, [])

  // 当 settings 变化时，如果计时器处于 idle 状态，更新 remainingSeconds
  useEffect(() => {
    if (timer.status === 'idle') {
      setTimer((prev) => ({
        ...prev,
        remainingSeconds: prev.mode === 'focus' ? settings.focusDuration : settings.breakDuration,
      }))
    }
  }, [settings.focusDuration, settings.breakDuration, timer.status])

  // 组件卸载时清理
  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  return {
    timer,
    start,
    pause,
    reset,
    skip,
    setCurrentTask,
    settings,
  }
}
