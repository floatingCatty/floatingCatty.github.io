#!/usr/bin/env python3
"""Notify IndexNow only about public URLs changed by the latest site deployment.

For GitHub Pages deployments this runs after a successful deployment_status event.
To recover from missing deployment events, workflow_dispatch accepts a comma- or
newline-separated list of site-relative or absolute changed URLs.

It is deliberately independent of any paid API and uses Python's stdlib only.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import urlsplit, urlunsplit
from urllib.request import Request, urlopen
from xml.etree import ElementTree

ORIGIN = "https://floatingcatty.github.io"
HOST = "floatingcatty.github.io"
INDEXNOW = "https://api.indexnow.org/indexnow"
PERMALINK = re.compile(r'(?m)^permalink\s*:\s*["\x27]?([^"\x27#\s]+)')
FRONTMATTER = re.compile(r"\A---\s*\n(.*?)\n---\s*\n", re.S)
KEYFILE = re.compile(r"[a-f0-9]{32}\.txt\Z")
BROAD_SOURCE_PREFIXES = ("_includes/", "_layouts/", "_data/", "_sass/", "assets/css/")
BROAD_SOURCE_FILES = {"_config.yml", "research.json", "publications.json"}


def key_at_root(root: Path) -> tuple[str, str]:
    matches = [
        p for p in root.iterdir()
        if p.is_file()
        and KEYFILE.fullmatch(p.name)
        and p.read_text(encoding="utf-8").strip() == p.stem
    ]
    if len(matches) != 1:
        raise ValueError("Expected exactly one valid 32-hex IndexNow key file at repository root")
    key = matches[0].stem
    return key, f"{ORIGIN}/{key}.txt"


def canonical_url(text: str) -> str:
    text = text.strip()
    if not text:
        raise ValueError("URL cannot be empty")
    if text.startswith("/") and not text.startswith("//"):
        text = ORIGIN + text
    parsed = urlsplit(text)
    if (parsed.scheme != "https" or parsed.netloc != HOST
            or parsed.username or parsed.password
            or parsed.query or parsed.fragment):
        raise ValueError(f"Not a canonical URL on {HOST}: {text}")
    if not parsed.path.startswith("/"):
        raise ValueError("Invalid URL path")
    return urlunsplit(("https", HOST, parsed.path, "", ""))


def permalink_from_source(body: str | None) -> str | None:
    if not body:
        return None
    front = FRONTMATTER.search(body)
    if not front:
        return None
    match = PERMALINK.search(front.group(1))
    return canonical_url(match.group(1)) if match else None


def git_text(spec: str, root: Path) -> str | None:
    proc = subprocess.run(
        ["git", "show", spec], cwd=root, capture_output=True, text=True, check=False
    )
    return proc.stdout if proc.returncode == 0 else None


def git_changes(root: Path) -> list[tuple[str, str]]:
    proc = subprocess.run(
        ["git", "diff", "--name-status", "-M", "HEAD^", "HEAD"],
        cwd=root, capture_output=True, text=True, check=False,
    )
    if proc.returncode != 0:
        raise ValueError("Cannot read deployment diff from HEAD^ to HEAD")
    changes: list[tuple[str, str]] = []
    for line in proc.stdout.splitlines():
        fields = line.split("\t")
        status = fields[0][0]
        if status in {"R", "C"} and len(fields) >= 3:
            changes.extend((("D", fields[1]), ("A", fields[2])))
        elif status in {"A", "M", "D"} and len(fields) >= 2:
            changes.append((status, fields[1]))
    return changes


def changed_urls(root: Path, changes: list[tuple[str, str]]) -> tuple[set[str], bool]:
    urls: set[str] = set()
    all_public_pages = False
    for status, path in changes:
        if path in BROAD_SOURCE_FILES or path.startswith(BROAD_SOURCE_PREFIXES):
            all_public_pages = True
        elif path == "index.html":
            urls.add(ORIGIN + "/")
        elif path.startswith(("_pages/", "_publications/", "_posts/")):
            # A deleted or relocated permalink must also be reported. Do not
            # suppress URLs just because the current sitemap omits deleted pages.
            previous = git_text(f"HEAD^:{path}", root) if status != "A" else None
            current_path = root / path
            current = current_path.read_text(encoding="utf-8") if current_path.exists() and status != "D" else None
            for body in (previous, current):
                if body is None:
                    continue
                permalink = permalink_from_source(body)
                if permalink:
                    urls.add(permalink)
                else:
                    # Jekyll-generated post permalinks are not reliably inferred
                    # from filenames without also inspecting the site config.
                    all_public_pages = True
    return urls, all_public_pages


def sitemap_urls() -> set[str]:
    with urlopen(ORIGIN + "/sitemap.xml", timeout=20) as response:
        xml = response.read()
    root = ElementTree.fromstring(xml)
    urls = set()
    for e in root.iter():
        if e.tag.rsplit("}", 1)[-1] == "loc" and e.text:
            url = e.text.strip()
            try:
                good = canonical_url(url)
            except ValueError:
                continue
            if not urlsplit(good).path.endswith((".xml", ".txt")):
                urls.add(good)
    return urls


def verify_published_key(key: str, url: str) -> None:
    with urlopen(url, timeout=20) as response:
        body = response.read(256).decode("utf-8").strip()
    if body != key:
        raise RuntimeError(f"IndexNow key file not yet deployed at {url}")


def notify(urls: set[str], key: str, key_url: str) -> int:
    payload = {
        "host": HOST,
        "key": key,
        "keyLocation": key_url,
        "urlList": sorted(urls),
    }
    data = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    request = Request(
        INDEXNOW,
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8", "User-Agent": "academic-site-indexnow/1.0"},
        method="POST",
    )
    with urlopen(request, timeout=30) as response:
        code = response.status
    if code not in (200, 202):
        raise RuntimeError(f"IndexNow returned unexpected HTTP {code}")
    return code


def run(root: Path, *, manual_urls: str, dry_run: bool) -> int:
    key, key_url = key_at_root(root)
    if manual_urls.strip():
        raw = re.split(r"[,\n]+", manual_urls)
        urls = {canonical_url(x) for x in raw if x.strip()}
        all_pages = False
    else:
        urls, all_pages = changed_urls(root, git_changes(root))
        if all_pages:
            # One-off legitimate sitewide structural changes (e.g. common
            # layout updates) affect all rendered pages. Otherwise submit
            # only the changed explicit permalinks.
            if not dry_run:
                urls.update(sitemap_urls())
            else:
                print("Dry-run: shared layout changed; sitemap expansion deferred")
    if not urls and not all_pages:
        print("No changed public URLs to report")
        return 0
    if len(urls) > 10_000:
        raise ValueError("Too many IndexNow URLs in one submission")
    print(f"IndexNow URLs: {len(urls)}")
    for url in sorted(urls):
        print("  " + url)
    if dry_run:
        print("Dry-run: no key verification or network submission")
        return 0
    verify_published_key(key, key_url)
    status = notify(urls, key, key_url)
    print(f"IndexNow HTTP {status}: notification received (NOT an indexing guarantee)")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("."))
    parser.add_argument("--urls", default="", help="Comma/newline-separated canonical or relative changed URLs")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    try:
        return run(args.root.resolve(), manual_urls=args.urls, dry_run=args.dry_run)
    except Exception as exc:
        print(f"IndexNow setup/submission error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
