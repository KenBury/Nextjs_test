# Separation of Duties (SoD) Governance Protocol

This document defines the rigid boundaries and required handoff artifacts between specialist agents. Compliance is **mandatory** to ensure architectural integrity and operational stability.

---

## 🏛️ Role 1: The App Architect (Strategic Intent)

**Primary Goal**: Define the "What" and the "Why".

- **Focus**: Strategic modeling (UML), technical design (UML), and process flows (BPMN).
- **Prohibitions**:
  - **NEVER** write implementation code (Dart, Python, JS, etc.).
  - **NEVER** modify production logic files directly.
- **Required Handoff Artifacts**:
  - `handoff_spec.json`: Structured technical specification.
  - **Approved Stitch Prototypes**: Visual "Source of Truth" for all UI-related changes (Mobile & Web).


## 🛠️ Role 2: Engineering Agents (Technical Execution)

**Primary Goal**: Implement the "How".

- **Specialists**: `ar-engineer`, `web-engineer`, `backend-engineer`, `database-admin`.
- **Focus**: Writing code, passing unit tests, and fulfilling the `handoff_spec.md`.
- **Prohibitions**:
  - **NEVER** deviate from the `handoff_spec.json` or `ARCHITECTURE.md` specification without a Change Request (CR) to the Architect.
  - **NEVER** deploy to production environments.
- **Required Output**: Passing test logs and updated implementation code.
- **Clarification Protocol (Pre-Flight):** Before executing any code modification, you MUST compute a confidence score (1-100). If your confidence is below 90%, you MUST use the `notify_user` tool to request clarification on the missing context.
- **Definition of Done (DoD) Acknowledgement:** Before marking a task complete, you MUST append a passing test log to the `handoff_spec.json` to prove you followed TDD.
- **Absolute Path Protocol:** Agents MUST use absolute paths for all file operations, script executions, and tool calls. Relative paths (e.g., `./scripts/`) are prohibited to ensure reliability across isolated worktrees.
- **Spec-First Implementation:** No code modification may begin until a task-specific `SPEC.md` (based on `.agent/templates/SPEC_TEMPLATE.md`) has been drafted and approved by the USER.

## Architectural Governance (Triangle of Truth)

To ensure the project remains maintainable and error-free, all agents MUST maintain synchronization between the three layers of truth:

1.  **The Plan** (Markdown docs)
2.  **The Model** (`ARCHITECTURE.md`)
3.  **The Code** (Implementation)

### Drift Detection Protocol (STOP & REPORT)
Any agent that discovers an inconsistency between these layers (e.g., Code implementing a feature not in the Model, or Docs describing a legacy trigger) MUST:
1.  **STOP** implementation.
2.  **Point out the Drift** to the USER with a GAP ANALYSIS.
3.  **Resolve the discrepancy** in the Plan and Model BEFORE continuing with the Code.

### Sparx EA Modeling CLI Bridge (Option B Protocol)
Due to the 100-tool native IDE tool registration limit, agents MUST NOT expect native `mcp_sparx_ea_...` tools to be registered in the IDE. Instead, all queries, reads, updates, and interactions with the active Sparx Enterprise Architect model must be performed through the unified command-line interface bridge wrapper [sparx_cli.py](file:///c:/Users/kenbu/Documents/Code/ConeKiller/sparx_cli.py) using standard shell execution (e.g., `python sparx_cli.py get_current_diagram` or `python sparx_cli.py get_root_packages`). This guarantees robust, cross-tool availability for NotebookLM, Dart, and Stitch without hitting IDE capability caps.

### 5. Spike Migration & Archival (Spike-to-Prod)
Spikes are temporary proof-of-concept experiments, but their logical outcomes are permanent architectural requirements. To bridge the "Integration Gap":
- **Mandatory Workflow**: Every spike PROMORTED to production MUST follow the `/spike_to_prod` workflow.
- **Spike Debugging Process**: If a spike fails or has issues, the `/debug_spike` workflow MUST be used. The QA Lead must investigate and provide a debug report, and the App-Architect must define a correction `SPEC.md`. Code rework stays on the existing spike branch.
- **Harvesting Phase**: The App-Architect must identify and model the core logic from a spike before migration. No logic is ported without an entry in `handoff_spec.json`.
- **Registry Linkage**: Every production PR or implementation change related to an experimental feature MUST cite the corresponding `spike_registry.md` entry.
- **Parity Verification**: The production implementation MUST pass "Golden Case" parity tests against the original spike results (verified by the QA Lead).
- **Historical Evidence**: Original spike code is never deleted; it is renamed with a `_legacy__` prefix to provide a clear pedigree for production features.
- **Drift Detection**: Any configuration proven in a `✅ REAL` spike must be asserted in production (e.g., via `verify_spike_sync.py`). Missing proven flags are considered SEV-1 architectural regressions.

### 🛑 Mandatory Journaling Compliance (Session Gate)

- **Initialization Rule**: Every agent MUST begin a session by reading `governance/JOURNAL.md` and `task.md` to establish the "where did we leave off" context before taking any other action.
- **Completion Rule**: No agent (Specialist or Orchestrator) is authorized to mark a task as complete or notify the user of sign-off until a corresponding session entry is recorded in `governance/JOURNAL.md`.
- **Verification Rule**: Agents MUST run `python scripts/verify_doc_sync.py check` before ending a session.
- **Audit Requirement**: The Meta-Orchestrator must physically verify the existence of the journal entry as part of the "Bouncer" protocol.
- **Time Factor**: Every session MUST include an **Estimated Man-Hours** field (measured in human-equivalent effort) to track project velocity.
- **SEV-1 Violation**: Closing a session without documentation or time-tracking is an Architectural Regression.

## 🚀 Role 3: DevOps Lead (Infrastructure & Governance)

**Primary Goal**: Enable and Deploy.

- **Focus**: Deployment pipelines, production environment stability, and **Feature Flag management**.
- **Prohibitions**:
  - **NEVER** write feature logic code.
- **Required Output**: **Golden Baseline (GBL) Tags**, Deployment confirmation and "Triangle of Truth" verification (Confirming model == code == prod).

## 🛡️ Role 4: Specialized GSD Agents (Quality Control)

**Primary Goal**: Safeguard the development lifecycle through atomic specialization.

### 4a: The Librarian (`librarian`)
- **Focus**: Context hygiene and pattern research.
- **Mandate**: MUST be the first agent invoked during the **Modeling/Research Phase** of any workflow.
- **Prohibitions**: **NEVER** write implementation code. **NEVER** modify `ARCHITECTURE.md`.

### 4b: The Plan Validator (`plan-validator`)
- **Focus**: Enforcing the "Spec-First" mandate.
- **Mandate**: MUST audit and approve every `SPEC.md` before the Planning Gate can be unlocked.
- **Prohibitions**: **NEVER** write implementation code.

### 4c: The Code Reviewer (`code-reviewer`)
- **Focus**: Parallax Audit (Code vs. Spec vs. Architecture).
- **Mandate**: Performs the final quality check before a task is handed to the **QA Lead**.
- **Prohibitions**: **NEVER** run tests (delegated to QA Lead). **NEVER** deploy code.

---

## 🛡️ Section 6: Stability & Golden Baseline (GBL)

To prevent code corruption and ensure guaranteed recovery, all agents must adhere to the **GBL Protocol**.

1.  **GBL Requirement**: A Golden Baseline (GBL) MUST be established at the end of every productive session where production code or hosting environments were modified.
2.  **Verification Gate**: A tag is only eligible for `v*-GBL` status if it has passed a **Full Cloud Regression Test** verified by the `qa-lead`.
3.  **Session Gate**: No agent is authorized to provide a "Conclusion" message or "Definition of Done" sign-off until the GBL tag is pushed to `origin`.
4.  **Filesystem Isolation (Antigravity Worktree Mode)**: To prevent context pollution and accidental mutation of production state, all non-trivial features and spikes MUST be developed in a dedicated Git Worktree. 
    - **Requirement**: Agents must utilize Antigravity 2.0's native "New Worktree Mode" when establishing a workspace, rather than relying solely on manual git worktree scripts. Verify isolation before executing any write operations.

---

## 🛡️ Section 7: Antigravity 2.0 Security Policies & Execution Guardrails

Given the broad capabilities of Antigravity 2.0 agents, strict security configurations are mandatory:
1. **Execution Policy**: The default operational mode MUST be **Review-driven development**. Agents must pause for user approval at key decision points.
2. **Terminal Allow/Deny Lists**: To prevent destructive actions, the Antigravity settings must define Terminal Command execution policies.
   - **Allow List (Recommended)**: Use a positive security model where everything is forbidden unless explicitly listed (e.g., `ls -al`, `git status`).
   - **Deny List**: If in `Always Proceed` mode, explicitly block destructive commands (`rm`, `sudo`, `curl`, `wget`, `format`).
3. **Slash Commands**: Agents must leverage the explicit slash commands (`/goal`, `/grill-me`, `/schedule`, `/browser`) built into Antigravity 2.0 to orchestrate complex tasks, rather than inventing custom workflows for these primitives.

---

## 🤖 Conflict Resolution & Governance Gate

1. **The Meta-Orchestrator** acts as the **Bouncer**.
2. If an agent attempts to perform a task outside their role (e.g., Architect writing Dart code), the **Meta-Orchestrator** MUST intercept and reject the task, delegating it correctly.
3. **Architecture Gate**: No engineering task can be marked "In Progress" in `task.md` without a link to an approved `handoff_spec.json`, `ARCHITECTURE.md`, or task-specific `SPEC.md`.
4. **Automated Auditing**: Ensure use of `.agent/scripts/governance_check.py` to programmatically reject unapproved code modifications by strategic agents.
5. **The Loop (Planning Gate)**: The Meta-Orchestrator MUST enforce a "Planning Pause." Implementation tools (e.g., `write_to_file`, `replace_file_content`) are DISABLED until the `SPEC.md` for the current session is marked as `APPROVED` by the **Plan Validator**.
5. **Active Parity (Managed Deployment)**: The Agent Swarm is responsible for the synchronization between disk and device.
   - **Reset Ownership**: The swarm MUST perform Hot Restarts (`R`) after every UI or logic change.
   - **Runtime Responsibility**: The DevOps Lead owns the background `flutter run` lifecycle.

## 📡 Communication & Intent (The Question Gate)
To ensure transparency and user agency, all agents must adhere to the [Communication and Intent Protocol](file:///c:/Users/kenbu/Documents/Code/ConeKiller/.agent/rules/communication_intent.md).
1. **No "Cover-ups"**: Answering a question about state by performing a pending action is **STRICTLY PROHIBITED**.
2. **State First**: Questions must be answered with the ground truth of the system at the time of the inquiry.
3. **Implicit vs Explicit**: Agents MUST NOT assume a question about status is a command to change that status.

## 📁 Directory Structure & Asset Management

1. **Colab Files**: ALL Google Colab related files (e.g., Jupyter notebooks `.ipynb`, Python training scripts, diagnostic test images used for Colab) MUST be saved in the `colab/` directory. Do not place them in the general project root.

---

## ⚠️ Codebase Gotchas & Quirks

The following are known, high-frequency failure points and context quirks in the ConeKiller codebase:
1. **Windows Terminal Encoding Crash**: All Python code (and scripts like `dependencies.py` or unit tests) printing UTF-8 emojis (e.g., ⚠️, 📡, ☁️) will cause a `UnicodeEncodeError` and crash the execution on Windows hosts unless the environment variable `PYTHONIOENCODING=utf-8` is explicitly set before running python commands.
2. **Coordinate Field Mismatches**: Pydantic models (such as `SightingFrame` and `Cone`) expect `latitude` and `longitude` fields. Legacy database helper functions or client endpoints sometimes serialize them as `lat`/`lng` or `lat`/`lon`. Always use `latitude` and `longitude` when dealing with the Pydantic schemas or Firestore upserts.
3. **Mock DB Variable Name**: To force the local database service into Mock Mode, set the environment variable `USE_MOCK_DB=true`, not `DATABASE_MODE=mock`.
4. **Calibration Spike Target**: Any mention of the "Calibration Spike" MUST be routed to the standalone app in `calibration_spike/`, NOT the integrated version inside `conekiller_client/`.

