import React, { useState } from 'react'
import TimerPage from './TimerPage'
import TasksPage from './TasksPage'
import StatsPage from './StatsPage'

type Tab = 'timer' | 'tasks' | 'stats'

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'timer', label: '计时', icon: '⏱' },
  { key: 'tasks', label: '任务', icon: '📋' },
  { key: 'stats', label: '统计', icon: '📊' },
]

export default function Layout(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<Tab>('timer')

  return (
    <div className="flex flex-col h-full">
      {/* 页面内容 */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'timer' && <TimerPage />}
        {activeTab === 'tasks' && <TasksPage />}
        {activeTab === 'stats' && <StatsPage />}
      </div>

      {/* 底部导航栏 */}
      <nav className="flex-shrink-0 flex border-t border-gray-100 bg-white">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex flex-col items-center py-2.5 transition-colors duration-200
                ${isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className={`text-xs mt-0.5 font-medium ${isActive ? 'text-primary-600' : ''}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
