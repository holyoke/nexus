import {
  Box,
  BrainCircuit,
  Check,
  CircleDot,
  Cpu,
  Database,
  Gauge,
  GitBranch,
  GripHorizontal,
  Maximize2,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent, useEffect, useMemo, useRef, useState } from 'react'

type NodeKind = 'input' | 'runtime' | 'compute' | 'task' | 'output'
type FieldKind = 'text' | 'textarea' | 'select' | 'number' | 'range' | 'toggle'

type NodeField = {
  key: string
  label: string
  kind: FieldKind
  value: string | number | boolean
  options?: string[]
  min?: number
  max?: number
  step?: number
  placeholder?: string
}

type StudioNode = {
  id: string
  type: NodeKind
  title: string
  subtitle: string
  x: number
  y: number
  status?: 'ready' | 'running' | 'queued'
  inputs: string[]
  outputs: string[]
  fields: NodeField[]
}

type Connection = { id: string; from: string; to: string }

const MODEL_OPTIONS = [
  'Qwen3-8B',
  'Qwen3-14B',
  'DeepSeek-R1-Distill-Qwen-7B',
  'Llama-3.1-8B-Instruct',
]

const initialNodes: StudioNode[] = [
  {
    id: 'dataset', type: 'input', title: 'Dataset', subtitle: '训练数据输入', x: 28, y: 55, status: 'ready',
    inputs: [], outputs: ['DATASET'], fields: [
      { key: 'path', label: 'Dataset path', kind: 'text', value: '/data/train.jsonl' },
      { key: 'split', label: 'Split', kind: 'select', value: 'train', options: ['train', 'validation', 'test'] },
    ],
  },
  {
    id: 'model', type: 'input', title: 'Load Model', subtitle: '基础模型', x: 28, y: 245, status: 'ready',
    inputs: [], outputs: ['MODEL', 'TOKENIZER'], fields: [
      { key: 'model', label: 'Model', kind: 'select', value: 'Qwen3-8B', options: MODEL_OPTIONS },
      { key: 'precision', label: 'Precision', kind: 'select', value: 'BF16', options: ['BF16', 'FP16', '4-bit NF4'] },
    ],
  },
  {
    id: 'prompt', type: 'input', title: 'Prompt Template', subtitle: '训练提示词', x: 28, y: 455, status: 'ready',
    inputs: ['TOKENIZER'], outputs: ['PROMPT'], fields: [
      { key: 'system', label: 'System prompt', kind: 'textarea', value: 'You are a helpful AI assistant.', placeholder: '输入系统提示词…' },
      { key: 'template', label: 'User template', kind: 'textarea', value: '### Instruction\n{{ instruction }}\n\n### Response\n{{ response }}', placeholder: '支持 {{ variable }} 变量' },
    ],
  },
  {
    id: 'train', type: 'runtime', title: 'Unsloth QLoRA', subtitle: '训练 Runtime', x: 330, y: 165, status: 'running',
    inputs: ['MODEL', 'DATASET', 'PROMPT', 'COMPUTE'], outputs: ['ADAPTER'], fields: [
      { key: 'runtime', label: 'Runtime', kind: 'select', value: 'Unsloth QLoRA', options: ['Unsloth QLoRA', 'Transformers LoRA', 'Full Fine-tuning'] },
      { key: 'rank', label: 'LoRA rank', kind: 'number', value: 32, min: 4, max: 256, step: 4 },
      { key: 'epochs', label: 'Epochs', kind: 'number', value: 3, min: 1, max: 20, step: 1 },
      { key: 'lr', label: 'Learning rate', kind: 'text', value: '2e-4' },
      { key: 'checkpointing', label: 'Gradient checkpointing', kind: 'toggle', value: true },
    ],
  },
  {
    id: 'compute', type: 'compute', title: 'GPU Compute', subtitle: 'Kubernetes 资源', x: 330, y: 470, status: 'running',
    inputs: [], outputs: ['COMPUTE'], fields: [
      { key: 'gpu', label: 'GPU model', kind: 'select', value: 'RTX PRO 6000 · 96GB', options: ['Auto · ≥24GB', 'RTX 4090 · 24GB', 'RTX PRO 6000 · 96GB', 'NVIDIA H200 · 141GB'] },
      { key: 'count', label: 'GPU count', kind: 'number', value: 1, min: 1, max: 8, step: 1 },
      { key: 'queue', label: 'Queue priority', kind: 'select', value: 'Normal', options: ['Low', 'Normal', 'High'] },
    ],
  },
  {
    id: 'eval', type: 'task', title: 'Evaluate', subtitle: '模型评测', x: 645, y: 165, status: 'queued',
    inputs: ['MODEL'], outputs: ['SCORE'], fields: [
      { key: 'benchmark', label: 'Benchmark', kind: 'select', value: 'MMLU + C-Eval', options: ['MMLU + C-Eval', 'GSM8K', 'Custom evaluator'] },
      { key: 'samples', label: 'Max samples', kind: 'number', value: 1000, min: 100, max: 10000, step: 100 },
    ],
  },
  {
    id: 'export', type: 'output', title: 'Export Model', subtitle: '交付产物', x: 930, y: 165, status: 'queued',
    inputs: ['MODEL', 'SCORE'], outputs: ['ARTIFACT'], fields: [
      { key: 'format', label: 'Format', kind: 'select', value: 'GGUF', options: ['GGUF', 'Safetensors', 'ONNX'] },
      { key: 'quant', label: 'Quantization', kind: 'select', value: 'Q4_K_M', options: ['Q4_K_M', 'Q5_K_M', 'Q8_0', 'None'] },
    ],
  },
]

const initialConnections: Connection[] = [
  { id: 'dataset-train', from: 'dataset', to: 'train' },
  { id: 'model-prompt', from: 'model', to: 'prompt' },
  { id: 'model-train', from: 'model', to: 'train' },
  { id: 'prompt-train', from: 'prompt', to: 'train' },
  { id: 'compute-train', from: 'compute', to: 'train' },
  { id: 'train-eval', from: 'train', to: 'eval' },
  { id: 'eval-export', from: 'eval', to: 'export' },
]

const nodeTemplates: Omit<StudioNode, 'id' | 'x' | 'y'>[] = [
  { type: 'input', title: 'Prompt Template', subtitle: '文本 / 动态提示词', status: 'ready', inputs: [], outputs: ['PROMPT'], fields: [{ key: 'prompt', label: 'Prompt', kind: 'textarea', value: '', placeholder: '输入提示词，支持 {{ variable }}…' }] },
  { type: 'input', title: 'Load Model', subtitle: '模型与精度', status: 'ready', inputs: [], outputs: ['MODEL'], fields: [{ key: 'model', label: 'Model', kind: 'select', value: MODEL_OPTIONS[0], options: MODEL_OPTIONS }] },
  { type: 'runtime', title: 'Runtime', subtitle: '训练 / 推理环境', status: 'ready', inputs: ['INPUT'], outputs: ['OUTPUT'], fields: [{ key: 'runtime', label: 'Runtime', kind: 'select', value: 'PyTorch CUDA', options: ['PyTorch CUDA', 'Unsloth QLoRA', 'Isaac Lab', 'vLLM'] }] },
  { type: 'compute', title: 'GPU Compute', subtitle: '算力约束', status: 'ready', inputs: [], outputs: ['COMPUTE'], fields: [{ key: 'gpu', label: 'GPU', kind: 'select', value: 'Auto · ≥24GB', options: ['Auto · ≥24GB', 'RTX 4090 · 24GB', 'RTX PRO 6000 · 96GB'] }] },
  { type: 'task', title: 'Evaluation', subtitle: '评测任务', status: 'ready', inputs: ['MODEL'], outputs: ['SCORE'], fields: [{ key: 'benchmark', label: 'Benchmark', kind: 'text', value: 'MMLU' }] },
  { type: 'output', title: 'Export', subtitle: '模型产物', status: 'ready', inputs: ['MODEL'], outputs: ['ARTIFACT'], fields: [{ key: 'format', label: 'Format', kind: 'select', value: 'Safetensors', options: ['Safetensors', 'GGUF', 'ONNX'] }] },
]

const icons = { input: Database, runtime: BrainCircuit, compute: Cpu, task: Gauge, output: Box }

function fieldSummary(field: NodeField) {
  if (typeof field.value === 'boolean') return field.value ? 'Enabled' : 'Disabled'
  return String(field.value)
}

function InlineWidget({ field, onChange }: { field: NodeField; onChange: (value: string | number | boolean) => void }) {
  const stop = (event: ReactPointerEvent) => event.stopPropagation()
  if (field.kind === 'textarea') return <textarea value={String(field.value)} placeholder={field.placeholder} onPointerDown={stop} onChange={event => onChange(event.target.value)} />
  if (field.kind === 'select') return <select value={String(field.value)} onPointerDown={stop} onChange={event => onChange(event.target.value)}>{field.options?.map(option => <option key={option}>{option}</option>)}</select>
  if (field.kind === 'toggle') return <button type="button" className={`inline-toggle ${field.value ? 'on' : ''}`} onPointerDown={stop} onClick={() => onChange(!field.value)}><i />{field.value ? 'Enabled' : 'Disabled'}</button>
  return <input type={field.kind === 'number' ? 'number' : 'text'} value={String(field.value)} min={field.min} max={field.max} step={field.step} placeholder={field.placeholder} onPointerDown={stop} onChange={event => onChange(field.kind === 'number' ? Number(event.target.value) : event.target.value)} />
}

function NodeCard({ node, selected, connecting, onSelect, onDragStart, onFieldChange, onPortClick }: {
  node: StudioNode
  selected: boolean
  connecting: boolean
  onSelect: () => void
  onDragStart: (event: ReactPointerEvent<HTMLDivElement>) => void
  onFieldChange: (key: string, value: string | number | boolean) => void
  onPortClick: (side: 'input' | 'output') => void
}) {
  const Icon = icons[node.type]
  const inlineFields = node.fields.slice(0, node.id === 'prompt' || node.title === 'Prompt Template' ? 2 : 2)
  return <div className={`flow-node comfy-node ${node.type} ${node.status ?? ''} ${selected ? 'selected' : ''}`} style={{ left: node.x, top: node.y }} onPointerDown={onSelect}>
    <div className="node-head node-drag-handle" onPointerDown={onDragStart}>
      <span className="node-icon"><Icon /></span><div><strong>{node.title}</strong><small>{node.subtitle}</small></div><GripHorizontal className="drag-glyph" /><MoreHorizontal />
    </div>
    <div className="node-ports">
      <button type="button" className="node-port-row input-row" onPointerDown={event => event.stopPropagation()} onClick={() => onPortClick('input')} disabled={!node.inputs.length}>
        <i className="port in" /><span>{node.inputs.join(' · ') || 'NO INPUT'}</span>
      </button>
      <button type="button" className={`node-port-row output-row ${connecting ? 'connecting' : ''}`} onPointerDown={event => event.stopPropagation()} onClick={() => onPortClick('output')} disabled={!node.outputs.length}>
        <span>{node.outputs.join(' · ') || 'NO OUTPUT'}</span><i className="port out" />
      </button>
    </div>
    <div className="node-widgets">
      {inlineFields.map(field => <label key={field.key}><span>{field.label}</span><InlineWidget field={field} onChange={value => onFieldChange(field.key, value)} /></label>)}
    </div>
  </div>
}

function ConfigField({ field, onChange }: { field: NodeField; onChange: (value: string | number | boolean) => void }) {
  if (field.kind === 'textarea') return <label className="config-field"><span>{field.label}</span><textarea value={String(field.value)} placeholder={field.placeholder} onChange={event => onChange(event.target.value)} /></label>
  if (field.kind === 'select') return <label className="config-field"><span>{field.label}</span><select value={String(field.value)} onChange={event => onChange(event.target.value)}>{field.options?.map(option => <option key={option}>{option}</option>)}</select></label>
  if (field.kind === 'toggle') return <label className="config-toggle"><span><strong>{field.label}</strong><small>{field.value ? 'Enabled' : 'Disabled'}</small></span><button type="button" className={field.value ? 'on' : ''} onClick={() => onChange(!field.value)}><i /></button></label>
  if (field.kind === 'range') return <label className="config-field"><span>{field.label}<em>{fieldSummary(field)}</em></span><input type="range" value={Number(field.value)} min={field.min} max={field.max} step={field.step} onChange={event => onChange(Number(event.target.value))} /></label>
  return <label className="config-field"><span>{field.label}</span><input type={field.kind === 'number' ? 'number' : 'text'} value={String(field.value)} min={field.min} max={field.max} step={field.step} placeholder={field.placeholder} onChange={event => onChange(field.kind === 'number' ? Number(event.target.value) : event.target.value)} /></label>
}

export function WorkflowCanvas({ editable = false }: { editable?: boolean }) {
  const [nodes, setNodes] = useState(initialNodes)
  const [connections, setConnections] = useState(initialConnections)
  const [selectedId, setSelectedId] = useState('train')
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const [showLibrary, setShowLibrary] = useState(false)
  const [search, setSearch] = useState('')
  const [zoom, setZoom] = useState(editable ? 0.72 : 0.82)
  const [pan, setPan] = useState({ x: 12, y: 10 })
  const [isPanning, setIsPanning] = useState(false)
  const [saved, setSaved] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ id: string; pointerX: number; pointerY: number; nodeX: number; nodeY: number } | null>(null)
  const panRef = useRef<{ pointerX: number; pointerY: number; panX: number; panY: number } | null>(null)

  const selected = nodes.find(node => node.id === selectedId) ?? nodes[0]
  const visibleTemplates = nodeTemplates.filter(template => `${template.title} ${template.subtitle}`.toLowerCase().includes(search.toLowerCase()))

  const nodeMap = useMemo(() => new Map(nodes.map(node => [node.id, node])), [nodes])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => fitView())
    return () => window.cancelAnimationFrame(frame)
    // The initial view only needs to fit once; later changes remain under user control.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function updateField(nodeId: string, key: string, value: string | number | boolean) {
    setNodes(current => current.map(node => node.id === nodeId ? { ...node, fields: node.fields.map(field => field.key === key ? { ...field, value } : field) } : node))
    setSaved(false)
  }

  function startDrag(event: ReactPointerEvent<HTMLDivElement>, node: StudioNode) {
    event.preventDefault()
    event.stopPropagation()
    setSelectedId(node.id)
    dragRef.current = { id: node.id, pointerX: event.clientX, pointerY: event.clientY, nodeX: node.x, nodeY: node.y }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moveDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (drag) {
      const dx = (event.clientX - drag.pointerX) / zoom
      const dy = (event.clientY - drag.pointerY) / zoom
      setNodes(current => current.map(node => node.id === drag.id ? { ...node, x: Math.max(8, Math.min(1060, drag.nodeX + dx)), y: Math.max(8, Math.min(620, drag.nodeY + dy)) } : node))
      return
    }
    const activePan = panRef.current
    if (activePan) setPan({ x: activePan.panX + event.clientX - activePan.pointerX, y: activePan.panY + event.clientY - activePan.pointerY })
  }

  function endDrag() {
    if (dragRef.current) setSaved(false)
    dragRef.current = null
    panRef.current = null
    setIsPanning(false)
  }

  function startPan(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 && event.button !== 1) return
    const target = event.target as Element
    if (target.closest('.comfy-node, .node-library-popover, .canvas-controls, .minimap, .connection-hint')) return
    event.preventDefault()
    panRef.current = { pointerX: event.clientX, pointerY: event.clientY, panX: pan.x, panY: pan.y }
    setIsPanning(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function setZoomAt(nextZoom: number, clientX?: number, clientY?: number) {
    const canvas = canvasRef.current
    if (!canvas) return
    const clampedZoom = Math.max(0.4, Math.min(1.6, nextZoom))
    const rect = canvas.getBoundingClientRect()
    const anchorX = (clientX ?? rect.left + rect.width / 2) - rect.left
    const anchorY = (clientY ?? rect.top + rect.height / 2) - rect.top
    const worldX = (anchorX - pan.x) / zoom
    const worldY = (anchorY - pan.y) / zoom
    setPan({ x: anchorX - worldX * clampedZoom, y: anchorY - worldY * clampedZoom })
    setZoom(clampedZoom)
  }

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    event.preventDefault()
    const factor = event.deltaY < 0 ? 1.1 : 0.9
    setZoomAt(zoom * factor, event.clientX, event.clientY)
  }

  function fitView() {
    const canvas = canvasRef.current
    if (!canvas || !nodes.length) return
    const minX = Math.min(...nodes.map(node => node.x))
    const minY = Math.min(...nodes.map(node => node.y))
    const maxX = Math.max(...nodes.map(node => node.x + 226))
    const maxY = Math.max(...nodes.map(node => node.y + (node.id === 'prompt' || node.title === 'Prompt Template' ? 245 : 205)))
    const boundsWidth = Math.max(1, maxX - minX)
    const boundsHeight = Math.max(1, maxY - minY)
    const padding = 34
    const nextZoom = Math.max(0.4, Math.min(1.15, Math.min((canvas.clientWidth - padding * 2) / boundsWidth, (canvas.clientHeight - padding * 2) / boundsHeight)))
    setZoom(nextZoom)
    setPan({
      x: (canvas.clientWidth - boundsWidth * nextZoom) / 2 - minX * nextZoom,
      y: (canvas.clientHeight - boundsHeight * nextZoom) / 2 - minY * nextZoom,
    })
  }

  function resetView() {
    setZoom(1)
    setPan({ x: 18, y: 18 })
  }

  function handlePort(node: StudioNode, side: 'input' | 'output') {
    if (side === 'output') {
      if (node.outputs.length) setConnectingFrom(current => current === node.id ? null : node.id)
      return
    }
    if (!connectingFrom || connectingFrom === node.id || !node.inputs.length) return
    setConnections(current => [...current, { id: `${connectingFrom}-${node.id}-${Date.now()}`, from: connectingFrom, to: node.id }])
    setConnectingFrom(null)
    setSaved(false)
  }

  function addNode(template: Omit<StudioNode, 'id' | 'x' | 'y'>) {
    const suffix = Date.now().toString(36).slice(-5)
    const node: StudioNode = { ...template, fields: template.fields.map(field => ({ ...field, options: field.options ? [...field.options] : undefined })), id: `${template.type}-${suffix}`, x: 420 + (nodes.length % 3) * 75, y: 90 + (nodes.length % 4) * 125 }
    setNodes(current => [...current, node])
    setSelectedId(node.id)
    setShowLibrary(false)
    setSaved(false)
  }

  function removeSelected() {
    if (!selected || initialNodes.some(node => node.id === selected.id)) return
    setNodes(current => current.filter(node => node.id !== selected.id))
    setConnections(current => current.filter(connection => connection.from !== selected.id && connection.to !== selected.id))
    setSelectedId('train')
  }

  function autoLayout() {
    const positions = [
      [28, 55], [28, 245], [28, 455], [330, 165], [330, 470], [645, 165], [930, 165],
      [645, 430], [900, 430], [500, 55],
    ]
    setNodes(current => current.map((node, index) => ({ ...node, x: positions[index]?.[0] ?? 500 + index * 18, y: positions[index]?.[1] ?? 500 + index * 12 })))
    setSaved(false)
    window.requestAnimationFrame(() => fitView())
  }

  function saveWorkflow() {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  return <section className={`workflow-panel panel comfy-workflow ${editable ? 'editable-canvas' : ''}`}>
    <div className="workflow-toolbar">
      <div><GitBranch /><div><strong>Qwen3 Fine-tuning</strong><span>Agent generated · autosaved</span></div></div>
      <div>
        {editable && <button className={showLibrary ? 'active' : ''} onClick={() => setShowLibrary(value => !value)}><Plus /> 添加节点</button>}
        <button onClick={autoLayout}><CircleDot /> 自动布局</button>
        {editable ? <button className={saved ? 'saved' : ''} onClick={saveWorkflow}>{saved ? <Check /> : <Save />}{saved ? '已保存' : '保存版本'}</button> : <button className="icon-button" title="适配全图" onClick={fitView}><Maximize2 /></button>}
      </div>
    </div>
    <div className={`canvas ${isPanning ? 'is-panning' : ''}`} ref={canvasRef} onPointerDown={startPan} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onWheel={handleWheel}>
      <div className="canvas-stage" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
        <svg className="connectors" viewBox="0 0 1300 740" preserveAspectRatio="none">
          {connections.map(connection => {
            const from = nodeMap.get(connection.from)
            const to = nodeMap.get(connection.to)
            if (!from || !to) return null
            const startX = from.x + 226
            const startY = from.y + 82
            const endX = to.x
            const endY = to.y + 70
            const bend = Math.max(55, Math.abs(endX - startX) * 0.46)
            return <path key={connection.id} d={`M${startX} ${startY} C${startX + bend} ${startY} ${endX - bend} ${endY} ${endX} ${endY}`} className={connection.from === 'train' ? 'flowing' : ''} />
          })}
        </svg>
        {nodes.map(node => <NodeCard
          key={node.id}
          node={node}
          selected={node.id === selectedId}
          connecting={connectingFrom === node.id}
          onSelect={() => setSelectedId(node.id)}
          onDragStart={event => startDrag(event, node)}
          onFieldChange={(key, value) => updateField(node.id, key, value)}
          onPortClick={side => handlePort(node, side)}
        />)}
      </div>
      {showLibrary && <aside className="node-library-popover">
        <header><div><Sparkles /><span><strong>Node Library</strong><small>添加可配置节点</small></span></div><button onClick={() => setShowLibrary(false)}><X /></button></header>
        <label><Search /><input autoFocus value={search} onChange={event => setSearch(event.target.value)} placeholder="搜索节点…" /></label>
        <div>{visibleTemplates.map((template, index) => {
          const Icon = icons[template.type]
          return <button key={`${template.title}-${index}`} onClick={() => addNode(template)}><span className={`library-icon ${template.type}`}><Icon /></span><span><strong>{template.title}</strong><small>{template.subtitle}</small></span><Plus /></button>
        })}</div>
      </aside>}
      {connectingFrom && <div className="connection-hint"><CircleDot /> 选择目标节点的输入端口 · Esc 取消</div>}
      <div className="canvas-controls"><button title="缩小" onClick={() => setZoomAt(zoom - 0.1)}>−</button><button className="zoom-value" title="恢复 100%" onClick={resetView}>{Math.round(zoom * 100)}%</button><button title="放大" onClick={() => setZoomAt(zoom + 0.1)}>＋</button><button className="fit-view" title="适配全图" onClick={fitView}><Maximize2 /></button></div>
      <div className="minimap"><div className="mini-map-inner">{nodes.map(node => <i key={node.id} style={{ left: `${Math.min(85, node.x / 13)}%`, top: `${Math.min(80, node.y / 8)}%` }} />)}</div></div>
    </div>
    {editable && selected && <aside className="node-inspector comfy-inspector">
      <header><span>NODE CONFIGURATION</span><button title="关闭选择" onClick={() => setSelectedId('')}><X /></button></header>
      <div className="inspector-title"><span className={`inspector-icon ${selected.type}`}>{(() => { const Icon = icons[selected.type]; return <Icon /> })()}</span><div><h3>{selected.title}</h3><p>{selected.subtitle} · {selected.id}</p></div></div>
      <nav><button className="active">Parameters</button><button>Inputs</button><button>Docs</button></nav>
      <div className="inspector-scroll">
        <section><span className="config-section-title">NODE PARAMETERS</span>{selected.fields.map(field => <ConfigField key={field.key} field={field} onChange={value => updateField(selected.id, field.key, value)} />)}</section>
        <section><span className="config-section-title">EXECUTION</span>
          <label className="config-field"><span>Execution policy</span><select defaultValue="agent"><option value="agent">Agent managed</option><option value="manual">Manual</option></select></label>
          <label className="config-field"><span>Failure strategy</span><select defaultValue="diagnose"><option value="diagnose">Diagnose & retry</option><option value="stop">Stop immediately</option></select></label>
        </section>
      </div>
      <footer><button className="delete-node" onClick={removeSelected} disabled={initialNodes.some(node => node.id === selected.id)}><Trash2 /> 删除节点</button><button onClick={saveWorkflow}><Save /> 应用配置</button></footer>
    </aside>}
  </section>
}
