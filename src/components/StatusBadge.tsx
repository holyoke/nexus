import type { JobStatus } from '../core/types'

export function StatusBadge({ status }: { status: JobStatus | 'idle' }) {
  const labels = { running: '运行中', queued: '排队中', completed: '已完成', failed: '失败', paused: '已暂停', idle: '草稿' }
  return <span className={`status-badge status-${status}`}><i />{labels[status]}</span>
}
