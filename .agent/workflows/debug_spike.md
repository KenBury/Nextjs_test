---
description: Debug and rework an isolated experimental Spike
---

# Workflow: Debug Spike

Follow these steps when a spike (`🔬 IN PROGRESS` or `⚠️ SIMULATED`) fails to meet its goals, exhibits bugs, or needs structural adjustments based on user feedback.

---

## Step 1: Trigger & Evidence Gathering

**User / Orchestrator Action:**
- Identify the spike that needs debugging.
- Provide evidence of the issue (logcats, screenshots, test failure logs, or user feedback) to the swarm.
- Keep the work on the **existing spike branch** since the spike is not yet considered complete.

---

## Step 2: QA Lead Investigation

**Role:** `leading-qa`
- **Review Intent:** Read the goal question and success criteria in `governance/spike_evidence/<spike_name>_verification.md` and the `MASTER_PLAN.md`.
- **Review As-Built:** Analyze the current spike code against the provided evidence.
- **Document Findings:** Create a Debug Report at `governance/spike_evidence/<spike_name>_debug_report.md`.
  - Include the identified root cause.
  - Detail any divergence from the original intent.
- **Handoff:** Pass the `_debug_report.md` to the App Architect.

---

## Step 3: Architectural Review

**Role:** `architecting-app`
- **Analyze Findings:** Review the QA Lead's debug report against the `ARCHITECTURE.md` model, user journey, and tech stack choices.
- **Discuss with User:** If the issue stems from an architectural flaw (e.g., wrong tool for the job, impossible user journey), discuss potential adjustments with the user.
- **Correction Plan (The Plan Gate):** Draft a `SPEC.md` detailing the required rework for the developer agents. If the tech stack or model needs changing, update `ARCHITECTURE.md` and relevant `SKILL.md` files.
- **Approval:** Wait for explicit **User Approval** on the `SPEC.md` before coding begins.

---

## Step 4: Developer Execution

**Role:** Appropriate Engineering Agent (`engineering-web`, `engineering-ar`, etc.)
- **Implement Rework:** Execute the approved `SPEC.md`.
- **Isolation:** Keep all changes strictly within the spike's isolated directory (`lib/screens/spike/<spike_name>_...`).
- **Handoff:** Notify the QA Lead when the rework is complete.

---

## Step 5: QA Testing Loop

**Role:** `leading-qa`
- **Verify Rework:** Run the spike using its dedicated entry point (`flutter run -t lib/main_spike_<name>.dart`).
- **Pass/Fail:** 
  - If **FAIL**: Generate a `TestFailureLog` and send the task back to Step 4.
  - If **PASS**: Update the `<spike_name>_verification.md` and notify DevOps.

---

## Step 6: Lightweight Spike Deployment

**Role:** `leading-devops`
- **Deploy for UAT:** Execute a lightweight deployment specific to spike testing.
  - *Web/Backend:* Deploy to a dedicated staging/spike Firebase target or local container.
  - *Mobile:* Compile an APK or prepare a quick iOS Sideload (without full production signing checks if possible).
- **Handoff:** Notify the User that the revised spike is available for testing.

---

## Step 7: User Verification

**User Action:**
- Test the deployed spike.
- If issues persist, loop back to **Step 1**.
- If approved, the QA Lead updates the registry status to `✅ REAL` (if applicable) and the spike is ready for `/spike_to_prod`.
