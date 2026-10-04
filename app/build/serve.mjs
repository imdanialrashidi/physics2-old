import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';

import { DIST } from './build.mjs';

/**
 * Minimal static server for local verification. Supports `--base <prefix>` so the built site can be
 * exercised exactly the way GitHub Pages serves a project site under a sub-path.
 */
const args = process.argv.slice(2);
const baseIndex = args.indexOf('--base');
const base = baseIndex >= 0 ? `/${args[baseIndex + 1].replace(/^\/|\/$/g, '')}` : '';
const port = Number(args.find((value) => /^\d+$/.test(value)) ?? process.env.PORT ?? 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

const NOT_FOUND = path.join(DIST, '404.html');

/**
 * Maps a request path to a built file. Requests outside the configured base (a browser's automatic
 * `/favicon.ico`, a root-relative asset probe) resolve to the 404 page like any other miss, so one
 * stray request can never take the preview server down.
 */
function resolveFile(pathname) {
  const relative = decodeURIComponent(pathname.replace(/^\/+/, ''));
  if (base && !pathname.startsWith(`${base}/`) && pathname !== base) return NOT_FOUND;
  const stripped = base ? pathname.slice(base.length) : pathname;
  const candidates = [
    path.join(DIST, stripped),
    path.join(DIST, stripped, 'index.html'),
    path.join(DIST, `${stripped}.html`),
    path.join(DIST, stripped.replace(/\/$/, ''), 'index.html'),
  ];
  for (const candidate of candidates) {
    if (!candidate.startsWith(DIST)) continue;
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return NOT_FOUND;
}

const server = createServer((request, response) => {
  try {
    const [rawPath] = (request.url ?? '/').split('?');
    const file = resolveFile(rawPath);
    const status = file === NOT_FOUND && rawPath !== `${base}/404.html` ? 404 : 200;
    response.writeHead(status, {
      'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    createReadStream(file).pipe(response);
  } catch (error) {
    response.writeHead(500, { 'Content-Type': TYPES['.txt'], 'Cache-Control': 'no-store' });
    response.end(`${error?.message ?? error}\n`);
  }
});

server.listen(port, () => {
  process.stdout.write(`سرویس محلی: http://localhost:${port}${base}/\n`);
});