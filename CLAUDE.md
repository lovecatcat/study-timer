# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

桌面学习计时器 — Electron + React + TypeScript 番茄钟应用，含任务管理和学习统计。

## 常用命令

```bash
npm install              # 安装依赖
npm run dev              # 启动 Electron 开发环境（HMR）
npm run build            # 生产构建（out/ 目录）
npm run package          # 构建并打包为 dmg/zip（dist/ 目录）
npm run preview          # 预览生产构建
```

**注意**：`npm run dev` 需要图形环境（macOS/Windows/Linux 桌面），SSH 终端无法启动 Electron 窗口。

## 技术栈

- **构建工具**: electron-vite（统一管理 main/preload/renderer 三个构建目标）
- **桌面壳**: Electron 30，窗口默认 420×640，最小 380×500
- **UI 框架**: React 18 + TypeScript + Tailwind CSS 3
- **状态管理**: React Context + useReducer（不用 Redux/Zustand）
- **持久化**: electron-store v6（CommonJS，JSON 文件存储）
- **图表**: Recharts
- **打包**: electron-builder

## 三层架构

```
src/main/index.ts        Electron 主进程（Node.js）
    ↓ contextBridge
src/preload/index.ts     安全桥接层，暴露 window.electronAPI
    ↓
src/renderer/            React 渲染进程（浏览器环境）
```

### 主进程 (`src/main/index.ts`)

- 创建 BrowserWindow，加载 preload 脚本
- 系统托盘：关闭窗口 → hide() 到托盘，右键菜单显示/退出
- 通过 `before-quit` + `isQuitting` 标志区分"最小化到托盘"和"真正退出"
- 开发环境通过 `ELECTRON_RENDERER_URL` 加载 Vite dev server，生产环境加载打包后的 HTML
- 所有持久化操作经 IPC handler 转发到 `store.ts`

### Preload 桥接 (`src/preload/index.ts`)

通过 `contextBridge.exposeInMainWorld` 暴露 `window.electronAPI`：
- `getData()` / `setData(data)` — 读写全量 AppData
- `showNotification(title, body)` — 弹出系统通知

类型定义在 `src/renderer/env.d.ts` 中声明到 `Window` 接口。

### IPC 通道 (`src/shared/ipc-channels.ts`)

三个通道，主进程和 preload 共享常量：
| 通道 | 方向 | 用途 |
|---|---|---|
| `store:get` | renderer → main | 返回完整 AppData |
| `store:set` | renderer → main | 保存 AppData（partial） |
| `notification:show` | renderer → main | 弹出系统通知 |

## 数据模型

所有类型定义在 `src/renderer/types/index.ts`：

- **Task** — 任务（name, color, completedAt），id 用 `crypto.randomUUID()`
- **TimerSession** — 一次计时记录（taskId, duration, type: focus/break, completed）
- **AppSettings** — 时长设置（秒为单位），含 autoStartBreak/autoStartFocus 标志
- **TimerState** — 计时器实时状态（status: idle/running/paused, mode: focus/break），仅存在于 useTimer hook 的本地 state，不持久化
- **AppData** — 顶层聚合：`{ tasks, sessions, settings }`

### 数据流：持久化机制

```
AppContext (useReducer) → state 变更 → useEffect → window.electronAPI.setData(state)
                                                    ↓
                                         IPC → main process → electron-store
```

- 初始加载：`AppProvider` mount 时调用 `getData()` 加载全量数据到 Context
- 每次 dispatch 触发 state 变化，React 的 batching 自然合并同一帧内的多次更新
- `initialized` ref 防止首次 mount 时触发保存（空数据覆盖磁盘）
- **注意**：state 和 store 的类型定义在 `main/store.ts`、`preload/index.ts`、`renderer/types/index.ts` 三处各自维护，修改数据模型时需三处同步更新

## 状态管理

### AppContext（全局持久化状态）

`src/renderer/context/AppContext.tsx` — 基于 `useReducer` 的单一数据源：

```
AppProvider
 ├── state: AppData（tasks + sessions + settings）
 ├── dispatch: 原始 dispatch（供 edge cases）
 └── 便捷方法: addTask / updateTask / deleteTask / addSession / updateSettings
```

Action 类型：`SET_DATA`, `ADD_TASK`, `UPDATE_TASK`, `DELETE_TASK`, `ADD_SESSION`, `UPDATE_SETTINGS`

DELETE_TASK 会同时将该任务关联的 sessions 的 taskId 置为 null（不删除记录）。

### useTimer（本地 UI 状态）

计时器状态是**本地 state**，不经过 Context（它是 UI 计算过程中的瞬态数据，只有完成后的 session 才写入全局）：

- 状态机：`idle → running → paused → running → ... → idle`
- 使用 `timerRef` / `settingsRef` 解决 setInterval 闭包陷阱（回调里永远能读到最新值）
- 每秒 tick 减 1，归零时 `completeSession()` → 写 session → 放音效 → 发通知 → 切换 focus/break
- `skip()` 会记录已过去的时间为未完成 session（completed: false），然后跳转下一模式
- `reset()` 恢复到当前模式的初始时长，不记录任何东西

## 组件结构

```
App → AppProvider → Layout（底部 3 Tab 切换）
                      ├── TimerPage    (timer tab)
                      │     ├── TimerDisplay   SVG 圆形进度环 + 居中倒计时
                      │     ├── TimerControls  开始/暂停/重置/跳过按钮
                      │     └── TaskSelector   下拉选当前任务
                      ├── TasksPage    (tasks tab)
                      │     ├── TaskForm       新增任务 + 颜色选择
                      │     └── TaskList → TaskItem  双击编辑、完成、删除
                      └── StatsPage    (stats tab)
                            ├── OverviewCards  今日/总计/天数卡片
                            ├── DailyChart     Recharts 柱状图（近7天）
                            └── TaskPieChart   Recharts 环形饼图（任务分布）
```

**注意事项**：
- 没有使用 React Router，Tab 切换通过 Layout 的 `useState<Tab>` 控制，每次切换页面会**卸载/重新挂载**非活跃的页面组件
- TimerPage 被卸载后再回来，timer 状态会丢失（因为 useTimer 是组件内 state）。这是设计取舍：计时主要在 TimerPage 活跃时进行。
- 如果后续需要在后台持续计时，需将 useTimer 状态提升到 AppContext 或 Layout 层

## 设计约束和已知问题

1. **数据模型三处重复**：`main/store.ts`、`preload/index.ts`、`renderer/types/index.ts` 各自定义了相同接口。修改数据字段时必须三处同步。
2. **长休息未实现**：`AppSettings` 定义了 `longBreakInterval` 和 `longBreakDuration`，但 useTimer 的 switchMode 未读取这些字段，始终使用普通 break/focus 时长。
3. **计时器不跨 Tab 存活**：切换到 Tasks/Stats Tab 后返回 Timer，计时器重置（因为 TimerPage 被卸载重挂载）。
4. **无深色模式**：全局样式为浅色主题，配色硬编码。
5. **electron-store v6**：使用 v6 而非 v8 是因为 Electron + Vite 构建输出为 CJS 格式，v8 是 ESM-only 会运行时报错。不要升级。
6. **托盘图标**：`resources/tray-icon.png` 是 Python 生成的 16×16 PNG，如需更好效果替换为此文件即可。
7. **`@/` 别名**：`electron.vite.config.ts` 配置了 `@` → `src/renderer`，可在 renderer 代码中用 `@/hooks/useTimer` 导入。
