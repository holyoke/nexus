import { ChevronDown, Cloud, Code2, History, Share2, Workflow } from 'lucide-react'
import { WorkflowCanvas } from '../../components/workflow/WorkflowCanvas'

export function WorkflowsPage() {
  return <div className="page-content workflow-page-v2">
    <div className="studio-page-head"><div><span className="crumb"><Workflow /> 我的工作流 /</span><strong>Qwen3 微调与部署</strong><button><ChevronDown /></button><em>草稿</em></div><nav><button className="active"><Workflow /> 编辑器</button><button><Code2 /> API</button><button><History /> 版本</button></nav><div><span className="cloud-state"><Cloud /> 已保存</span><button><Share2 /> 分享</button></div></div>
    <WorkflowCanvas editable />
  </div>
}
