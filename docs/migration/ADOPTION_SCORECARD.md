# Adoption Scorecard (Codex vs Claude)

Use this document to record module-by-module comparisons.

## Scoring Rules
- If any Hard Gate fails: mark as FAIL and do not adopt from that source.
- Only score Soft Goals if all Hard Gates pass for both candidates.

Soft goals score: 0–5 (higher is better)
- Modularity (separation of concerns)
- Readability
- Duplication (lower duplication = higher score)
- Testability
- Complexity (lower complexity = higher score)

---

## MODULE: Backend bootstrap/wiring (routing + dependency instantiation)
Paths:
- Codex:
- Claude:

### Hard Gates (PASS/FAIL)
- Contract compliance: 
- Legacy P0 unaffected:
- Security baseline (no client identity, safe boot):
- Tests relevant to this module:
- (UI parity not applicable): N/A

### Soft Scores (0–5)
- Modularity:
- Readability:
- Duplication:
- Testability:
- Complexity:

### Decision
- Adopt: Codex / Claude / Hybrid
- Rationale:
- Follow-up tasks:
- Tests run:

---

## MODULE: Auth/session utilities (parent/student/teacher/admin)
Paths:
- Codex:
- Claude:

### Hard Gates (PASS/FAIL)
- Contract compliance:
- Legacy P0 unaffected:
- Security baseline:
- Tests relevant to this module:
- (UI parity not applicable): N/A

### Soft Scores (0–5)
- Modularity:
- Readability:
- Duplication:
- Testability:
- Complexity:

### Decision
- Adopt: Codex / Claude / Hybrid
- Rationale:
- Follow-up tasks:
- Tests run:

---

## MODULE: Reading logs (student + parent flows)
Paths:
- Codex:
- Claude:

### Hard Gates (PASS/FAIL)
- Contract compliance:
- Legacy P0:
- Security baseline:
- Tests relevant to this module:
- UI parity (frontend pages that touch this module): PASS/FAIL (if applicable)

### Soft Scores (0–5)
- Modularity:
- Readability:
- Duplication:
- Testability:
- Complexity:

### Decision
- Adopt: Codex / Claude / Hybrid
- Rationale:
- Follow-up tasks:
- Tests run:

---

## MODULE: Pledges + guest pay tokens + payments
Paths:
- Codex:
- Claude:

### Hard Gates (PASS/FAIL)
- Contract compliance:
- Legacy P0:
- Security baseline:
- Tests relevant to this module:
- UI parity (if applicable):

### Soft Scores (0–5)
- Modularity:
- Readability:
- Duplication:
- Testability:
- Complexity:

### Decision
- Adopt: Codex / Claude / Hybrid
- Rationale:
- Follow-up tasks:
- Tests run:

---

## MODULE: Teacher scope + roster
Paths:
- Codex:
- Claude:

### Hard Gates (PASS/FAIL)
- Contract compliance:
- Legacy P0:
- Security baseline:
- Tests relevant to this module:
- UI parity (if applicable):

### Soft Scores (0–5)
- Modularity:
- Readability:
- Duplication:
- Testability:
- Complexity:

### Decision
- Adopt: Codex / Claude / Hybrid
- Rationale:
- Follow-up tasks:
- Tests run:

---

## MODULE: Admin auth + reports
Paths:
- Codex:
- Claude:

### Hard Gates (PASS/FAIL)
- Contract compliance:
- Legacy P0:
- Security baseline:
- Tests relevant to this module:
- UI parity (if applicable):

### Soft Scores (0–5)
- Modularity:
- Readability:
- Duplication:
- Testability:
- Complexity:

### Decision
- Adopt: Codex / Claude / Hybrid
- Rationale:
- Follow-up tasks:
- Tests run: