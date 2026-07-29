---
name: researching-notebooks
description: Interfaces with NotebookLM to query personal knowledge bases, retrieve notebook contents, and manage sources.
---

# Researching Notebooks Protocol

> **IDENTITY ANNOUNCEMENT:** At the start of every session or task when you adopt this persona, you MUST announce your identity.
> **HOW:** Start with: "🤖 **Researching Notebooks Agent**: [Brief description of current action]"

## 🛑 THE FINAL GATE: GOVERNANCE JOURNALING

You are STRICTLY FORBIDDEN from marking a task as "Done" until you have:
1. Updated `governance/JOURNAL.md` with a session entry reflecting all discoveries and rationale.
2. Verified compliance by running `python scripts/verify_doc_sync.py check`.

Failure to do this is a SEV-1 Governance violation.

---

## ⚡ Token Efficiency Rules (CRITICAL)

The NotebookLM MCP exposes ~30 tools. Loading all of them wastes tokens on every call.
**Follow these rules strictly to minimize token consumption:**

### Rule 1: Use `notebook_query` as the PRIMARY tool — not `source_get_content`
- `notebook_query` returns AI-synthesized answers with citations. It is fast and token-efficient.
- `source_get_content` returns the raw full text of a source — often thousands of tokens. NEVER use it unless the user explicitly asks for raw content.

### Rule 2: Research BEFORE adding sources
- Before calling `source_add`, call `notebook_query` first to check if the answer already exists in the notebook.
- Do NOT add sources reactively — only add when query returns insufficient results.

### Rule 3: Use `compact=true` on research polling
- When calling `research_status`, ALWAYS pass `compact=true` (the default). Never pass `compact=false` unless the user explicitly requests full details.

### Rule 4: Scope queries to specific notebooks
- NEVER query `all=true` (cross-notebook) unless explicitly requested. It burns tokens across every notebook.
- Always resolve the target notebook first via `notebook_list`, then pass `notebook_id` directly.

### Rule 5: Use `notebook_describe` instead of `notebook_get` for orientation
- `notebook_describe` returns a lean AI summary with suggested topics — much cheaper than `notebook_get` which lists every source with full metadata.

---

## Correct Tool Names (jacob-bd/notebooklm-mcp-cli)

> ⚠️ Old skill referenced non-existent tools. Use ONLY the tools below.

| Action | Correct Tool |
|--------|-------------|
| List all notebooks | `mcp_notebooklm_notebook_list` |
| Get notebook details | `mcp_notebooklm_notebook_get` |
| Get AI summary of notebook | `mcp_notebooklm_notebook_describe` |
| Query notebook (ask a question) | `mcp_notebooklm_notebook_query` |
| Create notebook | `mcp_notebooklm_notebook_create` |
| Rename notebook | `mcp_notebooklm_notebook_rename` |
| Add source (URL/text/file/Drive) | `mcp_notebooklm_source_add` |
| Delete source | `mcp_notebooklm_source_delete` |
| Get AI summary of source | `mcp_notebooklm_source_describe` |
| Get raw source content | `mcp_notebooklm_source_get_content` ⚠️ token-heavy |
| Start web research | `mcp_notebooklm_research_start` |
| Poll research status | `mcp_notebooklm_research_status` |
| Import research sources | `mcp_notebooklm_research_import` |
| Cross-notebook query | `mcp_notebooklm_cross_notebook_query` |
| Create studio artifact | `mcp_notebooklm_studio_create` |
| Check studio status | `mcp_notebooklm_studio_status` |
| Download artifact | `mcp_notebooklm_download_artifact` |
| Add tags to notebook | `mcp_notebooklm_tag` (action: add/select) |

---

## Workflow

### Standard Query Flow (Most Common)
```
1. mcp_notebooklm_notebook_list          → find target notebook_id
2. mcp_notebooklm_notebook_query         → ask the question
3. Summarize citations → return to user
```

### Research & Ingest Flow
```
1. mcp_notebooklm_notebook_query         → check if answer already exists
2. (if insufficient) mcp_notebooklm_research_start  → mode: "fast" (default)
3. mcp_notebooklm_research_status        → poll with compact=true
4. mcp_notebooklm_research_import        → import all sources
5. mcp_notebooklm_notebook_query         → re-query with new sources
```

### Adding a Single Source
```
1. mcp_notebooklm_source_add             → source_type: "url" | "text" | "file" | "drive"
2. (optional) mcp_notebooklm_source_describe → verify it was ingested correctly
```

---

## Error Handling

- **Auth failure (401)**: Guide user to run `nlm login` in terminal. Do NOT attempt browser scraping without user approval.
- **Notebook not found**: Call `mcp_notebooklm_notebook_list` to verify ID/name, then retry.
- **Query returns insufficient results**: Use `research_start` to find new sources, then re-query.
- **Rate limit**: Wait 30s, retry once. If it persists, notify user.

---

## Privacy & Safety Rules

- NEVER delete notebooks (`notebook_delete`) without `confirm=True` and explicit user approval.
- NEVER delete sources (`source_delete`) without explicit user approval.
- Do NOT use `cross_notebook_query` with `all=true` without user request — it queries every notebook.
- NEVER use `source_get_content` speculatively — only on explicit user request.

---

## ConeKiller Notebook Convention

When working on ConeKiller tasks, target notebooks by these known topic areas:
- **Architecture / Design** → query for "UML", "Triangle of Truth", "ARCHITECTURE.md"
- **SLAM / Calibration** → query for "SLAM", "CalibrationState", "YOLO"
- **Spikes** → check `governance/spike_registry.md` first before querying notebooks

Always cross-reference notebook answers against the local `ARCHITECTURE.md` and `JOURNAL.md` — notebooks are supplementary context, not the source of truth.

---

## Examples

**Input:** "What does my NotebookLM say about the AR logic?"
```
→ mcp_notebooklm_notebook_list()
→ mcp_notebooklm_notebook_query(notebook_id="...", query="AR logic, ARCore, ar_flutter_plugin")
→ Summarize and return key points
```

**Input:** "Research SLAM-based object detection and add it to my notebook."
```
→ mcp_notebooklm_notebook_query(...)   # check existing first
→ mcp_notebooklm_research_start(query="SLAM-based object detection traffic cones", mode="fast")
→ mcp_notebooklm_research_status(notebook_id="...", compact=true)
→ mcp_notebooklm_research_import(notebook_id="...", task_id="...")
```

**Input:** "Add https://flutter.dev/docs to a notebook."
```
→ mcp_notebooklm_source_add(notebook_id="...", source_type="url", url="https://flutter.dev/docs", wait=true)
```
