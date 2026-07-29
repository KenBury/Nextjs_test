# UI Prototyping Rule (Stitch)
# Version: 1.0 | Last Updated: 2026-04-25


All user interface changes in the ConeKiller project (both **Flutter Mobile** and **Web Dashboard**) MUST follow a "Design First" protocol using the Google Stitch UI MCP.

## Mandatory Prototyping Sequence

Before any frontend code (HTML/JS/Flutter) is committed or implemented, the following steps must be completed:

1. **Design System**: A design system must exist or be created for the project using `mcp_StitchMCP_create_design_system`.
2. **Screen Generation**: Base screens must be generated from descriptive prompts using `mcp_StitchMCP_generate_screen_from_text`.
3. **Variant Iteration**: At least 3 variants must be generated for each major UI component using `mcp_StitchMCP_generate_variants`.
4. **User Sign-off**: The user must review screenshots of the variants and approve the final design.

## Technical Requirements

- **Project IDs**: All Stitch operations must be associated with the current project's Stitch ID.
- **Consistency**: All screens must have the project's design system applied via `mcp_StitchMCP_apply_design_system`.
- **Handoff**: The final approved variant should serve as the primary visual reference for implementation.

## Exemptions

- Minor bug fixes to existing UI (e.g., color tweaks, minor spacing).
- Purely functional backend changes with no exposure to the frontend.
