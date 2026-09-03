# Nexus Compute UI Guidelines

## Design direction

The visual system combines a dense professional compute console with two interaction references:

- ComfyUI-style direct manipulation for workflow creation.
- Codex-style persistent tasks, plans, tool activity, execution status and reviewable results for Agent work.

The interface should feel like an AI creation environment, not a Kubernetes administration dashboard.

## Stable shell

Unless explicitly requested, preserve:

- Left sidebar grouping: `CREATE`, `MANAGE`, quota and personal controls.
- Global header structure and search.
- Lime accent, dark neutral surfaces and current typography scale.
- Existing page widths, panel density, border radii and compact control sizing.
- Light/dark theme toggle and theme persistence.

## Theme rules

- Dark mode is the primary visual reference.
- Light mode must use light surfaces throughout; never leave unreadable dark-only modules.
- Maintain visible borders and text contrast in both themes.
- Status colors must preserve meaning: green/lime running or healthy, amber queued/warning, red failed, blue informational.
- Avoid introducing a new accent palette for one isolated module.

## Workflow Studio

- The canvas is the focus; rails and inspectors support it without dominating it.
- Nodes expose recognizable header, ports, parameters, state and resize affordance.
- Node width and height resize independently.
- Dragging a connection shows a live preview line and a clear target affordance.
- Panning, canvas zoom and node manipulation must not conflict.
- Model, Runtime and prompt configuration stays accessible in the node inspector.
- New node types and templates should reuse the established node vocabulary.

## Agent Assistant

- Left: persistent task/session list.
- Center: user goal, Agent summary, maintained plan, tool activity and result.
- Right: Harness inspector with run, workflow and resource views.
- The composer remains the primary action and includes useful scenario starters.
- Execution changes must be visible: queued, admitted, running, paused, diagnosing, retrying and completed.
- Tool activity should look append-only and attributable, not like hidden magic.
- Approvals and scope limits should be explicit.

## Personal settings

- Treat profile and platform preferences as one settings destination.
- First-level tabs: personal profile, platform/preferences, access/API, usage/billing.
- Platform sub-navigation: workspace, compute policy, integrations, security/access.
- Preserve vertical alignment and readable data rows in both themes.

## Interaction quality

- Buttons that appear actionable should update visible state or navigate somewhere meaningful.
- Keep existing working behaviors when adding a new behavior.
- Provide Mock examples that let a reviewer exercise the feature without setup.
- Avoid dead modal controls, invisible hover-only actions and ambiguous destructive actions.

## Scope discipline

When a request targets one surface:

1. Identify the owning component and scoped stylesheet.
2. Do not alter other modules to achieve visual consistency unless necessary.
3. If shared CSS must change, verify all known consumers.
4. Report any unavoidable cross-module effect before expanding the change.
