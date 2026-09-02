import { Bot, Check, Clock3, MoreHorizontal, Pause, Play, Sparkles } from 'lucide-react'
import { useApp } from '../../core/AppContext'
import { AgentComposer } from './AgentComposer'

export function SessionConversation({ compact = false }: { compact?: boolean }) {
  const { activeSession, jobs, updateJobStatus } = useApp()
  const activeJob = jobs.find(job => job.name.includes('qwen3'))
  const running = activeJob?.status === 'running'
  return <section className={`chat-panel panel ${compact ? 'compact-chat' : ''}`}>
    <div className="panel-title"><div><Sparkles className="purple" /><div><strong>{activeSession.title}</strong><span>{activeSession.runtime} · traceable session</span></div></div><button><MoreHorizontal /></button></div>
    <div className="messages"><div className="date-sep"><span>SESSION · {activeSession.id}</span></div>
      {activeSession.messages.length === 0 && <div className="conversation-welcome"><Bot /><strong>继续这个任务</strong><span>输入目标后，Agent 会自动生成可审计执行计划。</span></div>}
      {activeSession.messages.map(message => message.role === 'user' ? <div className="user-message" key={message.id}>{message.content}<time>{message.time}</time></div> : <div className="agent-message" key={message.id}><div className="agent-icon"><Bot /></div><div className="agent-copy"><strong>Compute Agent</strong><p>{message.content}</p>{message.id === 'm2' && <div className="plan-card"><div><Check /> 数据集检查 <span>18,420 samples</span></div><div><Check /> Runtime 配置 <span>unsloth:qwen3</span></div><div className="active-step"><span className="spinner" /> 模型训练 <span>Step 1,284 / 3,600</span></div><div><Clock3 /> 评测与导出 <span>等待中</span></div></div>}</div></div>)}
      {activeJob && <div className="agent-actions sticky-action"><button onClick={() => updateJobStatus(activeJob.id, running ? 'paused' : 'running')}>{running ? <Pause /> : <Play />}{running ? '暂停任务' : '继续任务'}</button><button>查看完整计划</button></div>}
    </div><AgentComposer />
  </section>
}
