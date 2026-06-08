import React, { useState } from 'react'
import type { Task } from '../../types'
import { formatDurationShort } from '../../utils/format'

interface Props {
  task: Task
  durationSeconds: number
  onUpdate: (id: string, updates: Partial<Pick<Task, 'name' | 'color' | 'completedAt'>>) => void
  onDelete: (id: string) => void
}

export default function TaskItem({ task, durationSeconds, onUpdate, onDelete }: Props): React.ReactElement {
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(task.name)

  const handleSave = () => {
    if (editName.trim() && editName.trim() !== task.name) {
      onUpdate(task.id, { name: editName.trim() })
    }
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') { setEditName(task.name); setEditing(false) }
  }

  const isCompleted = task.completedAt !== null

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
        ${isCompleted ? 'bg-gray-50 opacity-60' : 'bg-white hover:bg-gray-50 border border-gray-100 hover:border-gray-200'}`}
    >
      {/* 颜色标识 */}
      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: task.color }} />

      {/* 任务名 */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full text-sm bg-transparent border-b border-primary-300 outline-none px-1 py-0.5"
            autoFocus
          />
        ) : (
          <span
            className={`text-sm block truncate ${isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}
            onDoubleClick={() => !isCompleted && setEditing(true)}
          >
            {task.name}
          </span>
        )}
      </div>

      {/* 时长 */}
      {durationSeconds > 0 && (
        <span className="text-xs text-gray-400 font-mono flex-shrink-0">
          {formatDurationShort(durationSeconds)}
        </span>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {!isCompleted && (
          <>
            <button
              onClick={() => setEditing(true)}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded"
              title="编辑"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onUpdate(task.id, { completedAt: Date.now() })}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-emerald-500 rounded"
              title="完成"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 rounded"
          title="删除"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
