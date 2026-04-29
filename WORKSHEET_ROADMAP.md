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
- [ ] Weekly packet workflow
- [ ] Persistent child profiles
- [ ] Automated layout regression checks

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

- [ ] Build one-click weekly packet generator (mixed worksheet bundle)
- [ ] Add packet templates (e.g., handwriting focus, math focus, mixed review)
- [ ] Add child profile save/load (name, level, preferences)
- [ ] Add print preview quality checks and overflow warnings

### Acceptance Criteria

- Parent can generate a multi-page packet in one action.
- Profiles reload previous settings in one click.
- Print output remains within single-page constraints per worksheet.

---

## Phase 4: Reliability & Engineering Hardening

**Goal:** Prevent regressions and improve maintainability.

### Tasks

- [ ] Refactor each worksheet type into dedicated components
- [ ] Introduce settings schema validation
- [ ] Add deterministic generation helpers and unit tests
- [ ] Add print-layout snapshot tests
- [ ] Add lightweight e2e test for generate/print/pdf flow

### Acceptance Criteria

- Changes in one worksheet type do not break others.
- Core generation is test-covered and deterministic when seeded.
- Print layout regressions are caught in CI.

---

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

### Decisions Log

- 2026-04-29: Use KG Primary Dots for tracing text.
- 2026-04-29: Use browser print dialog for PDF save reliability.
- 2026-04-29: Completed Phase 1 instructional foundations.
- 2026-04-29: Switched tracing font to Patrick Hand/Schoolbell for better guide-line alignment.
- 2026-04-29: Switched tracing font to lighter Coming Soon style for pencil-first trace visibility.
- 2026-04-29: Switched tracing font to Playwrite NZ Basic Guides and simplified extra guide-line styling.
- 2026-04-29: Completed Phase 2 content/curriculum upgrades with sight-word sources and recent-history no-repeat memory.
- 2026-04-29: Added Vitest regression tests for worksheet engine logic and key UI flows.

### Risks / Open Questions

- [ ] Confirm preferred default skill preset.
- [ ] Confirm whether custom sight words should be saved per child profile.
- [ ] Confirm if weekly packet should be single combined PDF or print batch.
