/**
 * 将秒数格式化为 mm:ss 显示
 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * 将秒数格式化为 "X小时Y分钟" 的可读文本
 */
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0 分钟'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.round((seconds % 3600) / 60)
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`
  if (hours > 0) return `${hours} 小时`
  return `${minutes} 分钟`
}

/**
 * 将秒数格式化为简短形式 "1.5h" 或 "45m"
 */
export function formatDurationShort(seconds: number): string {
  if (seconds <= 0) return '0m'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.round((seconds % 3600) / 60)
  if (hours > 0) {
    if (minutes > 0) return `${hours}.${Math.round(minutes / 6)}h`
    return `${hours}h`
  }
  return `${minutes}m`
}

/**
 * 格式化时间戳为 YYYY-MM-DD
 */
export function formatDate(timestamp: number): string {
  const d = new Date(timestamp)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * 获取今天日期字符串 YYYY-MM-DD
 */
export function getTodayStr(): string {
  return formatDate(Date.now())
}

/**
 * 获取本周一的日期字符串
 */
export function getWeekStartStr(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? 6 : day - 1 // 周一为一周开始
  const monday = new Date(now)
  monday.setDate(now.getDate() - diff)
  monday.setHours(0, 0, 0, 0)
  return formatDate(monday.getTime())
}

/**
 * 中文星期几
 */
export function getDayName(dateStr: string): string {
  const date = new Date(dateStr)
  const names = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return names[date.getDay()]
}
