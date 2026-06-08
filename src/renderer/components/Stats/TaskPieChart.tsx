import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { TaskTimeStats } from '../../types'

interface Props {
  data: TaskTimeStats[]
}

export default function TaskPieChart({ data }: Props): React.ReactElement {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="text-sm font-medium text-gray-600 mb-3">🎯 任务时间分布</h3>
        <div className="flex items-center justify-center h-[200px] text-sm text-gray-400">
          暂无数据，在计时前选择一个任务吧！
        </div>
      </div>
    )
  }

  // 最多显示前6个，其余归为"其他"
  const topItems = data.slice(0, 6)
  const remainder = data.slice(6)

  const chartData = topItems.map((item) => ({
    name: item.taskName,
    value: item.totalMinutes,
    color: item.taskColor,
  }))

  if (remainder.length > 0) {
    const otherMinutes = remainder.reduce((sum, item) => sum + item.totalMinutes, 0)
    chartData.push({ name: '其他', value: otherMinutes, color: '#94a3b8' })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-medium text-gray-600 mb-1">🎯 任务时间分布</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value} 分钟`]}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
              fontSize: 12,
            }}
          />
          <Legend
            formatter={(value: string) => (
              <span style={{ fontSize: 11, color: '#64748b' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
