# FOLLOW-UP PROMPTS — RIA AI Report

> **Archive.** Go-live, the first-look polish, the First Trust restyle, and
> the rename to **CFP AI REPORT** are done. Open work is
> `docs/FUTURE_IMPROVEMENTS.md`.

Use these in later conversations in this folder. Not required for the first run.

---

## 1. First-look polish (after local preview)

```
I have looked at the local RIA AI Report. Keep the 3-column layout.
Fix: [empty sections / bad sources / wrong routing / branding notes].
Re-probe failing feeds. Do not create a GitHub repo yet.
```

## 2. Create the public GitHub repo + Pages

```
The first look is good enough. In /Users/paulnelson/Documents/Development/RIA-AI-Drudge/
only:

1. Confirm git is initialized and nothing from ai-drudge is in this remote.
2. Create a new public GitHub repository (suggest name ria-ai-report or RIA-AI-Drudge).
3. Set vite base and Atom SITE_URL to the Pages project path.
4. Commit the site (no secrets). Push to origin.
5. Enable GitHub Pages from the existing refresh.yml workflow (Actions + Pages).
6. Return the repo URL and the Pages URL.

Do not touch any other Development project.
```

## 3. Feed-rot / collector pass

```
Upgrade RIA AI Report sources quality-first. Probe every URL in scripts/sources.ts
and ai-news-sources-RIA.md. Replace 404/stale feeds. Add only live, parseable,
on-topic sources. Keep requireAny filters on broad outlets. Commit if I ask.
```

## 4. Column / keyword tuning

```
Homepage sections feel [thin / wrong]. Adjust CATEGORIES order, AGE_WINDOWS,
KEYWORDS, and requireAny without changing the 3-column wire or client features.
```

## 5. Daily brief voice

```
Rewrite generate-brief.ts so the fallback and Claude prompts speak to RIAs
(supervision, vendor AI, exam priorities, AI-as-theme) without inventing facts.
```
