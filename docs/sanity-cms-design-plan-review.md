# Sanity CMS Design Plan Review

**Date:** 2026-09-04  
**Branch:** dev  
**Initial Design Score:** 4/10  
**Overall Design Score:** 9/10  

---

## 1. System Audit & Findings Summary

1. **Framework Mismatch (Critical):** The plan targets Next.js App Router, while the repository is a Vite + React 19 SPA deployed via static `gh-pages`. A dedicated Phase 0 is required to migrate the SPA to Next.js before wiring Sanity.
2. **Hosting Resolution:** User chose **Static GitHub Pages Export (`output: 'export'`)**. Features requiring a Node/Edge runtime (Draft Mode preview cookies, on-demand ISR revalidation webhooks) are explicitly dropped from scope.
3. **Schema Simplification:** 15 granular fields on `project` collapsed into 8 core fields + a rich Portable Text `body` field.
4. **Navigation:** Hybrid model with global pathname links (`Home`, `Work`, `Writing`, `Contact`) and homepage scroll-spy.
5. **Route-Level States:** `loading.tsx`, `not-found.tsx`, `error.tsx` specified per dynamic segment.
6. **Reading Experience:** 65ch measure (`max-w-prose`), Shiki syntax highlighting (`github-light`), one-click code copy, and sticky desktop Table of Contents.
7. **Design Language:** Dense mono-labels and semantic category colors over generic 3-column image cards.

---

## 2. Implementation Tasks

- [ ] **T1 (P1, human: ~3-5 days / CC: ~30min)** — Framework Migration — Migrate Vite SPA to Next.js App Router (ensure matter-js, canvas particle field, and scroll hooks hydrate cleanly).
  - Files: `package.json`, `App.tsx`, `src/index.css`, `index.html`
- [ ] **T2 (P1, human: ~2h / CC: ~15min)** — Navigation — Two-mode navbar: global pathname links + homepage in-page anchor scroll.
  - Files: `components/layout/Navigation.tsx`
- [ ] **T3 (P1, human: ~3h / CC: ~25min)** — States — Add `loading.tsx`, `not-found.tsx`, and `error.tsx` for `/work`, `/work/[slug]`, `/writing`, `/writing/[slug]`.
  - Files: `src/app/work/loading.tsx`, `src/app/work/[slug]/not-found.tsx`, `src/app/writing/[slug]/not-found.tsx`
- [ ] **T4 (P2, human: ~3h / CC: ~20min)** — Reading System — Portable text typography (65ch, sticky desktop ToC, top reading progress indicator).
  - Files: `src/components/content/portable-text.tsx`
- [ ] **T5 (P2, human: ~2h / CC: ~15min)** — Code Tooling — Shiki `github-light` highlighting, copy-to-clipboard button, and overflow safety.
  - Files: `src/components/content/code-block.tsx`
- [ ] **T6 (P1, human: ~1h / CC: ~10min)** — Schema — Project schema with 8 core fields + portable text body.
  - Files: `sanity/schemaTypes/project.ts`
- [ ] **T7 (P1, human: ~3h / CC: ~25min)** — Deployment — Configure `next.config.js` for `output: 'export'` and verify GitHub Actions static deployment to `gh-pages`.
  - Files: `next.config.js`, `.github/workflows/deploy.yml`
- [ ] **T8 (P2, human: ~2h / CC: ~20min)** — Cards — Dense mono-typography listing cards with semantic category tags.
  - Files: `src/components/WorkIndexCard.tsx`, `src/components/WritingIndexCard.tsx`

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|---|---|---|---|---|---|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 0 | — | — |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | CLEAR | score: 4/10 → 9/10, 7 decisions |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | — |

**VERDICT:** DESIGN CLEARED — eng review required

NO UNRESOLVED DECISIONS
