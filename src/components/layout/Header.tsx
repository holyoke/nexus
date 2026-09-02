import { Bell, ChevronDown, Moon, Plus, Search, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useApp } from '../../core/AppContext'
import { modules } from '../../modules/registry'

type Theme = 'dark' | 'light'

export function Header() {
  const { route, navigate } = useApp()
  const active = modules.find(module => module.id === route)
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('nexus-theme') as Theme) || 'dark')
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('nexus-theme', theme) }, [theme])
  return <header className="header product-header">
    <div className="header-project"><span>Grail workspace <ChevronDown /></span><h1>{active?.label}</h1></div>
    <label className="global-search"><Search /><input placeholder="搜索模板、模型、Runtime 或工作流" /><kbd>⌘ K</kbd></label>
    <div className="header-actions"><div className="gpu-available"><i /> 8 GPU 可用</div><button className="icon-button theme-toggle" title={theme === 'dark' ? '切换为高对比度白色模式' : '切换为黑色模式'} onClick={() => setTheme(value => value === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun /> : <Moon />}</button><button className="icon-button notification"><Bell /><b /></button><button className="new-task" onClick={() => navigate('workflows')}><Plus /> 新建工作流</button></div>
  </header>
}
