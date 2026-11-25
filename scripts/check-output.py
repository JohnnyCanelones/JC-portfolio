"""Validate public artifacts, independent of Astro's route implementation."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import gzip
import json
import re
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1] / 'dist'
class Document(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path, self.ids, self.links, self.images, self.meta, self.scripts = path, set(), [], [], {}, []
        self.h1 = self.main = 0
        self.title = ''; self.in_title = False
        self.feed(path.read_text())
    def handle_starttag(self, tag, attributes):
        a = dict(attributes)
        if a.get('id'): self.ids.add(a['id'])
        if tag == 'a' and a.get('href'): self.links.append(a['href'])
        if tag == 'img': self.images.append(a)
        if tag == 'meta': self.meta[a.get('name', a.get('property'))] = a.get('content')
        if tag == 'h1': self.h1 += 1
        if tag == 'main': self.main += 1
        if tag == 'title': self.in_title = True
        if tag == 'script' and a.get('src'): self.scripts.append(a['src'])
    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
    def handle_data(self, data):
        if self.in_title: self.title += data

DOCS = {p: Document(p) for p in ROOT.rglob('*.html')}
class PublicOutput(unittest.TestCase):
    def test_required_routes(self):
        for route in ['', 'projects', 'projects/wealthos', 'projects/gjd', 'projects/ttb-ism', 'projects/globalfinances', 'projects/breeze-airways', 'projects/brikmate', 'experience', 'about', 'contact']:
            self.assertIn(ROOT / route / 'index.html', DOCS)
    def test_homepage_section_navigation(self):
        home = DOCS[ROOT/'index.html']
        case = DOCS[ROOT/'projects/wealthos/index.html']
        for section in ['work', 'experience', 'about', 'contact']:
            self.assertIn(f'#{section}', home.links)
            self.assertIn(f'/#{section}', case.links)
    def test_no_drafts_or_empty_blog(self):
        self.assertFalse((ROOT / 'blog').exists())
        for path, doc in DOCS.items():
            self.assertFalse(any('/blog/' in href or 'foundation-draft' in href or '_draft' in href for href in doc.links), str(path))
    def test_same_route_localization(self):
        self.assertFalse((ROOT / 'es').exists())
        home = (ROOT / 'index.html').read_text()
        wealthos = (ROOT / 'projects/wealthos/index.html').read_text()
        for marker in ['data-locale-choice="en"', 'data-locale-choice="es"', 'Productos definidos por restricciones reales', 'Currículum en inglés']:
            self.assertIn(marker, home)
        for marker in ['data-locale-content="es"', 'El producto', 'Escritura sin conexión', 'Trabajo relacionado']:
            self.assertIn(marker, wealthos)
        self.assertNotIn('hreflang="es"', home)
    def test_metadata_and_landmarks(self):
        self.assertEqual(len({d.title for d in DOCS.values()}), len(DOCS))
        for doc in DOCS.values():
            self.assertEqual(doc.h1, 1, str(doc.path))
            self.assertEqual(doc.main, 1, str(doc.path))
            for name in ['description','og:title','og:description','og:image']:
                self.assertTrue(doc.meta.get(name), f'{doc.path}: {name}')
    def test_structured_data_and_social_assets(self):
        for doc in DOCS.values():
            for payload in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', doc.path.read_text(), re.S):
                data = json.loads(payload)
                self.assertEqual(data['@context'], 'https://schema.org')
            social_path = urlsplit(doc.meta['og:image']).path
            self.assertTrue((ROOT/social_path.lstrip('/')).exists(), social_path)
    def test_links_and_anchor_targets(self):
        for doc in DOCS.values():
            for href in doc.links:
                url = urlsplit(href)
                if url.scheme or url.netloc: continue
                if not url.path: target = doc.path
                elif url.path.startswith('/'): target = ROOT / unquote(url.path.lstrip('/'))
                else: target = doc.path.parent / unquote(url.path)
                if target.is_dir(): target /= 'index.html'
                self.assertTrue(target.exists(), f'{doc.path}: {href}')
                if url.fragment and target in DOCS:
                    self.assertIn(unquote(url.fragment), DOCS[target].ids, f'{doc.path}: {href}')
    def test_images_and_optional_assets(self):
        for doc in DOCS.values():
            for img in doc.images:
                self.assertIn('alt', img)
                self.assertTrue(img.get('width') and img.get('height'))
        # A published text-only project must build without inventing an image.
        self.assertFalse(DOCS[ROOT/'projects/brikmate/index.html'].images)
    def test_sitemap(self):
        tree = ET.parse(ROOT/'sitemap.xml')
        urls = [n.text for n in tree.iter() if n.tag.endswith('loc')]
        self.assertEqual(len(urls), len(set(urls)))
        self.assertFalse(any('/blog' in u or '_draft' in u for u in urls))
        self.assertTrue(any('/projects/wealthos/' in u for u in urls))
    def test_javascript_budget(self):
        for doc in DOCS.values():
            sources = set(doc.scripts)
            total = sum(len(gzip.compress((ROOT / src.lstrip('/')).read_bytes())) for src in sources if src.startswith('/'))
            inline = re.findall(r'<script(?![^>]*src=)(?![^>]*application/ld\+json)[^>]*>(.*?)</script>', doc.path.read_text(), re.S)
            total += sum(len(gzip.compress(code.encode())) for code in inline)
            self.assertLessEqual(total, 30*1024, str(doc.path))

if __name__ == '__main__': unittest.main(verbosity=2)
