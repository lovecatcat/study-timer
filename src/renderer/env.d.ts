/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    getData: () => Promise<{
      tasks: Array<{
        id: string
        name: string
        color: string
        createdAt: number
        completedAt: number | null
      }>
      sessions: Array<{
        id: string
        taskId: string | null
        startTime: number
        endTime: number
        duration: number
        type: 'focus' | 'break'
        completed: boolean
      }>
      settings: {
        focusDuration: number
        breakDuration: number
        longBreakInterval: number
        longBreakDuration: number
        autoStartBreak: boolean
        autoStartFocus: boolean
        soundEnabled: boolean
      }
    }>
    setData: (data: Record<string, unknown>) => Promise<boolean>
    showNotification: (title: string, body: string) => Promise<boolean>
  }
}
