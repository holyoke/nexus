import { ArrowUp, Command, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../core/AppContext'

export function AgentComposer() {
  const { sendMessage } = useApp()
  const [value, setValue] = useState('')
  const [sending, setSending] = useState(false)
  const submit = async () => {
    if (!value.trim() || sending) return
    const content = value.trim()
    setValue('')
    setSending(true)
    await sendMessage(content)
    setSending(false)
  }
  return <div className="composer"><textarea value={value} onChange={event => setValue(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void submit() } }} placeholder="描述目标，Agent 会规划 Runtime、GPU 与执行步骤…" /><div><span><Command /> Enter 发送 · Shift + Enter 换行</span><button onClick={() => void submit()} disabled={sending}>{sending ? <LoaderCircle className="spin" /> : <ArrowUp />}</button></div></div>
}
