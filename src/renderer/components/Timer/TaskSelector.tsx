import React from 'react'
import type { Task } from '../../types'
import { useAppContext } from '../../context/AppContext'

interface Props {
  currentTaskId: string | null
  onSelect: (taskId: string | null) => void
}

export default function TaskSelector({ currentTaskId, onSelect }: Props): React.ReactElement {
  const { state } = useAppContext()
  const activeTasks = state.tasks.filter((t) => t.completedAt === null)

  const currentTask = state.tasks.find((t) => t.id === currentTaskId)

  return (
    <div className="w-full max-w-[280px] mx-auto mt-4">
      <label className="block text-xs text-gray-400 mb-1.5 font-medium">当前任务</label>
      <div className="relative">
        <select
          value={currentTaskId ?? ''}
          onChange={(e) => onSelect(e.target.value || null)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8
            text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300
            cursor-pointer transition-all"
        >
          <option value="">📋 不指定任务</option>
          {activeTasks.map((task) => (
            <option key={task.id} value={task.id}>
              ● {task.name}
            </option>
          ))}
        </select>
        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {currentTask && (
        <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTask.color }} />
          {currentTask.name}
        </div>
      )}
    </div>
  )
}
