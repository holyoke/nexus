import { CheckCircle2, Clock3, Copy, GitBranch, MoreHorizontal, Play, Plus } from 'lucide-react'
import { useState } from 'react'
import { WorkflowCanvas } from '../../components/workflow/WorkflowCanvas'

const workflows = [
  { id: 'qwen', name: 'Qwen3 Fine-tuning', runtime: 'Unsloth', updated: '2 分钟前', version: 'v12', active: true },
  { id: 'isaac', name: 'Isaac Humanoid PPO', runtime: 'Isaac Lab', updated: '昨天', version: 'v4', active: false },
  { id: 'serve', name: 'Evaluate & Deploy', runtime: 'vLLM', updated: '3 天前', version: 'v8', active: false },
]

export function WorkflowsPage() {
  const [selected, setSelected] = useState('qwen')
  return <div className="workflow-page page-content"><div className="page-toolbar"><div><h2>Workflow Studio</h2><p>Agent 生成、人工编辑、版本化执行。</p></div><button className="primary-action"><Plus /> 新建工作流</button></div><div className="workflow-studio"><aside className="workflow-library panel"><span className="eyebrow">MY WORKFLOWS</span>{workflows.map(flow => <button className={selected === flow.id ? 'active' : ''} onClick={() => setSelected(flow.id)} key={flow.id}><GitBranch /><div><strong>{flow.name}</strong><span>{flow.runtime} · {flow.version}</span></div><MoreHorizontal /></button>)}<div className="versions"><span>VERSION HISTORY</span><div><CheckCircle2 /><p><strong>v12 · current</strong><small>Agent 调整 batch size</small></p><time>10:42</time></div><div><Clock3 /><p><strong>v11</strong><small>添加 C-Eval 节点</small></p><time>09:51</time></div><button><Copy /> 从版本创建副本</button></div></aside><WorkflowCanvas editable /></div></div>
}
