---
description: Coordinate the insertion of spike code components into the production implementation
---

# Workflow: Spike-to-Prod Migration

Use this workflow to formally migrate proven experimental logic from a **Spike** into the **Production Codebase**.

---

## ⛔ Prerequisites (Hard Gates — ALL must pass before proceeding)

These are checked by the **QA Lead**. Failure of any gate **blocks** this workflow.

| Gate | Check |
| :--- | :--- |
| **Gate 1 — Registry Entry** | `governance/spike_registry.md` contains an entry for this spike. |
| **Gate 2 — Report Exists** | `governance/spike_evidence/<spike_name>_verification.md` exists. |
| **Gate 3 — REAL Status** | Registry status is `✅ REAL`. A status of `⚠️ SIMULATED` **permanently blocks** this workflow until a REAL test is conducted. |
| **Gate 4 — Result PASS** | The verification report `Result` field is `PASS`. |
| **Gate 5 — Risk Acknowledgment** | All `Assumptions Carried Forward` in the report have been read and acknowledged by the USER. |

> [!CAUTION]
> **`SIMULATED` ≠ done.** If the spike was only validated with mock or random data, it has not proven the technology works. Porting `SIMULATED` spike code into production creates the illusion of working software. The QA Lead will file a `TestFailureLog` blocking this workflow.

---

## 🚀 Execution Steps (After All Gates Pass)

### 1. Spike Review (Planning — App-Architect)

Present a **Harvesting Plan** to the user:
- **Core Logic**: Identify specific functions, classes, or algorithms to migrate.
- **Disposable Code**: Identify what is discarded (debug buttons, mock data generators, simulation loops).
- **Refactoring Intent**: Define how the logic will be improved for production (e.g., "Extract `TFLiteInference` into a Singleton Service").
- **Open Risk Resolution**: Confirm how each `Assumption Carried Forward` from the verification report will be handled.

---

### 2. Architectural Modeling (App-Architect → Sparx EA)

// turbo
1. Update the Sparx EA UML/ArchiMate models to reflect the new Production Service.
2. Define the class interface (UML) based on the spike's verified behavior.
3. Use the CLI bridge wrapper ([sparx_cli.py](file:///c:/Users/kenbu/Documents/Code/ConeKiller/sparx_cli.py)) to synchronize changes in the Sparx EA project file.

---

### 3. TDD Setup (QA Lead)

1. Create an **Integration Test** in the production codebase that replicates the spike's "Golden Case".
2. Confirm the test **fails predictably** before implementation begins.
3. Document the test in `VERIFICATION_GUIDE.md`.

---

### 4. Implementation (Specialist Engineer)

1. Implement the refactored logic in the production directory (`lib/services/`, etc.).
2. Ensure production code follows the Apex Neon design system (if UI is involved).
3. Update the production screen to consume the new service.
4. Do NOT carry over simulation code (mock timers, random data generators, stub UUID returns, etc.).

---

### 5. Archival (Historical Evidence)

// turbo
1. **Do NOT delete** the spike directory.
2. Rename the spike entry point with a `_legacy_` prefix (e.g., `_legacy_spike_tflite`).
3. Update the verification report's `Disposition` section to note the production implementation location.
4. Update `spike_registry.md` to add a link to the production service file.

---

### 6. Final Verification (QA Lead)

1. Run `flutter test` and/or `pytest` to confirm the integration tests pass.
2. Run the feature on a physical device and capture evidence.
3. Present a **Walkthrough** comparing the original spike evidence with the new production behavior.
4. QA Lead signs off the verification report's `Disposition` section.

---

## ⚖️ Governance Rules

- **No Simulation in Production**: Simulation code (mock timers, random data, stub returns) must never appear in the production implementation.
- **No Direct Copy-Paste**: All code must be refactored for the production architecture.
- **Triangle of Truth**: Migration is not complete until Architecture Spec, Sparx EA Model, and Production Code are in sync.
- **Risk Resolution**: Every `Assumption Carried Forward` from the spike must be resolved or explicitly deferred with a filed `RISK` item in `architecture_spec.md`.
