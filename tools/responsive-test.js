const http = require('http');
const path = require('path');
const fs = require('fs');
const serveHandler = require('serve-handler');
const playwright = require('playwright');

(async () => {
  const buildDir = path.resolve(__dirname, '..', 'client', 'build');
  if (!fs.existsSync(buildDir)) {
    console.error('Build directory not found:', buildDir);
    process.exit(1);
  }

  const server = http.createServer((req, res) => serveHandler(req, res, { public: buildDir }));
  const port = 5009;
  server.listen(port);
  console.log('Serving build at http://localhost:' + port);

  const viewports = [
    { name: '360x780', width: 360, height: 780 },
    { name: '375x812', width: 375, height: 812 },
    { name: '412x915', width: 412, height: 915 },
    { name: '768x1024', width: 768, height: 1024 },
    { name: '1024x1366', width: 1024, height: 1366 },
    { name: '1366x768', width: 1366, height: 768 },
  ];

  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:' + port, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => {
      return { w: document.documentElement.scrollWidth, innerW: window.innerWidth };
    });
    const hasHorizontal = overflow.w > overflow.innerW;
    const screenshotPath = path.resolve(__dirname, `..`, `tools`, `screenshots`, `${vp.name}.png`);
    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    await page.screenshot({ path: screenshotPath, fullPage: true });
    results.push({ viewport: vp.name, width: vp.width, height: vp.height, scrollWidth: overflow.w, innerWidth: overflow.innerW, overflow: hasHorizontal, screenshot: screenshotPath });
    console.log(`${vp.name} -> overflow: ${hasHorizontal} (scrollWidth=${overflow.w} innerWidth=${overflow.innerW})`);
  }

  await browser.close();
  server.close();
  console.log('Results:', results);
})();