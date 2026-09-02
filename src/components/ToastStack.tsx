import { CheckCircle2 } from 'lucide-react'
import { useApp } from '../core/AppContext'

export function ToastStack() {
  const { toasts } = useApp()
  return <div className="toast-stack">{toasts.map(item => <div className="toast" key={item.id}><CheckCircle2 /><div><strong>{item.title}</strong><span>{item.detail}</span></div></div>)}</div>
}
