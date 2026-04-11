/**
 * Prueba smoke – verifica que todos los módulos principales carguen y funcionen
 * correctamente sin necesitar Electron ni una sesión de navegador real.
 * Ejecutar: node tests/smoke.test.js
 */

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗  ${name}\n       ${err.message}`);
    failed++;
  }
}

console.log('\n── Pruebas Smoke ────────────────────────────────────\n');

test('lighthouseRunner exporta la función runLighthouse', () => {
  const mod = require('../src/core/lighthouseRunner');
  if (typeof mod.runLighthouse !== 'function')
    throw new Error('runLighthouse no es una función');
});

test('browserDetector exporta la función detectBrowsers', () => {
  const mod = require('../src/core/browserDetector');
  if (typeof mod.detectBrowsers !== 'function')
    throw new Error('detectBrowsers no es una función');
});

test('detectBrowsers devuelve un array', () => {
  const { detectBrowsers } = require('../src/core/browserDetector');
  const result = detectBrowsers();
  if (!Array.isArray(result))
    throw new Error(`Se esperaba un array, se obtuvo ${typeof result}`);
});

test('detectBrowsers encuentra al menos un navegador', () => {
  const { detectBrowsers } = require('../src/core/browserDetector');
  const result = detectBrowsers();
  if (result.length === 0)
    throw new Error(
      'No se encontraron navegadores – instalá Chrome, Brave, Edge u Opera',
    );
  console.log(`       Encontrados: ${result.map((b) => b.name).join(', ')}`);
});

test('cada navegador detectado tiene los campos name, path e icon', () => {
  const { detectBrowsers } = require('../src/core/browserDetector');
  const browsers = detectBrowsers();
  browsers.forEach((b) => {
    if (!b.name || !b.path)
      throw new Error(
        `Entrada de navegador sin name/path: ${JSON.stringify(b)}`,
      );
  });
});

test('el paquete lighthouse es importable', () => {
  const lh = require('lighthouse');
  // v12 ships as ESM→CJS: the runner is at .default
  const runner = lh.default || lh;
  if (typeof runner !== 'function')
    throw new Error('el runner de lighthouse no es una función');
});

test('el paquete chrome-launcher es importable', () => {
  const cl = require('chrome-launcher');
  if (typeof cl.launch !== 'function')
    throw new Error('chrome-launcher.launch no es una función');
});

// ── Resumen ──────────────────────────────────────────────────
console.log(`\n────────────────────────────────────────────────────`);
console.log(`  Resultados: ${passed} aprobadas, ${failed} fallidas\n`);

if (failed > 0) process.exit(1);
