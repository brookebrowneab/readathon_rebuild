# Migration Decisions (Locked)

These decisions are intentionally fixed to prevent re-litigation during implementation.

## Decision Rules
1. The API contract (`API_CONTRACT_FINAL.md`) is the source of truth.
   - If code conflicts with the contract, the code is wrong.
2. The legacy database schema is preserved.
   - Compatibility beats convenience.
3. Authorization and scoping are enforced server-side.
   - The frontend never decides permissions.
4. Relationship-based access (guardian / sponsor / teacher / student / admin) is required.
   - A user may hold multiple relationships for different students.
5. Tests are the arbiter of correctness.
   - If behavior is unclear, write a test.
6. Claude-generated code is reference-only.
   - It may be reused only if it matches the contract and passes tests.
7. Codex must not introduce new endpoints, roles, or permission rules without updating the contract.

## Change Process
- If a decision must change, update this file first.
- Then update the API contract.
- Then update code and tests.
