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
        self.schemas = []
        self._reading_schema = False
        self._schema_parts = []
        self.languages = set()
        self.links = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.html_lang = a.get("lang")
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

    research = json_file("research.json")
    papers = json_file("publications.json")
    notes = research.get("items", [])
    entries = papers.get("papers", [])
    expect(len(notes) >= 9, "Fewer than nine research/software notes in generated feed")
    expect(len(entries) >= 7, "Fewer than seven publications in generated feed")
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
