# Rule: Mandatory Human Checkpoint Protocol
# Version: 1.0 | Last Updated: 2026-04-25

## Context
Antigravity agents operate with supervised autonomy. Certain actions carry enough risk that the agent MUST pause and explicitly request human confirmation before proceeding, regardless of confidence level or workflow stage.

## 🛑 MANDATORY STOP — Await Human Confirmation Before:

### Production Infrastructure
- Any write to a **production Firestore collection** (not emulator/mock).
- Any `firebase deploy` to the live hosting URL.
- Any `gcloud` or Cloud Run deployment command.
- Any change to `firestore.rules` that modifies `allow write` permissions.

### Native AR / Mobile
- Any modification to `packages/ar_flutter_plugin/android/` (native Kotlin/Java).
- Any change to `AndroidManifest.xml` that adds a new `<uses-permission>`.
- Any change to ARCore session configuration flags (`geospatialMode`, `depthMode`).

### Critical Algorithms
- Any change to statistical clustering parameters (DBSCAN epsilon, min_samples).
- Any change to SLAM weight matrices or graph optimization parameters.
- Any change to ML model inference thresholds (TFLite confidence cutoffs).

### Schema & Contracts
- Any addition or removal of a field from a Firestore document schema.
- Any change to the API contract between `conekiller_server` and `conekiller_client` (request/response shape).

## 📋 Confirmation Format

When a checkpoint is triggered, the agent MUST display:

```
⚠️ MANDATORY CHECKPOINT
Action: [Describe the action]
Risk: [Why this requires confirmation]
Affected System: [File/Collection/Service]
Proceed? (yes/no)
```

## Enforcement

- **All agents** are bound by this rule — it supersedes confidence scoring.
- The `meta-orchestrator` MUST intercept any attempt to bypass a checkpoint.
- Checkpoints cannot be waived by workflow `// turbo` annotations.
