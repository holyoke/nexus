# Nexus Compute Repository Guidance

This repository contains the interactive frontend prototype for an Agent-native GPU Compute Platform. Read this file and the documents under `docs/` before changing product behavior or UI.

## Product intent

- Present GPU computing as goal-driven workflows instead of raw Kubernetes forms.
- Treat Runtime as a first-class model or execution framework: Unsloth, PyTorch, vLLM, ComfyUI, Isaac Sim and Isaac Lab.
- Combine a ComfyUI-style editable node graph with a Codex-style autonomous Agent workbench.
- The Agent analyzes a task, produces Workflow IR, requests resources through controlled tools, observes execution, diagnoses failures and delivers artifacts.
- Kubernetes, Kueue, GPU Operator and storage are infrastructure implementation details; users interact with intent, workflow, Runtime, resources and results.

## Change boundaries

- Preserve the overall information architecture, navigation, spacing, typography and visual language unless the user explicitly requests a redesign.
- When the user says “保持整体不变” or equivalent, modify only the named module or interaction. Do not opportunistically restyle neighboring modules.
- Keep dark and light themes functionally and visually usable for every changed surface.
- Preserve existing interactions while extending them unless the request explicitly replaces an interaction.
- Do not replace meaningful prototype interactions with static screenshots or non-functional mockups.
- Use Mock data by default until a backend integration is explicitly requested.

## Workflow canvas contract

- Nodes remain draggable, selectable, deletable, duplicable and independently resizable by width and height.
- Connections can be created by dragging an output port to an input port; click-to-connect remains supported.
- Node configuration supports editable title, description, model/Runtime selection, prompt fields and custom parameters.
- Canvas zoom/pan and node resize are separate interactions.
- Connections must follow node movement and resizing.
- Test templates must remain available for model training, inference, ComfyUI generation and Isaac simulation/training scenarios.

## Agent workbench contract

- The Agent Assistant is a task workbench, not a generic chat page.
- Keep the three-part model: task threads, goal/plan/execution conversation, and Harness inspector.
- Surface task analysis, reviewable plan, append-only tool activity, Workflow IR, resource intent, approvals, execution status and final artifacts.
- High-cost, destructive or external-publishing operations must be shown as approval-gated.
- Demonstrations must include at least model training and Isaac simulation/data-generation paths.

## Settings contract

- Personal and platform settings are one consolidated experience.
- `个人设置` contains `个人资料`, `平台与偏好`, `访问与 API`, and `用量与账单`.
- The legacy `平台设置` sidebar entry opens the same consolidated experience with `平台与偏好` selected.
- Platform preferences retain workspace, compute policy, integrations, and security/access sections.

## Architecture and editing

- Register pages in `src/modules/registry.ts`.
- Keep domain pages under `src/modules/` and reusable UI under `src/components/`.
- Scope new CSS to the owning module to avoid regressions elsewhere.
- Preserve user changes in a dirty worktree. Inspect `git status` before editing.
- Use `apply_patch` for source-file changes.

## Verification

For frontend changes:

1. Run `npm.cmd run build` on Windows (`npm run build` elsewhere).
2. Verify the changed interaction in the real local page when practical.
3. Check both themes for any surface whose colors or layout changed.
4. Run `git diff --check` before committing.

## Version management

- Keep each requested product change in a focused commit.
- Use annotated version tags for meaningful prototype milestones.
- Never rewrite or discard existing history to implement a UI request.
- Report the commit, tag, verification result and rollback point after publishing.
- Current documented baseline: `v0.5.1-unified-settings` at commit `d60fea6`.

## Canonical documents

- Product definition: `docs/PRODUCT_SPEC.md`
- UI rules: `docs/UI_GUIDELINES.md`
- Implemented prototype and version map: `docs/PROTOTYPE_STATUS.md`
