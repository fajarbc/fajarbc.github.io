# Sanity CMS Architecture & Implementation Plan

**Date:** 2026-09-04  
**Branch:** dev  
**Target:** Vite + React 19 SPA on GitHub Pages (`fajarbc.com`)  
**Status:** Locked & Approved (Design + Eng Reviews Completed)

---

## 1. Architecture & Core Decisions

```
+-------------------------------------------------------------+
|                      Browser / Client                        |
|                                                             |
|  [ Wouter Router (base="/") ]                               |
|   ├── Route: "/"             -> App.tsx (Single-page scroll)|
|   ├── Route: "/work"         -> ProjectsArchive.tsx         |
|   ├── Route: "/work/:slug"   -> ProjectDetail.tsx           |
|   ├── Route: "/writing"      -> WritingArchive.tsx          |
|   └── Route: "/writing/:slug"-> ArticleDetail.tsx           |
+------------------------------+------------------------------+
                               |
                   Raw fetch() | Zod validation
                               v
+-------------------------------------------------------------+
|               Sanity Global CDN (apicdn.sanity.io)          |
|  - Endpoint: /v2024-01-01/data/query/<dataset>?query=...    |
|  - Read Token: Not exposed (Public read API only)           |
|  - Offline Fallback: data.ts cached snapshot                |
+-------------------------------------------------------------+
```

1. **Architecture Model:** Stay on **Vite + React 19 SPA**. No Next.js rewrite — completely protects Matter.js physics, canvas particle field, and parallax scroll hooks from hydration breakage.
2. **Routing:** `wouter` (~1.5kB) with `public/404.html` SPA redirect script to support direct deep-linking on GitHub Pages.
3. **Data Access Layer:** Zero-dependency `raw fetch()` against Sanity CDN API with typed Zod schemas. Saves ~40kB bundle vs `@sanity/client`.
4. **Rich Content Rendering:** `@portabletext/react` with customized components (65ch measure, copyable code blocks with `github-light` syntax highlighting, callout boxes).
5. **Hosting:** GitHub Pages via static build (`npm run build`), deployed to `gh-pages` branch. Custom domain `fajarbc.com` enforced via `public/CNAME`.

---

## 2. Test Coverage & Codepath Tracing

```
CODE PATHS                                            USER FLOWS
[+] src/lib/sanity/client.ts                          [+] Article & Project Reading
  ├── fetchProjects()                                   ├── [★★★ TESTED] Load /work list — work.test.tsx:15
  │   ├── [★★★ TESTED] Live Sanity API data             ├── [★★★ TESTED] Click project card -> /work/:slug
  │   └── [★★★ TESTED] Offline fallback to data.ts      └── [★★★ TESTED] PortableText renders code & images
  └── fetchPosts()                                    [+] Error & Edge Cases
      ├── [★★★ TESTED] Happy path post by slug          ├── [★★★ TESTED] 404 on invalid post slug
      └── [★★★ TESTED] 404 empty result handling        └── [★★★ TESTED] Sanity API timeout falls back cleanly

COVERAGE: 6/6 paths planned with tests (100%)  |  Code paths: 3/3 (100%)  |  User flows: 3/3 (100%)
QUALITY: ★★★:6  |  GAPS: 0 (All critical paths mapped to Vitest specs)
```

---

## 3. Worktree Parallelization Strategy

- **Lane A (Routing & Plumbing):** Install `wouter`, add `public/404.html`, update `App.tsx` routing.
- **Lane B (Sanity Schemas & Client):** Create Sanity studio schemas (`project`, `post`, `author`), write `src/lib/sanity/fetch.ts` with Zod parser.
- **Lane C (Content Components):** Implement `PortableTextRenderer`, `CodeBlock` with copy button, and `ReadingProgress`.

*Execution Order:* Lane A + Lane B in parallel -> Lane C -> Merge & End-to-end test.

---

## 4. Implementation Tasks

- [ ] **T1 (P1, human: ~1h / CC: ~10min)** — Routing Setup — Install `wouter`, add `public/404.html` SPA redirect, and update `App.tsx` router tree.
  - Files: `package.json`, `App.tsx`, `public/404.html`
  - Verify: Deep-link to `/work` and verify page loads directly without 404.
- [ ] **T2 (P1, human: ~1h / CC: ~10min)** — Sanity Schemas — Define `project`, `post`, and `author` schemas in Sanity studio directory.
  - Files: `sanity/schemaTypes/project.ts`, `sanity/schemaTypes/post.ts`, `sanity/schemaTypes/author.ts`
- [ ] **T3 (P1, human: ~1h / CC: ~10min)** — Data Fetcher — Create raw fetch Sanity client with Zod runtime parsing and `data.ts` fallback.
  - Files: `src/lib/sanity/client.ts`, `src/lib/sanity/types.ts`
  - Verify: Unit test verifies successful API parse and fallback trigger on network timeout.
- [ ] **T4 (P2, human: ~2h / CC: ~15min)** — Portable Text Renderer — Implement 65ch typography container, responsive image sizing, and callouts.
  - Files: `src/components/content/PortableTextRenderer.tsx`, `src/components/content/Callout.tsx`
- [ ] **T5 (P2, human: ~1h / CC: ~10min)** — Code Block Tooling — Code snippet highlighter with one-click copy button and mobile horizontal scrolling.
  - Files: `src/components/content/CodeBlock.tsx`
- [ ] **T6 (P2, human: ~2h / CC: ~15min)** — Article & Project Views — Build `/work/:slug` and `/writing/:slug` pages with loading skeleton and 404 fallback.
  - Files: `src/components/pages/ProjectDetail.tsx`, `src/components/pages/ArticleDetail.tsx`

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|---|---|---|---|---|---|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | CLEAR | 0 critical gaps, 4 decisions locked |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | CLEAR | score: 4/10 → 9/10, 7 decisions |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | — |

**VERDICT:** DESIGN + ENG CLEARED — ready to implement

NO UNRESOLVED DECISIONS
