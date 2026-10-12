"""Offline tests for the site-specific IndexNow URL and key validation."""
from pathlib import Path
import tempfile
import unittest

from indexnow import (
    ORIGIN, canonical_url, changed_urls, key_at_root, permalink_from_source
)


class IndexNowTest(unittest.TestCase):
    def test_english_and_chinese_urls(self):
        self.assertEqual(canonical_url("/research/deeptb/"), ORIGIN + "/research/deeptb/")
        self.assertEqual(canonical_url("/zh/research/deeptb/"), ORIGIN + "/zh/research/deeptb/")

    def test_deny_cross_site_submission(self):
        for bad in ("https://other.github.io/research/", "//evil.test/",
                    "http://floatingcatty.github.io/",
                    "/cv/?tracking=1", "/cv/#top"):
            with self.subTest(bad=bad), self.assertRaises(ValueError):
                canonical_url(bad)

    def test_frontmatter_research_and_publications(self):
        self.assertEqual(
            permalink_from_source("---\nlayout: research\npermalink: /zh/research/vbcsr/\n---\n"),
            ORIGIN + "/zh/research/vbcsr/",
        )
        self.assertEqual(
            permalink_from_source('---\npermalink: "/publication/2023-07-10-DeePTB-number-1"\n---\n'),
            ORIGIN + "/publication/2023-07-10-DeePTB-number-1",
        )
        self.assertIsNone(permalink_from_source("plain HTML has no front matter"))

    def test_key_must_match_its_public_filename(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            key = "0123456789abcdef0123456789abcdef"
            filename = root / (key + ".txt")
            filename.write_text(key + "\n", encoding="utf-8")
            self.assertEqual(key_at_root(root), (key, ORIGIN + "/" + key + ".txt"))
            filename.write_text("something else", encoding="utf-8")
            with self.assertRaises(ValueError):
                key_at_root(root)

    def test_deleted_file_not_ignored(self):
        # changed_urls reads the actual deployment's old/new source. Here a
        # new English research page without a git history is still detected.
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            page = root / "_pages" / "research-test.md"
            page.parent.mkdir()
            page.write_text("---\npermalink: /research/test/\n---\nBody")
            urls, all_pages = changed_urls(root, [("A", "_pages/research-test.md")])
            self.assertEqual(urls, {ORIGIN + "/research/test/"})
            self.assertFalse(all_pages)


if __name__ == "__main__":
    unittest.main()
