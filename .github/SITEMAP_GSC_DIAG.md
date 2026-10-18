# Google Search Console "Couldn't fetch" — controlled sitemap test

**Observation (2026-10-18):** Google Search Console reports that
`/sitemap.xml` could not be fetched, discovers 0 URLs, and its displayed
last-read date has not changed since 2026-10-11. This does **not** prove
that the current sitemap XML is malformed.

Already-verified external behavior:

- `https://floatingcatty.github.io/sitemap.xml` responds with HTTP 200,
  no redirect, and the existing sitemap inspection service parsed 62 URLs.
- `https://floatingcatty.github.io/robots.txt` responds with HTTP 200
  and declares the primary XML sitemap.
- The GitHub Pages build checks the generated XML structure, links and
  sitemap membership; a previously inspected homepage was crawled by Google.
- The earlier GSC Wizard MCP integration is unavailable because its
  trial/subscription has ended, so actual Search Console requests must be
  made by the site owner through the official UI.

## Control sitemap

`sitemap-diagnostic.txt` is a **short-lived diagnostic**, with ten
root-domain canonical HTML URLs. It has one full HTTPS URL per line, without
comments, XML markup or invalid URLs. The site build audit verifies each
URL also appears in the regular `sitemap.xml`. It is not added to
`robots.txt` because it is a diagnostic control, not a replacement for
the automatically maintained complete XML sitemap.

This second format is supported by Google's official sitemap specification,
and removes XML syntax as a variable. Its behavior can therefore narrow the
investigation:

- If **both** sitemaps are fetched successfully: keep the generated XML
  as canonical; remove the diagnostic file after a reasonable observation.
- If **text succeeds, XML fails**: inspect the XML response format, cache,
  namespace, URL contents and file-specific fetch behavior.
- If **both fail** despite independent HTTP 200 responses: prioritize
  Google's site fetch/status, property verification, manual/security actions,
  or crawl scheduling; don't blindly regenerate the same XML.
- If an explicit HTTP error appears in the Google report, follow the
  concrete status instead of inferring a parse problem.

## After the PR is merged and the Pages deployment has finished

1. Verify the **published** control file:
   `https://floatingcatty.github.io/sitemap-diagnostic.txt`.
   It should contain precisely ten absolute URLs.
2. Open [Google Search Console](https://search.google.com/search-console/)
   and select exactly `https://floatingcatty.github.io/`.
3. Run **URL Inspection → Test Live URL** for both
   `https://floatingcatty.github.io/sitemap.xml` and
   `https://floatingcatty.github.io/sitemap-diagnostic.txt`.
   Inspect *Crawl allowed?* and *Page fetch*. The inspection tool's
   "not indexed" status for a non-HTML sitemap is not the test result.
4. In **Indexing → Sitemaps**, submit `sitemap.xml` **once** as an
   evidence-based retry after a failed week. Submit
   `sitemap-diagnostic.txt` separately to compare status and
   discovered URL counts.
5. Wait for Search Console to show the actual processing results. Capture
   each row's Status, Type, Last read, Discovered pages and any detailed
   errors. Don't repeatedly remove and re-add the sitemap.
6. If the error still occurs, inspect **Security & Manual Actions**, and
   report an exact fetch error or Google's Live URL Inspection result.
   The GitHub Actions site-audit logs also probe the live XML with standard
   and Googlebot-like User-Agent headers. Simulating the User-Agent is
   **not** proof of Google's own server-side fetch.

Google:
- https://support.google.com/webmasters/answer/7451001
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

**Cleanup:** Remove this diagnostic text sitemap and its CI assertions
once the comparison yields a conclusion. Do not let it become a stale,
separately maintained substitute for `jekyll-sitemap`.
