import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { jobsSeed, mockApi, runtimesSeed, sessionsSeed } from '../services/mockApi'
import type { AgentSession, ComputeJob, RouteId, RuntimeDefinition, ToastMessage } from './types'

interface AppRuntime {
  route: RouteId
  navigate: (route: RouteId) => void
  sessions: AgentSession[]
  activeSession: AgentSession
  selectSession: (id: string) => void
  sendMessage: (content: string) => Promise<void>
  jobs: ComputeJob[]
  updateJobStatus: (id: string, status: ComputeJob['status']) => void
  runtimes: RuntimeDefinition[]
  launchRuntime: (runtime: RuntimeDefinition) => Promise<void>
  toasts: ToastMessage[]
}

const AppContext = createContext<AppRuntime | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const hashRoute = window.location.hash.replace('#/', '') as RouteId
  const [route, setRoute] = useState<RouteId>(hashRoute || 'dashboard')
  const [sessions, setSessions] = useState(sessionsSeed)
  const [activeSessionId, setActiveSessionId] = useState(sessionsSeed[0].id)
  const [jobs, setJobs] = useState(jobsSeed)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const toast = (title: string, detail: string) => {
    const id = Date.now()
    setToasts(current => [...current, { id, title, detail }])
    window.setTimeout(() => setToasts(current => current.filter(item => item.id !== id)), 3200)
  }

  const navigate = (next: RouteId) => {
    window.location.hash = `/${next}`
    setRoute(next)
  }

  useEffect(() => {
    const onHash = () => setRoute((window.location.hash.replace('#/', '') as RouteId) || 'dashboard')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const activeSession = sessions.find(item => item.id === activeSessionId) ?? sessions[0]

  const sendMessage = async (content: string) => {
    const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    setSessions(current => current.map(session => session.id === activeSessionId ? { ...session, updatedAt: '刚刚', messages: [...session.messages, { id: `user-${Date.now()}`, role: 'user', content, time }] } : session))
    const response = await mockApi.sendMessage(content)
    setSessions(current => current.map(session => session.id === activeSessionId ? { ...session, messages: [...session.messages, response] } : session))
    toast('Agent 已响应', '已生成新的算力意图分析。')
  }

  const updateJobStatus = (id: string, status: ComputeJob['status']) => {
    setJobs(current => current.map(job => job.id === id ? { ...job, status } : job))
    toast(status === 'paused' ? '任务已暂停' : '任务已继续', id)
  }

  const launchRuntime = async (runtime: RuntimeDefinition) => {
    const result = await mockApi.submitRuntime(runtime)
    setJobs(current => [{ id: result.jobId, name: `${runtime.id}-workspace`, runtime: `${runtime.name} ${runtime.version}`, gpu: runtime.gpu, queue: 'research', status: 'queued', progress: 0, duration: '--', owner: 'Yun Chen', cost: 0 }, ...current])
    toast('Workspace 已提交', `${runtime.name} 正在等待 GPU 调度。`)
  }

  const value = useMemo(() => ({ route, navigate, sessions, activeSession, selectSession: setActiveSessionId, sendMessage, jobs, updateJobStatus, runtimes: runtimesSeed, launchRuntime, toasts }), [route, sessions, activeSession, jobs, toasts])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
