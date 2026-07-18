# 为好奇心留一盏灯 · Keep a light on for curiosity

Personal website of **周寅张皓 / Zhanghao Zhou** — physics, AI, and scientific software.

Live at <https://floatingCatty.github.io>.

## Structure

The site is a Jekyll project. The landing experience uses a custom, self-contained "oil lamp" design; the deeper content (posts, publications, CV) still renders through the underlying [academicpages](https://github.com/academicpages/academicpages.github.io) / Minimal Mistakes theme.

| Path | Purpose |
| --- | --- |
| `index.html` | Home page (lamp design, `layout: raw`) |
| `_pages/essays.html` | 随笔 · Essays listing (`category: essay` posts) |
| `_pages/study-notes.html` | 学习笔记 · Study notes listing (`category: study` posts) |
| `_pages/about.md`, `cv.md`, `publications.md`, `cif-viewer.html` | Inner pages |
| `_posts/` | Blog posts — set `category: essay` or `category: study` in front matter |
| `_publications/` | Publication entries |
| `_includes/lamp-*.html` | Shared markup for the lamp-styled pages (head, nav, footer, embers) |
| `_layouts/raw.html` | Pass-through layout that bypasses the theme for the lamp pages |
| `_sass/`, `assets/`, other `_includes/`, `_layouts/` | Underlying theme engine (used by inner pages) |

## Writing a post

Add a Markdown file to `_posts/` named `YYYY-MM-DD-title.md`. In the front matter set the stream:

```yaml
category: essay   # shows on /essays/  (narrative)
# or
category: study   # shows on /study-notes/  (technical notes)
```

## Run locally

```bash
bundle install
bundle exec jekyll serve -l -H localhost
```

Then open <http://localhost:4000>.

---

Built on the academicpages template (© Michael Rose / Stuart Geiger, MIT License — see `LICENSE`).
