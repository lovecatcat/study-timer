import React from 'react'
import TaskForm from './Tasks/TaskForm'
import TaskList from './Tasks/TaskList'
import { useTasks } from '../hooks/useTasks'

export default function TasksPage(): React.ReactElement {
  const { tasks, activeTasks, completedTasks, addTask, updateTask, deleteTask, getTaskDuration } =
    useTasks()

  const totalFocusSeconds = tasks.reduce((sum, t) => sum + getTaskDuration(t.id), 0)

  return (
    <div className="h-full flex flex-col px-4">
      <div className="mb-4">
        <TaskForm onSubmit={addTask} />
      </div>

      {/* 总览 */}
      {tasks.length > 0 && (
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
          <span>共 {tasks.length} 个任务</span>
          {totalFocusSeconds > 0 && (
            <span>
              累计专注{' '}
              {Math.round(totalFocusSeconds / 60) >= 60
                ? `${(totalFocusSeconds / 3600).toFixed(1)} 小时`
                : `${Math.round(totalFocusSeconds / 60)} 分钟`}
            </span>
          )}
        </div>
      )}

      {/* 任务列表 */}
      <div className="flex-1 overflow-y-auto">
        <TaskList
          tasks={activeTasks}
          getDuration={getTaskDuration}
          onUpdate={updateTask}
          onDelete={deleteTask}
          title="进行中"
          emptyMessage="还没有任务，添加一个吧"
        />

        <TaskList
          tasks={completedTasks}
          getDuration={getTaskDuration}
          onUpdate={updateTask}
          onDelete={deleteTask}
          title="已完成"
          emptyMessage="暂无已完成任务"
        />
      </div>
    </div>
  )
}
