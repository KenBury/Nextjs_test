# Rule: Detailed Change Reporting (DCR)
# Version: 1.2 | Last Updated: 2026-04-25


## Context
Critical systems in ConeKiller (ARCore, VPS, SLAM, ML Inference, Firestore Schema, and Statistical Clustering) have complex interactions and high stakes. Small changes in native logic, database structures, or algorithmic weights can cause silent failures or significant regressions in the field.

## Mandatory Requirements
1. **Impact Analysis**: Every task affecting the following subsystems MUST include a "Detailed Change Report" (DCR) in the `artifacts/` directory:
   - `conekiller_client/packages/ar_flutter_plugin` (Native AR/ML)
   - `conekiller_client/lib/services/ar` (AR/VPS Services)
   - `conekiller_client/lib/models` (Core Data Models)
   - `conekiller_server/models/` (Python data models — cross-system contract with mobile client)
   - `backend/app/algorithms` (Statistical Clustering/SLAM)
   - Firestore Security Rules & Indexes
2. **Native/Dart/Data Boundary Mapping**: The report must explicitly list any changes to MethodChannel signatures, event streams, platform-specific flags, or Firestore collection schemas.
3. **Regression Reasoning**: If a system is being "fixed" or "refactored", the report must state the specific reason for the change (e.g., "removed broken shim", "optimized cluster epsilon") to provide context for future debugging.
4. **Verification Evidence**: The report must link to specific lines in the code, log files, or Firestore console paths that prove the change was implemented as intended.

## Reporting Structure
The DCR should follow this template:
- **Overview**: High-level goal.
- **Affected Components**: File paths, line ranges, or collection names.
- **Protocol/Schema Changes**: MethodChannel/API/Firestore updates.
- **Justification**: Why was this specific implementation chosen?
- **Known Risks**: Potential side effects or dependencies.

## Enforcement
- The AI Assistant MUST generate this report before closing a task.
- The `/deploy_feature` workflow will verify the existence of a DCR before proceeding to QA.
- Any manual database edits via the Firebase Console must be retroactively documented in a DCR.
