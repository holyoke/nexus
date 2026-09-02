import { ArrowRight, Bot, Box, BrainCircuit, ChevronRight, Clock3, Cpu, Database, Play, Search, Sparkles, Star, Workflow, X } from 'lucide-react'
import { useMemo, useState, type CSSProperties } from 'react'
import { useApp } from '../../core/AppContext'

type Template = { id: string; title: string; summary: string; category: string; runtime: string; author: string; runs: string; time: string; nodes: number; color: string; tags: string[] }

const templates: Template[] = [
  { id: 'qwen-qlora', title: 'Qwen3 企业知识 QLoRA', summary: '数据清洗、提示词模板、Unsloth 微调、评测与 GGUF 导出。', category: '模型训练', runtime: 'Unsloth', author: 'Nexus Official', runs: '2.8k', time: '2.4h', nodes: 9, color: '#9cff45', tags: ['Qwen3', 'LoRA', '单卡'] },
  { id: 'rag-serving', title: 'RAG 知识库与推理服务', summary: '文档向量化、召回评测并发布为 OpenAI 兼容 API。', category: '模型推理', runtime: 'vLLM', author: 'Flow Lab', runs: '1.6k', time: '12m', nodes: 11, color: '#6c8cff', tags: ['RAG', 'vLLM', 'API'] },
  { id: 'humanoid-ppo', title: 'Humanoid Locomotion PPO', summary: '从机器人资产到 Isaac Lab 并行训练、评测与策略导出。', category: '具身仿真', runtime: 'Isaac Lab', author: 'Robotics Lab', runs: '986', time: '5.8h', nodes: 8, color: '#ff9f43', tags: ['PPO', 'Isaac Lab', '4096 Envs'] },
  { id: 'vlm-sft', title: '多模态 VLM 指令微调', summary: '图片数据集预处理、SFT 训练、基准评测和模型登记。', category: '模型训练', runtime: 'PyTorch', author: 'Vision Stack', runs: '742', time: '4.1h', nodes: 10, color: '#d17cff', tags: ['VLM', 'SFT', 'H200'] },
  { id: 'sim-real', title: 'Sim-to-Real 数据闭环', summary: '场景随机化、合成数据生成、感知训练和仿真回放。', category: '具身仿真', runtime: 'Isaac Sim', author: 'Nexus Official', runs: '635', time: '3.6h', nodes: 13, color: '#20c997', tags: ['Isaac Sim', 'ROS2', 'SDG'] },
  { id: 'comfy-video', title: '产品视频批量生成', summary: '提示词、视觉模型、ControlNet 与视频超分的一体工作流。', category: '视觉创作', runtime: 'ComfyUI', author: 'Studio X', runs: '4.2k', time: '8m', nodes: 16, color: '#ff6680', tags: ['Video', 'ControlNet', 'Batch'] },
]

const categories = [
  { title: '模型训练', desc: '微调、强化学习与评测', icon: BrainCircuit, tone: '#9cff45' },
  { title: '模型推理', desc: '部署、RAG 与 API 服务', icon: Bot, tone: '#6c8cff' },
  { title: '具身仿真', desc: 'Isaac Sim / Lab 与 ROS2', icon: Box, tone: '#ff9f43' },
  { title: '视觉创作', desc: '图像、视频与 3D 工作流', icon: Sparkles, tone: '#d17cff' },
]

function MiniFlow({ color }: { color: string }) {
  return <div className="mini-flow" style={{ '--flow-color': color } as CSSProperties}>
    <span className="mf-node data"><Database /><b>Data</b></span><i /><span className="mf-node model"><BrainCircuit /><b>Model</b></span><i /><span className="mf-node runtime"><Cpu /><b>Runtime</b></span><i /><span className="mf-node output"><Box /><b>Output</b></span>
  </div>
}

export function DiscoverPage() {
  const { navigate } = useApp()
  const [category, setCategory] = useState('全部')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Template | null>(null)
  const visible = useMemo(() => templates.filter(item => (category === '全部' || item.category === category) && `${item.title} ${item.runtime} ${item.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [category, query])
  return <div className="page-content discover-page">
    <section className="discover-hero">
      <div className="hero-copy"><span className="eyebrow"><Sparkles /> AGENT-NATIVE FLOW STUDIO</span><h2>用节点，编排每一种<br /><em>AI 计算工作流</em></h2><p>像 ComfyUI 一样组合节点。从模型训练、推理部署到 Isaac 仿真，用同一张画布配置 Runtime、模型、数据与 GPU。</p><div><button className="hero-primary" onClick={() => navigate('workflows')}><Workflow /> 从空白画布开始</button><button className="hero-secondary" onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}>浏览模板 <ArrowRight /></button></div><small><i /> 模板可克隆、可修改、可发布为 API</small></div>
      <div className="hero-flow-card"><header><span><i /> Qwen3 微调与部署</span><em>Live canvas</em></header><div className="hero-canvas"><MiniFlow color="#9cff45" /><span className="flow-agent"><Sparkles /> Agent 正在优化显存配置</span></div><footer><span>9 nodes</span><span>RTX PRO 6000 × 1</span><button><Play /> Run</button></footer></div>
    </section>
    <section className="category-strip">{categories.map(item => <button key={item.title} onClick={() => { setCategory(item.title); document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' }) }}><span style={{ color: item.tone, background: `${item.tone}18` }}><item.icon /></span><div><strong>{item.title}</strong><small>{item.desc}</small></div><ChevronRight /></button>)}</section>
    <section className="template-section" id="templates"><div className="section-heading"><div><span>TEMPLATE MARKETPLACE</span><h2>从成熟工作流开始</h2><p>克隆一份模板，然后替换你的数据、模型和 Runtime。</p></div><button onClick={() => navigate('workflows')}>查看我的工作流 <ArrowRight /></button></div>
      <div className="template-toolbar"><div className="filter-tabs">{['全部', ...categories.map(item => item.title)].map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><label><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索模板" /></label></div>
      <div className="template-grid">{visible.map(item => <article className="template-card" key={item.id} onClick={() => setSelected(item)}><div className="template-preview"><MiniFlow color={item.color} /><span>{item.category}</span><button aria-label="收藏"><Star /></button></div><div className="template-body"><div className="template-runtime"><i style={{ background: item.color }} /> {item.runtime}<em>{item.nodes} nodes</em></div><h3>{item.title}</h3><p>{item.summary}</p><div className="template-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div><footer><span>{item.author}</span><span><Play /> {item.runs}</span><span><Clock3 /> {item.time}</span></footer></div></article>)}</div>
    </section>
    <section className="product-loop"><div><span>01</span><strong>选择模板或描述目标</strong><p>从空白、社区模板或自然语言开始。</p></div><i /><div><span>02</span><strong>配置节点与算力</strong><p>替换模型、Runtime、提示词和 GPU 约束。</p></div><i /><div><span>03</span><strong>运行、观测、复用</strong><p>排队执行、Agent 排错并发布工作流。</p></div></section>
    {selected && <div className="modal-backdrop" onMouseDown={() => setSelected(null)}><section className="template-modal" onMouseDown={event => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)}><X /></button><div className="modal-flow"><MiniFlow color={selected.color} /></div><span className="eyebrow">{selected.category} · {selected.runtime}</span><h2>{selected.title}</h2><p>{selected.summary}</p><div className="modal-metrics"><span><b>{selected.nodes}</b> 节点</span><span><b>{selected.runs}</b> 次运行</span><span><b>{selected.time}</b> 预计耗时</span></div><button className="hero-primary" onClick={() => navigate('workflows')}><Workflow /> 使用此模板</button></section></div>}
  </div>
}
