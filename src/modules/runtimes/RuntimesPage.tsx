import { ArrowRight, Bot, Box, BrainCircuit, Check, Cpu, Download, Plus, Search, ShieldCheck, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useApp } from '../../core/AppContext'

const catalog = [
  { name: 'Qwen3-14B', type: '模型', category: 'LLM', desc: '高性能中英双语基座模型，适合微调、推理和 Agent。', meta: '14.8B · BF16 / AWQ', icon: BrainCircuit, color: '#6c8cff', tags: ['Train', 'Inference'], pulls: '18.2k' },
  { name: 'DeepSeek-R1 Distill', type: '模型', category: 'LLM', desc: '面向推理任务的蒸馏模型，支持 LoRA 与高吞吐服务。', meta: '7B · BF16 / GGUF', icon: BrainCircuit, color: '#8c7cff', tags: ['Reasoning', 'LoRA'], pulls: '12.6k' },
  { name: 'Unsloth', type: 'Runtime', category: '训练', desc: '高效 LLM 微调 Runtime，支持 LoRA、QLoRA 与 GRPO。', meta: '2026.8 · CUDA 13', icon: Bot, color: '#9cff45', tags: ['QLoRA', 'GRPO'], pulls: '8.4k' },
  { name: 'vLLM', type: 'Runtime', category: '推理', desc: '高吞吐 LLM Serving，提供 OpenAI 兼容 API。', meta: '0.10 · CUDA 13', icon: Cpu, color: '#45caff', tags: ['Serving', 'Paged Attention'], pulls: '10.8k' },
  { name: 'Isaac Sim + Lab', type: 'Runtime', category: '仿真', desc: '机器人仿真、合成数据以及强化学习的一体环境。', meta: '5.0 / 2.3 · RTX', icon: Box, color: '#ff9f43', tags: ['ROS2', 'PPO', 'Simulation'], pulls: '4.1k' },
  { name: 'ComfyUI', type: 'Runtime', category: '视觉', desc: '图像与视频生成工作流 Runtime，支持自定义节点。', meta: 'Stable · CUDA 13', icon: Sparkles, color: '#d17cff', tags: ['Image', 'Video'], pulls: '21.3k' },
]

export function RuntimesPage() {
  const { navigate } = useApp()
  const [tab, setTab] = useState('全部')
  const [query, setQuery] = useState('')
  const visible = useMemo(() => catalog.filter(item => (tab === '全部' || item.type === tab) && `${item.name} ${item.category} ${item.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [tab, query])
  return <div className="page-content model-market">
    <section className="market-title"><div><span className="eyebrow"><ShieldCheck /> VERIFIED REGISTRY</span><h2>模型与 Runtime</h2><p>工作流节点的能力来源。选择模型或运行框架，一键添加到你的画布。</p></div><button onClick={() => navigate('workflows')}><Plus /> 创建自定义 Runtime</button></section>
    <section className="featured-runtime"><div><span>FEATURED · EMBODIED AI</span><h2>Isaac Sim + Isaac Lab</h2><p>从交互式仿真到 Headless 强化学习，在 Kubernetes GPU 上运行完整具身工作流。</p><button onClick={() => navigate('workflows')}>添加到工作流 <ArrowRight /></button></div><div className="runtime-orbit"><Box /><i /><b>SIM</b><span>ROS2</span><em>RL</em></div></section>
    <div className="market-tools"><div className="filter-tabs">{['全部', '模型', 'Runtime'].map(item => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</button>)}</div><label><Search /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索模型或 Runtime" /></label></div>
    <div className="catalog-grid">{visible.map(item => <article key={item.name} className="catalog-card"><header><i style={{ color: item.color, background: `${item.color}16` }}><item.icon /></i><span>{item.type}</span><em><Check /> Verified</em></header><h3>{item.name}</h3><p>{item.desc}</p><small>{item.meta}</small><div>{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div><footer><span><Download /> {item.pulls}</span><button onClick={() => navigate('workflows')}><Plus /> 添加节点</button></footer></article>)}</div>
  </div>
}
