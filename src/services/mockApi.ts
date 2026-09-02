import type { AgentSession, ComputeJob, RuntimeDefinition } from '../core/types'

const wait = (ms = 240) => new Promise(resolve => setTimeout(resolve, ms))

export const sessionsSeed: AgentSession[] = [
  {
    id: 'qwen-lora', title: 'Qwen3-8B QLoRA', runtime: 'Unsloth', status: 'running', updatedAt: '刚刚', preview: '训练进行到 step 1,284，GPU 利用率 94%。',
    messages: [
      { id: 'm1', role: 'user', content: '用 Qwen3-8B 对 train.jsonl 做一次 QLoRA。优先用空闲的 48G 以上 GPU，训练完成后跑评测，并导出 GGUF。', time: '09:54' },
      { id: 'm2', role: 'agent', content: '已选择 Unsloth QLoRA Runtime，并匹配到 RTX PRO 6000。训练稳定，预计 1 小时 42 分钟后完成。', time: '09:58' },
    ],
    trace: [
      { id: 't1', type: 'intent', title: '解析用户意图', detail: 'QLoRA 微调 → 评测 → GGUF 导出', time: '09:54:02', status: 'done' },
      { id: 't2', type: 'tool', title: 'inspect_dataset', detail: '18,420 samples · JSONL · schema valid', time: '09:54:04', status: 'done' },
      { id: 't3', type: 'plan', title: '生成执行计划', detail: 'Unsloth · 3 epochs · rank 32', time: '09:54:07', status: 'done' },
      { id: 't4', type: 'scheduler', title: '请求 GPU 算力', detail: 'gpu.memory >= 48Gi · Kueue admitted', time: '09:58:12', status: 'done' },
      { id: 't5', type: 'tool', title: 'job.observe', detail: 'step 1,284 / 3,600 · loss 1.36', time: '10:42:18', status: 'running' },
      { id: 't6', type: 'result', title: '评测与导出', detail: '等待训练完成', time: '--:--', status: 'pending' },
    ],
  },
  { id: 'isaac-humanoid', title: 'Isaac Lab Humanoid PPO', runtime: 'Isaac Lab', status: 'queued', updatedAt: '12 分钟前', preview: '等待 simulation-gpu 队列资源。', messages: [], trace: [] },
  { id: 'vllm-api', title: '部署 DeepSeek-R1 API', runtime: 'vLLM', status: 'completed', updatedAt: '昨天', preview: '服务已部署，平均吞吐 126 tok/s。', messages: [], trace: [] },
  { id: 'comfy-video', title: 'ComfyUI 视频工作流', runtime: 'ComfyUI', status: 'idle', updatedAt: '3 天前', preview: '草稿 · 尚未申请算力。', messages: [], trace: [] },
]

export const jobsSeed: ComputeJob[] = [
  { id: 'job-7f4', name: 'train-qwen3-8b-7f4', runtime: 'Unsloth 2026.8', gpu: 'RTX PRO 6000 × 1', queue: 'research', status: 'running', progress: 35.7, duration: '2h 18m', owner: 'Yun Chen', cost: 18.6 },
  { id: 'job-20a', name: 'isaac-humanoid-ppo', runtime: 'Isaac Lab 2.3', gpu: 'RTX PRO 6000 × 1', queue: 'simulation', status: 'queued', progress: 0, duration: '--', owner: 'Yun Chen', cost: 0 },
  { id: 'job-1d8', name: 'eval-qwen3-ceval', runtime: 'PyTorch 2.8', gpu: 'RTX 4090 × 1', queue: 'research', status: 'completed', progress: 100, duration: '28m', owner: 'Lin Tao', cost: 2.4 },
  { id: 'job-8c1', name: 'vllm-deepseek-api', runtime: 'vLLM 0.10', gpu: 'H200 × 2', queue: 'serving', status: 'running', progress: 68, duration: '18h 42m', owner: 'Platform', cost: 420.8 },
  { id: 'job-4b7', name: 'comfy-wan-video', runtime: 'ComfyUI 0.3', gpu: 'RTX 4090 × 1', queue: 'creative', status: 'failed', progress: 12, duration: '7m', owner: 'Mo Qi', cost: 0.8 },
]

export const runtimesSeed: RuntimeDefinition[] = [
  { id: 'unsloth', name: 'Unsloth QLoRA', category: 'LLM', description: '高效单卡/多卡模型微调，内置 Qwen、Llama、DeepSeek 模板。', version: '2026.8', gpu: '≥ 24 GB', color: '#9b7af4', verified: true, tags: ['QLoRA', 'GRPO', 'GGUF'] },
  { id: 'isaac-lab', name: 'Isaac Lab', category: 'Embodied AI', description: '基于 Isaac Sim 的机器人强化学习与模仿学习环境。', version: '2.3', gpu: 'Graphics · ≥ 24 GB', color: '#76b900', verified: true, tags: ['PPO', 'ROS2', 'Headless'] },
  { id: 'isaac-sim', name: 'Isaac Sim Interactive', category: 'Embodied AI', description: '支持浏览器串流、USD 场景编辑和 ROS2 联调的仿真工作站。', version: '5.1', gpu: 'Full GPU', color: '#9ac63d', verified: true, tags: ['Streaming', 'USD', 'ROS2'] },
  { id: 'vllm', name: 'vLLM Serving', category: 'Inference', description: '高吞吐 LLM 推理服务，提供 OpenAI API 兼容端点。', version: '0.10', gpu: '≥ 24 GB', color: '#45d6c8', verified: true, tags: ['API', 'PagedAttention'] },
  { id: 'pytorch', name: 'PyTorch CUDA', category: 'Development', description: '预置 Jupyter、VS Code 与常用 CUDA 工具链。', version: '2.8', gpu: 'Optional', color: '#ef7b62', verified: true, tags: ['Jupyter', 'VS Code'] },
  { id: 'comfyui', name: 'ComfyUI', category: 'Development', description: '可视化生成式 AI 工作流与模型资产管理环境。', version: '0.3', gpu: '≥ 16 GB', color: '#5d91e8', verified: false, tags: ['Image', 'Video', 'Workflow'] },
]

export const mockApi = {
  async sendMessage(content: string) {
    await wait(480)
    return { id: `m-${Date.now()}`, role: 'agent' as const, content: `已收到任务。我会先检查可用 Runtime 与 GPU 配额，然后生成可审计的执行计划。目标摘要：${content.slice(0, 42)}${content.length > 42 ? '…' : ''}`, time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }
  },
  async submitRuntime(runtime: RuntimeDefinition) {
    await wait(520)
    return { jobId: `job-${Math.random().toString(16).slice(2, 6)}`, runtime: runtime.name }
  },
}
