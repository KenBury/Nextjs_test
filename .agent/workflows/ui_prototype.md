---
description: Systematic UI Prototyping using Google Stitch MCP for Mobile and Web.
---

# UI Prototyping Workflow (Stitch)

This workflow defines the standard procedure for designing and iterating on user interfaces using the Google Stitch platform before any frontend implementation begins.

## 1. Setup Phase

- **Check Project**: Identify the Stitch Project ID using `mcp_StitchMCP_list_projects`.
- **Sync Design System**: Ensure the project design system is up to date using `mcp_StitchMCP_get_project` and `mcp_StitchMCP_list_design_systems`.

## 2. Iteration Phase

- **Prompt**: Formulate a descriptive prompt for the screen (e.g., "A modern activity feed for an AR game showing player scores and recent cone captures").
- **Generate**: Call `mcp_StitchMCP_generate_screen_from_text`.
- **Variants**: Generate at least 3 variants using `mcp_StitchMCP_generate_variants` to explore different layouts and creative directions.

## 3. Review & Refinement

- **Screenshots**: Present screens/variants to the user for review.
- **Edit**: Apply feedback using `mcp_StitchMCP_edit_screens` for targeted modifications.
- **Styling**: Ensure visual consistency by calling `mcp_StitchMCP_apply_design_system` on the final selection.

## 4. Handoff Phase

- **Documentation**: Record the selected Screen ID and variant details.
- **Reference**: Use the approved design as the source of truth for implementation in Flutter (Mobile) or Vanilla CSS/JS (Web).
