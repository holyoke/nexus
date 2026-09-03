# Nexus Compute Product Specification

## Product definition

Nexus Compute is an Agent-native GPU Compute Platform for model training, inference, generative workflows and embodied-AI simulation. A user expresses a goal in natural language or edits a visual workflow. The platform turns that intent into a controlled, observable execution on Kubernetes GPU resources.

The product is not positioned as a raw GPU rental console. Its core value is the closed loop:

```text
User goal
  → Task analysis
  → Reviewable plan
  → Workflow IR
  → Runtime and resource selection
  → Kueue/Kubernetes execution
  → Logs and metrics observation
  → Diagnose and re-plan
  → Validated artifact
```

## Primary workloads

### Model training

- Dataset inspection and validation
- Model and prompt configuration
- Unsloth/PyTorch LoRA, QLoRA and fine-tuning
- Evaluation, export and model registration

### Model inference

- vLLM or comparable Runtime selection
- GPU sizing and queue admission
- Load testing and guardrails
- OpenAI-compatible endpoint publication

### Generative AI

- ComfyUI-style visual pipelines
- Prompt, model, ControlNet and post-processing nodes
- Image/video artifact generation and storage

### Embodied AI

- Isaac Sim interactive simulation
- Isaac Lab headless RL/IL training
- ROS2-compatible Runtime variants
- Synthetic-data generation, domain randomization, policy evaluation and export

## Core product objects

- **Project**: ownership, members, quota and artifact boundary.
- **Task**: the user goal and its persistent Agent thread.
- **Workflow**: editable graph and versioned Workflow IR.
- **Runtime**: model or execution framework packaged as a selectable capability.
- **Compute intent**: GPU capabilities, memory, count, CPU, RAM, duration, priority and budget.
- **Run**: admitted execution with logs, metrics, events and status.
- **Artifact**: dataset, model, checkpoint, policy, generated media or API endpoint.
- **Trajectory**: append-only record of reasoning milestones, tool calls, scheduling events, approvals and results.

## Agent/Harness responsibilities

The Harness provides controlled semantic tools rather than unrestricted cluster access:

- `workspace.inspect`
- `dataset.inspect`
- `runtime.resolve`
- `workflow.compile`
- `compute.inspect`
- `compute.request`
- `job.submit`
- `job.observe`
- `artifact.publish`
- `compute.release`

The Agent may autonomously perform reversible, scoped actions. High-cost resource requests, destructive actions and external publication require explicit approval and must be visible in the trajectory.

## Platform layers

```text
Product experience
  Agent Workbench · Workflow Studio · Runtime Catalog · Runs · Artifacts

Control plane
  Task/Session · Workflow compiler · Runtime controller · Policy · Audit

Scheduling
  Kueue · Kubernetes scheduler · optional HAMi/MIG/DRA

Infrastructure
  Kubernetes · NVIDIA GPU Operator · containerd · CSI storage · observability
```

## MVP success criteria

- A user can create a task from natural language.
- The Agent produces a reviewable plan and editable workflow.
- A workflow can select Runtime, model, prompt, storage and compute constraints.
- Runs expose queue, GPU, progress, logs, cost and failure state.
- The Agent can demonstrate an observe/diagnose/re-plan loop.
- Results remain traceable to the task, workflow version and resource events.

## Out of scope for the current frontend prototype

- Real Kubernetes mutation
- Real billing or payment
- Production authentication and RBAC
- Real model training, inference or simulation execution
- Production-grade workflow schema compatibility guarantees

These behaviors are represented with interactive Mock state until backend integration is explicitly requested.
