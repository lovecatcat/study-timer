import { useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import type { Task } from '../types'

export function useTasks() {
  const { state, addTask, updateTask, deleteTask } = useAppContext()

  const activeTasks = useMemo(
    () => state.tasks.filter((t) => t.completedAt === null),
    [state.tasks]
  )

  const completedTasks = useMemo(
    () => state.tasks.filter((t) => t.completedAt !== null),
    [state.tasks]
  )

  // 计算每个任务的累计专注时长
  const taskDurations = useMemo(() => {
    const map = new Map<string, number>()
    for (const session of state.sessions) {
      if (session.taskId && session.type === 'focus' && session.completed) {
        map.set(session.taskId, (map.get(session.taskId) ?? 0) + session.duration)
      }
    }
    return map
  }, [state.sessions])

  const getTaskDuration = (taskId: string): number => {
    return taskDurations.get(taskId) ?? 0
  }

  return {
    tasks: state.tasks,
    activeTasks,
    completedTasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskDuration,
  }
}
