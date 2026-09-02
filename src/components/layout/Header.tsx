import { Bell, Plus, Search } from 'lucide-react'
import { useApp } from '../../core/AppContext'
import { modules } from '../../modules/registry'

export function Header() {
  const { route, navigate } = useApp()
  const active = modules.find(module => module.id === route)
  return <header className="header"><div><span>Project / Embodied Intelligence</span><h1>{active?.label}</h1></div><div className="header-actions"><div className="status-pill"><i /> Cluster healthy</div><button className="icon-button"><Search /></button><button className="icon-button notification"><Bell /><b /></button><button className="new-task" onClick={() => navigate('sessions')}><Plus /> 新建任务</button></div></header>
}
