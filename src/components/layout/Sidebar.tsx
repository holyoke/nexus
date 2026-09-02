import { MoreHorizontal, Settings, Zap } from 'lucide-react'
import { useApp } from '../../core/AppContext'
import { modules } from '../../modules/registry'
import { Brand } from './Brand'

export function Sidebar() {
  const { route, navigate } = useApp()
  return <aside className="sidebar"><Brand /><nav>
    {(['create', 'manage'] as const).map(section => <div className="nav-group" key={section}>
      <span className="nav-label">{section === 'create' ? 'CREATE' : 'MANAGE'}</span>
      {modules.filter(module => module.section === section).map(module => <button className={route === module.id ? 'active' : ''} onClick={() => navigate(module.id)} key={module.id}><module.icon />{module.label}{module.badge && <em>{module.badge}</em>}</button>)}
    </div>)}
  </nav><div className="sidebar-bottom">
    <div className="quota-card"><span><Zap /> 本月算力</span><strong>126.4 <small>GPU h</small></strong><i><b /></i><small>配额已使用 63%</small></div>
    <button><Settings />平台设置</button><div className="profile"><div className="avatar">GL</div><div><strong>Grail Lee</strong><span>Creator workspace</span></div><MoreHorizontal /></div>
  </div></aside>
}
