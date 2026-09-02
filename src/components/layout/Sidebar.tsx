import { MoreHorizontal, Settings } from 'lucide-react'
import { useApp } from '../../core/AppContext'
import { modules } from '../../modules/registry'
import { Brand } from './Brand'

export function Sidebar() {
  const { route, navigate } = useApp()
  return <aside className="sidebar"><Brand /><nav>
    {(['workspace', 'platform'] as const).map(section => <div className="nav-group" key={section}>
      <span className="nav-label">{section === 'workspace' ? 'WORKSPACE' : 'PLATFORM'}</span>
      {modules.filter(module => module.section === section).map(module => <button className={route === module.id ? 'active' : ''} onClick={() => navigate(module.id)} key={module.id}><module.icon />{module.label}{module.badge && <em>{module.badge}</em>}</button>)}
    </div>)}
  </nav><div className="sidebar-bottom"><button><Settings />平台设置</button><div className="profile"><div className="avatar">YC</div><div><strong>Yun Chen</strong><span>Research Team</span></div><MoreHorizontal /></div></div></aside>
}
