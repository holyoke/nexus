import { useApp } from '../../core/AppContext'
import { modules } from '../../modules/registry'
import { ToastStack } from '../ToastStack'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function AppShell() {
  const { route } = useApp()
  const active = modules.find(module => module.id === route) ?? modules[0]
  const ActiveModule = active.component
  return <div className="app-shell"><Sidebar /><main><Header /><ActiveModule /></main><ToastStack /></div>
}
