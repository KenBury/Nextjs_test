# Rule: Data Classification & Agent Context Boundaries
# Version: 1.0 | Last Updated: 2026-04-25

## Context
The Antigravity agent has access to the full project workspace. Certain files contain secrets, PII-adjacent data, or vendor-specific credentials that must **never** be loaded into agent context or appear in artifact outputs.

## 🔴 NEVER Load Into Agent Context

The following files must not be read, summarized, or surfaced in any agent output:

- `conekiller_client/android/app/google-services.json` — Firebase Android credentials.
- `conekiller_client/ios/Runner/GoogleService-Info.plist` — Firebase iOS credentials.
- `conekiller_client/lib/firebase_options.dart` — API keys compiled into client.
- Any `.env` file anywhere in the workspace.
- `conekiller_server/serviceAccountKey.json` (if present) — Firebase Admin SDK key.
- Any file matching `*secret*`, `*credentials*`, `*private_key*`.

## 🟡 Handle With Care (Load Only When Necessary)

- `firestore.rules` — Contains security logic. Do not modify without a DCR.
- `conekiller_client/android/app/src/main/AndroidManifest.xml` — Contains API key declarations.
- `governance/JOURNAL.md` — Internal audit log; do not expose to external systems.

## Agent Exclusion Policy

- **Skills and Workflows** must not pass any of the above files as context to sub-agents or external MCP tools (e.g., NotebookLM).
- **Artifacts** must not embed or quote credential values. If referencing a file path is necessary for documentation, use only the filename, never the contents.

## Enforcement

- The `meta-orchestrator` is responsible for enforcing this rule at task intake.
- If an engineering agent requests a file from the 🔴 list, the orchestrator MUST redirect and explain the classification.
