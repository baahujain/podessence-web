#!/usr/bin/env python3
"""
Crawls api.podessence.app/transcriptions to discover all channel + episode URLs,
then writes sitemap.xml to the current directory.

Usage: python3 generate_sitemap.py
"""

import re
import sys
import time
import urllib.request
from datetime import date
from urllib.error import URLError

BASE_API = "https://api.podessence.app"
BASE_TRANSCRIPTS = "https://transcripts.podessence.app"
TODAY = date.today().isoformat()

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; podessence-sitemap-bot/1.0)"
}

def fetch(url, retries=3):
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as resp:
                return resp.read().decode("utf-8", errors="replace")
        except URLError as e:
            print(f"  [warn] {url} attempt {attempt+1} failed: {e}", file=sys.stderr)
            time.sleep(2 ** attempt)
    return ""

def extract_channel_slugs(html):
    """Extract channel slugs from the directory page structured data."""
    return re.findall(
        r'"url":\s*"https?://api\.podessence\.app/transcriptions/([^"]+)"',
        html
    )

def extract_episode_urls(html):
    """Extract episode URLs from a channel page."""
    return re.findall(
        r'href="(https://transcripts\.podessence\.app/[^"]+\.html)"',
        html
    )

def url_entry(loc, lastmod=TODAY, priority="0.8"):
    return (
        f"  <url>\n"
        f"    <loc>{loc}</loc>\n"
        f"    <lastmod>{lastmod}</lastmod>\n"
        f"    <priority>{priority}</priority>\n"
        f"  </url>"
    )

def main():
    all_urls = []

    # 1. Top-level directory page
    print("Fetching channel directory...")
    dir_html = fetch(f"{BASE_API}/transcriptions")
    channel_slugs = extract_channel_slugs(dir_html)
    print(f"Found {len(channel_slugs)} channels")

    all_urls.append(url_entry(f"{BASE_API}/transcriptions", priority="1.0"))

    # 2. Each channel page + its episodes
    for i, slug in enumerate(channel_slugs, 1):
        channel_url = f"{BASE_API}/transcriptions/{slug}"
        print(f"[{i}/{len(channel_slugs)}] {slug}")
        all_urls.append(url_entry(channel_url, priority="0.9"))

        channel_html = fetch(channel_url)
        episode_urls = extract_episode_urls(channel_html)
        print(f"  -> {len(episode_urls)} episodes")

        for ep_url in episode_urls:
            all_urls.append(url_entry(ep_url, priority="0.8"))

        time.sleep(0.3)  # polite crawl delay

    # 3. Build sitemap
    sitemap = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(all_urls)
        + "\n</urlset>\n"
    )

    out_path = "sitemap.xml"
    with open(out_path, "w") as f:
        f.write(sitemap)

    total = len(all_urls)
    print(f"\nDone. {total} URLs written to {out_path}")

if __name__ == "__main__":
    main()
