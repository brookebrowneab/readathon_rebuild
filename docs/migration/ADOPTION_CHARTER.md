# Adoption Charter (Codex vs Claude)

## Purpose
Codex must compare the Codex implementation against the Claude reference implementation and adopt the most elegant, secure, modular approach **without violating any non-negotiables**.

This document defines:
- what “better” means,
- what can never be traded off,
- and how decisions get documented.

## Inputs and Evidence
These documents are evidence and requirements. None of them are “truth” on their own; the final truth is **code that passes tests** and matches the contract.

### Sources of Truth for the rebuilt system
- UI behavior: `docs/migration/MIGRATION_MAP.md`
- API behavior + payloads: `docs/migration/API_CONTRACT_FINAL.md`
- Locked decisions: `docs/migration/DECISIONS.md`
- UI appearance:  
  - `docs/ui/DESIGN_TOKENS.md`  
  - `docs/ui/COMPONENT_SPECS.md`  
  - `docs/ui/LAYOUT_SPECS.md`  
  - `docs/ui/PAGE_COMPOSITION.md`
- Legacy compatibility evidence:  
  - `docs/migration/LEGACY_TEST_PLAN.md`  
  - `docs/migration/legacy_seed.sql`  
  - passing legacy P0 tests (`backend/tests/run-legacy-p0.sh`)
- Security audit evidence: `docs/migration/AUDIT_SECURITY.md` (and any later security notes)

### Claude reference code location
- Claude reference code must be treated as reference-only and should live under:
  - `claude_reference/`

## Non-Negotiables (Hard Gates)
Any code adopted from either system MUST:
1) Pass tests (as applicable to the module)
   - Legacy P0: `backend/tests/run-legacy-p0.sh`
   - Slice tests: existing slice test runners (or backend + E2E if present)
2) Match API contract behavior
   - endpoints, methods, response envelope, error codes
3) Preserve pixel parity for UI to the UI docs
   - tokens/components/layout/composition as specified
4) Preserve legacy compatibility
   - no destructive schema changes
   - must work with legacy-shaped fixtures (readathon_legacytest)
5) Meet security baseline
   - parameterized SQL only
   - server-side scoping and authorization only
   - no client-supplied identity (no user_id/child_id auth via query params/headers/localStorage)
   - public endpoints do not leak child/family/sponsor/payment/admin-only data

If an option fails ANY hard gate, it is not eligible for adoption.

## Preferences (Soft Goals)
If (and only if) hard gates are satisfied, prefer code that:
- Is modular and layered: Controller → Service → Repository → DB
- Minimizes duplication
- Is readable and documentable
- Is testable (clean dependencies, predictable side effects)
- Has clear error handling and consistent envelopes
- Has smaller surface area (less moving parts)

## Adoption Rules
- Codex implementation is the current baseline.
- Claude code is reference-only; it may be copied only if it passes hard gates.
- Hybrid adoption is allowed only when it reduces complexity without breaking gates.
- “Better” is defined by the scorecard (below) and validated by tests.

## Decision Recording
Every adoption decision must be recorded in:
- `docs/migration/ADOPTION_SCORECARD.md` (per module comparison)
- `docs/migration/ADOPTION_LOG.md` (chronological record)

## Workflow
1) Pick a module bucket (start with backend bootstrap/wiring).
2) Identify the Codex files and Claude files for that bucket.
3) Evaluate both against hard gates.
4) If both pass, score soft goals and choose the better implementation.
5) Implement the smallest safe change set.
6) Run tests relevant to that bucket + legacy P0.
7) Record the decision and results in scorecard + log.

## Definition of Done
- Selected modules are adopted and integrated.
- Relevant tests pass (including legacy P0).
- Contract remains stable (or documented updates are made deliberately).
- Adoption Log shows what changed, why, and how it was validated.