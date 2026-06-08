import React from 'react'
import TimerDisplay from './Timer/TimerDisplay'
import TimerControls from './Timer/TimerControls'
import TaskSelector from './Timer/TaskSelector'
import { useTimer } from '../hooks/useTimer'

export default function TimerPage(): React.ReactElement {
  const { timer, start, pause, reset, skip, setCurrentTask, settings } = useTimer()

  const totalSeconds = timer.mode === 'focus' ? settings.focusDuration : settings.breakDuration

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <TimerDisplay
        remainingSeconds={timer.remainingSeconds}
        totalSeconds={totalSeconds}
        status={timer.status}
        mode={timer.mode}
      />

      <TimerControls
        status={timer.status}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onSkip={skip}
      />

      {/* 仅在专注模式显示任务选择器 */}
      {timer.mode === 'focus' && (
        <TaskSelector
          currentTaskId={timer.currentTaskId}
          onSelect={setCurrentTask}
        />
      )}

      {/* 今日完成数 */}
      {timer.completedSessions > 0 && (
        <div className="mt-4 text-xs text-gray-400">
          今日已完成 <span className="font-semibold text-primary-500">{timer.completedSessions}</span> 个番茄 🍅
        </div>
      )}
    </div>
  )
}
