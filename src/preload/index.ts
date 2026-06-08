import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '../shared/ipc-channels'

export interface ElectronAPI {
  getData: () => Promise<AppData>
  setData: (data: Record<string, unknown>) => Promise<boolean>
  showNotification: (title: string, body: string) => Promise<boolean>
}

// 与 store.ts 保持一致
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

interface AppData {
  tasks: Task[]
  sessions: TimerSession[]
  settings: AppSettings
}

const electronAPI: ElectronAPI = {
  getData: () => ipcRenderer.invoke(IPC_CHANNELS.STORE_GET),
  setData: (data) => ipcRenderer.invoke(IPC_CHANNELS.STORE_SET, data),
  showNotification: (title, body) => ipcRenderer.invoke(IPC_CHANNELS.NOTIFICATION_SHOW, title, body),
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
