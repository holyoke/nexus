import {
  ArrowRight, Bot, Box, BrainCircuit, Check, CheckCircle2, ChevronDown,
  CircleDot, Code2, Cpu, Database, FileCode2, GitBranch, GitFork, Gauge,
  HardDrive, ListTodo, LoaderCircle, MoreHorizontal, Network, Pause, Play, Plus,
  Search, Send, Server, ShieldCheck, Square, TerminalSquare, Workflow, Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useApp } from '../../core/AppContext'
import type { AgentSession } from '../../core/types'

type InspectorTab = 'run' | 'workflow' | 'resources'
type Scenario = {
  goal: string
  summary: string
  runtime: string
  gpu: string
  queue: string
  estimate: string
  artifact: string
  workflow: string[]
}

const scenarios: Record<string, Scenario> = {
  'qwen-lora': {
    goal: '使用 Qwen3-8B 对 train.jsonl 完成 QLoRA 微调，自动选择 48GB 以上 GPU，评测后导出 GGUF。',
    summary: '已检查数据与配额，生成 7 节点训练工作流；RTX PRO 6000 已由 Kueue 准入，训练正在稳定运行。',
    runtime: 'Unsloth 2026.8', gpu: 'RTX PRO 6000 · 96 GB', queue: 'research', estimate: '¥ 20.64 · 2h 24m', artifact: 'qwen3-support-v1.gguf',
    workflow: ['Dataset', 'Prompt', 'Qwen3-8B', 'Unsloth', 'GPU', 'Evaluate', 'GGUF'],
  },
  'isaac-humanoid': {
    goal: '在 Isaac Lab 中生成 Humanoid locomotion 仿真数据，并训练 PPO 策略，目标成功率大于 92%。',
    summary: '已解析机器人资产与环境配置，准备创建 4096 个并行环境并请求具备图形能力的整卡 GPU。',
    runtime: 'Isaac Lab 2.3', gpu: 'RTX PRO 6000 · Graphics', queue: 'simulation', estimate: '¥ 48.20 · 5h 40m', artifact: 'humanoid-policy-v3.onnx',
    workflow: ['USD Asset', 'Domain Randomization', 'Isaac Sim', 'GPU', 'PPO', 'Evaluate', 'Policy'],
  },
  'vllm-api': {
    goal: '部署 DeepSeek-R1 推理服务，自动压测吞吐并发布 OpenAI-compatible API。',
    summary: '部署与压测已完成，服务健康，平均吞吐 126 tok/s，结果已登记到 Runtime Registry。',
    runtime: 'vLLM 0.10', gpu: 'H200 · 2 GPU', queue: 'serving', estimate: '¥ 420.80 · 18h 42m', artifact: '/v1/chat/completions',
    workflow: ['Model', 'Quantize', 'vLLM', 'H200 × 2', 'Load Test', 'Guardrail', 'Endpoint'],
  },
  'comfy-video': {
    goal: '把产品图和品牌提示词编排成 ComfyUI 视频生成工作流，并输出 1080p 素材。',
    summary: '目标已保存为草稿。Harness 尚未申请资源，你可以先审阅计划或直接授权执行。',
    runtime: 'ComfyUI Stable', gpu: 'Auto · ≥ 24 GB', queue: 'creative', estimate: '¥ 6.80 · 32m', artifact: 'campaign-video-1080p.mp4',
    workflow: ['Images', 'Prompt', 'ControlNet', 'ComfyUI', 'GPU', 'Upscale', 'Video'],
  },
}

const quickTasks = [
  { label: '模型训练', value: '用 Qwen3-8B 微调客服数据，验证效果并导出 GGUF。', icon: BrainCircuit },
  { label: '仿真数据', value: '用 Isaac Sim 生成机械臂抓取数据，自动配置 GPU 和随机化参数。', icon: Box },
  { label: '推理服务', value: '部署一个 vLLM 推理服务，完成压测后发布 API。', icon: Server },
]

const planSteps = [
  ['理解目标与约束', '解析产物、预算、时限和成功标准'],
  ['检查上下文与输入', '验证数据、模型、资产和工作区权限'],
  ['生成 Workflow IR', '选择 Runtime 并编排可复用节点图'],
  ['请求计算资源', '通过 Kueue 提交 GPU、CPU、内存意图'],
  ['执行并持续观测', '运行任务，读取日志、指标与异常'],
  ['验证并交付结果', '评测产物，保存工作流并释放资源'],
]

function initialPhase(session: AgentSession) {
  if (session.status === 'completed') return 6
  if (session.status === 'running') return 4
  if (session.status === 'queued') return 3
  return 0
}

function SessionRail() {
  const { sessions, activeSession, selectSession } = useApp()
  const [query, setQuery] = useState('')
  const visible = sessions.filter(session => `${session.title} ${session.runtime}`.toLowerCase().includes(query.toLowerCase()))
  return <aside className="agent-task-rail">
    <header><div><strong>Tasks</strong><span>{sessions.length} 个自主任务</span></div><button title="新建任务"><Plus /></button></header>
    <label className="agent-search"><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索任务" /></label>
    <div className="agent-session-list">{visible.map(session => <button key={session.id} className={session.id === activeSession.id ? 'active' : ''} onClick={() => selectSession(session.id)}>
      <div><span className={`task-state ${session.status}`}><i />{session.status}</span><time>{session.updatedAt}</time></div>
      <strong>{session.title}</strong><p>{session.preview}</p><footer><span>{session.runtime}</span><MoreHorizontal /></footer>
    </button>)}</div>
    <footer><GitBranch /><span><b>Harness online</b><small>6 tools · K8s connected</small></span><CheckCircle2 /></footer>
  </aside>
}

function StepStatus({ index, phase }: { index: number; phase: number }) {
  if (index < phase) return <i className="step-done"><Check /></i>
  if (index === phase && phase < 6) return <i className="step-running"><LoaderCircle /></i>
  return <i className="step-pending">{index + 1}</i>
}

function HarnessPlan({ phase, scenario }: { phase: number; scenario: Scenario }) {
  return <section className="harness-plan-card">
    <header><div><ListTodo /><span><strong>执行计划</strong><small>Harness 根据目标动态维护</small></span></div><em>{Math.min(phase, 6)} / 6</em></header>
    <div>{planSteps.map((step, index) => <article key={step[0]} className={index === phase ? 'active' : index < phase ? 'done' : ''}>
      <StepStatus index={index} phase={phase} /><span><strong>{step[0]}</strong><small>{index === 2 ? `${step[1]} · ${scenario.workflow.length} nodes` : step[1]}</small></span>{index < phase && <b>完成</b>}{index === phase && phase < 6 && <b>执行中</b>}
    </article>)}</div>
  </section>
}

function ToolActivity({ phase, scenario }: { phase: number; scenario: Scenario }) {
  const calls = [
    ['workspace.inspect', '读取数据、模型与项目约束', '18,420 samples · schema valid'],
    ['runtime.resolve', `匹配 ${scenario.runtime}`, 'image verified · cache warm'],
    ['workflow.compile', '生成并校验 Workflow IR', `${scenario.workflow.length} nodes · DAG valid`],
    ['compute.request', `申请 ${scenario.gpu}`, `queue/${scenario.queue} · admitted`],
    ['job.observe', '持续读取日志与 GPU 指标', 'util 94% · VRAM 71.8 GiB'],
  ]
  const shown = Math.max(1, Math.min(calls.length, phase + 1))
  return <section className="harness-activity">
    <div className="activity-heading"><span><TerminalSquare /> Harness activity</span><em>append-only</em></div>
    {calls.slice(0, shown).map((call, index) => <article key={call[0]} className={index === shown - 1 && phase < 6 ? 'running' : ''}>
      <i>{index === shown - 1 && phase < 6 ? <LoaderCircle /> : <Check />}</i><div><header><code>{call[0]}</code><time>10:{42 + index}:1{index}</time></header><p>{call[1]}</p><pre>{call[2]}</pre></div>
    </article>)}
  </section>
}

function AgentThread({ phase, running, scenario, onRun, onPause }: { phase: number; running: boolean; scenario: Scenario; onRun: () => void; onPause: () => void }) {
  const { activeSession } = useApp()
  return <div className="agent-thread-scroll">
    <div className="agent-thread-date"><span>TODAY · TASK {activeSession.id.toUpperCase()}</span></div>
    <div className="agent-user-turn"><p>{scenario.goal}</p><footer><time>09:54</time><span>Grail Lee</span></footer></div>
    <div className="agent-assistant-turn"><div className="codex-mark"><Bot /></div><div>
      <header><strong>Compute Agent</strong><span>Autonomous mode</span></header>
      <p>{scenario.summary}</p>
      <HarnessPlan phase={phase} scenario={scenario} />
      <ToolActivity phase={phase} scenario={scenario} />
      {phase >= 6 && <section className="agent-result-card"><CheckCircle2 /><div><strong>任务已完成并通过验证</strong><span>{scenario.artifact} · 资源已释放 · 轨迹已归档</span></div><button>查看产物 <ArrowRight /></button></section>}
      <div className="agent-turn-actions"><button onClick={running ? onPause : onRun}>{running ? <Pause /> : <Play />}{running ? '暂停执行' : phase >= 6 ? '重新运行' : '继续执行'}</button><button><GitFork /> Fork</button><button><FileCode2 /> 查看 Workflow IR</button></div>
    </div></div>
  </div>
}

function AgentPrompt({ onSubmit }: { onSubmit: (value: string) => Promise<void> }) {
  const [value, setValue] = useState('')
  const [sending, setSending] = useState(false)
  const submit = async () => { if (!value.trim() || sending) return; setSending(true); await onSubmit(value.trim()); setValue(''); setSending(false) }
  return <div className="agent-prompt-wrap">
    <div className="quick-task-row">{quickTasks.map(item => <button key={item.label} onClick={() => setValue(item.value)}><item.icon />{item.label}</button>)}</div>
    <div className="agent-prompt-box"><textarea value={value} onChange={event => setValue(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void submit() } }} placeholder="描述目标，Harness 将分析任务、生成工作流并调度算力…" />
      <footer><div><button><Plus /></button><span><Code2 /> workspace</span><span><ShieldCheck /> scoped tools</span></div><button className="prompt-send" onClick={() => void submit()} disabled={!value.trim() || sending}>{sending ? <LoaderCircle /> : <Send />}</button></footer>
    </div><small>Agent 可在授权范围内自主执行；高成本、删除和外部发布操作需要确认。</small>
  </div>
}

function WorkflowMiniMap({ scenario, phase }: { scenario: Scenario; phase: number }) {
  return <div className="agent-workflow-map">{scenario.workflow.map((node, index) => <div key={node}><span className={index < phase ? 'done' : index === phase ? 'active' : ''}>{index === 0 ? <Database /> : index === 3 ? <Cpu /> : index === scenario.workflow.length - 1 ? <Box /> : <Workflow />}<b>{node}</b></span>{index < scenario.workflow.length - 1 && <i />}</div>)}</div>
}

function HarnessInspector({ tab, setTab, scenario, phase, running }: { tab: InspectorTab; setTab: (tab: InspectorTab) => void; scenario: Scenario; phase: number; running: boolean }) {
  const { navigate } = useApp()
  return <aside className="harness-inspector">
    <header><div><CircleDot /><span><strong>Harness</strong><small>run-7f4 · isolated workspace</small></span></div><button><MoreHorizontal /></button></header>
    <nav><button className={tab === 'run' ? 'active' : ''} onClick={() => setTab('run')}>运行</button><button className={tab === 'workflow' ? 'active' : ''} onClick={() => setTab('workflow')}>工作流</button><button className={tab === 'resources' ? 'active' : ''} onClick={() => setTab('resources')}>资源</button></nav>
    <div className="harness-inspector-body">
      {tab === 'run' && <><section className="run-state-card"><span className={running ? 'live' : phase >= 6 ? 'done' : 'paused'}><i />{running ? 'RUNNING' : phase >= 6 ? 'COMPLETED' : 'PAUSED'}</span><strong>{phase >= 6 ? '100%' : `${Math.max(8, phase * 17)}%`}</strong><div><i style={{ width: `${phase >= 6 ? 100 : Math.max(8, phase * 17)}%` }} /></div><small>{phase >= 6 ? 'All validations passed' : `${planSteps[Math.min(phase, 5)][0]} · checkpoint saved`}</small></section>
        <section className="inspector-block"><label>执行策略</label><div className="kv-row"><span>Mode</span><b>Autonomous</b></div><div className="kv-row"><span>Approval</span><b>Risk based</b></div><div className="kv-row"><span>Retries</span><b>1 / 3</b></div><div className="kv-row"><span>Budget</span><b>¥ 60.00 max</b></div></section>
        <section className="inspector-block"><label>上下文</label><div className="context-chip"><HardDrive /><span><b>/workspace</b><small>12 files · 2.4 GB</small></span><Check /></div><div className="context-chip"><Network /><span><b>Kubernetes</b><small>gpu-prod-shanghai</small></span><Check /></div></section>
        <section className="approval-card"><ShieldCheck /><div><strong>权限边界生效</strong><span>仅可操作 project/grail-dev；发布与删除需确认。</span></div></section></>}
      {tab === 'workflow' && <><section className="inspector-title"><Workflow /><div><strong>Generated Workflow</strong><span>{scenario.workflow.length} nodes · DAG valid</span></div></section><WorkflowMiniMap scenario={scenario} phase={phase} /><button className="open-workflow" onClick={() => navigate('workflows')}><Workflow /> 在画布中打开 <ArrowRight /></button><section className="inspector-block"><label>编译目标</label><div className="kv-row"><span>API</span><b>batch/v1 Job</b></div><div className="kv-row"><span>Queue</span><b>{scenario.queue}</b></div><div className="kv-row"><span>Policy</span><b>retry-once</b></div></section></>}
      {tab === 'resources' && <><section className="resource-hero"><Cpu /><div><span>ALLOCATED COMPUTE</span><strong>{scenario.gpu}</strong><small>Kueue admitted · node/gpu-07</small></div></section><section className="resource-meters"><div><span>GPU UTIL <b>94%</b></span><i><em style={{ width: '94%' }} /></i></div><div><span>VRAM <b>71.8 / 96 GB</b></span><i><em style={{ width: '75%' }} /></i></div><div><span>CPU <b>18 / 32 cores</b></span><i><em style={{ width: '56%' }} /></i></div></section><section className="inspector-block"><label>资源意图</label><div className="code-intent"><code>gpu.vendor = nvidia</code><code>gpu.memory &gt;= 48Gi</code><code>graphics = true</code><code>priority = normal</code></div></section><section className="cost-estimate"><Gauge /><span><small>预计成本与耗时</small><strong>{scenario.estimate}</strong></span></section></>}
    </div>
  </aside>
}

export function AgentWorkbench() {
  const { activeSession, sendMessage } = useApp()
  const scenario = scenarios[activeSession.id] ?? scenarios['qwen-lora']
  const [phase, setPhase] = useState(() => initialPhase(activeSession))
  const [running, setRunning] = useState(activeSession.status === 'running')
  const [tab, setTab] = useState<InspectorTab>('run')

  useEffect(() => { setPhase(initialPhase(activeSession)); setRunning(activeSession.status === 'running'); setTab('run') }, [activeSession.id])
  useEffect(() => {
    if (!running) return
    if (phase >= 6) { setRunning(false); return }
    const timer = window.setTimeout(() => setPhase(value => Math.min(6, value + 1)), 1200)
    return () => window.clearTimeout(timer)
  }, [running, phase])

  const submit = async (value: string) => { setPhase(0); setRunning(true); await sendMessage(value) }
  const run = () => { if (phase >= 6) setPhase(0); setRunning(true) }

  return <div className="agent-workbench page-content">
    <SessionRail />
    <main className="agent-command-center">
      <header className="agent-command-header"><div><span><Bot /> AGENT TASK</span><strong>{activeSession.title}</strong></div><div><button className="agent-mode"><Zap /> Autonomous <ChevronDown /></button><button title="停止任务"><Square /></button></div></header>
      <AgentThread phase={phase} running={running} scenario={scenario} onRun={run} onPause={() => setRunning(false)} />
      <AgentPrompt onSubmit={submit} />
    </main>
    <HarnessInspector tab={tab} setTab={setTab} scenario={scenario} phase={phase} running={running} />
  </div>
}
