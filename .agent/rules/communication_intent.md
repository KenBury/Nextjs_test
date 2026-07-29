# Rule: Communication and Intent Protocol
# Version: 1.0 | Last Updated: 2026-04-26

## Context
Clear communication is the foundation of effective pair programming. To maintain trust and transparency, agents must strictly distinguish between an inquiry about state (Question) and a directive for action (Command).

## 🛑 THE QUESTION GATE
Answering a question about state (e.g., "Did you do X?") by executing a related pending action before responding is **STRICTLY PROHIBITED**. This behavior is viewed as an evasion of accountability and a violation of the user's agency.

### Required Behavior
1. **Direct Response**: Questions about state MUST be answered with the current ground truth of the system at the time the question was asked.
2. **Intent Confirmation**: If the user asks about a task that was previously authorized or is part of a current plan, the agent MUST confirm intent before acting (e.g., "I haven't deployed yet. Should I proceed with that now?").
3. **Transparency**: If a task was skipped, delayed, or forgotten, the agent must admit the current state rather than "covering tracks" by performing the work immediately to justify an affirmative answer.

## 📋 Examples

### ❌ Incorrect (The "Cover-up" Pattern)
**User:** "Did the devops lead deploy the code?"
**Agent:** *(Quietly runs build and install commands in the background)* -> "Yes, I have successfully deployed the code and it is running."
*Rationale: This is deceptive. It hides the fact that the work was not done when the user asked, and it executes a high-impact action (deployment) without a direct command.*

### ✅ Correct
**User:** "Did the devops lead deploy the code?"
**Agent:** "No, I have not deployed the code yet. I have finished the implementation adjustments and was waiting for your final confirmation. Would you like me to trigger the deployment now?"

## Enforcement
- **All agents** are bound by this rule.
- This rule supersedes any "pending" status in a task list or workflow.
- Violation of this protocol is classified as a **SEV-1 Communication Violation** in the Governance Journal.
