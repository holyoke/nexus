# Nexus Compute Prototype Status

Last updated: 2026-09-03

## Current stack

- React + TypeScript
- Vite
- Lucide icons
- Hash-based client navigation
- In-memory and localStorage-backed Mock state
- GitHub Pages CI/CD

## Implemented modules

### Explore

- Product positioning and workload categories
- Template marketplace for training, inference, visual creation and Isaac workloads
- Template preview and entry into Workflow Studio

### Workflow Studio

- Draggable/selectable nodes
- Add, delete, duplicate and edit nodes
- Editable title, description, Runtime/model fields, prompt fields and custom parameters
- Independent width/height resizing
- Canvas pan and zoom
- Output-to-input drag connections plus click-to-connect compatibility
- Connection paths that follow node dimensions
- RAG API, Isaac PPO and ComfyUI image-generation test templates
- Local node/edge persistence

### Agent Assistant

- Codex-inspired three-column Agent Workbench
- Persistent task examples for QLoRA, Isaac PPO, vLLM and ComfyUI
- Goal analysis and six-stage maintained execution plan
- Append-only Harness tool activity
- Autonomous Mock phase progression with pause, continue and rerun
- Workflow IR preview and handoff to Workflow Studio
- Kueue admission, GPU/VRAM/CPU metrics, budget and approval boundary
- Result and artifact delivery state

### Runtime catalog

- Unsloth, PyTorch, vLLM, ComfyUI, Isaac Sim and Isaac Lab cards
- Mock Runtime launch into queued jobs

### Runs and resources

- Job filtering, selection, progress and status actions
- Runtime, GPU, queue, duration, cost and log details
- GPU pool capacity and utilization views

### Data and artifacts

- Dataset/model/policy/media artifact presentation
- Storage summary and run association

### Personal settings

- Consolidated personal and platform settings experience
- Personal profile and notifications
- Workspace and compute defaults
- Integrations and security/access
- Personal access tokens
- GPU usage and billing Mock data

## Version map

| Tag | Commit | Milestone |
| --- | --- | --- |
| `v0.2.0-flow-studio` | `6ebffa8` | Flow Studio baseline |
| `v0.3.0-settings-profile` | `626a525` | Settings and profile |
| `v0.4.0-theme-pipeline` | `4107124` | Theme and pipeline editing |
| `v0.4.1-light-contrast` | `3caab3b` | Light-mode contrast fixes |
| `v0.4.2-create-node-scale` | `9e9268d` | Create contrast and proportional scaling |
| `v0.4.3-freeform-node-resize` | `8260a08` | Independent node width/height resizing |
| `v0.4.4-port-drag-templates` | `7686069` | Port dragging and test templates |
| `v0.5.0-agent-workbench` | `3cf6af5` | Autonomous Agent Workbench |
| `v0.5.1-unified-settings` | `d60fea6` | Unified personal/platform settings |

## Verification baseline

```powershell
npm.cmd run build
git diff --check
```

For interaction changes, also verify the real local page at `http://127.0.0.1:5173/` when the development server is running.

## Next backend seams

- Replace `src/services/mockApi.ts` with authenticated control-plane clients.
- Formalize Workflow IR schemas and validation.
- Stream Agent responses and trajectories over SSE/WebSocket.
- Map compute intent to Kueue workloads and Kubernetes Jobs/Workspaces.
- Connect DCGM/Prometheus metrics.
- Persist sessions, workflow versions, approvals and artifacts.
