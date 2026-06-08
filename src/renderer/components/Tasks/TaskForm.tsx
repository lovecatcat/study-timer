import React, { useState } from 'react'
import { TASK_COLORS } from '../../types'

interface Props {
  onSubmit: (name: string, color: string) => void
}

export default function TaskForm({ onSubmit }: Props): React.ReactElement {
  const [name, setName] = useState('')
  const [color, setColor] = useState(TASK_COLORS[0])
  const [showColors, setShowColors] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit(name.trim(), color)
    setName('')
    setColor(TASK_COLORS[0])
    setShowColors(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4">
      <div className="relative flex-1">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="添加新任务..."
          maxLength={30}
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pr-10
            text-sm text-gray-700 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300
            transition-all"
        />
        {/* 颜色选择器按钮 */}
        <button
          type="button"
          onClick={() => setShowColors(!showColors)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-gray-200
            hover:scale-110 transition-transform"
          style={{ backgroundColor: color }}
        />
      </div>

      <button
        type="submit"
        disabled={!name.trim()}
        className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300
          text-white text-sm font-medium rounded-lg transition-colors duration-200
          disabled:cursor-not-allowed"
      >
        添加
      </button>

      {/* 颜色选择面板 */}
      {showColors && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-lg border border-gray-100 z-10 flex gap-1.5">
          {TASK_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => { setColor(c); setShowColors(false) }}
              className={`w-6 h-6 rounded-full transition-transform hover:scale-110
                ${c === color ? 'ring-2 ring-offset-1 ring-primary-300' : ''}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      )}
    </form>
  )
}
