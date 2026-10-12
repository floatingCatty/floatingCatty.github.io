# 为好奇心留一盏灯 · Keep a light on for curiosity

Personal website of **周寅张皓 / Zhanghao Zhouyin** — physics, AI, and scientific software.

Live at <https://floatingCatty.github.io>.

## Structure

The site is a Jekyll project. The homepage, research, essays, study notes and publication index use the oil-lamp design. The CV, About page and individual publication abstracts use the underlying [academicpages](https://github.com/academicpages/academicpages.github.io) / Minimal Mistakes theme.

| Path | Purpose |
| --- | --- |
| `index.html` | Home page (lamp design, `layout: raw`) |
| `_pages/essays.html` | 随笔 · Essays listing (`category: essay` posts) |
| `_pages/study-notes.html` | 学习笔记 · Study notes listing (`category: study` posts) |
| `_pages/about-page.html`, `cv.html`, `publications.html`, `research.html` | About, current academic CV, and publication/research indexes |
| `_posts/` | Blog posts — set `category: essay` or `category: study` in front matter |
| `_publications/` | Individual scholarly abstracts, author lists, citation metadata and source links |
| `_pages/research-*.md` | Bilingual research and software notes (`layout: research`) |
| `publications.json`, `research.json` | Jekyll-generated public machine-readable indexes |
| `scripts/audit_site.py` | Checks generated pages, research links, citation metadata, profile canonicals and legacy redirects |
| `_includes/lamp-profile-style.html` | Shared accessible/printable About and CV presentation |
| `_includes/lamp-*.html` | Shared markup for the lamp-styled pages (head, nav, footer, embers) |
| `_layouts/raw.html` | Pass-through layout for the lamp landing/listing pages |
| `_layouts/post.html`, `_layouts/research.html` | Lamp-styled article layouts, incl. MathJax |
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
  - ⚠️ **Never put a raw `|` inside inline `$…$` math.** kramdown's GFM parser treats the
    line as a table and mangles the equation. Use `\vert`, `\mid`, or `\lvert…\rvert`
    instead (they render identically). Inside `$$…$$` display blocks, `|` is fine.
  - Keep `$$` balanced, and don't glue `$$` directly to a word (`When$$…$$` breaks — write
    `When $…$` with a space). Prefer `\tilde{G}` over `\~G`, `\operatorname*{argmax}` over `\argmax`.
- **Headings** inside the body use `#`, `##`, `###`. The `title` is already rendered at
  the top, so you can start the body at `##` (or a short intro paragraph) to avoid a
  duplicate top-level heading.
- **Permalink** is optional; without one the URL follows `_config.yml` (`/year/month/slug/`).
- Code blocks, blockquotes, tables, and images are all lamp-styled automatically.

## Adding publications and research notes

For **all research and software notes**, each language has its own URL.
The English source remains `_pages/research-<slug>.md` at
`/research/<slug>/`; its Chinese counterpart is `_pages/research-<slug>-zh.md`
at `/zh/research/<slug>/`. Both carry:

- `research_locale: en` or `research_locale: zh`;
- `translation_url`: the other language's page;
- `alternate_en_url` and `alternate_zh_url`: both canonical variants;
- `translation_of` **on the Chinese page only**, so `/research.json` lists
  one entry per project but exposes both URLs.

Keep the Chinese and English bodies in their respective `post-zh` and `post-en`
wrappers. The existing language toggle navigates between the two pages;
the HTML head has reciprocal `hreflang` and self-canonical links. A note can
have separate language URLs without depending on JavaScript to show its content.

The English and Chinese research indexes live at `/research/` and
`/zh/research/`. **Update both indexes** with one original-language card
each, linking directly to the corresponding translation. The site homepage
uses locale-aware links where a real Chinese equivalent exists.

A research note is a personal explanation of a project, not the original
paper abstract. A broader **technical perspective** may use
`project_kind: guide` with a first-party source URL and
`citation_urls:` listing several fully verified primary references.
This renders `BlogPosting.citation` as a list of URLs and labels the note
as a technical perspective, not a new research paper. Do not describe
unpublished numerical results, or add SEO-only translations that do not
contain a substantial independent-language body.

An academic paper belongs in `_publications/`. Its front matter should
include the **published** author list, journal or conference, date/year, DOI
when available, and the original paper URL. Set `research_url` to the
corresponding note. If a conference paper and its preprint have different
author lists or dates, record both versions rather than merging their
bibliographic metadata. Do not invent day/month precision when only a
publication year is verified.

The public `/research.json` and `/publications.json` feeds are generated
from Jekyll front matter. They need no separate manual edits.

## Verify a site change

GitHub Actions builds a Pages-compatible version and runs the site audit for
relevant PR changes. Locally, run:

```bash
bundle exec jekyll build
python3 scripts/audit_site.py _site
```

The audit checks generated HTML, per-paper citation tags, canonical URLs,
the researcher identity, language blocks, JSON feeds, sitemap membership and
internal research links. It does not measure Google or ChatGPT indexing.
Use Search Console to inspect crawl/indexing status after publishing.

## Run locally

```bash
bundle install
bundle exec jekyll serve -l -H localhost
```

Then open <http://localhost:4000>.

---

Built on the academicpages template (© Michael Rose / Stuart Geiger, MIT License — see `LICENSE`).

## Profile and former URLs

The canonical researcher pages are `/` (homepage), `/about/`, and `/cv/`.
Both `/about/` and `/cv/` use the current site styling and citation records;
the CV publication list is generated from `_publications/` rather than kept as a second manually dated list.

Older links `/resume`, `/resume/`, `/cv.html`, and `/about.html` intentionally
remain as **noindex redirect stubs** to their matching current page. Do not copy
an old CV into a second public location. See [the URL cleanup notes](.github/SEO_LEGACY_PATHS.md).

The internal source-audit file `docs/publication-source-audit.md` is kept in
GitHub for the maintainers but explicitly excluded from the public Jekyll build.
The Search Console verification HTML must stay at the repository root and keep
its exact token, even though it is not a research page.
