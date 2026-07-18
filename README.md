# 为好奇心留一盏灯 · Keep a light on for curiosity

Personal website of **周寅张皓 / Zhanghao Zhouyin** — physics, AI, and scientific software.

Live at <https://floatingCatty.github.io>.

## Structure

The site is a Jekyll project. The landing experience uses a custom, self-contained "oil lamp" design; the deeper content (posts, publications, CV) still renders through the underlying [academicpages](https://github.com/academicpages/academicpages.github.io) / Minimal Mistakes theme.

| Path | Purpose |
| --- | --- |
| `index.html` | Home page (lamp design, `layout: raw`) |
| `_pages/essays.html` | 随笔 · Essays listing (`category: essay` posts) |
| `_pages/study-notes.html` | 学习笔记 · Study notes listing (`category: study` posts) |
| `_pages/about.md`, `cv.md`, `publications.md` | Inner pages |
| `_posts/` | Blog posts — set `category: essay` or `category: study` in front matter |
| `_publications/` | Publication entries |
| `_includes/lamp-*.html` | Shared markup for the lamp-styled pages (head, nav, footer, embers) |
| `_layouts/raw.html` | Pass-through layout for the lamp landing/listing pages |
| `_layouts/post.html` | Lamp-styled article layout for individual posts (essays + study notes), incl. MathJax |
| `_sass/`, `assets/`, other `_includes/`, `_layouts/` | Underlying theme engine (still used by /about/, /cv/, /publications/) |

## Writing a post

Add a Markdown file to `_posts/` named `YYYY-MM-DD-title.md`. It automatically renders
in the lamp-styled article layout (`_layouts/post.html`) — no `layout:` needed.

**Standard front matter for a study note:**

```yaml
---
title: 'SOC Matrix Element in DFT'   # shown as the page heading + browser title
date: 2025-01-08                     # drives the timeline position + displayed date
category: study                      # study -> /study-notes/ ; essay -> /essays/
tags:                                # optional; first tag is shown as a chip
  - Physics Notes
excerpt: 'One-line summary.'         # optional; used for the meta description
---
```

Conventions:

- **`category`** decides the stream and styling: `study` (technical notes, LaTeX-heavy)
  or `essay` (narrative). This is the only required non-obvious field.
- **Math** works out of the box: inline `$…$` and display `$$…$$` (and `\begin{align*}…\end{align*}`).
  Equations are auto-numbered and wide ones scroll horizontally on small screens.
- **Headings** inside the body use `#`, `##`, `###`. The `title` is already rendered at
  the top, so you can start the body at `##` (or a short intro paragraph) to avoid a
  duplicate top-level heading.
- **Permalink** is optional; without one the URL follows `_config.yml` (`/year/month/slug/`).
- Code blocks, blockquotes, tables, and images are all lamp-styled automatically.

## Run locally

```bash
bundle install
bundle exec jekyll serve -l -H localhost
```

Then open <http://localhost:4000>.

---

Built on the academicpages template (© Michael Rose / Stuart Geiger, MIT License — see `LICENSE`).
