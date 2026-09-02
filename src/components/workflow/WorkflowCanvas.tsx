import { Bot, Box, BrainCircuit, Check, ChevronDown, CircleDot, Cpu, Database, Gauge, GripHorizontal, Maximize2, Play, Plus, Rocket, Save, Search, Sparkles, Trash2, X, ZoomIn, ZoomOut } from 'lucide-react'
import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from 'react'

type Kind = 'data' | 'model' | 'runtime' | 'compute' | 'task' | 'output'
type Field = { key: string; label: string; type: 'text' | 'textarea' | 'select' | 'number' | 'toggle'; value: string | number | boolean; options?: string[] }
type Node = { id: string; kind: Kind; title: string; subtitle: string; x: number; y: number; inputs: string[]; outputs: string[]; fields: Field[]; state?: 'ready' | 'running' | 'queued' }
type Edge = { from: string; to: string }

const icons = { data: Database, model: BrainCircuit, runtime: Bot, compute: Cpu, task: Gauge, output: Box }
const models = ['Qwen3-8B', 'Qwen3-14B', 'DeepSeek-R1-Distill-7B', 'Llama-3.1-8B-Instruct']
const runtimes = ['Unsloth 2026.8', 'PyTorch 2.8 CUDA', 'vLLM 0.10', 'Isaac Lab 2.3', 'ComfyUI Stable']

const seeds: Node[] = [
  { id: 'data', kind: 'data', title: '训练数据集', subtitle: 'Dataset Input', x: 36, y: 54, inputs: [], outputs: ['DATASET'], fields: [{ key: 'path', label: '数据路径', type: 'text', value: '/data/train.jsonl' }, { key: 'split', label: '数据切分', type: 'select', value: 'train', options: ['train', 'validation', 'test'] }], state: 'ready' },
  { id: 'model', kind: 'model', title: '加载基础模型', subtitle: 'Model Loader', x: 36, y: 270, inputs: [], outputs: ['MODEL', 'TOKENIZER'], fields: [{ key: 'model', label: '模型', type: 'select', value: 'Qwen3-8B', options: models }, { key: 'precision', label: '精度', type: 'select', value: '4-bit NF4', options: ['BF16', 'FP16', '4-bit NF4'] }], state: 'ready' },
  { id: 'prompt', kind: 'data', title: '提示词模板', subtitle: 'Prompt Template', x: 36, y: 486, inputs: ['TOKENIZER'], outputs: ['PROMPT'], fields: [{ key: 'system', label: '系统提示词', type: 'textarea', value: '你是一名专业、可靠的 AI 助手。' }, { key: 'template', label: '用户模板', type: 'textarea', value: '{{ instruction }}\n\n{{ response }}' }], state: 'ready' },
  { id: 'train', kind: 'runtime', title: 'Unsloth QLoRA', subtitle: 'Training Runtime', x: 365, y: 155, inputs: ['MODEL', 'DATASET', 'PROMPT', 'GPU'], outputs: ['ADAPTER'], fields: [{ key: 'runtime', label: 'Runtime', type: 'select', value: 'Unsloth 2026.8', options: runtimes }, { key: 'rank', label: 'LoRA Rank', type: 'number', value: 32 }, { key: 'epoch', label: '训练轮次', type: 'number', value: 3 }, { key: 'checkpoint', label: '梯度检查点', type: 'toggle', value: true }], state: 'running' },
  { id: 'gpu', kind: 'compute', title: 'GPU 算力', subtitle: 'Kubernetes Compute', x: 365, y: 488, inputs: [], outputs: ['GPU'], fields: [{ key: 'gpu', label: 'GPU 规格', type: 'select', value: 'RTX PRO 6000 · 96GB', options: ['Auto · ≥24GB', 'RTX 4090 · 24GB', 'RTX PRO 6000 · 96GB', 'NVIDIA H200 · 141GB'] }, { key: 'count', label: 'GPU 数量', type: 'number', value: 1 }, { key: 'queue', label: '队列', type: 'select', value: 'Normal', options: ['Low', 'Normal', 'High'] }], state: 'running' },
  { id: 'eval', kind: 'task', title: '模型评测', subtitle: 'Evaluation', x: 710, y: 155, inputs: ['MODEL'], outputs: ['SCORE'], fields: [{ key: 'benchmark', label: '评测集', type: 'select', value: 'MMLU + C-Eval', options: ['MMLU + C-Eval', 'GSM8K', 'Custom'] }, { key: 'samples', label: '样本数', type: 'number', value: 1000 }], state: 'queued' },
  { id: 'serve', kind: 'runtime', title: 'vLLM 推理服务', subtitle: 'Model Serving', x: 1015, y: 155, inputs: ['MODEL', 'SCORE'], outputs: ['ENDPOINT'], fields: [{ key: 'runtime', label: 'Runtime', type: 'select', value: 'vLLM 0.10', options: runtimes }, { key: 'replica', label: '副本数', type: 'number', value: 1 }], state: 'queued' },
  { id: 'output', kind: 'output', title: '发布产物', subtitle: 'Artifacts & API', x: 1015, y: 430, inputs: ['ENDPOINT'], outputs: [], fields: [{ key: 'name', label: '模型名称', type: 'text', value: 'qwen3-support-v1' }, { key: 'visibility', label: '可见性', type: 'select', value: '私有', options: ['私有', '团队', '公开'] }], state: 'queued' },
]
const seedEdges: Edge[] = [{ from: 'data', to: 'train' }, { from: 'model', to: 'prompt' }, { from: 'model', to: 'train' }, { from: 'prompt', to: 'train' }, { from: 'gpu', to: 'train' }, { from: 'train', to: 'eval' }, { from: 'eval', to: 'serve' }, { from: 'serve', to: 'output' }]
const library: Array<{ kind: Kind; title: string; subtitle: string; group: string }> = [
  { kind: 'model', title: '加载模型', subtitle: 'Hugging Face / Registry', group: '模型' }, { kind: 'data', title: '数据集', subtitle: 'Dataset / Object Storage', group: '输入' }, { kind: 'data', title: '提示词', subtitle: 'Prompt / Variables', group: '输入' },
  { kind: 'runtime', title: '训练 Runtime', subtitle: 'Unsloth / PyTorch', group: 'Runtime' }, { kind: 'runtime', title: '推理 Runtime', subtitle: 'vLLM / SGLang', group: 'Runtime' }, { kind: 'runtime', title: 'Isaac 仿真', subtitle: 'Isaac Sim / Lab', group: 'Runtime' },
  { kind: 'compute', title: 'GPU 算力', subtitle: 'Kubernetes / Kueue', group: '算力' }, { kind: 'task', title: '模型评测', subtitle: 'Benchmark / Guardrail', group: '处理' }, { kind: 'output', title: '发布 API', subtitle: 'Endpoint / Artifact', group: '输出' },
]

function Widget({ field, onChange }: { field: Field; onChange: (v: string | number | boolean) => void }) {
  if (field.type === 'textarea') return <textarea value={String(field.value)} onChange={e => onChange(e.target.value)} />
  if (field.type === 'select') return <select value={String(field.value)} onChange={e => onChange(e.target.value)}>{field.options?.map(o => <option key={o}>{o}</option>)}</select>
  if (field.type === 'toggle') return <button className={`switch ${field.value ? 'on' : ''}`} onClick={() => onChange(!field.value)}><i /></button>
  return <input type={field.type === 'number' ? 'number' : 'text'} value={String(field.value)} onChange={e => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)} />
}

export function WorkflowCanvas({ editable = false }: { editable?: boolean }) {
  const [nodes, setNodes] = useState(seeds)
  const [edges, setEdges] = useState(seedEdges)
  const [selectedId, setSelectedId] = useState('train')
  const [connecting, setConnecting] = useState<string | null>(null)
  const [zoom, setZoom] = useState(editable ? .68 : .78)
  const [pan, setPan] = useState({ x: 18, y: 18 })
  const [query, setQuery] = useState('')
  const [running, setRunning] = useState(false)
  const [saved, setSaved] = useState(true)
  const drag = useRef<{ id: string; px: number; py: number; x: number; y: number } | null>(null)
  const panning = useRef<{ px: number; py: number; x: number; y: number } | null>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const selected = nodes.find(n => n.id === selectedId)
  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes])
  const matches = library.filter(n => `${n.title} ${n.subtitle}`.toLowerCase().includes(query.toLowerCase()))

  const change = (id: string, key: string, value: Field['value']) => { setNodes(v => v.map(n => n.id === id ? { ...n, fields: n.fields.map(f => f.key === key ? { ...f, value } : f) } : n)); setSaved(false) }
  const startDrag = (e: ReactPointerEvent, node: Node) => { e.stopPropagation(); drag.current = { id: node.id, px: e.clientX, py: e.clientY, x: node.x, y: node.y }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); setSelectedId(node.id) }
  const startPan = (e: ReactPointerEvent) => { if ((e.target as HTMLElement).closest('.studio-node,.canvas-ui')) return; panning.current = { px: e.clientX, py: e.clientY, x: pan.x, y: pan.y }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId) }
  const move = (e: ReactPointerEvent) => { if (drag.current) { const d = drag.current; setNodes(v => v.map(n => n.id === d.id ? { ...n, x: d.x + (e.clientX - d.px) / zoom, y: d.y + (e.clientY - d.py) / zoom } : n)); setSaved(false) } else if (panning.current) { const p = panning.current; setPan({ x: p.x + e.clientX - p.px, y: p.y + e.clientY - p.py }) } }
  const end = () => { drag.current = null; panning.current = null }
  const wheel = (e: ReactWheelEvent) => { e.preventDefault(); setZoom(v => Math.min(1.5, Math.max(.35, v * (e.deltaY < 0 ? 1.08 : .92)))) }
  const addNode = (item: typeof library[number]) => { const id = `${item.kind}-${Date.now()}`; const fields: Field[] = item.kind === 'model' ? [{ key: 'model', label: '模型', type: 'select', value: models[0], options: models }] : item.kind === 'runtime' ? [{ key: 'runtime', label: 'Runtime', type: 'select', value: runtimes[0], options: runtimes }] : item.kind === 'compute' ? [{ key: 'gpu', label: 'GPU 规格', type: 'select', value: 'Auto · ≥24GB', options: ['Auto · ≥24GB', 'RTX PRO 6000 · 96GB'] }] : [{ key: 'name', label: '名称', type: 'text', value: item.title }]; setNodes(v => [...v, { id, kind: item.kind, title: item.title, subtitle: item.subtitle, x: 580, y: 360, inputs: item.kind === 'data' || item.kind === 'model' || item.kind === 'compute' ? [] : ['INPUT'], outputs: item.kind === 'output' ? [] : ['OUTPUT'], fields, state: 'ready' }]); setSelectedId(id); setSaved(false) }
  const port = (node: Node, side: 'in' | 'out') => { if (side === 'out') return setConnecting(connecting === node.id ? null : node.id); if (connecting && connecting !== node.id) { setEdges(v => [...v, { from: connecting, to: node.id }]); setConnecting(null); setSaved(false) } }
  const fit = () => { setZoom(.68); setPan({ x: 18, y: 18 }) }

  return <section className={`flow-studio ${editable ? 'is-editable' : ''}`}>
    <div className="flow-toolbar"><div><span className="live-dot" /> <strong>Qwen3 微调与部署</strong><em>{nodes.length} nodes · {edges.length} links</em></div><div><button><Sparkles /> Agent 生成</button><button onClick={() => setSaved(true)}>{saved ? <Check /> : <Save />} {saved ? '已保存' : '保存版本'}</button><button className="run-flow" onClick={() => setRunning(v => !v)}>{running ? <CircleDot /> : <Play />} {running ? '运行中 24%' : '运行工作流'}</button></div></div>
    <div className="flow-body">
      {editable && <aside className="node-rail"><div className="rail-head"><strong>节点</strong><button><Plus /></button></div><label><Search /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索节点" /></label><div className="rail-groups">{['输入', '模型', 'Runtime', '算力', '处理', '输出'].map(group => <section key={group}><span>{group}<ChevronDown /></span>{matches.filter(n => n.group === group).map((item, i) => { const Icon = icons[item.kind]; return <button key={`${item.title}-${i}`} onClick={() => addNode(item)}><i className={item.kind}><Icon /></i><b>{item.title}<small>{item.subtitle}</small></b><Plus /></button> })}</section>)}</div></aside>}
      <div className="flow-canvas" ref={canvas} onPointerDown={startPan} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onWheel={wheel}>
        <div className="flow-stage" style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})` }}><svg viewBox="0 0 1400 800">{edges.map((edge, i) => { const a = nodeMap.get(edge.from), b = nodeMap.get(edge.to); if (!a || !b) return null; const x1 = a.x + 254, y1 = a.y + 82, x2 = b.x, y2 = b.y + 70, bend = Math.max(70, Math.abs(x2 - x1) / 2); return <path key={`${edge.from}-${edge.to}-${i}`} d={`M${x1} ${y1} C${x1 + bend} ${y1},${x2 - bend} ${y2},${x2} ${y2}`} className={edge.from === 'train' ? 'active' : ''} /> })}</svg>
          {nodes.map(node => { const Icon = icons[node.kind]; return <article key={node.id} className={`studio-node ${node.kind} ${selectedId === node.id ? 'selected' : ''}`} style={{ left: node.x, top: node.y }} onPointerDown={() => setSelectedId(node.id)}><header onPointerDown={e => startDrag(e, node)}><i><Icon /></i><div><strong>{node.title}</strong><small>{node.subtitle}</small></div><GripHorizontal /></header><div className="node-port-line"><button disabled={!node.inputs.length} onClick={() => port(node, 'in')}><i />{node.inputs.join(' · ') || 'SOURCE'}</button><button className={connecting === node.id ? 'linking' : ''} disabled={!node.outputs.length} onClick={() => port(node, 'out')}>{node.outputs.join(' · ') || 'SINK'}<i /></button></div><div className="node-fields">{node.fields.slice(0, 2).map(field => <label key={field.key}><span>{field.label}</span><Widget field={field} onChange={v => change(node.id, field.key, v)} /></label>)}</div>{node.state && <footer><i /> {node.state === 'running' ? 'Running' : node.state === 'queued' ? 'Queued' : 'Ready'}</footer>}</article> })}
        </div>
        {connecting && <div className="link-tip canvas-ui"><CircleDot /> 点击目标节点输入端口完成连线</div>}
        <div className="canvas-zoom canvas-ui"><button onClick={() => setZoom(v => Math.max(.35, v - .1))}><ZoomOut /></button><button onClick={fit}>{Math.round(zoom * 100)}%</button><button onClick={() => setZoom(v => Math.min(1.5, v + .1))}><ZoomIn /></button><button onClick={fit}><Maximize2 /></button></div>
        <div className="flow-minimap canvas-ui">{nodes.map(n => <i key={n.id} style={{ left: `${n.x / 15}%`, top: `${n.y / 9}%` }} />)}</div>
        {running && <div className="run-console canvas-ui"><span><CircleDot /> RUN #NF-2084</span><strong>正在执行 Unsloth QLoRA</strong><em>GPU 91% · VRAM 42.6 / 96 GB · ETA 1h 42m</em><i><b /></i></div>}
      </div>
      {editable && selected && <aside className="node-config"><header><div><span>节点配置</span><small>NODE INSPECTOR</small></div><button onClick={() => setSelectedId('')}><X /></button></header><div className="config-node-title"><i className={selected.kind}>{(() => { const I = icons[selected.kind]; return <I /> })()}</i><div><strong>{selected.title}</strong><small>{selected.subtitle} · {selected.id}</small></div></div><nav><button className="active">参数</button><button>输入/输出</button><button>文档</button></nav><div className="config-scroll"><section><span>节点参数</span>{selected.fields.map(field => <label key={field.key}><b>{field.label}</b><Widget field={field} onChange={v => change(selected.id, field.key, v)} /></label>)}</section><section><span>执行设置</span><label><b>执行策略</b><select defaultValue="agent"><option value="agent">Agent 托管</option><option value="manual">手动执行</option></select></label><label><b>失败策略</b><select defaultValue="retry"><option value="retry">诊断并重试</option><option value="stop">立即停止</option></select></label></section>{selected.kind === 'compute' && <div className="cost-card"><Cpu /><div><strong>预计 ¥8.6 / 小时</strong><small>队列等待约 2 分钟</small></div></div>}</div><footer><button onClick={() => { if (!seeds.some(n => n.id === selected.id)) setNodes(v => v.filter(n => n.id !== selected.id)) }}><Trash2 /> 删除</button><button onClick={() => setSaved(true)}><Save /> 应用配置</button></footer></aside>}
    </div>
    {editable && <div className="flow-status"><span><i /> Kueue connected</span><span>GPU 配额 8 / 12</span><span>预计费用 ¥20.64</span><button><Rocket /> 发布为应用 / API</button></div>}
  </section>
}
