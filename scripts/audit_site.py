#!/usr/bin/env python3
"""Check the generated Jekyll site, not just its source templates.

Run after a Pages-compatible build:
    python3 scripts/audit_site.py _site
"""
from __future__ import annotations

import json
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree


class Metadata(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.meta = {}
        self.canonical = []
        self.alternates = {}
        self.html_lang = None
        self.h1_count = 0
        self.schemas = []
        self._reading_schema = False
        self._schema_parts = []
        self.languages = set()
        self.links = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.html_lang = a.get("lang")
        if tag == "h1":
            self.h1_count += 1
        if tag == "meta":
            key = a.get("name") or a.get("property")
            if key:
                self.meta.setdefault(key, []).append(a.get("content", ""))
        elif tag == "link" and "canonical" in (a.get("rel") or "").split():
            self.canonical.append(a.get("href", ""))
        elif tag == "link" and "alternate" in (a.get("rel") or "").split() and a.get("hreflang"):
            self.alternates[a["hreflang"]] = a.get("href")
        elif tag == "a":
            self.links.append(a.get("href", ""))
        elif tag == "script" and a.get("type") == "application/ld+json":
            self._reading_schema = True
            self._schema_parts = []
        elif tag == "div":
            css = (a.get("class") or "").split()
            for name in ("post-zh", "post-en"):
                if name in css:
                    self.languages.add(name)

    def handle_data(self, text):
        if self._reading_schema:
            self._schema_parts.append(text)

    def handle_endtag(self, tag):
        if tag == "script" and self._reading_schema:
            raw = "".join(self._schema_parts).strip()
            self._reading_schema = False
            if raw:
                self.schemas.append(json.loads(raw))

    def schema_types(self):
        return {entry.get("@type") for entry in self.schemas if isinstance(entry, dict)}


def main(root: Path) -> int:
    errors = []
    checked = 0

    def expect(ok, message):
        nonlocal checked
        checked += 1
        if not ok:
            errors.append(message)

    def resolve_url(url):
        parsed = urlsplit(url)
        if parsed.netloc and parsed.netloc.lower() not in ("floatingcatty.github.io",):
            return None
        relative = unquote(parsed.path).lstrip("/")
        possibilities = [
            root / relative,
            root / relative / "index.html",
            root / (relative + ".html"),
        ]
        return next((p for p in possibilities if p.is_file()), None)

    def parse_page(url):
        path = resolve_url(url)
        expect(path is not None, "Missing built page: " + url)
        if path is None:
            return None
        parser = Metadata()
        try:
            parser.feed(path.read_text(encoding="utf-8"))
        except (ValueError, json.JSONDecodeError) as exc:
            errors.append("Invalid structured data in " + url + ": " + str(exc))
        return parser

    def json_file(name):
        path = root / name
        expect(path.is_file(), "Missing generated " + name)
        if not path.is_file():
            return {}
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            errors.append("Invalid " + name + ": " + str(exc))
            return {}

    sitemap = root / "sitemap.xml"
    expect(sitemap.is_file(), "Missing sitemap.xml")
    sitemap_urls = set()
    if sitemap.is_file():
        try:
            xml = ElementTree.fromstring(sitemap.read_text(encoding="utf-8"))
            sitemap_urls = {
                node.text.strip().rstrip("/")
                for node in xml.iter()
                if node.tag.rsplit("}", 1)[-1] == "loc" and node.text
            }
        except ElementTree.ParseError as exc:
            errors.append("Invalid sitemap.xml: " + str(exc))
    robots = root / "robots.txt"
    expect(robots.is_file(), "Missing robots.txt")
    if robots.is_file():
        contents = robots.read_text(encoding="utf-8")
        expect("OAI-SearchBot" in contents and "Allow: /" in contents,
               "OAI-SearchBot should be able to access public content")
        expect("https://floatingcatty.github.io/sitemap.xml" in contents,
               "Sitemap URL missing from robots.txt")

    home = parse_page("https://floatingcatty.github.io/")
    if home:
        expect(len(home.canonical) == 1, "Homepage must have one canonical URL")
        expect(any(x.get("@type") == "Person" for x in home.schemas if isinstance(x, dict)),
               "Homepage should expose the researcher identity")
        expect(any("/research/" in (href or "") for href in home.links),
               "Homepage does not link to research")
        expect(any("/cv/" in (href or "") for href in home.links),
               "Homepage must visibly link the academic CV")
        home_path = resolve_url("https://floatingcatty.github.io/")
        if home_path:
            markup = home_path.read_text(encoding="utf-8")
            expect('class="nav-cv"' in markup,
                   "Shared navigation lacks visible icon-labeled CV item")
            expect('data-href-zh="/zh/cv/"' in markup,
                   "CV navigation does not expose the Chinese URL")

    # The human-facing researcher and CV pages should not expose the old 2023-era
    # resume or stale biography, and their canonical URL must stay unchanged.
    for slug, expected in (("cv", "Ph.D. candidate in Physics"),
                           ("about", "machine-learned")):
        url = "https://floatingcatty.github.io/" + slug + "/"
        profile = parse_page(url)
        if profile:
            expect(profile.canonical == [url],
                   slug + " page needs one self-canonical URL")
            expect(profile.h1_count == 1,
                   slug + " page should have exactly one H1")
            expect(bool(profile.meta.get("description", [""])[0]),
                   slug + " page lacks its meta description")
            expect("ProfilePage" in profile.schema_types(),
                   slug + " page lacks a linked researcher profile schema")
            page_path = resolve_url(url)
            html = page_path.read_text(encoding="utf-8") if page_path else ""
            expect(expected in html,
                   slug + " page lacks current academic research identity")
            expect(all(old not in html for old in
                       ("Feb 2024 (expected)", "May 2022 - Till date",
                        "Alea iacta est.", "Zhanghao's Blog")),
                   slug + " still contains content from the retired CV/website")

    # CV deliberately links papers to original scientific sources as well
    # as same-theme author-owned detail pages (not an old AcademicPages view).
    for locale in ("cv/", "zh/cv/"):
        cv_path = resolve_url("https://floatingcatty.github.io/" + locale)
        if cv_path:
            cv_html = cv_path.read_text(encoding="utf-8")
            expect('10.1038/s41467-024-51006-4' in cv_html,
                   "CV missing direct DOI link to published DeePTB paper")
            expect('/publication/' in cv_html,
                   "CV should preserve stable local paper detail links")
            expect('TCAD' in cv_html and 'circuit' in cv_html.lower() or
                   'TCAD' in cv_html and '电路' in cv_html,
                   "CV lost atomistic-to-device multiscale positioning")

    # Full-language profile URLs must be crawlable independently.
    for slug in ("cv", "about"):
        en_url = "https://floatingcatty.github.io/" + slug + "/"
        zh_url = "https://floatingcatty.github.io/zh/" + slug + "/"
        for url, lang, other in ((en_url, "en", zh_url),
                                 (zh_url, "zh-Hans", en_url)):
            parsed = parse_page(url)
            if not parsed:
                continue
            expect(parsed.canonical == [url], "Noncanonical localized profile: " + url)
            expect(parsed.html_lang == lang, "Wrong HTML language for " + url)
            expect(parsed.h1_count == 1, "Wrong H1 count: " + url)
            expect(parsed.alternates.get("en") == en_url and
                   parsed.alternates.get("zh-Hans") == zh_url,
                   "Localized profile missing reciprocal hreflang: " + url)
            expect(any(urlsplit(href or "").path == urlsplit(other).path
                       for href in parsed.links),
                   "Localized profile missing a visible alternate link: " + url)
            expect(url.rstrip("/") in sitemap_urls, "Localized profile missing from sitemap: " + url)
            profile_schemas = [x for x in parsed.schemas if isinstance(x, dict)
                               and x.get("@type") == "ProfilePage"]
            expect(len(profile_schemas) == 1 and
                   profile_schemas[0].get("inLanguage") == lang,
                   "Profile schema language is wrong: " + url)
            path = resolve_url(url)
            html = path.read_text(encoding="utf-8") if path else ""
            profile_body = html.split('<main class="profile-content"', 1)[-1].split('</main>', 1)[0]
            expect('class="i18n-en"' not in profile_body and
                   'class="i18n-zh"' not in profile_body,
                   "Duplicated translated profile main text: " + url)
    cv_path = resolve_url("https://floatingcatty.github.io/cv/")
    if cv_path:
        cv_html = cv_path.read_text(encoding="utf-8")
        expect("M.E. in Electronic Information" in cv_html,
               "CV misidentifies Tianjin University master's degree")
        expect("M.E. in Computer Science" not in cv_html,
               "Obsolete master degree label remains")
        expect(all(word in cv_html for word in
                   ("AI4S-Benchmark", "RSATB", "RESCU++", "QTCAD")),
               "CV omits important source-verified work")

    # Historical paths should guide visitors to the current URLs, not expose
    # a second live copy with the old academicpages layout.
    for previous, destination in (
        ("/resume", "/cv/"),
        ("/resume/", "/cv/"),
        ("/cv.html", "/cv/"),
        ("/about.html", "/about/"),
    ):
        path = resolve_url("https://floatingcatty.github.io" + previous)
        expect(path is not None,
               "Legacy profile path lost its redirect: " + previous)
        if path:
            content = path.read_text(encoding="utf-8").lower()
            expect("refresh" in content and destination in content,
                   "Legacy path does not redirect to its current profile: " + previous)
            expect("noindex" in content,
                   "Legacy redirect should not be indexed: " + previous)

    # Keep maintenance notes in GitHub but outside the public site. Do not
    # accidentally delete or disable Search Console ownership verification.
    expect("/docs/publication-source-audit" not in sitemap_urls,
           "Internal citation audit leaked into sitemap")
    expect(resolve_url("https://floatingcatty.github.io/docs/publication-source-audit/") is None,
           "Internal citation audit is still publicly rendered")
    custom_404 = root / "404.html"
    expect(custom_404.is_file(), "Custom 404 page missing")
    if custom_404.is_file():
        notfound = custom_404.read_text(encoding="utf-8").lower()
        expect('name="robots" content="noindex,follow"' in notfound,
               "404 page must be explicitly non-indexable")
        expect('/cv/' in notfound and '/research/' in notfound,
               "404 should lead visitors to current profile and research")
    expect("https://floatingcatty.github.io/404.html" not in sitemap_urls,
           "404 page must not be in sitemap")

    verification = root / "googlec07fc31230407367.html"
    expect(verification.is_file(), "Google verification HTML was removed")
    if verification.is_file():
        expect("google-site-verification: googlec07fc31230407367.html" in
               verification.read_text(encoding="utf-8"),
               "Google verification token was modified")
    expect("https://floatingcatty.github.io/googlec07fc31230407367.html"
           not in sitemap_urls, "Verification file should not be promoted as an indexable article")

    research = json_file("research.json")
    papers = json_file("publications.json")
    notes = research.get("items", [])
    entries = papers.get("papers", [])
    expect(len(notes) >= 10, "Fewer than ten released research and software notes")
    expect(len(entries) >= 11, "Fewer than eleven verified publications in generated feed")
    # The author postponed the standalone cross-project synthesis until RSATB
    # is public; no public page, sitemap entry, JSON feed item or index link
    # may expose either localized draft in the meantime.
    for slug in ("research/learned-hamiltonians-to-observables/",
                 "zh/research/learned-hamiltonians-to-observables/"):
        withheld = "https://floatingcatty.github.io/" + slug
        expect(resolve_url(withheld) is None, "Postponed guide still rendered: " + withheld)
        expect(withheld.rstrip("/") not in sitemap_urls, "Postponed guide in sitemap: " + withheld)
        expect(not any(slug.rstrip("/") in (x.get("url", "") or "") or
                       slug.rstrip("/") in (x.get("url_zh", "") or "")
                       for x in notes),
               "Postponed guide leaked into research.json: " + withheld)
        for location in ("https://floatingcatty.github.io/",
                         "https://floatingcatty.github.io/research/",
                         "https://floatingcatty.github.io/zh/research/"):
            p = resolve_url(location)
            if p:
                expect(slug.rstrip("/") not in p.read_text(encoding="utf-8"),
                       "Postponed guide still linked from public navigation: " + location)

    conference = next((x for x in entries
                       if "2025-12-12-DeePTB-NEGF-preprint" in x.get("url", "")), None)
    expect(conference is not None and
           conference.get("doi") == "10.1109/MoSICom67153.2025.11398312" and
           conference.get("preprint_url") == "https://arxiv.org/abs/2512.11291",
           "Published IEEE conference record must preserve its public arXiv provenance")

    for item in notes + entries:
        url = item.get("url", "")
        expect(url.rstrip("/") in sitemap_urls,
               "Research or publication missing from sitemap: " + url)

    for item in notes:
        url = item.get("url", "")
        page = parse_page(url)
        if not page:
            continue
        expect(len(page.canonical) == 1, "Canonical URL count for " + url)
        if item.get("url_zh"):
            expect(page.languages == {"post-en"}, "English article contains extra/missing language body: " + url)
            expect(page.html_lang == "en", "Wrong English HTML language: " + url)
            expect(page.alternates.get("en") == url, "Missing reciprocal English hreflang: " + url)
            expect(page.alternates.get("zh-Hans") == item["url_zh"],
                   "Missing Chinese hreflang on English page: " + url)
            expect(any(x.get("inLanguage") == "en" for x in page.schemas if isinstance(x, dict)),
                   "Wrong English schema language: " + url)
            zh_url = item["url_zh"]
            zh = parse_page(zh_url)
            if zh:
                expect(zh_url.rstrip("/") in sitemap_urls, "Chinese translation missing from sitemap: " + zh_url)
                expect(len(zh.canonical) == 1 and zh.canonical[0] == zh_url,
                       "Chinese page needs a self-canonical: " + zh_url)
                expect(zh.languages == {"post-zh"}, "Chinese article contains extra/missing language body: " + zh_url)
                expect(zh.html_lang == "zh-Hans", "Wrong Chinese HTML language: " + zh_url)
                expect(zh.alternates.get("en") == url and zh.alternates.get("zh-Hans") == zh_url,
                       "Chinese article needs reciprocal hreflang annotations: " + zh_url)
                expect(any(x.get("inLanguage") == "zh-Hans" for x in zh.schemas if isinstance(x, dict)),
                       "Wrong Chinese schema language: " + zh_url)
                expect(any(urlsplit(href or "").path == urlsplit(url).path for href in zh.links),
                       "Missing visible link back to English: " + zh_url)
        else:
            expect({"post-zh", "post-en"}.issubset(page.languages),
                   "Legacy bilingual note lost one language: " + url)
        expect("BlogPosting" in page.schema_types(), "BlogPosting missing in " + url)
        expect(bool(item.get("title_zh")) and bool(item.get("title_en")),
               "Missing bilingual title in research feed for " + url)
        expect(bool(item.get("paper_url") or item.get("code_url")),
               "Missing external source for " + url)

    for paper in entries:
        url = paper.get("url", "")
        page = parse_page(url)
        if not page:
            continue
        expect(len(page.canonical) == 1, "Canonical URL count for " + url)
        expect("ScholarlyArticle" in page.schema_types(),
               "ScholarlyArticle missing in " + url)
        expect(bool(page.meta.get("citation_title")), "citation_title missing in " + url)
        published_page = resolve_url(url)
        if published_page:
            markup = published_page.read_text(encoding="utf-8")
            expect('class="publication-title"' in markup and
                   'class="profile-intro"' in markup,
                   "Paper detail still uses retired academic theme: " + url)
            expect('class="page__inner-wrap"' not in markup,
                   "Paper detail unexpectedly retains AcademicPages HTML: " + url)
            source = paper.get("paper_url")
            expect(bool(source) and source in markup,
                   "Paper detail must link to original published paper: " + url)
        authors = paper.get("authors") or []
        expect(bool(authors) and len(page.meta.get("citation_author", [])) == len(authors),
               "Citation author count mismatch in " + url)
        expect(bool(paper.get("research_url")) and resolve_url(paper["research_url"]) is not None,
               "Missing linked research note for " + url)

    index = parse_page("https://floatingcatty.github.io/research/")
    if index:
        for item in notes:
            path = urlsplit(item.get("url", "")).path
            expect(any(path in (href or "") for href in index.links),
                   "Research index does not link " + path)

    print(f"Checked {checked} conditions across {len(notes)} notes and {len(entries)} papers.")
    if errors:
        for message in errors:
            print("FAIL:", message)
        return 1
    print("All checks passed.")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python3 scripts/audit_site.py <jekyll-output-directory>")
    raise SystemExit(main(Path(sys.argv[1])))
