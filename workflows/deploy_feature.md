---
description: Standard procedure for deploying a new feature to production, involving QA verification and DevOps deployment.
---

# Feature Deployment Workflow

Use this workflow when a feature implementation is complete and ready for production deployment.

## 0. Governance Gate (Automated Bouncer)

- **Actor**: `meta-orchestrator`
- **Action**: Run the automated governance audit on staged files.
// turbo
- **Command**: `python .agent/scripts/governance_check.py`
- **Gate**: If violations are reported, stop and resolve before proceeding.

## 1. QA Verification

- **Actor**: `qa-lead`
- **Action**: Run integration tests and verification scripts.
- **Tools**: `flutter test`, `pytest`, `flutter analyze`.
- **Pro Tip**: Use the `/goal` slash command to authorize autonomous overnight QA testing and exhaustive regression analysis.
- **Gate**: If tests fail, stop and return to Engineering.

## 1.2 Detailed Change Report (DCR) Verification

- **Actor**: `meta-orchestrator`
- **Action**: Verify that a **Detailed Change Report** (DCR) exists in the `artifacts/` directory if the feature affects critical systems (AR, VPS, SLAM, ML).
- **Rule**: Follow [detailed_change_reporting.md](file:///c:/Users/kenbu/Documents/Code/ConeKiller/.agent/rules/detailed_change_reporting.md).
- **Gate**: If a required DCR is missing, the deployment is blocked.

## 1.5 Architectural Sync (Final Check)

- **Actor**: `app-architect`
- **Action**: Perform a final drift check — verify the implementation (as confirmed by QA) matches the Sparx EA model. Any divergence is a **SEV-1 Drift Alert** and blocks deployment.
- **Workflow**: Use the Python CLI bridge (`python sparx_cli.py <query_tool>`) to query the Sparx EA project state. Do NOT assume native `mcp_sparx_ea_...` tools are available.
- **Gate**: If drift is detected between the EA model and the deployed code, deployment is blocked until the model is updated or a Change Request is filed.

## 2. Pre-Deployment Check

- **Actor**: `devops-lead`
- **Action**: Verify build configuration and environment settings.
- **Check**: `firebase.json` (Hosting), `google-services.json` (Android/iOS).

## 3. Build & Deploy (Infrastructure)

- **Actor**: `devops-lead`
- **Action**: Build and deploy Web, Backend, and Mobile artifacts.
- **Pro Tip**: Use the `/schedule` slash command to automate recurring nightly deployments or scheduled rollouts.
// turbo
- **Command**: `flutter build web --release`
// turbo
- **Command**: `firebase deploy --only hosting`
// turbo
- **Command**: `flutter build apk --release`

## 4. Mobile Deployment (On-Device Verification)

- **Actor**: `devops-lead`
- **Action**: Check for connected physical mobile hardware to verify the build.
// turbo
- **Command**: `flutter devices`
- **Action**: If a device is found, install the latest APK.
// turbo
- **Command**: `flutter install`

## 5. Live Verification (Web)

- **Actor**: `qa-lead`
- **Action**: Verify the deployed URL with cache-busting to ensure fresh content.
- **Steps**:
  1. Navigate to production URL
  2. Clear browser cache via JavaScript:

     ```javascript
     if ('caches' in window) {
       caches.keys().then(names => names.forEach(name => caches.delete(name)));
     }
     location.reload(true);
     ```

  3. Verify new version/features are present

## 6. User Handoff

- **Actor**: `meta-orchestrator`
- **Action**: Notify user of success with the live URL and confirm mobile installation status.
