# Kindergarten Worksheet Generator Roadmap

This document is the build plan and progress tracker for improving the worksheet generator into a polished, educator-friendly product.

## Product Goals

- Make worksheet generation fast and simple for non-technical parents.
- Improve educational quality (age-appropriate progression, handwriting supports, phonics quality).
- Ensure reliable, high-quality print/PDF output on 8.5 x 11 paper.
- Keep generation varied while avoiding unwanted duplicates.

## Current Status Snapshot

- [x] Core worksheet types implemented
- [x] Theme selector implemented
- [x] Child name support implemented
- [x] Print flow implemented
- [x] Save as PDF flow via print dialog
- [x] KG Primary Dots font integrated
- [x] No-repeat constraints for major tracing sets
- [x] Instructional quality pass
- [x] Standards-based sight word sets
- [x] Primary handwriting guide lines
- [x] Regression test suite (core generation + UI actions)
- [x] Weekly packet workflow
- [x] Persistent child profiles
- [x] Automated layout regression checks (snapshot tests)
- [x] Teacher tools (answer keys, standards tags, editable instructions/objectives)
- [x] Handwriting paper options (paper style, tracing opacity, tracing font)
- [x] Content expansion (subtraction, ten-frames, CVC, sentence tracing, patterns)
- [x] Assessment + placement (placement packet template + in-app scoring recommendation + apply)
- [x] Phase 11 / Content expansion increment (Rhyme Match, Syllable Sort, Number Bonds; Subitizing; Measurement / Compare)
- [ ] Next themes queued: Phase 12 (parent UX/QoL), Phase 13 (engineering/reliability)

---

## Phase 1: Instructional Foundations

**Goal:** Improve educational quality of every worksheet immediately.

### Tasks

- [x] Add worksheet-specific instruction sentence under title
- [x] Add age/skill preset selector:
  - [x] Pre-K
  - [x] K Early
  - [x] K Mid
  - [x] K End
- [x] Map presets to default ranges by worksheet type
- [x] Upgrade phonics prompts to picture-word style pairs
- [x] Add writing guidance lines (top/mid/baseline) for tracing and name writing
- [x] Add per-type maximum problem safeguards in UI

### Acceptance Criteria

- Every worksheet has a clear instruction line.
- Parent can choose one preset and get age-appropriate defaults.
- Tracing pages show proper handwriting guide lines.
- Phonics prompts are concrete and beginner-friendly.

---

## Phase 2: Content & Curriculum Quality

**Goal:** Make generated content more standards-aligned and reusable.

### Tasks

- [x] Add sight word source selector:
  - [x] Dolch Pre-Primer
  - [x] Dolch Primer
  - [x] Fry Top 100 (chunked)
  - [x] Custom word list input
- [x] Add no-repeat memory across recent generations
- [x] Improve theme assets with consistent black-and-white line icons
- [x] Add section-level regenerate (reshuffle only one content block)

### Acceptance Criteria

- Parent can choose curriculum word list source.
- Generated sets avoid immediate repeats across sessions.
- Theme visuals are consistent and print-safe.

---

## Phase 3: Parent Workflow & Packaging

**Goal:** Make this practical for weekly home/school use.

### Tasks

- [x] Build one-click weekly packet generator (mixed worksheet bundle)
- [x] Add packet templates (e.g., handwriting focus, math focus, mixed review)
- [x] Add child profile save/load (name, level, preferences)
- [x] Add print preview quality checks and overflow warnings
- [x] Add Phase 3 regression tests (packet + profiles)

### Acceptance Criteria

- Parent can generate a multi-page packet in one action.
- Profiles reload previous settings in one click.
- Print output remains within single-page constraints per worksheet.

---

## Phase 4: Reliability & Engineering Hardening

**Goal:** Prevent regressions and improve maintainability.

### Tasks

- [x] Refactor each worksheet type into dedicated components/modules
- [x] Introduce settings schema validation
- [x] Add deterministic generation helpers and unit tests
- [x] Add print-layout snapshot tests
- [x] Add lightweight e2e test for generate/print/pdf/packet flow

### Acceptance Criteria

- Changes in one worksheet type do not break others.
- Core generation is test-covered and deterministic when seeded.
- Print layout regressions are caught in CI.

---

## Phase 5: Teacher Tools + Standards Alignment (stabilize first)

**Goal:** Add optional teacher-facing features without changing student-facing output by default.

### Tasks

- [x] Optional answer key pages (hidden by default)
- [x] Optional standards/skill tags in worksheet footer (hidden by default)
- [x] Editable instruction line (defaults preserved; per-profile override)
- [x] Optional “Objective” line (hidden by default; per-profile override)

### Acceptance Criteria

- Student worksheet output is unchanged when toggles are off (default).
- Print output remains clean black-and-white and snapshot tests stay stable.

---

## Phase 6: Handwriting Paper Options (queued after Phase 5)

**Goal:** Let users choose paper styles and tracing visibility options while keeping a simple default experience.

### Tasks

- [x] `paperStyle` selector to switch handwriting guide backgrounds/lines
- [x] Tracing opacity slider (for lighter/darker trace guides)
- [x] Optional tracing font selector (with print-safe defaults)

### Acceptance Criteria

- Defaults stay parent-friendly with no extra configuration required.
- All styles remain print-safe (8.5" x 11) and layout does not overflow.

---

## Phase 8: Content Expansion (queued)

**Goal:** Add more worksheet types that cover common K-ready skills without sacrificing print cleanliness.

### Tasks

- [x] Subtraction (within small numbers)
- [x] Ten-frames / number representation
- [x] CVC words (blend/read/write)
- [x] Sentence tracing (short “I see a ___.” style)
- [x] Patterns (AB, AAB, ABB, ABC) with fill-in blanks

### Acceptance Criteria

- Each new type includes schema + engine generation + UI renderer + tests.
- Defaults remain age-appropriate for each skill preset.

---

## Phase 9: UX + Reliability Polish (queued)

**Goal:** Reduce friction for parents/teachers and make printing more predictable.

### Tasks

- [x] Dedicated Print Preview mode (hide controls; show packet page thumbnails / page list)
- [x] Section-level reroll for multi-part pages (page-level reroll for weekly packet pages)
- [x] Import/export child profiles as JSON (backup + share)
- [x] Clear print overflow warnings with suggested fixes (reduce problems, switch template, etc.)

### Acceptance Criteria

- Parent can confidently preview before printing and avoid accidental multi-page overflow.
- Profiles are portable and recoverable.

---

## Phase 10: Assessment + Placement

**Goal:** Help parents/teachers pick the right skill preset using a short placement packet and simple in-app scoring.

### Tasks

- [x] Add a “Placement Packet” template (a short mixed packet used for assessment)
- [x] Add a Placement flow in the UI:
  - [x] Generate the placement packet
  - [x] Enter simple scores per section
  - [x] Recommend a preset (Pre-K / K Early / K Mid / K End) with a short explanation
  - [x] One-click apply recommended preset to current settings (and save to a profile if desired)
- [x] Add tests for placement recommendation + apply flow (unit + regression)

### Future / Deferred (not required for MVP)

- [ ] Optional printable placement score sheet page bundled into PDF export

### Acceptance Criteria

- Placement packet generation uses existing print-safe worksheet types and fits standard 8.5\" x 11 output constraints.
- Parent can enter results and get a clear recommended preset without needing educational expertise.
- Applying the recommendation updates the current skill preset and updates defaults appropriately (problems/difficulty) using the existing preset logic.
- Placement logic is deterministic and test-covered to prevent regressions.

---

## Phase 11: Content Expansion — Next Curriculum Skills

**Goal:** Add the next slice of kindergarten readiness skills as new worksheet types while keeping print output clean, consistent, and test-covered.

### Candidate worksheet types (pick 2–4 as the first increment)

- [x] Rhyming / word families (match + write) — implemented as **Rhyme Match**
- [x] Syllable awareness (count/sort syllables with simple picture prompts) — implemented as **Syllable Sort (Tap Clap)**
- [x] Number bonds / decomposing numbers (within 10) aligned with ten-frames thinking — implemented as **Number Bonds (within 10)**
- [x] Subitizing / quick-look dot groups (small quantities) — implemented as **Subitizing (Quick-Look Dots)** (dots on a 5×5 grid; word prompts only—no clipart)
- [x] Measurement / comparison (longer/shorter, heavier/lighter, etc.) — implemented as **Measurement / Compare** (A/B labeled picture-style word prompts; clipart deferred)

### Tasks

- [x] Choose the first increment (2–4 types) and define defaults per skill preset (**Rhyme Match**, **Syllable Sort**, **Number Bonds**)
- [x] Add schema + engine generation + UI renderer for each new type
- [x] Add targeted unit tests for generation + layout snapshot coverage where layout is sensitive
- [x] Add at least one regression test per new type for “generate + render path exists”

### Acceptance Criteria

- Each new type remains single-page friendly on 8.5\" x 11 with black-and-white printing.
- Defaults are age-appropriate for Pre-K through K End without requiring extra parent configuration.
- Tests prevent silent regressions in generation and rendering.

---

## Phase 12: Parent UX + Quality of Life (complete)

**Goal:** Reduce cognitive load for parents while keeping power-user controls discoverable but not noisy.

### Tasks

- [x] First-run / first-packet guided hints (short, dismissible) for: packet → preview → print/PDF
- [x] “Reset to recommended defaults” for the current worksheet type (undo manual tweaks safely)
- [x] Clearer empty states in packet preview (what to do next; common templates)
- [x] Quick actions: duplicate last packet settings, jump to print preview
- [x] Copy improvements: plainer language for teacher toggles and placement scoring

### Acceptance Criteria

- Core flow remains fast for repeat users (no extra required clicks for typical generation).
- New users can complete a successful print path without hunting settings.
- No negative impact on snapshot/print-layout stability (changes are mostly UI copy + light structure).

---

## Phase 13: Engineering + Reliability (queued)

**Goal:** Strengthen confidence in releases as the app grows (more types, more UI paths).

### Tasks

- [ ] Add a small browser smoke suite (Playwright) for critical flows: single sheet, packet, print preview, PDF download path (as feasible in CI)
- [ ] Improve production bundle strategy (split heavy PDF/react-pdf paths if needed) without changing user-visible output
- [ ] Add performance budgets / monitoring hooks (bundle size trend, simple perf checklist)
- [ ] Harden error handling around local storage + import/export edge cases (clear user messaging)

### Acceptance Criteria

- CI catches major UI regressions beyond unit/snapshot tests where practical.
- Build output remains reliable; no increase in flaky tests.
- User-facing failures are explained in parent-friendly language (not stack traces).

## Implementation Notes

- Keep the UI parent-friendly and uncluttered.
- Maintain black-and-white print focus.
- Prefer explicit educational language over generic labels.
- Avoid adding advanced controls unless they clearly help parents.

---

## Working Cadence

Use this section as our sprint tracker.

### Current Sprint (Next)

- [x] Phase 1 / Instruction line
- [x] Phase 1 / Skill presets
- [x] Phase 1 / Handwriting guide lines
- [x] Phase 10 / Assessment + placement packet + recommendation + tests
- [x] Phase 11 / Content expansion increment (Rhyme Match, Syllable Sort, Number Bonds; Subitizing; Measurement / Compare)
- [x] Phase 12 / Parent UX + quality of life (hints, reset, packet empty state, quick actions, copy)

### Queued (After Phase 5 Stabilizes)

- [x] Phase 6 / Handwriting paper options (paper styles, tracing opacity, font selector)
- [x] Phase 8 / New worksheet types (subtraction, ten-frames, CVC, sentences, patterns)
- [x] Phase 9 / UX polish (print preview, section reroll, import/export profiles)
- [x] Phase 11 / Next content expansion (Rhyme Match, Syllable Sort, Number Bonds + Subitizing + Measurement / Compare)
- [x] Phase 12 / Parent UX + quality of life
- [ ] Phase 13 / Engineering + reliability (CI smoke + performance hardening)

### Decisions Log

- 2026-04-29: Use KG Primary Dots for tracing text.
- 2026-04-29: Use browser print dialog for PDF save reliability.
- 2026-04-29: Completed Phase 1 instructional foundations.
- 2026-04-29: Switched tracing font to Patrick Hand/Schoolbell for better guide-line alignment.
- 2026-04-29: Switched tracing font to lighter Coming Soon style for pencil-first trace visibility.
- 2026-04-29: Switched tracing font to Playwrite NZ Basic Guides and simplified extra guide-line styling.
- 2026-04-29: Completed Phase 2 content/curriculum upgrades with sight-word sources and recent-history no-repeat memory.
- 2026-04-29: Added Vitest regression tests for worksheet engine logic and key UI flows.
- 2026-04-29: Completed Phase 10 assessment + placement: added Placement Packet template, in-app scoring recommendation + apply-to-preset controls, placement unit + regression coverage (optional printable placement score-sheet page deferred).
- 2026-04-29: Prioritized next roadmap themes: **Phase 11 content expansion**, **Phase 12 parent UX/QoL**, then **Phase 13 engineering/reliability**.
- 2026-04-29: Completed Phase 11 first increment worksheet types: **Rhyme Match**, **Syllable Sort**, **Number Bonds** (+ engine/UI/PDF/tests/snapshots).
- 2026-04-29: Completed Phase 11 second increment: **Subitizing (Quick-Look Dots)** and **Measurement / Compare** (word/label prompts; clipart-style pictures deferred).
- 2026-04-29: Completed Phase 12 parent UX/QoL: dismissible weekly-packet tips, richer empty packet preview + template shortcuts, quick actions (reset to recommended defaults, jump to print preview, restore last packet snapshot from localStorage), clearer printing/placement copy, softer placement recommendation narration.

### Risks / Open Questions

- [x] Default skill preset confirmed: **K End**
- [x] Custom sight words are saved per child profile.
- [x] Weekly packet supports **single combined PDF export** (in addition to print batch).
