"""Exercise published article and invalid content builds in an isolated copy."""
from pathlib import Path
import os
import shutil
import subprocess
import tempfile

repo = Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='portfolio-publication-') as folder:
    root = Path(folder)
    for name in ['src', 'public']:
        shutil.copytree(repo/name, root/name)
    for name in ['astro.config.mjs', 'tsconfig.json', 'package.json']:
        shutil.copy2(repo/name, root/name)
    (root/'node_modules').symlink_to(repo/'node_modules', target_is_directory=True)
    article = root/'src/content/blog/static-astro-portfolio.md'
    article.write_text(article.read_text().replace('draft: true', 'draft: false'))
    def build():
        return subprocess.run(['pnpm', 'build'], cwd=root, env={**os.environ,'ASTRO_TELEMETRY_DISABLED':'1'}, capture_output=True, text=True)
    result = build()
    assert result.returncode == 0, result.stdout + result.stderr
    index = (root/'dist/blog/index.html').read_text()
    detail = (root/'dist/blog/static-astro-portfolio/index.html').read_text()
    assert '/blog/static-astro-portfolio/' in index
    assert 'astro-code' in detail and 'Code example' in detail and 'scope="col"' in detail
    assert '#original-example' in detail and 'BlogPosting' in detail
    assert '/blog/' in (root/'dist/index.html').read_text()
    assert '/blog/static-astro-portfolio/' in (root/'dist/sitemap.xml').read_text()
    assert not (root/'dist/blog/building-wealthos').exists()
    duplicate = root/'src/content/projects/collision.md'
    duplicate.write_text((root/'src/content/projects/wealthos.md').read_text().replace('draft: false','draft: true'))
    result = build()
    assert result.returncode != 0 and 'Duplicate content route' in result.stdout + result.stderr
    duplicate.unlink()
    article.write_text(article.read_text().replace('publishedAt: 2026-11-25', 'publishedAt: 2026-11-25\nupdatedAt: 2025-01-01'))
    result = build()
    assert result.returncode != 0 and 'Updated date must follow' in result.stdout + result.stderr
print('Published blog fixture, code/table/TOC, sitemap, draft isolation, duplicate-route rejection and invalid-date rejection passed. Real content unchanged.')
