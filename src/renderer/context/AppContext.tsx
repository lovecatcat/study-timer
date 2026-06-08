import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react'
import type { AppData, AppAction, Task, TimerSession, AppSettings } from '../types'
import { DEFAULT_SETTINGS } from '../types'

// ============ Reducer ============

function appReducer(state: AppData, action: AppAction): AppData {
  switch (action.type) {
    case 'SET_DATA':
      return action.payload

    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
        ),
      }

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
        // 同时清理关联的 sessions
        sessions: state.sessions.map((s) =>
          s.taskId === action.payload ? { ...s, taskId: null } : s
        ),
      }

    case 'ADD_SESSION':
      return { ...state, sessions: [...state.sessions, action.payload] }

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }

    default:
      return state
  }
}

// ============ 初始状态 ============

const initialData: AppData = {
  tasks: [],
  sessions: [],
  settings: DEFAULT_SETTINGS,
}

// ============ Context ============

interface AppContextValue {
  state: AppData
  dispatch: React.Dispatch<AppAction>
  addTask: (name: string, color: string) => void
  updateTask: (id: string, updates: Partial<Pick<Task, 'name' | 'color' | 'completedAt'>>) => void
  deleteTask: (id: string) => void
  addSession: (session: TimerSession) => void
  updateSettings: (updates: Partial<AppSettings>) => void
}

const AppContext = createContext<AppContextValue | null>(null)

// ============ Provider ============

export function AppProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [state, dispatch] = useReducer(appReducer, initialData)
  const initialized = useRef(false)

  // 初始化：从 electron-store 加载数据
  useEffect(() => {
    async function loadData() {
      try {
        if (window.electronAPI) {
          const data = await window.electronAPI.getData()
          if (data) {
            dispatch({ type: 'SET_DATA', payload: data })
          }
        }
      } catch (err) {
        console.warn('无法加载持久化数据，使用默认设置:', err)
      }
      initialized.current = true
    }
    loadData()
  }, [])

  // 持久化：state 变更时保存到 electron-store（跳过初始加载）
  useEffect(() => {
    if (!initialized.current) return
    try {
      if (window.electronAPI) {
        window.electronAPI.setData(state)
      }
    } catch (err) {
      console.warn('保存数据失败:', err)
    }
  }, [state])

  // 便捷方法
  const addTask = useCallback(
    (name: string, color: string) => {
      const task: Task = {
        id: crypto.randomUUID(),
        name,
        color,
        createdAt: Date.now(),
        completedAt: null,
      }
      dispatch({ type: 'ADD_TASK', payload: task })
    },
    []
  )

  const updateTask = useCallback(
    (id: string, updates: Partial<Pick<Task, 'name' | 'color' | 'completedAt'>>) => {
      dispatch({ type: 'UPDATE_TASK', payload: { id, updates } })
    },
    []
  )

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id })
  }, [])

  const addSession = useCallback((session: TimerSession) => {
    dispatch({ type: 'ADD_SESSION', payload: session })
  }, [])

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: updates })
  }, [])

  const value: AppContextValue = {
    state,
    dispatch,
    addTask,
    updateTask,
    deleteTask,
    addSession,
    updateSettings,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// ============ Hook ============

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return ctx
}
