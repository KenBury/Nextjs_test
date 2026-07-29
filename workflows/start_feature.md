---
description: Standard procedure for starting a new feature, ensuring architectural alignment and modeling before coding.
---

# Start Feature Workflow

Use this workflow at the beginning of any new feature or structural change. This workflow follows the **GSD (Get Shit Done)** philosophy: Spec-Driven, Isolated, and Verified.

## 1. Project Context & Environment Setup

- **Actor**: `meta-orchestrator`
- **Action**: 
  1. Consult `governance/JOURNAL.md` for situational awareness.
  2. // turbo
     **Initialize Isolated Environment**: Establish a workspace using Antigravity 2.0's native "New Worktree Mode" feature or manually fallback to creating a dedicated Git Worktree:
     `git worktree add .agent/worktrees/<feature-id> <branch-name>`
- **Goal**: Prevent filesystem pollution and establish a clean context.

## 2. Product Definition & Strategy

- **Actor**: `app-architect`
- **Action**: Update `MASTER_PLAN.md` and define the feature goals.
- **Pro Tip**: Use the `/grill-me` slash command to initiate a Q&A session with the `app-architect`. This ensures all edge cases and requirements are fully extracted before the Master Plan is updated.
- **Output**: Updated `MASTER_PLAN.md`.

## 3. Architectural Modeling (Architecture Gate)

- **Actor**: `app-architect` + `sparx_cli.py`
- **Action**: Create or update UML/ArchiMate elements in Sparx EA.
- **Workflow**:
  1. Inspect existing model using `python sparx_cli.py <query_tool_name>`.
  2. Create/update UML or ArchiMate elements to reflect the new feature using `python sparx_cli.py <create_update_tool_name>`.
  3. **Invoke** the CLI bridge wrapper ([sparx_cli.py](file:///c:/Users/kenbu/Documents/Code/ConeKiller/sparx_cli.py)) to synchronize changes.
- **Gate**: Modeling MUST be complete before proceeding.

## 4. The Loop: Planning Phase (Spec Gate)

- **Actor**: `meta-orchestrator`
- **Action**: Generate the task-specific `SPEC.md`.
  1. Copy `.agent/templates/SPEC_TEMPLATE.md` to `.agent/worktrees/<feature-id>/SPEC.md`.
  2. Populate the Spec with "Must-Haves", "Out of Scope", and "Technical Implementation Plan".
  3. **Verification**: Define the specific UAT script path in Section 6 of the Spec.
- **Gate (Planning Pause)**: **STOP.** Use `notify_user` to present the `SPEC.md`. Implementation is blocked until the USER provides sign-off.

## 5. Implementation & Execution

- **Actor**: Engineering Specialists (`ar-engineer`, `web-engineer`, etc.)
- **Action**: 
  1. Implement logic within the isolated worktree.
  2. **Absolute Paths**: Ensure all internal calls use absolute paths relative to the worktree root.
- **Protocol**: Mark tasks in `task.md` only after they satisfy the `SPEC.md` success criteria.

## 6. Verification & Complete

- **Actor**: `qa-lead`
- **Action**: Execute the UAT script defined in the `SPEC.md`.
- **Output**: Passing test logs appended to the session journal.
- **Final Gate**: The `meta-orchestrator` verifies the "Triangle of Truth" is intact before marking the feature as COMPLETE.
