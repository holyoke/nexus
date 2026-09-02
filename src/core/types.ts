import type { ComponentType } from 'react'

export type RouteId = 'dashboard' | 'sessions' | 'workflows' | 'jobs' | 'resources' | 'runtimes' | 'artifacts'
export type JobStatus = 'running' | 'queued' | 'completed' | 'failed' | 'paused'

export interface ModuleDefinition {
  id: RouteId
  label: string
  section: 'workspace' | 'platform'
  icon: ComponentType<{ size?: number; className?: string }>
  badge?: string
  component: ComponentType
}

export interface AgentSession {
  id: string
  title: string
  runtime: string
  status: JobStatus | 'idle'
  updatedAt: string
  preview: string
  messages: ChatMessage[]
  trace: TraceEvent[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'agent'
  content: string
  time: string
}

export interface TraceEvent {
  id: string
  type: 'intent' | 'plan' | 'tool' | 'scheduler' | 'result' | 'approval'
  title: string
  detail: string
  time: string
  status: 'done' | 'running' | 'pending' | 'warning'
}

export interface ComputeJob {
  id: string
  name: string
  runtime: string
  gpu: string
  queue: string
  status: JobStatus
  progress: number
  duration: string
  owner: string
  cost: number
}

export interface RuntimeDefinition {
  id: string
  name: string
  category: 'LLM' | 'Embodied AI' | 'Inference' | 'Development'
  description: string
  version: string
  gpu: string
  color: string
  verified: boolean
  tags: string[]
}

export interface ToastMessage {
  id: number
  title: string
  detail: string
}
