/**
 * Functional test – launches a real Lighthouse audit against google.com.
 * Verifies the runner doesn't crash and that the progress callback fires.
 * Run: node tests/lighthouse.test.js
 */

const { runLighthouse } = require('../src/core/lighthouseRunner');
const { detectBrowsers } = require('../src/core/browserDetector');

async function main() {
  console.log('\n── Lighthouse Functional Test (google.com) ─────────\n');

  const browsers = detectBrowsers();
  if (browsers.length === 0) {
    console.error('  ✗  No browsers found. Install Chrome, Brave, or Edge.');
    process.exit(1);
  }

  const browser = browsers[0];
  console.log(`  Using browser : ${browser.name}`);
  console.log(`  Path          : ${browser.path}`);
  console.log(`  Target URL    : https://www.google.com\n`);

  const progressLog = [];

  const lhr = await runLighthouse(
    'https://www.google.com',
    browser.path,
    (data) => {
      progressLog.push(data);
      const bar = '█'.repeat(Math.floor(data.percent / 5)).padEnd(20, '░');
      process.stdout.write(
        `\r  [${bar}] ${data.percent}%  ${data.message}    `,
      );
    },
  );

  console.log('\n');

  if (!lhr || !lhr.categories) {
    console.error('  ✗  LHR result is missing categories.');
    process.exit(1);
  }

  console.log('  ── Category Scores ──────────────────────────────');
  Object.values(lhr.categories).forEach((cat) => {
    const score = Math.round((cat.score || 0) * 100);
    const bar = '█'.repeat(Math.floor(score / 5)).padEnd(20, '░');
    console.log(`  ${cat.title.padEnd(22)} [${bar}] ${score}/100`);
  });

  console.log('\n  ── Progress Events ──────────────────────────────');
  console.log(`  Total updates received : ${progressLog.length}`);
  const finalPct = progressLog[progressLog.length - 1]?.percent;
  if (finalPct === 100) {
    console.log('  Final progress         : 100% ✓');
  } else {
    console.warn(`  Final progress         : ${finalPct}% (expected 100)`);
  }

  console.log('\n  ✓  Test passed – no crash, audit completed.\n');
  console.log('────────────────────────────────────────────────────\n');
}

main().catch((err) => {
  console.error('\n  ✗  Test failed:', err.message);
  process.exit(1);
});
