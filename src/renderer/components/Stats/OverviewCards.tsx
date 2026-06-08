import React from 'react'
import { formatDuration } from '../../utils/format'

interface Props {
  todayMinutes: number
  todaySessions: number
  totalSeconds: number
  totalSessions: number
  totalDays: number
}

export default function OverviewCards({
  todayMinutes,
  todaySessions,
  totalSeconds,
  totalSessions,
  totalDays,
}: Props): React.ReactElement {
  const cards = [
    {
      label: '今日学习',
      value: todayMinutes > 0 ? formatDuration(todayMinutes * 60) : '--',
      sub: todaySessions > 0 ? `${todaySessions} 个番茄` : '暂无记录',
      icon: '📝',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: '总学习时长',
      value: totalSeconds > 0 ? formatDuration(totalSeconds) : '--',
      sub: totalSessions > 0 ? `${totalSessions} 个番茄` : '开始你的第一个番茄吧',
      icon: '⏱️',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: '学习天数',
      value: totalDays > 0 ? `${totalDays} 天` : '--',
      sub: '累积坚持',
      icon: '📅',
      color: 'bg-amber-50 text-amber-600',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {cards.map((card) => (
        <div key={card.label}
          className="bg-white rounded-xl border border-gray-100 p-3 text-center hover:shadow-sm transition-shadow">
          <span className="text-lg">{card.icon}</span>
          <p className="text-lg font-bold text-gray-800 mt-1">{card.value}</p>
          <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
        </div>
      ))}
    </div>
  )
}
