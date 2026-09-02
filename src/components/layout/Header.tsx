import { Bell, ChevronDown, Plus, Search } from 'lucide-react'
import { useApp } from '../../core/AppContext'
import { modules } from '../../modules/registry'

export function Header() {
  const { route, navigate } = useApp()
  const active = modules.find(module => module.id === route)
  return <header className="header product-header">
    <div className="header-project"><span>Grail workspace <ChevronDown /></span><h1>{active?.label}</h1></div>
    <label className="global-search"><Search /><input placeholder="搜索模板、模型、Runtime 或工作流" /><kbd>⌘ K</kbd></label>
    <div className="header-actions"><div className="gpu-available"><i /> 8 GPU 可用</div><button className="icon-button notification"><Bell /><b /></button><button className="new-task" onClick={() => navigate('workflows')}><Plus /> 新建工作流</button></div>
  </header>
}
