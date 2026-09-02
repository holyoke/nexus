import { Boxes, Cpu, Database, LayoutGrid, MessageSquareText, Settings, TerminalSquare, UserRound, Workflow } from 'lucide-react'
import type { ModuleDefinition } from '../core/types'
import { ArtifactsPage } from './artifacts/ArtifactsPage'
import { DiscoverPage } from './discover/DiscoverPage'
import { JobsPage } from './jobs/JobsPage'
import { ProfilePage } from './profile/ProfilePage'
import { ResourcesPage } from './resources/ResourcesPage'
import { RuntimesPage } from './runtimes/RuntimesPage'
import { SessionsPage } from './sessions/SessionsPage'
import { SettingsPage } from './settings/SettingsPage'
import { WorkflowsPage } from './workflows/WorkflowsPage'

export const modules: ModuleDefinition[] = [
  { id: 'dashboard', label: '探索广场', section: 'create', icon: LayoutGrid, component: DiscoverPage },
  { id: 'workflows', label: '工作流', section: 'create', icon: Workflow, component: WorkflowsPage },
  { id: 'runtimes', label: '模型与 Runtime', section: 'create', icon: Boxes, component: RuntimesPage },
  { id: 'sessions', label: 'Agent 助手', section: 'create', icon: MessageSquareText, badge: '4', component: SessionsPage },
  { id: 'jobs', label: '运行记录', section: 'manage', icon: TerminalSquare, badge: '3', component: JobsPage },
  { id: 'artifacts', label: '数据与产物', section: 'manage', icon: Database, component: ArtifactsPage },
  { id: 'resources', label: '算力资源', section: 'manage', icon: Cpu, component: ResourcesPage },
  { id: 'settings', label: '平台设置', section: 'manage', icon: Settings, hidden: true, component: SettingsPage },
  { id: 'profile', label: '个人设置', section: 'manage', icon: UserRound, hidden: true, component: ProfilePage },
]
