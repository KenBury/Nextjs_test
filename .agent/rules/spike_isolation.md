# Spike Isolation Policy
# Version: 1.0 | Last Updated: 2026-04-25


All experimental, diagnostic, or "Spike" development MUST follow this isolation policy to prevent corruption of the production codebase and established "Triangle of Truth".

## 📜 The Core Principles

1.  **Strict Isolation**: Spike code MUST NEVER reside in the same execution path as production code. 
2.  **Dedicated Entry Points**: Every spike MUST have a dedicated entry point (e.g., `lib/main_spike.dart`, `app_spike.py`) that is distinct from the primary `main` file.
3.  **Namespace Separation**: UI and logic specific to a spike MUST be placed in a `spike/` subdirectory within the relevant component (e.g., `lib/screens/spike/`).
4.  **Shared Core Entities**: Spikes SHOULD reuse existing domain models and interfaces from the `lib/models/` or `lib/domain/` layers to ensure architectural alignment.

## 🛠️ Implementation Rules

- **Flutter**: Use `flutter run -t lib/main_<spike_name>.dart` for execution.
- **Backend**: Use a dedicated `spike_<name>.py` script or a separate Docker container if necessary.
- **Git**: Spikes should be developed on a branch (e.g., `spike/cone-placement`) and only merged if the core architecture is validated and the spike code is refactored into production-grade logic.

## 🚦 Governance Gate
The **Meta-Orchestrator** MUST reject any "Spike" implementation that attempts to modify `main.dart` or existing production screens directly.
