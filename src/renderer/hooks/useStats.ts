import { useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import type { DailyStats, TaskTimeStats } from '../types'
import { getTodayStr, getWeekStartStr, formatDate } from '../utils/format'

export function useStats() {
  const { state } = useAppContext()
  const { sessions, tasks } = state

  // 今日统计
  const todayStats = useMemo(() => {
    const today = getTodayStr()
    const todaySessions = sessions.filter((s) => formatDate(s.startTime) === today)

    const focusSessions = todaySessions.filter((s) => s.type === 'focus' && s.completed)
    const breakSessions = todaySessions.filter((s) => s.type === 'break' && s.completed)

    return {
      totalFocusSeconds: focusSessions.reduce((sum, s) => sum + s.duration, 0),
      totalBreakSeconds: breakSessions.reduce((sum, s) => sum + s.duration, 0),
      sessionsCompleted: focusSessions.length,
      focusMinutes: Math.round(focusSessions.reduce((sum, s) => sum + s.duration, 0) / 60),
    }
  }, [sessions])

  // 本周每日统计（近7天）
  const weekStats = useMemo(() => {
    const stats: DailyStats[] = []
    const now = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = formatDate(date.getTime())

      const daySessions = sessions.filter((s) => formatDate(s.startTime) === dateStr)
      const focusDay = daySessions.filter((s) => s.type === 'focus' && s.completed)
      const breakDay = daySessions.filter((s) => s.type === 'break' && s.completed)

      stats.push({
        date: dateStr,
        totalFocusMinutes: Math.round(focusDay.reduce((sum, s) => sum + s.duration, 0) / 60),
        totalBreakMinutes: Math.round(breakDay.reduce((sum, s) => sum + s.duration, 0) / 60),
        sessionsCompleted: focusDay.length,
      })
    }

    return stats
  }, [sessions])

  // 总计
  const totalStats = useMemo(() => {
    const focusSessions = sessions.filter((s) => s.type === 'focus' && s.completed)
    const totalSeconds = focusSessions.reduce((sum, s) => sum + s.duration, 0)
    return {
      totalFocusSeconds: totalSeconds,
      totalSessions: focusSessions.length,
      totalDays: new Set(focusSessions.map((s) => formatDate(s.startTime))).size,
    }
  }, [sessions])

  // 各任务时长分布
  const taskBreakdown = useMemo(() => {
    const map = new Map<string, { totalSeconds: number; sessionCount: number }>()

    for (const session of sessions) {
      if (!session.taskId || session.type !== 'focus' || !session.completed) continue
      const entry = map.get(session.taskId) ?? { totalSeconds: 0, sessionCount: 0 }
      entry.totalSeconds += session.duration
      entry.sessionCount += 1
      map.set(session.taskId, entry)
    }

    const result: TaskTimeStats[] = []
    for (const [taskId, data] of map) {
      const task = tasks.find((t) => t.id === taskId)
      result.push({
        taskId,
        taskName: task?.name ?? '已删除的任务',
        taskColor: task?.color ?? '#94a3b8',
        totalMinutes: Math.round(data.totalSeconds / 60),
        sessionCount: data.sessionCount,
      })
    }

    // 按时长降序
    result.sort((a, b) => b.totalMinutes - a.totalMinutes)
    return result
  }, [sessions, tasks])

  return {
    todayStats,
    weekStats,
    totalStats,
    taskBreakdown,
  }
}
