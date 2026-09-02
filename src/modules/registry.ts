import { Box, Cpu, Database, LayoutDashboard, Library, MessageSquareText, TerminalSquare, Workflow } from 'lucide-react'
import type { ModuleDefinition } from '../core/types'
import { ArtifactsPage } from './artifacts/ArtifactsPage'
import { DashboardPage } from './dashboard/DashboardPage'
import { JobsPage } from './jobs/JobsPage'
import { ResourcesPage } from './resources/ResourcesPage'
import { RuntimesPage } from './runtimes/RuntimesPage'
import { SessionsPage } from './sessions/SessionsPage'
import { WorkflowsPage } from './workflows/WorkflowsPage'

export const modules: ModuleDefinition[] = [
  { id: 'dashboard', label: '控制台', section: 'workspace', icon: LayoutDashboard, component: DashboardPage },
  { id: 'sessions', label: 'Agent 会话', section: 'workspace', icon: MessageSquareText, badge: '4', component: SessionsPage },
  { id: 'workflows', label: '工作流', section: 'workspace', icon: Workflow, component: WorkflowsPage },
  { id: 'jobs', label: '任务与运行', section: 'workspace', icon: TerminalSquare, badge: '3', component: JobsPage },
  { id: 'resources', label: '算力资源', section: 'platform', icon: Cpu, component: ResourcesPage },
  { id: 'runtimes', label: 'Runtime 市场', section: 'platform', icon: Library, component: RuntimesPage },
  { id: 'artifacts', label: '数据与产物', section: 'platform', icon: Database, component: ArtifactsPage },
]
