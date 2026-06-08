// ============ 基础数据模型 ============

export interface Task {
  id: string
  name: string
  color: string
  createdAt: number
  completedAt: number | null
}

export interface TimerSession {
  id: string
  taskId: string | null
  startTime: number
  endTime: number
  duration: number
  type: 'focus' | 'break'
  completed: boolean
}

export interface AppSettings {
  focusDuration: number
  breakDuration: number
  longBreakInterval: number
  longBreakDuration: number
  autoStartBreak: boolean
  autoStartFocus: boolean
  soundEnabled: boolean
}

// ============ 应用全局数据 ============

export interface AppData {
  tasks: Task[]
  sessions: TimerSession[]
  settings: AppSettings
}

// ============ 计时器状态 ============

export type TimerStatus = 'idle' | 'running' | 'paused'
export type TimerMode = 'focus' | 'break'

export interface TimerState {
  status: TimerStatus
  mode: TimerMode
  remainingSeconds: number
  currentTaskId: string | null
  sessionStartTime: number | null
  completedSessions: number
}

// ============ 统计数据 ============

export interface DailyStats {
  date: string // YYYY-MM-DD
  totalFocusMinutes: number
  totalBreakMinutes: number
  sessionsCompleted: number
}

export interface TaskTimeStats {
  taskId: string
  taskName: string
  taskColor: string
  totalMinutes: number
  sessionCount: number
}

// ============ Context Actions ============

export type AppAction =
  | { type: 'SET_DATA'; payload: AppData }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Pick<Task, 'name' | 'color' | 'completedAt'>> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_SESSION'; payload: TimerSession }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }

// ============ 默认设置 ============

export const DEFAULT_SETTINGS: AppSettings = {
  focusDuration: 25 * 60, // 25 分钟
  breakDuration: 5 * 60, // 5 分钟
  longBreakInterval: 4, // 4 个番茄后长休息
  longBreakDuration: 15 * 60, // 15 分钟
  autoStartBreak: true,
  autoStartFocus: false,
  soundEnabled: true,
}

// ============ 任务颜色预设 ============

export const TASK_COLORS = [
  '#6366f1', // indigo
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
]
