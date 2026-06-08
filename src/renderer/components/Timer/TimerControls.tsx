import React from 'react'
import type { TimerStatus } from '../../types'

interface Props {
  status: TimerStatus
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
}

export default function TimerControls({
  status,
  onStart,
  onPause,
  onReset,
  onSkip,
}: Props): React.ReactElement {
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      {/* 重置 */}
      <button
        onClick={onReset}
        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center
          text-gray-500 transition-colors duration-200"
        title="重置"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      {/* 开始/暂停 */}
      {status === 'running' ? (
        <button
          onClick={onPause}
          className="w-16 h-16 rounded-full bg-primary-500 hover:bg-primary-600 flex items-center justify-center
            text-white shadow-lg shadow-primary-200 transition-all duration-200 hover:scale-105"
          title="暂停"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        </button>
      ) : (
        <button
          onClick={onStart}
          className="w-16 h-16 rounded-full bg-primary-500 hover:bg-primary-600 flex items-center justify-center
            text-white shadow-lg shadow-primary-200 transition-all duration-200 hover:scale-105"
          title="开始"
        >
          <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}

      {/* 跳过 */}
      <button
        onClick={onSkip}
        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center
          text-gray-500 transition-colors duration-200"
        title="跳过"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
