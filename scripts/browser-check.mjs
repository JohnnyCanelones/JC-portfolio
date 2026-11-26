/** Optional browser QA. Supply PLAYWRIGHT_MODULE when Playwright is installed outside this repo. */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const playwright = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = playwright.chromium ?? playwright.default?.chromium;
assert.ok(chromium, 'Chromium is unavailable from the configured Playwright module');
const base = process.env.QA_URL || 'http://127.0.0.1:4322';
const output = process.env.QA_OUTPUT || '/tmp/portfolio-phase6-qa';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const routes = [
  '/projects/',
  '/projects/wealthos/',
  '/projects/gjd/',
  '/experience/',
  '/about/',
  '/contact/',
  '/certifications/',
];
const results = [];
try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      await page.goto(base + route);
      await page.evaluate(() => document.fonts.ready);
      for (const img of await page.locator('img').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate((el) => el.decode());
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      assert.equal(overflow, false, `${route} overflows at ${width}`);
      for (const theme of ['light', 'dark']) {
        await page.locator('#theme-preference').selectOption(theme);
        assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
        if (width === 390 || width === 1440)
          await page.screenshot({
            path: `${output}/${route.split('/').filter(Boolean).join('-')}-${width}-${theme}.png`,
            fullPage: true,
            animations: 'disabled',
          });
      }
      await page.locator('[data-locale-choice="es"]').click();
      assert.equal(await page.locator('html').getAttribute('lang'), 'es');
      assert.equal(await page.locator('html').getAttribute('data-locale'), 'es');
      assert.equal(
        await page.locator('[data-locale-choice="es"]').getAttribute('aria-pressed'),
        'true',
      );
      assert.equal(await page.locator('[data-locale-choice="es"]').getAttribute('class'), 'active');
      assert.equal(
        await page.locator('[data-locale-choice="en"]').getAttribute('aria-pressed'),
        'false',
      );
      const localeStyles = await page.evaluate(() => {
        const active = document.querySelector('[data-locale-choice="es"]');
        const inactive = document.querySelector('[data-locale-choice="en"]');
        return {
          activeBackground: active ? getComputedStyle(active).backgroundColor : '',
          inactiveBackground: inactive ? getComputedStyle(inactive).backgroundColor : '',
          activeColor: active ? getComputedStyle(active).color : '',
          inactiveColor: inactive ? getComputedStyle(inactive).color : '',
        };
      });
      assert.notEqual(localeStyles.activeBackground, localeStyles.inactiveBackground);
      assert.notEqual(localeStyles.activeColor, localeStyles.inactiveColor);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        ),
        false,
        `${route} Spanish overflows at ${width}`,
      );
      if (width === 390 || width === 1440)
        await page.screenshot({
          path: `${output}/${route.split('/').filter(Boolean).join('-')}-${width}-dark-es.png`,
          fullPage: true,
          animations: 'disabled',
        });
      await page.locator('[data-locale-choice="en"]').click();
      assert.equal(
        await page.locator('[data-locale-choice="en"]').getAttribute('aria-pressed'),
        'true',
      );
      assert.equal(await page.locator('[data-locale-choice="en"]').getAttribute('class'), 'active');
      results.push({ route, width, overflow });
    }
  }
  await page.goto(`${base}/projects/wealthos/`);
  assert.equal(
    await page.locator('html').getAttribute('data-theme'),
    'dark',
    'theme persists across navigation',
  );
  await page.reload();
  assert.equal(
    await page.locator('html').getAttribute('data-theme'),
    'dark',
    'theme persists across reload',
  );
  await page.locator('#theme-preference').selectOption('system');
  await page.emulateMedia({ colorScheme: 'light' });
  const light = await page.locator('html').evaluate((el) => getComputedStyle(el).backgroundColor);
  await page.emulateMedia({ colorScheme: 'dark' });
  const dark = await page.locator('html').evaluate((el) => getComputedStyle(el).backgroundColor);
  assert.notEqual(light, dark, 'system theme responds to OS changes');
  await page.getByRole('link', { name: 'Architecture', exact: true }).click();
  const offset = await page
    .locator('#architecture')
    .evaluate((el) => el.getBoundingClientRect().top);
  const headerBottom = await page
    .locator('.site-header')
    .evaluate((el) => el.getBoundingClientRect().bottom);
  assert.ok(offset >= headerBottom, 'anchor heading clears fixed header');
  await page.goto(`${base}/contact/`);
  await page.keyboard.press('Tab');
  assert.equal(
    await page.evaluate(() => document.activeElement?.textContent?.trim()),
    'Skip to content',
  );
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'main-content');

  await page.goto(`${base}/certifications/`);
  assert.equal(
    await page.locator('[data-certification-list] [data-certification-item]').count(),
    32,
  );
  await page.locator('#credential-search').fill('Next.js');
  assert.equal(
    await page.locator('[data-certification-list] [data-certification-item]:visible').count(),
    1,
  );
  assert.match(await page.locator('[data-filter-status]').textContent(), /1 credential shown/);
  await page.locator('[data-locale-choice="es"]').click();
  assert.equal(
    await page.locator('#credential-search').getAttribute('placeholder'),
    'Título, tecnología, categoría o proveedor',
  );
  assert.match(await page.locator('[data-filter-status]').textContent(), /1 credencial visible/);
  await page.locator('[data-clear-filters]').click();
  assert.equal(
    await page.locator('[data-certification-list] [data-certification-item]:visible').count(),
    32,
  );
  await context.close();
  const noScript = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 900 },
  });
  const plain = await noScript.newPage();
  await plain.goto(`${base}/projects/wealthos/`);
  assert.equal(await plain.locator('h1').textContent(), 'WealthOS');
  await plain.getByRole('link', { name: 'Architecture', exact: true }).click();
  assert.ok(plain.url().endsWith('#architecture'));
  await plain.getByRole('link', { name: 'Contact', exact: true }).click();
  assert.ok(plain.url().endsWith('/#contact'));
  await plain.goto(`${base}/certifications/`);
  assert.equal(await plain.locator('[data-certification-item]').count(), 37);
  assert.equal(
    await plain.locator('.certification-filters').evaluate((el) => getComputedStyle(el).display),
    'none',
  );
  await noScript.close();
  await writeFile(
    `${output}/results.json`,
    JSON.stringify(
      {
        checks: results,
        themePersistence: true,
        systemTheme: true,
        keyboardSkipLink: true,
        nativeToc: true,
        noJavaScript: true,
        certificationFilters: true,
      },
      null,
      2,
    ),
  );
  console.log(
    `Passed ${results.length} route/viewport checks, both themes, native TOC, keyboard skip link and no-JS navigation. Screenshots: ${output}`,
  );
} finally {
  await browser.close();
}
