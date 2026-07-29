---
description: High-Availability (HA) Git Workflow for ConeKiller
---

# High-Availability (HA) Git Workflow

This workflow ensures that the ConeKiller codebase remains stable, traceable, and revertible. All agents MUST follow these protocols for every task.

## 1. Semantic Versioning (SemVer)

We use a **MAJOR.MINOR.PATCH** system (`vX.Y.Z`).

- **MAJOR (X)**: Incompatible architectural shifts or breaking API changes.
- **MINOR (Y)**: Backwards-compatible new features (e.g., New UI screens, new services).
- **PATCH (Z)**: Backwards-compatible bug fixes and small tweaks.

## 2. Branching Strategy

> [!IMPORTANT]
> **NEVER** commit directly to `main`. Every task requires a branch created from the latest `main`.

- `feat/feature-name`: For new functionality (Increments MINOR).
- `fix/bug-name`: For bug fixes (Increments PATCH).
- `spike/experimental-name`: For isolated experiments (Does not increment version until integrated).
- `docs/topic-name`: For documentation updates.

## 3. Implementation Cycle

1. **Model Sync**: Update Sparx EA architecture BEFORE writing code.
2. **Branch**: `git checkout -b <prefix>/<name>`
3. **Commit**: Use conventional commit messages:
    - `feat: [description]`
    - `fix: [description]`
    - `docs: [description]`
    - `arch: [description]` (for Sparx EA syncs)
4. **Push**: Always push branches to GitHub for remote redundancy.

## 4. Merging & Revertibility

> [!CAUTION]
> **DO NOT SQUASH MERGE.** We prioritize the full history over a clean log.

### To Merge a Feature

1. Ensure all tests (`pytest`, `flutter test`) pass.
2. `git checkout main`
3. `git merge --no-ff <branch-name>` (Mandatory merge commit).
4. **Golden Baseline (GBL) Tagging**:
   - Immediately after a production-verified merge, create a GBL tag:
   - `git tag -a v0.X.Y-GBL -m "Production verified save point"`
   - `git push origin --tags`

## 5. Stability Protocol: The Golden Baseline (GBL)

A **Golden Baseline (GBL)** is a verified state of the codebase that has passed a **Full Cloud Regression Test**. 

- **Frequency**: A GBL MUST be created at the end of every productive session or successful feature deployment.
- **Immutability**: GBL tags are permanent and must never be deleted or moved.

## 6. Revert Procedure

If a regression or corruption is found in `main`:

1. **Identify the GBL**: Use `git tag -l "*GBL"` to find the most recent Golden Baseline.
2. **Instant Restore**: `git reset --hard <LATEST_GBL_TAG>`
3. **Traceability**: If you must revert beyond a GBL, document the rationale in `governance/JOURNAL.md` and obtain USER approval before force-pushing.
