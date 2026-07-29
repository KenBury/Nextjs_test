# Agent Registry & Capabilities

This document serves as the "Global Shared State" for the Antigravity Swarm.

## Global Directives

- **Calibration Spike Targeting:** Whenever working on the "Calibration Spike", agents MUST operate exclusively on the standalone app in `calibration_spike/`. They must NEVER operate on the integrated version within `conekiller_client/`.
## Meta-Orchestrator (`orchestrating-meta`)

- **Role:** Executive Function & Dispatcher.
- **Capabilities:**
  - Context_Translation
  - Task_Delegation
  - Artifact_Validation
  - **TDD-Guard:** Intercepts `TestFailureLog` / `BugReport` and triggers remediation.

## QA Lead (`leading-qa`)

- **Role:** Quality Assurance & Standards Enforcer.
- **Capabilities:**
  - **TDD-Reporting:** Generates standardized `BugReport` and `TestFailureLog` artifacts upon failure.
  - **Test Automation:** Authorized to use `SafeToAutoRun: true` for browser JS and test commands (`flutter test`, `pytest`) to accelerate verification.

## Web Engineer (`engineering-web`)

- **Role:** Frontend Developer (Web).
- **Capabilities:**
  - **Autofix:** Prioritizes resolving "QA Identified Regressions" to satisfy TDD-Guard.
  - Flutter/Dart Implementation.
  - **3D/AR:** ARCore/3D Tiles Visualization & Geospatial Data Binding.

## AR Engineer (`engineering-ar`)

- **Role:** Frontend Developer (Mobile AR).
- **Capabilities:**
  - ARCore Logic.
  - Mobile Hardware Integration.

## Backend Engineer (`engineering-backend`)

- **Role:** Backend Developer.
- **Capabilities:**
  - Python/FastAPI.
  - Firebase/Firestore.

## App Architect (`architecting-app`)

- **Role:** System Design & Strategy.
- **Capabilities:**
  - Sparx EA/UML modeling.
  - Master Plan updates.

## Database Admin (`administering-database`)

- **Role:** Data Layer Governance.
- **Capabilities:**
  - Firestore Schema Design & Security Rules.
  - Index management and query optimization.
  - Cross-system data contract verification (Dart ↔ Python models).

## Librarian (`managing-context`)

- **Role:** Context Management & Research.
- **Capabilities:**
  - **Context Compression**: Scouts `JOURNAL.md`, `ARCHITECTURE.md`, and NotebookLM sources to provide atomic knowledge packets.
  - **Pattern Discovery**: Identifies existing logic in "Spikes" to prevent redundant engineering.
  - **Prohibition**: NEVER writes implementation code.

## Plan Validator (`validating-plans`)

- **Role:** GSD "Planning Gate" Enforcer.
- **Capabilities:**
  - **Spec Audit**: Verifies that every `SPEC.md` has measurable success criteria and a UAT verification script.
  - **Triangle Alignment**: Ensures tactical plans exactly match the strategic `ARCHITECTURE.md`.
  - **Prohibition**: NEVER writes implementation code.

## Code Reviewer (`reviewing-code`)

- **Role:** Quality & Architectural Audit.
- **Capabilities:**
  - **Parallax Review**: Compares implemented code against the `SPEC.md` to detect scope creep or technical debt.
  - **Style Guard**: Enforces the Absolute Path Protocol and naming conventions.
  - **Prohibition**: NEVER runs tests (delegated to QA Lead).
