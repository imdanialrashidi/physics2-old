/**
 * Proves the built site works the way GitHub Pages serves a project site: from a sub-path,
 * with directory-style URLs, direct deep links and a 404 page.
 */
import { spawn } from 'node:child_process';

const PORT = Number(process.env.SUBPATH_PORT ?? 4321);
const BASE = '/physics2';
const ORIGIN = `http://127.0.0.1:${PORT}`;

const server = spawn(process.execPath, ['app/build/serve.mjs', String(PORT), '--base', BASE], {
  stdio: ['ignore', 'ignore', 'inherit'],
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForServer(attempts = 40) {
  for (let index = 0; index < attempts; index++) {
    try {
      const response = await fetch(`${ORIGIN}${BASE}/`, { redirect: 'manual' });
      if (response.status < 500) return;
    } catch {
      await sleep(100);
    }
  }
  throw new Error(`the local preview server did not start on ${ORIGIN}${BASE}`);
}

async function check(path, expected, label, failures) {
  try {
    const response = await fetch(`${ORIGIN}${path}`, { redirect: 'manual' });
    if (response.status !== expected) {
      failures.push(`${label}: ${path} returned ${response.status}, expected ${expected}`);
      return '';
    }
    return await response.text();
  } catch (error) {
    failures.push(`${label}: ${path} failed — ${error.message}`);
    return '';
  }
}

const failures = [];
try {
  await waitForServer();

  const home = await check(`${BASE}/`, 200, 'sub-path home', failures);
  if (home && !/href="assets\/main\.[^"]+\.css"/.test(home)) {
    failures.push('sub-path home: hashed stylesheet is not referenced relatively');
  }
  if (home && !home.includes('ساخته شده توسط دانیال رشیدی')) failures.push('sub-path home: author credit missing');

  const deep = await check(`${BASE}/concept/coulomb/`, 200, 'deep link', failures);
  if (deep && !/src="\.\.\/\.\.\/assets\/main\.[^"]+\.js"/.test(deep)) {
    failures.push('deep link: hashed script is not referenced relatively');
  }
  if (deep && !deep.includes('قانون کولن')) failures.push('deep link: concept content missing');
  if (deep && /undefined/.test(deep)) failures.push('deep link: page contains an undefined value');

  await check(`${BASE}/practice/mixed/`, 200, 'practice', failures);
  await check(`${BASE}/sims/`, 200, 'simulations', failures);
  await check(`${BASE}/search-index.json`, 200, 'search index', failures);

  // A 404 is served at whatever URL was requested, so its asset URLs must be absolute under the
  // deployment base — a depth-relative prefix renders an unstyled, unlinked error page.
  const deep404 = await check(`${BASE}/concepts/does-not-exist/`, 404, 'unknown path', failures);
  if (deep404 && !deep404.includes('پیدا نشد')) failures.push('unknown path: 404 page body missing');
  if (deep404) {
    for (const [pattern, label] of [
      [/<link rel="stylesheet" href="(\/physics2\/assets\/main\.[^"]+\.css)">/, 'stylesheet'],
      [/<script type="module" src="(\/physics2\/assets\/main\.[^"]+\.js)"><\/script>/, 'script'],
      [/<link rel="icon" href="(\/physics2\/assets\/favicon\.svg)"/, 'favicon'],
    ]) {
      const found = new RegExp(pattern).exec(deep404);
      if (!found) {
        failures.push(`unknown path: 404 ${label} is not absolute under ${BASE}`);
        continue;
      }
      await check(found[1], 200, `unknown path: 404 ${label}`, failures);
    }
  }

  // A request outside the base (a browser's automatic /favicon.ico) must not take the server down.
  await check('/favicon.ico', 404, 'request outside the base', failures);
  await check(`${BASE}/`, 200, 'server still alive after an out-of-base request', failures);
} catch (error) {
  failures.push(error.message);
} finally {
  server.kill();
}

if (failures.length) {
  process.stderr.write(`${failures.map((line) => `  ✖ ${line}`).join('\n')}\n`);
  process.exit(1);
}
process.stdout.write('  ✔ the built site works from a GitHub Pages style sub-path\n');
process.exit(0);