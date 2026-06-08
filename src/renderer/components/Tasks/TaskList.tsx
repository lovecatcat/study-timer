import React from 'react'
import TaskItem from './TaskItem'
import type { Task } from '../../types'

interface Props {
  tasks: Task[]
  getDuration: (taskId: string) => number
  onUpdate: (id: string, updates: Partial<Pick<Task, 'name' | 'color' | 'completedAt'>>) => void
  onDelete: (id: string) => void
  title: string
  emptyMessage: string
}

export default function TaskList({
  tasks,
  getDuration,
  onUpdate,
  onDelete,
  title,
  emptyMessage,
}: Props): React.ReactElement {
  if (tasks.length === 0) {
    return (
      <div className="mb-4">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
        <p className="text-sm text-gray-400 text-center py-4">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="mb-4">
      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
        {title} ({tasks.length})
      </h3>
      <div className="space-y-1.5">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            durationSeconds={getDuration(task.id)}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
