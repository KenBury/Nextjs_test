# Rule: Architecture Synchronization (Ground-Truth Protocol)
# Version: 1.0 | Last Updated: 2026-04-25


To maintain the **Triangle of Truth** and prevent architectural drift, all agents MUST follow this protocol when planning or executing changes.

## 📐 The Triangle of Truth

1.  **The Plan**: Markdown architecture documents (`architecture_spec.md`, `MASTER_PLAN.md`).
2.  **The Model**: Sparx EA UML / UML / BPMN models (`.qea`).
3.  **The Code**: The implementation in the repository.

## 🛡️ Synchronization Protocol

### 1. Pre-flight Verification (The Triple Check)
Before modifying ANY code, agents MUST verify that the proposed change aligns with:
- [ ] The current **Architecture Spec** (`architecture_spec.md`).
- [ ] The current **Sparx EA Model** (via sparx_cli.py).

### 2. Drift Detection & Escalation
If an agent discovers that the **Code** has diverged from the **Plan** or the **Model**:
1.  **STOP**: Cease all coding activity immediately.
2.  **REPORT**: Explicitly document the drift to the USER using a "Drift Detection Report" (GitHub ALERT).
3.  **RESOLVE**: Update the Plan and Model FIRST. Only proceed with code changes once the documentation reflects the target reality.

### 3. Change Propagation
Whenever a change is made to the architecture:
1.  Update the **Plan** (Markdown).
2.  Update the **Model** (Sparx EA).
3.  Implement the **Code**.
4.  Verify the triplet is in sync.

## ⚠️ Forbidden Actions
- **DO NOT** implement functions, classes, or services that are not defined in the Architecture Spec or Model.
- **DO NOT** assume the Code is the "Source of Truth" if it contradicts the Plan or Model.
- **DO NOT** bypass modeling for "simple" changes.

> [!IMPORTANT]
> Failure to synchronize the Triangle of Truth is considered a **Governance Violation** and must be remediated as a high-priority task.
