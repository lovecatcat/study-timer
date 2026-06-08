import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { DailyStats } from '../../types'
import { getDayName } from '../../utils/format'

interface Props {
  data: DailyStats[]
}

export default function DailyChart({ data }: Props): React.ReactElement {
  const chartData = data.map((d) => ({
    ...d,
    day: getDayName(d.date),
    date: d.date.slice(5), // MM-DD
    minutes: d.totalFocusMinutes,
  }))

  const hasData = chartData.some((d) => d.minutes > 0)

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
      <h3 className="text-sm font-medium text-gray-600 mb-3">📊 近7天学习时长</h3>
      {hasData ? (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              unit="m"
              width={30}
            />
            <Tooltip
              formatter={(value: number) => [`${value} 分钟`, '学习时长']}
              labelFormatter={(_, payload) => {
                if (payload?.[0]) return `${payload[0].payload.date} ${payload[0].payload.day}`
                return ''
              }}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="minutes"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[180px] text-sm text-gray-400">
          暂无数据，开始计时吧！
        </div>
      )}
    </div>
  )
}
