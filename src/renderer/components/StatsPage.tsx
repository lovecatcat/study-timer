import React from 'react'
import OverviewCards from './Stats/OverviewCards'
import DailyChart from './Stats/DailyChart'
import TaskPieChart from './Stats/TaskPieChart'
import { useStats } from '../hooks/useStats'

export default function StatsPage(): React.ReactElement {
  const { todayStats, weekStats, totalStats, taskBreakdown } = useStats()

  return (
    <div className="h-full overflow-y-auto px-4 pb-4">
      {/* 概览卡片 */}
      <OverviewCards
        todayMinutes={todayStats.focusMinutes}
        todaySessions={todayStats.sessionsCompleted}
        totalSeconds={totalStats.totalFocusSeconds}
        totalSessions={totalStats.totalSessions}
        totalDays={totalStats.totalDays}
      />

      {/* 每日图表 */}
      <DailyChart data={weekStats} />

      {/* 任务分布 */}
      <TaskPieChart data={taskBreakdown} />
    </div>
  )
}
