#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Governance Check Script (The Bouncer) v2.1
Run this script to audit staged git commits against the project's Governance Protocol.

Checks:
  1. SoD Violation      -- Flags code file commits (Architect role boundary).
  2. DCR Requirement    -- If critical-path files are staged, a DCR artifact must exist (modified < 24h).
  3. Checkpoint Warning -- Flags high-risk files that required a mandatory human sign-off.
  4. Journal Gate       -- If production code is staged, JOURNAL.md must also have been modified.
  5. Doc Sync           -- Calls verify_doc_sync.py to confirm the journal hash changed this session.
  6. GBL Requirement    -- Warns if a Golden Baseline (v*-GBL) tag is missing after prod changes.
"""

import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Restricted extensions for strategic roles (e.g., app-architect cannot edit these)
RESTRICTED_CODE_EXTENSIONS = {'.dart', '.py', '.js', '.html', '.css', '.ts'}

# Critical paths that require a DCR artifact when modified
# Keys: human-readable label. Values: path prefixes to match against staged files.
DCR_REQUIRED_PATHS = {
    "Native AR/ML Plugin":       "conekiller_client/packages/ar_flutter_plugin",
    "AR/VPS Services":           "conekiller_client/lib/services/ar",
    "Core Dart Models":          "conekiller_client/lib/models",
    "Python Server Models":      "conekiller_server/models",
    "Backend Algorithms (SLAM)": "backend/app/algorithms",
    "Firestore Rules/Indexes":   "firestore",
}

# High-risk files/paths that require a mandatory human checkpoint before commit
CHECKPOINT_REQUIRED_PATHS = [
    "conekiller_client/packages/ar_flutter_plugin/android",
    "conekiller_client/android/app/src/main/AndroidManifest.xml",
    "firestore.rules",
    "firestore.indexes.json",
    "backend/app/algorithms",
    "conekiller_server/models",
]

# Where DCR artifacts live (relative to repo root)
ARTIFACTS_DIR = Path("artifacts")

# DCR must have been modified within this window to count as "current session"
DCR_MAX_AGE_HOURS = 24

# Production code paths that trigger the Journal Gate check
JOURNAL_GATE_PATHS = [
    "conekiller_client/lib",
    "conekiller_client/packages",
    "conekiller_server",
    "backend",
    "firestore",
]

# Path to the development journal (relative to repo root)
JOURNAL_PATH = "governance/JOURNAL.md"

# Path to the doc sync script (relative to repo root)
DOC_SYNC_SCRIPT = Path("scripts/verify_doc_sync.py")

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_repo_root():
    try:
        result = subprocess.run(
            ['git', 'rev-parse', '--show-toplevel'],
            capture_output=True, text=True, check=True
        )
        return Path(result.stdout.strip())
    except subprocess.CalledProcessError:
        return Path.cwd()


def get_staged_files():
    try:
        result = subprocess.run(
            ['git', 'diff', '--cached', '--name-only'],
            capture_output=True, text=True, check=True
        )
        return result.stdout.splitlines()
    except subprocess.CalledProcessError:
        print("[WARN] Not inside a git repository or git is not installed.")
        return []


def find_recent_dcr(repo_root):
    """Return DCR markdown files modified within DCR_MAX_AGE_HOURS."""
    cutoff = datetime.now() - timedelta(hours=DCR_MAX_AGE_HOURS)
    artifacts_path = repo_root / ARTIFACTS_DIR
    if not artifacts_path.exists():
        return []
    recent = []
    for f in artifacts_path.glob("*.md"):
        mtime = datetime.fromtimestamp(f.stat().st_mtime)
        if mtime >= cutoff:
            recent.append(f)
    return recent


def normalise(path_str):
    """Normalise path separators for cross-platform matching."""
    return path_str.replace("\\", "/")

# ---------------------------------------------------------------------------
# Checks
# ---------------------------------------------------------------------------

def check_architect_violations(files):
    return [f for f in files if any(f.endswith(ext) for ext in RESTRICTED_CODE_EXTENSIONS)]


def check_dcr_requirement(files, repo_root):
    """
    Returns a list of (label, files_list) for critical-path files that are
    staged but have no recent DCR artifact.
    """
    triggered = {}
    for f in files:
        nf = normalise(f)
        for label, prefix in DCR_REQUIRED_PATHS.items():
            if nf.startswith(normalise(prefix)):
                triggered.setdefault(label, []).append(f)

    if not triggered:
        return []

    recent_dcrs = find_recent_dcr(repo_root)
    if recent_dcrs:
        return []  # Pass: DCR requirement satisfied

    return [(label, files_list) for label, files_list in triggered.items()]


def check_checkpoint_warnings(files):
    """Returns high-risk staged files that should have had a human checkpoint."""
    warnings = []
    for f in files:
        nf = normalise(f)
        for path in CHECKPOINT_REQUIRED_PATHS:
            if nf.startswith(normalise(path)) or nf == normalise(path):
                warnings.append(f)
                break
    return warnings


def check_journal_gate(files, repo_root):
    """
    Check 4: If any production code path is staged, the journal must also
    have been modified (staged or modified on disk within the last 24h).
    Returns True (fail) if journal is stale, False if OK.
    """
    has_prod_code = any(
        normalise(f).startswith(normalise(p))
        for f in files
        for p in JOURNAL_GATE_PATHS
    )
    if not has_prod_code:
        return False  # No production code staged -- gate not triggered

    journal_abs = repo_root / JOURNAL_PATH

    # First: check if journal is in the staged files
    journal_staged = any(normalise(f) == normalise(JOURNAL_PATH) for f in files)
    if journal_staged:
        return False  # Journal is being committed alongside code -- pass

    # Second: check if journal was modified on disk in the last 24h (session window)
    if journal_abs.exists():
        mtime = datetime.fromtimestamp(journal_abs.stat().st_mtime)
        if mtime >= datetime.now() - timedelta(hours=24):
            return False  # Modified recently -- pass

    return True  # Journal stale -- fail


def check_doc_sync(repo_root):
    """
    Check 5: Run verify_doc_sync.py check to confirm the journal hash
    changed since the session marker was written.
    Returns (passed: bool, output: str).
    """
    script = repo_root / DOC_SYNC_SCRIPT
    if not script.exists():
        return True, f"[SKIP] {DOC_SYNC_SCRIPT} not found -- skipping doc sync check."

    try:
        result = subprocess.run(
            [sys.executable, str(script), "check"],
            capture_output=True, text=True,
            cwd=str(repo_root)
        )
        output = (result.stdout + result.stderr).strip()
        passed = result.returncode == 0
        return passed, output
    except Exception as e:
        return True, f"[SKIP] Could not run verify_doc_sync.py: {e}"


def check_gbl_requirement(repo_root):
    """
    Check 6: Verify if a Golden Baseline tag exists for the current session.
    Since we are pre-commit, we check the latest tag in the repo.
    Returns (warn: bool, latest_tag: str).
    """
    try:
        result = subprocess.run(
            ['git', 'describe', '--tags', '--abbrev=0'],
            capture_output=True, text=True, check=True,
            cwd=str(repo_root)
        )
        tag = result.stdout.strip()
        is_gbl = "-GBL" in tag
        return not is_gbl, tag
    except subprocess.CalledProcessError:
        return True, "No tags found"

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("[BOUNCER v2.2] Running Governance Check...")
    print("-" * 60)

    repo_root = get_repo_root()
    staged_files = get_staged_files()

    if not staged_files:
        print("[INFO] No staged files found. Skipping governance check.")
        return 0

    print(f"[SCAN] Scanning {len(staged_files)} staged file(s)...\n")
    violations = 0

    # -- Check 1: SoD (Role Boundary) -----------------------------------------
    sod_violations = check_architect_violations(staged_files)
    if sod_violations:
        print("[WARN] [CHECK 1] ROLE BOUNDARY -- Code files detected in commit.")
        print("   If this commit is from an App Architect or Analyst, this is FORBIDDEN.")
        for f in sod_violations:
            print(f"     - {f}")
        print("   See .agent/GOVERNANCE.md > Role 2 for details.\n")
    else:
        print("[OK]   [CHECK 1] Role boundary: OK\n")

    # -- Check 2: DCR Requirement ----------------------------------------------
    dcr_missing = check_dcr_requirement(staged_files, repo_root)
    if dcr_missing:
        print("[FAIL] [CHECK 2] DCR REQUIREMENT FAILED -- Critical-path files staged with no recent DCR.")
        print(f"   No DCR artifact found in '{ARTIFACTS_DIR}/' modified in the last {DCR_MAX_AGE_HOURS}h.")
        for label, files_list in dcr_missing:
            print(f"   Triggered by: [{label}]")
            for f in files_list:
                print(f"     - {f}")
        print("   Action: Create a Detailed Change Report before deploying.")
        print("   See .agent/rules/detailed_change_reporting.md for the template.\n")
        violations += 1
    else:
        any_critical = any(
            normalise(f).startswith(normalise(prefix))
            for f in staged_files
            for prefix in DCR_REQUIRED_PATHS.values()
        )
        if any_critical:
            recent = find_recent_dcr(repo_root)
            print(f"[OK]   [CHECK 2] DCR requirement: Satisfied ({len(recent)} recent DCR(s) found)\n")
        else:
            print("[OK]   [CHECK 2] DCR requirement: Not triggered (no critical paths staged)\n")

    # -- Check 3: Mandatory Human Checkpoint -----------------------------------
    checkpoint_hits = check_checkpoint_warnings(staged_files)
    if checkpoint_hits:
        print("[WARN] [CHECK 3] CHECKPOINT WARNING -- High-risk files staged.")
        print("   These files require a mandatory human sign-off BEFORE deployment.")
        for f in checkpoint_hits:
            print(f"     - {f}")
        print("   See .agent/rules/mandatory_human_checkpoints.md for the full list.\n")
    else:
        print("[OK]   [CHECK 3] Checkpoint paths: None triggered\n")

    # -- Check 4: Journal Gate -------------------------------------------------
    journal_stale = check_journal_gate(staged_files, repo_root)
    if journal_stale:
        print("[FAIL] [CHECK 4] JOURNAL GATE -- Production code staged but JOURNAL.md not updated.")
        print(f"   '{JOURNAL_PATH}' has not been modified in the last 24h and is not staged.")
        print("   Action: Add a session entry to the journal before committing.")
        print("   See GOVERNANCE.md > Mandatory Journaling Compliance for requirements.\n")
        violations += 1
    else:
        has_prod = any(
            normalise(f).startswith(normalise(p))
            for f in staged_files for p in JOURNAL_GATE_PATHS
        )
        if has_prod:
            print("[OK]   [CHECK 4] Journal gate: JOURNAL.md is current\n")
        else:
            print("[OK]   [CHECK 4] Journal gate: Not triggered (no production paths staged)\n")

    # -- Check 5: Doc Sync (verify_doc_sync.py) --------------------------------
    doc_sync_passed, doc_sync_output = check_doc_sync(repo_root)
    if not doc_sync_passed:
        print("[FAIL] [CHECK 5] DOC SYNC -- verify_doc_sync.py reports journal hash unchanged.")
        print(f"   {doc_sync_output}")
        print("   Action: Update JOURNAL.md and run 'python scripts/verify_doc_sync.py init' to reset the marker.\n")
        violations += 1
    else:
        print(f"[OK]   [CHECK 5] Doc sync: {doc_sync_output}\n")

    # -- Check 6: GBL Requirement (Golden Baseline) ---------------------------
    has_prod_staged = any(
        normalise(f).startswith(normalise(p))
        for f in staged_files for p in JOURNAL_GATE_PATHS
    )
    if has_prod_staged:
        gbl_warn, latest_tag = check_gbl_requirement(repo_root)
        if gbl_warn:
            print("[WARN] [CHECK 6] GBL REQUIREMENT -- No Golden Baseline tag detected.")
            print(f"   Latest tag: '{latest_tag}'")
            print("   Action: Ensure you create a 'v*-GBL' tag before finalizing this session.")
            print("   See GOVERNANCE.md > Section 6 for stability requirements.\n")
        else:
            print(f"[OK]   [CHECK 6] GBL requirement: Last tag was GBL ({latest_tag})\n")
    else:
        print("[OK]   [CHECK 6] GBL requirement: Not triggered (no production paths staged)\n")

    # -- Summary ---------------------------------------------------------------
    print("-" * 60)
    if violations > 0:
        print(f"[FAIL] GOVERNANCE CHECK FAILED -- {violations} blocking violation(s) found.")
        print("   Resolve all [FAIL] items above before deploying to production.")
        return 1
    else:
        print("[PASS] GOVERNANCE CHECK PASSED -- Safe to proceed to QA.")
        return 0


if __name__ == "__main__":
    sys.exit(main())
