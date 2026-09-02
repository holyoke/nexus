export type WorkflowNode = {
  id: string
  type: 'input' | 'runtime' | 'compute' | 'task' | 'output'
  title: string
  subtitle: string
  x: number
  y: number
  status?: 'ready' | 'running' | 'queued'
  meta: string[]
}

export const workflowNodes: WorkflowNode[] = [
  { id: 'dataset', type: 'input', title: 'Dataset', subtitle: '输入数据', x: 35, y: 135, status: 'ready', meta: ['train.jsonl', '18.4k samples'] },
  { id: 'model', type: 'input', title: 'Qwen3 · 8B', subtitle: '基础模型', x: 35, y: 340, status: 'ready', meta: ['BF16', 'HuggingFace'] },
  { id: 'train', type: 'runtime', title: 'Unsloth QLoRA', subtitle: '训练 Runtime', x: 325, y: 185, status: 'running', meta: ['rank 32 · alpha 64', '3 epochs'] },
  { id: 'compute', type: 'compute', title: 'RTX PRO 6000', subtitle: 'GPU Compute', x: 325, y: 420, status: 'running', meta: ['1 × 96 GB', 'Priority · Normal'] },
  { id: 'eval', type: 'task', title: 'Evaluate', subtitle: '模型评测', x: 625, y: 185, status: 'queued', meta: ['MMLU · C-Eval', 'Queued'] },
  { id: 'export', type: 'output', title: 'Export GGUF', subtitle: '交付产物', x: 885, y: 185, status: 'queued', meta: ['Q4_K_M', 'Artifact Registry'] },
]

export const gpuPools = [
  { name: 'RTX PRO 6000', spec: '96 GB · Blackwell', used: 3, total: 4, utilization: 72, tone: 'violet' },
  { name: 'NVIDIA H200', spec: '141 GB · Hopper', used: 8, total: 8, utilization: 94, tone: 'cyan' },
  { name: 'RTX 4090', spec: '24 GB · Ada', used: 5, total: 8, utilization: 58, tone: 'blue' },
]

export const activity = [
  { time: '10:42:18', title: 'Checkpoint saved', detail: 'step-1240 · 4.8 GB', tone: 'green' },
  { time: '10:38:04', title: 'Evaluation queued', detail: '等待训练完成后自动执行', tone: 'purple' },
  { time: '10:24:51', title: 'Training stable', detail: 'loss 1.82 → 1.36', tone: 'cyan' },
  { time: '09:58:12', title: 'Compute admitted', detail: 'gpu-node-bw-03', tone: 'blue' },
]
