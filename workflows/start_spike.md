---
description: Start a new isolated experimental Spike
---

# Workflow: Start Spike

Follow these steps to initialize a new isolated experimental spike. **Do not skip any step.**
Missing documentation is grounds for the QA Lead to cancel the spike.

---

## Step 1: Define the Goal Question

State the **single specific question** this spike is designed to answer.
This must be a falsifiable question — one that has a clear YES/NO/MEASURED answer.

> ✅ Good: "Can TFLite detect a traffic cone in a live ARCore camera frame at 30fps on a Pixel device?"
> ❌ Bad: "Test if TFLite works."

---

## Step 2: Register the Spike (MANDATORY — do this BEFORE writing code)

2a. Add a row to **[`governance/spike_registry.md`](../../governance/spike_registry.md)** with:
  - Spike name (snake_case)
  - Goal question
  - Planned entry point
  - Status: 🔬 `IN PROGRESS`

2b. Create the verification report stub by copying the template:
  - Source: `governance/spike_evidence/_TEMPLATE_verification.md`
  - Destination: `governance/spike_evidence/<spike_name>_verification.md`
  - Fill in: **Goal Question** and **Success Criteria** sections only.
  - Leave Evidence and Result blank — those are filled AFTER the test.

> [!CAUTION]
> The spike does not officially exist until both the registry entry and the report stub are created.

---

## Step 3: Create the Isolation Directory

- Create `lib/screens/spike/<spike_name>_screen.dart` (or equivalent for non-Flutter spikes).
- Create `lib/main_spike_<name>.dart` as the dedicated entry point.
- Import the spike screen and set it as the `home` of the `MaterialApp`.

---

## Step 4: Code the Spike

- Import shared models from `lib/models/` or `lib/domain/` to maintain the Triangle of Truth.
- Keep all spike logic inside the spike directory. Do NOT modify production files.
- Log your channel names, method names, and assumptions in comments.

---

## Step 5: Run and Capture Evidence

// turbo
- Run the spike using its dedicated entry point:  
  `flutter run -t lib/main_spike_<name>.dart`
- Capture logcat output, screenshots, or screen recordings.
- **If using mock/simulated data:** note this explicitly. The spike status will be `⚠️ SIMULATED`.
- **If using real hardware and real data:** this is the target. Status becomes `✅ REAL`.

---

## Step 6: Complete the Verification Report

Fill in the remaining sections of `governance/spike_evidence/<spike_name>_verification.md`:
- Test Environment (device, build command, Real vs Mocked)
- Evidence (paste logs, screenshot paths)
- Result (PASS / FAIL / PARTIAL)
- Assumptions Carried Forward
- **Detailed Change Report**: If this spike modifies native code or critical protocols, attach a DCR as per [detailed_change_reporting.md](file:///c:/Users/kenbu/Documents/Code/ConeKiller/.agent/rules/detailed_change_reporting.md).

Request **QA Lead review** to update the registry status from 🔬 `IN PROGRESS` to its final state.

---

## Step 7: Handoff

Once the QA Lead marks the spike `✅ REAL` and the result is PASS:
- The spike is eligible for the `/spike_to_prod` workflow.
- Do NOT port any `⚠️ SIMULATED` spike results into production code.
