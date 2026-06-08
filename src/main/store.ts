import Store from 'electron-store'

interface AppData {
  tasks: Task[]
  sessions: TimerSession[]
  settings: AppSettings
}

interface Task {
  id: string
  name: string
  color: string
  createdAt: number
  completedAt: number | null
}

interface TimerSession {
  id: string
  taskId: string | null
  startTime: number
  endTime: number
  duration: number
  type: 'focus' | 'break'
  completed: boolean
}

interface AppSettings {
  focusDuration: number
  breakDuration: number
  longBreakInterval: number
  longBreakDuration: number
  autoStartBreak: boolean
  autoStartFocus: boolean
  soundEnabled: boolean
}

const defaultSettings: AppSettings = {
  focusDuration: 25 * 60,
  breakDuration: 5 * 60,
  longBreakInterval: 4,
  longBreakDuration: 15 * 60,
  autoStartBreak: true,
  autoStartFocus: false,
  soundEnabled: true,
}

const store = new Store<AppData>({
  defaults: {
    tasks: [],
    sessions: [],
    settings: defaultSettings,
  },
})

export function getData(): AppData {
  return {
    tasks: store.get('tasks', []) as Task[],
    sessions: store.get('sessions', []) as TimerSession[],
    settings: store.get('settings', defaultSettings) as AppSettings,
  }
}

export function setData(data: Partial<AppData>): void {
  if (data.tasks !== undefined) store.set('tasks', data.tasks)
  if (data.sessions !== undefined) store.set('sessions', data.sessions)
  if (data.settings !== undefined) store.set('settings', data.settings)
}

export { defaultSettings }
