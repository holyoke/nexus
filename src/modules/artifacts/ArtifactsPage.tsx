import { Box, Database, Download, FileJson, Folder, HardDrive, MoreHorizontal, Search, Upload } from 'lucide-react'
import { useState } from 'react'

const items = [
  { name: 'qwen3-8b-lora', type: 'Model artifact', size: '4.8 GB', updated: '刚刚', icon: Box, tone: 'violet' },
  { name: 'train.jsonl', type: 'Dataset', size: '284 MB', updated: '2 小时前', icon: FileJson, tone: 'cyan' },
  { name: 'humanoid-policy.pt', type: 'Policy checkpoint', size: '92 MB', updated: '昨天', icon: Box, tone: 'green' },
  { name: 'isaac-assets', type: 'Asset folder', size: '18.6 GB', updated: '3 天前', icon: Folder, tone: 'amber' },
  { name: 'eval-reports', type: 'Report folder', size: '42 MB', updated: '4 天前', icon: Folder, tone: 'blue' },
]

export function ArtifactsPage() {
  const [view, setView] = useState<'all'|'datasets'|'artifacts'>('all')
  return <div className="artifacts-page page-content"><div className="page-toolbar"><div><h2>Data & Artifacts</h2><p>跨 Workspace 持久化数据、模型、策略与评测报告。</p></div><button className="primary-action"><Upload /> 上传数据</button></div><div className="storage-banner panel"><div><HardDrive/><div><strong>Project Storage</strong><span>CephFS · embodied-intelligence</span></div></div><div className="storage-meter"><div><span>628 GB / 1 TB</span><strong>62.8%</strong></div><div className="progress"><i style={{width:'62.8%'}}/></div></div></div><section className="artifacts-panel panel"><div className="table-tools"><div className="search-field"><Search/><input placeholder="搜索数据或产物…" /></div><div className="filter-tabs">{(['all','datasets','artifacts'] as const).map(item=><button className={view===item?'active':''} onClick={()=>setView(item)} key={item}>{item==='all'?'全部':item==='datasets'?'数据集':'产物'}</button>)}</div></div><div className="artifact-grid">{items.map(item=><article key={item.name}><div className={`artifact-icon ${item.tone}`}><item.icon/></div><button><MoreHorizontal/></button><strong>{item.name}</strong><span>{item.type}</span><footer><small>{item.size} · {item.updated}</small><button><Download/></button></footer></article>)}</div></section></div>
}
