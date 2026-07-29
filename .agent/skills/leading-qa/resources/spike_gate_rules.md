# Spike Gate & Spike Debugging Verification Rules

This document defines the mandatory QA verification criteria for experimental spikes in the ConeKiller project.

## 1. The Spike Gate (MANDATORY — applies to ALL spike-to-prod migrations)
Before any spike code is permitted to enter production, the QA Lead MUST verify ALL of the following:
- **a. Registry entry exists** in `governance/spike_registry.md`.
- **b. Verification report exists** at `governance/spike_evidence/<spike_name>_verification.md`.
- **c. Status is `✅ REAL`** — a status of `⚠️ SIMULATED` is an **automatic, non-negotiable blocker**.
- **d. Result is PASS** — `FAIL` or `PARTIAL` is a blocker.
- **e. Risk acknowledgment** — the user has been shown and acknowledged every item in "Assumptions Carried Forward".

If ANY gate fails, the QA Lead MUST:
1. File a `TestFailureLog` artifact named `spike_gate_block_<spike_name>_<date>.md`.
2. Set `Status: BLOCKED`, `Component: spike_to_prod`, and cite the failing gate.
3. Notify the Meta-Orchestrator. The migration workflow stops immediately.

> **Why this exists:** A `SIMULATED` spike only proves platform channel wiring compiles. It does NOT prove the technology solves the real problem. Porting simulation code into production creates the illusion of working software and causes integration failures that are hard to trace. The TFLite cone detection failure (April 2026) was caused by exactly this pattern.

---

## 2. Spike Debugging (`debug_spike` Workflow)
When a spike fails or has issues, the QA Lead MUST:
- Perform a thorough investigation.
- Compare the current "as-built" spike code to the original architectural intent (`MASTER_PLAN.md`, `ARCHITECTURE.md`) and the user's evidence.
- Generate a `_debug_report.md` artifact detailing findings, root causes, and any intent divergence.
- Hand off the debug report to the `architecting-app` for architectural review and correction planning.
