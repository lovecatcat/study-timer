import React from 'react'
import type { TimerStatus, TimerMode } from '../../types'
import { formatTime } from '../../utils/format'

interface Props {
  remainingSeconds: number
  totalSeconds: number
  status: TimerStatus
  mode: TimerMode
}

export default function TimerDisplay({ remainingSeconds, totalSeconds, status, mode }: Props): React.ReactElement {
  // 圆形进度计算
  const radius = 130
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius
  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 1
  const dashOffset = circumference * (1 - progress)

  const isFocus = mode === 'focus'
  const isRunning = status === 'running'

  // 颜色：专注=indigo，休息=green
  const trackColor = isFocus ? '#e0e7ff' : '#d1fae5'
  const progressColor = isFocus ? '#6366f1' : '#10b981'
  const textColor = isFocus ? 'text-primary-600' : 'text-emerald-600'
  const labelColor = isFocus ? 'text-primary-400' : 'text-emerald-400'

  return (
    <div className="flex flex-col items-center justify-center select-none">
      {/* 模式标签 */}
      <div className={`text-sm font-medium mb-3 ${labelColor} tracking-wider`}>
        {isFocus ? '🔴 专注时间' : '🟢 休息时间'}
      </div>

      {/* SVG 圆环进度 */}
      <div className="relative">
        <svg width="300" height="300" className="-rotate-90">
          {/* 背景圆环 */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* 进度圆环 */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>

        {/* 中间时间显示 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-6xl font-mono font-bold tracking-tight ${textColor} ${isRunning ? 'animate-pulse' : ''}`}
            style={{ animation: isRunning ? 'none' : undefined }}>
            {formatTime(remainingSeconds)}
          </span>
          <span className={`text-xs mt-2 ${labelColor}`}>
            {status === 'idle' ? '准备开始' : status === 'running' ? '进行中' : '已暂停'}
          </span>
        </div>
      </div>
    </div>
  )
}
