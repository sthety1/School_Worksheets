# School Worksheets (Kindergarten Worksheet Generator)

A parent-friendly web app that generates **printable kindergarten worksheets** (8.5" x 11") in a clean black‑and‑white format. Built with **React + Vite + Tailwind**, with a strong focus on print output and regression testing.

## What it does

- Generate **single worksheets** or **weekly packets (5 pages)**.
- Print directly, or use the browser print dialog to **Save as PDF**.
- Supports a child name at the top of every page.
- Uses handwriting-style tracing text designed for pencil tracing.

## Worksheet types included

- Number tracing
- Counting objects
- Letter tracing (uppercase + lowercase)
- Sight word tracing
- Name writing practice
- Shapes recognition
- Beginning addition
- Matching pictures/words
- Beginning sounds / phonics
- Color by number

## Key features

### Phase 1 — Instructional Foundations

- Worksheet-specific instruction text under each title
- Skill presets: **Pre‑K / K Early / K Mid / K End**
- Writing/tracing areas designed for early learners
- Type-aware maximum problem safeguards

### Phase 2 — Content & Curriculum Quality

- Sight word sources:
  - Dolch Pre‑Primer
  - Dolch Primer
  - Fry Top 100 (starter set)
  - Custom word list input
  - Mixed random phonics
- “No-repeat” memory to reduce immediate repeats across generations
- Consistent black‑and‑white theme badge/icons
- “Reshuffle problems” without changing settings

### Phase 3 — Parent Workflow & Packaging

- Weekly packet mode (multi-page) with templates:
  - Mixed Review
  - Handwriting Focus
  - Math Focus
- Child profile save/load/delete (name, level, theme, word source, packet template)
- Print overflow warnings for packet pages (when a page looks too tall)

### Phase 4 — Reliability & Engineering Hardening

- Refactored generator + validation into dedicated modules
- Settings validation using **zod**
- Deterministic generation when seeded (stable regression behavior)
- Regression tests (unit + UI)
- Snapshot-style print layout regression test

### Next queued work

- **Phase 5 (stabilize first)**: Teacher tools (optional answer keys, standards tags, editable instructions)
- **Phase 6 (queued after Phase 5)**: Handwriting paper options (paper styles, tracing opacity slider, optional tracing font selector)

## Project structure

- `src/AppNew.jsx`: main UI (single worksheet + packet mode)
- `src/worksheetEngine.js`: generator logic + deterministic RNG + word lists
- `src/worksheetSchema.js`: zod schemas for generator/settings validation
- `src/packetTemplates.js`: packet templates + packet config builder
- `src/index.css`: print sizing and worksheet styling (Letter paper, page breaks)
- `src/test/`: regression tests (engine/UI/snapshot)
- `WORKSHEET_ROADMAP.md`: roadmap and progress tracker

## Getting started

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Run tests

```bash
npm run test
```

### Run lint

```bash
npm run lint
```

## Printing tips

- Use **Print** and set scale to **100%** if possible.
- To export a PDF, click **Save as PDF** and choose **Save as PDF** in the print destination dialog.
- In packet mode, each worksheet is its own printable page (automatic page breaks).

## Notes

- If you add external fonts/icons, verify licensing before redistribution.
