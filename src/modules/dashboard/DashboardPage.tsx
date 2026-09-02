import { SessionConversation } from '../../components/agent/SessionConversation'
import { LiveRunPanel } from '../../components/metrics/LiveRunPanel'
import { WorkflowCanvas } from '../../components/workflow/WorkflowCanvas'

export function DashboardPage() {
  return <div className="workspace-grid"><SessionConversation compact /><WorkflowCanvas /><LiveRunPanel /></div>
}
