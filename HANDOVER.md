# Agent Handover — Bambuddy Fork

> Read this file before making changes. Update it with each meaningful development step, commit, test result, decision, and handoff. Future agents should append notes rather than replace history.

## Repositories and upstream baseline

- Fork: https://github.com/MattTheBanana/bambuddy
- Official upstream: https://github.com/maziggy/bambuddy
- Latest upstream checked: **v1.3.1**, released 2026-11-11.
- Upstream `main` commit checked: `1aa7bce166682fde929fec0d535bdaaa22685aad` (2026-11-13).
- Fork default `main` was last updated 2026-10-09 at `b4042d7b9bee1d7298308cf07db07d48bbc30ef6`.
- Upstream-sync PR: https://github.com/MattTheBanana/bambuddy/pull/2 (draft, not merged). Branch `sync/official-v1.3.1` is based on the official upstream main commit.
- GitHub compare showed diverged history (514 ahead / 27 behind, 1,698 changed files). Treat this as a full history sync; review conflicts and fork-specific changes carefully. Do not force-push or overwrite the old fork branch.
- Recheck upstream releases/main before each major sync.

## User requirements

1. Build a real dedicated **Web Slicer** inside Bambuddy, based on OrcaSlicer and Bambu Studio workflows.
2. Responsive/mobile-first model preparation and slicing for Bambu printers.
3. Upload STL and 3MF at minimum; verify additional formats against installed parsers.
4. Interactive 3D model/plate preview with orbit, zoom, pan, dimensions, placement and orientation.
5. Printer, nozzle, filament/AMS, and process-profile selection using existing Bambuddy data.
6. Generate downloadable printer-ready G-code and Bambu-compatible 3MF-G-code ZIP. Verify exact format requirements before advertising.
7. Integrate OrcaSlicer and Bambu Studio engines; offer Wave Overhangs as an optional feature based on https://github.com/dennisklappe/OrcaSlicer-WaveOverhangs.
8. Preserve optional authentication. Users may disable login through supported settings, but do not silently weaken defaults or bypass authorization.

## Important correction: current implementation status

- PR #1: https://github.com/MattTheBanana/bambuddy/pull/1
- PR #1 added an experimental Wave process option, sidecar URL setting, routing and Docker scaffolding on the old fork base.
- **PR #1 does NOT implement a dedicated Web Slicer page or complete mobile web-slicing workflow.** Never describe it as a finished web slicer.
- Wave sidecar build, binary override, profiles, API contract, routing, and output compatibility have not been verified.
- No frontend/backend build, automated test suite, Docker build, end-to-end slicing, or physical printer test was run for PR #1.
- Rebase/port the Wave work onto the synchronized upstream after inspecting the latest code. Do not blindly apply old snippets.

## Upstream architecture notes (v1.3.1 inspection)

- Frontend: React + TypeScript + Vite.
- Three.js and `occt-import-js` are already dependencies.
- Existing reusable components: `frontend/src/components/ModelViewer.tsx`, `ModelViewerModal.tsx`, `SliceModal.tsx`, `SlicerSettingsPanel.tsx`, and `SliceSpoolPicker.tsx`.
- Frontend pages live in `frontend/src/pages/`. Add a dedicated page and route/navigation item rather than hiding the whole experience inside the library slice modal.
- Existing backend routes include `backend/app/api/routes/library.py`, `slice_jobs.py`, `slicer_presets.py`, and `slicer_pipelines.py`; slicer services are under `backend/app/services/`.
- Upstream has materially changed since the fork's October main. Re-read current route, schema, auth, navigation and slicer code before modifying anything.

## Recommended implementation sequence

1. Review/land upstream sync PR #2 safely, preserving a backup/ref of old fork main and PR #1.
2. Audit latest slice job API, request schemas, progress/websocket handling, preset resolution, artifact storage, download routes, and Orca/Bambu sidecar API contracts.
3. Create dedicated Web Slicer page/route: responsive upload/dropzone, model/plate viewer, printer/profile controls, mobile bottom sheet/collapsible panels, slice progress and errors.
4. Backend job contract: validated uploads, bounded sizes, job creation/status/progress/cancellation, safe artifact paths, authenticated download, cleanup. Reuse existing job infrastructure.
5. Use existing printer/nozzle/filament/process preset catalog; validate combinations. Preserve source 3MF settings only with explicit user choice.
6. Verify both plain G-code and Bambu 3MF-G-code ZIP output, including metadata, plate config, thumbnails and printer/process/filament config, against real Orca/Bambu examples.
7. Add Wave only after standard slicing works. Keep it off by default, use a verified Wave binary/service, label experimental, and inspect preview/toolpaths.
8. Test frontend unit/type/build/lint, backend unit/integration, x86_64 Docker build, STL and 3MF end-to-end, output compatibility, then a non-critical real print.

## Development guardrails

- Do not guess endpoints, CLI flags, slicer settings or output structures. Inspect source and test contracts.
- Reuse existing APIs/services; avoid a parallel slicer implementation if existing jobs support it.
- Uploaded 3MF/STL are untrusted. Validate file type/content, size, archive paths and extracted contents.
- Use safe subprocess argument arrays, bounded uploads, timeouts, isolated temporary directories and cleanup.
- Never expose printer credentials or internal sidecar ports to the browser. Route browser work through authenticated Bambuddy backend endpoints.
- Test both authentication-enabled and authentication-disabled configurations.
- Do not claim a feature works until a real build and end-to-end slice has passed.
- Update this file at every handoff with commit hashes, PRs, paths changed, test commands/results, failures, decisions and next actions.

## Current state — 2026-11-19

- `feature/wave-overhangs-web-slicer`: earlier experimental Wave changes; PR #1 draft, unverified.
- `sync/official-v1.3.1`: based on official upstream main commit `1aa7bce166682fde929fec0d535bdaaa22685aad`; PR #2 draft, not merged.
- Fork default main remains at old base `b4042d7b9bee1d7298308cf07db07d48bbc30ef6`.
- PR #2 compare: 514 ahead / 27 behind; 1,698 files reported. Check mergeability and preserve fork-specific changes.
- **No dedicated Web Slicer UI exists yet.**

## Next actions

1. Resolve and review upstream sync PR #2 without losing fork-specific code.
2. Inspect current upstream `ModelViewer`, `SliceModal`, slicer API/job services, routes and navigation.
3. Implement the dedicated mobile-friendly Web Slicer page and backend job/download contract.
4. Add real G-code and 3MF-G-code output validation.
5. Port and test Wave Overhangs integration.
6. Append a dated development note here with every subsequent change.


## Sync conflict update — 2026-11-20

- PR #2 current compare is **515 commits upstream-only and 41 fork-only** (compare `sync/official-v1.3.1` to `main`); GitHub reports `mergeable=false`, `mergeable_state=dirty`. Earlier PR description counts were stale and have been corrected.
- The 41 fork-only commits include intentional authentication changes. Preserve the behavior in fork `main`: password requirements were removed and login requirement can be disabled. Do not reintroduce mandatory password authentication. Audit backend auth schemas/routes/tests, frontend login/setup/users/settings pages, and any settings/API compatibility changes as a single feature.
- Other fork-only files include library, slicer process schema/UI, and Wave/docker changes; reconcile them individually with upstream, not by force-pushing or wholesale copying old files over new upstream versions.
- PR #2 remains draft and unresolved. GitHub connector exposes commit/file APIs but this session has no local git/network access for a real three-way conflict resolution or full test run. Do not mark this sync fixed or merge it until a conflict-resolved merge commit is created and tested in a git-capable environment.
- PR #2 description now records the accurate counts, auth-preservation requirement, and pre-merge checklist.


## Resolution update — 2026-11-20

- PR #2 conflicts were resolved in merge commit `b0254f51d7f07bf7b526174bc25e70dd930d6e12`. It has the upstream sync branch as first parent and fork `main` at `c66f6212d9b23140ca6d1b0ae52e7c13943cf361` as second parent. GitHub reports PR #2 mergeable.
- Preserved the fork's removal of password complexity and minimum-length validation (password login itself remains password-based), associated auth frontend changes/tests, and Wave Overhangs process option, sidecar routing/configuration and Docker Compose files.
- Preserved upstream's `local_login_enabled` control and other upstream auth changes.
- Kept upstream's current CI workflow. The conflicting slicer library/config/schema/settings files were reconciled by applying the fork-specific Wave changes to the upstream versions rather than replacing those files wholesale.
- PR #3 is stacked on this branch. Its head merge commit is `67b2ffb004beb3ba506fd3bd81228604b5df7d31`; its diff against this base is limited to Web Slicer UI/route/locale files.
- No local tests or builds were run. GitHub Actions workflow runs and commit statuses were empty at the time checked. Required validation: backend tests, frontend lint/typecheck/build, Docker builds, upload-preview-slice/download integration, and output/printer validation.


## Profile preset editor fix — 2026-11-24

- Branch: `fix/profile-create-button-and-translations` (based on `main` at `55318a20a288c3ebc715c000dcd1607aa7556c41`).
- Inspected `frontend/src/pages/ProfilesPage.tsx`, the cloud preset API/schema and field-definition JSON. The Cloud create API requires `base_id`; the Create button correctly cannot submit without a base preset, but the form did not explain that disabled state. Added an inline hint and button tooltip for the missing base selection. Do not remove this requirement: `SlicerSettingCreate.base_id` is required and the backend forwards it to Bambu Cloud.
- Fixed stale JSON validation: leaving the JSON tab now synchronizes the canonical settings object and clears parse errors belonging to discarded JSON text. JSON file imports also clear the parse error and synchronize the editor text.
- Fixed base-preset changes resetting all existing overrides. The selected preset's `inherits` value is now merged into the existing settings, preserving values entered by the user.
- Added missing profile-editor translation entries (14 keys) in all 16 supported locale files. This covers the visible `commonSettings`, `currentOverrides`, empty template state and template hint, plus import/export and validation messages.
- Files changed: `frontend/src/pages/ProfilesPage.tsx`; `frontend/src/i18n/locales/{en,de,es,fr,it,ja,ko,nl,pl,pt-BR,ru,sv,tr,uk,zh-CN,zh-TW}.ts`.
- Source inspection confirmed API field labels are already human-readable values from `backend/app/data/{filament,process,printer}_fields.json`; they are not i18n keys. The raw `profiles.presets.commonSettings` text was caused by the missing locale entry.
- Verification so far: all 16 locale files on this branch contain each of the 14 added keys exactly once. Added a regression test in `frontend/src/__tests__/pages/ProfilesPageWiring.test.tsx` covering stale JSON error recovery and the translated Common Settings heading. The frontend parity script, typecheck, tests and build have not yet been run in a local checkout; use PR CI or run `cd frontend && npm run check:i18n && npm run typecheck && npm run test:run && npm run build`.
- The PR must preserve the mandatory base-preset contract and be tested against both Bambu Cloud authentication states before merge. No local end-to-end cloud profile creation was performed in this session.


## Remaining v1.3.2 transfer — 2026-11-24

- Official upstream release: `maziggy/bambuddy` tag `v1.3.2`, commit `b7d894b57c0a373f66dc0de49680865b02b3aae5` (parent is upstream v1.3.1 commit `1aa7bce166682fde929fec0d535bdaaa22685aad`).
- Existing selective feature port remains in PR #21 / merge commit `55318a20a288c3ebc715c000dcd1607aa7556c41`.
- Remaining port branch: `port/remaining-v1.3.2`; initial port commit: `acc95480c659136b0b9403222ef75dac1437b7bc`; review PR #23.
- Compared the full upstream v1.3.1 → v1.3.2 delta (300 changed paths) against the fork's changes. Seventy-three overlapping paths were already handled by PR #21. The other three overlaps were reconciled deliberately:
  - `backend/app/core/config.py`: set `APP_VERSION = "1.3.2"` and retained `wave_overhangs_api_url`.
  - `backend/app/services/bambu_cloud.py`: added upstream null preset-category/list normalization while retaining the fork's `public=false` request parameter and detailed non-200 error handling.
  - `frontend/src/__tests__/pages/SettingsPage.test.tsx`: retained the fork's version and its Web Slicer sidebar expectations.
- Ported the other 111 non-overlapping upstream paths, including backend fixes/tests, frontend source/tests, PWA source assets, Dockerfile, fonts, and changelog.
- Deliberately did not copy the 113 generated `static/assets/*` files. They must be regenerated from the fork's combined frontend source so the custom Web Slicer is included; do not copy the upstream prebuilt bundle over the fork's bundle.
- A full upstream PR (#22) was opened as a draft to test the merge and GitHub reported conflicts. It was closed without merging; branch `sync/official-v1.3.2-full` remains as an audit reference. Do not merge it.
- No local build or tests were run in this environment. PR #23 is a draft pending backend tests, frontend lint/typecheck/tests/build, Docker build, regenerated static assets, and Web Slicer upload → preview → slice → download verification.
- Preserve the Web Slicer, Wave Overhangs, relaxed password validation (password login remains enabled), `local_login_enabled`, Docker/sidecar changes, and all other fork-only behavior in any follow-up resolution.


## Full v1.3.2 overlap reconciliation — 2026-11-24

Follow-up audit corrected the initial path-level review: PR #21 changed several of the same files as upstream v1.3.2 but did not include every upstream hunk. I compared the shared files against the common upstream v1.3.1 base and merged their upstream v1.3.2 deltas into this branch, retaining fork-specific hunks. In total, the reconciliation covered the 31 shared paths with remaining upstream hunks, including:

- Printer UI and firmware support: H2/H3 exhaust-fan naming, access-code show/hide, printer connection-check retry UI, any-model printer dispatch priority (from #21) retained.
- Slicing and queue reliability: refuse embedded-settings fallback when source/target printer models differ; select queue printers by nozzle diameter; reset upload backoff on reconnect; guard MQTT stale detection during FTP upload; filter monitor-only MQTT smart plugs from power-on.
- Filament and inventory: recognize support-filament suffix/material matching; treat firmware's `00000000` blank-tray colour as no filament; restore the assigning user's cloud identity when replaying a spool preset; preserve spool IDs across CSV migration/import; keep decimal-comma CSV support.
- Archive/maintenance/export: complete archive G-code fingerprints and resend matching; lifetime MQTT energy settings/migrations; maintenance-log backfill/FK and CSV formula safety; archive aggregate-cost fields.
- Frontend/API/locales: archive cost and lifetime-energy types, spool CSV ID type, printer-dispatch settings types, user-group role demotion payload fix, and matching translations across locales.
- SQLite FK cleanup: include the new assigning-user relationship.
- Tests: merge upstream's Settings-page tests while retaining the fork's Web Slicer assertions; align maintenance-log formula-safety test with the final helper return behavior.

Files whose upstream changes were already present as a superset in the fork were left unchanged (notably `slicer-api/README.md`, which already includes the host/bridge binding guidance plus the optional Wave port restriction). `slicer-api/.env.example` now includes upstream's full security note while preserving `WAVE_API_PORT` and `WAVE_OVERHANGS_VERSION`.

The Cloud preset normalizer on this branch is behaviorally equivalent to upstream's v1.3.2 normalizer. It is called on the successful preset-list response while retaining the fork's `public=false` request and detailed non-200 response body.

The version remains `1.3.2`; the Wave configuration and Web Slicer test expectations remain present. Generated `static/assets/*` artifacts were intentionally not copied; regenerate them from this fork's complete frontend source in CI/build to avoid dropping Web Slicer.

## Validation status

- No local backend/frontend/Docker build or test run was available during this transfer.
- PR #23 is still a draft review PR. Re-check GitHub Actions on the latest branch commit, then run/confirm backend tests, frontend lint/typecheck/tests/build, Docker build, and an end-to-end Web Slicer upload → preview → slice → download test before marking ready or merging.
