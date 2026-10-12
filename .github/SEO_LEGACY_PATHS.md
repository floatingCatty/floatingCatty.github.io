# Public profile and legacy URL audit — October 2026

This is a maintainer record, not a public research article.

## Confirmed current and former paths

| URL | What was found before this change | Desired behavior after merge |
| --- | --- | --- |
| `/` | Current lamp-themed homepage, with a relatively indirect description of research | Keep one canonical homepage; add a discreet visible McGill/physics/research identity line and links |
| `/cv/` | Indexable AcademicPages-era CV, outdated experience and sparse software list | Replace at the **same canonical URL** with current education, experience, research, software, and an automatically maintained bibliography |
| `/about/` | Current prose but old AcademicPages styling | Keep the URL; apply the site's current visual design and current topic links |
| `/resume` | Existing noindex redirect stub to `/cv/` | Retain as a noindex redirect, not a second CV |
| `/resume/` | 404 | Give human readers a redirect to `/cv/` |
| `/cv.html` | Old-style alias occasionally used in academic sites | Give human readers a redirect to `/cv/` |
| `/about.html` | Existing noindex redirect stub | Retain redirect to `/about/` |
| `/docs/publication-source-audit/` | Internal bibliography-maintainer notes were unintentionally public and in sitemap | Exclude that source Markdown from Jekyll output and sitemap; GitHub source remains available |
| `/files/{arxiv-id}.pdf` | Three copies of old **research papers**, not CV PDFs | Preserve them: deleting scholarly resources would break historical links |
| `/googlec07fc31230407367.html` | Google Search Console HTML ownership proof | Preserve exact content and live URL; omit it from sitemap if Jekyll supports the default flag |

Other source tree files starting with `_` (such as layout templates and Sass)
are Jekyll internals, not independently published "old homepages".
The repository history and external search caches can still contain snapshots:
removing a public page does not rewrite past Git commits or erase cached search snippets.

## Verification

Use the GitHub Pages Jekyll CI (`scripts/audit_site.py`) to verify these
invariants against `_site/`: canonical pages self-canonicalize and contain
exactly one H1; obsolete body strings are absent; legacy aliases redirect
and are not indexable; `docs/publication-source-audit/` no longer outputs;
verification HTML is still served; sitemap doesn't promote internal notes
or the verification token.

After merging and deploying:

1. Verify `https://floatingcatty.github.io/cv/` and `/about/` with a live
   browser, including mobile and language-toggle behavior.
2. Open `/resume`, `/resume/`, `/cv.html`, and `/about.html` to check their
   browser redirects. On GitHub Pages, the redirect-from plugin creates an
   **instant HTML meta refresh**, not a server-side HTTP 301.
3. Test that `/docs/publication-source-audit/` has become a 404 and that
   `/googlec07fc31230407367.html` still shows the verification line.
4. Inspect `/cv/`, `/about/`, and `/` using Search Console → URL Inspection →
   Test Live URL → Request Indexing. Search-result snippets may still show
   pre-2026 CV text until Google recrawls.
5. If the live CV has been fixed but Google continues to display an obsolete
   snippet, Search Console → Removals → **Clear snippet in search** can clear
   the old text until the refreshed page is indexed. Do **not** use the
   "Temporarily remove URL" option for the valid current CV.
6. Keep the confirmed indexed URL(s) under GSC Wizard tracking and evaluate
   coverage, crawl dates and queries once data is available.

Official documentation:
- https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- https://support.google.com/webmasters/answer/9689846
- https://github.com/jekyll/jekyll-redirect-from
