import { buildRoutes } from './build.mjs';

/**
 * Dev-server middleware that renders the same pages as the production build, so what you see in
 * `npm run dev` is what the static build produces (only asset URLs differ).
 */
export function devHtmlPlugin() {
  return {
    name: 'physics2-dev-html',
    async configureServer(server) {
      const { registry } = await import('../content/index.mjs');
      server.middlewares.use((request, response, next) => {
        if (!request.url || request.method !== 'GET') return next();
        const [rawPath] = request.url.split('?');
        const pathname = decodeURIComponent(rawPath);
        const routes = buildRoutes();
        const match =
          routes.find((route) => `/` + route.file === pathname) ??
          routes.find((route) => `/` + route.file.replace(/index\.html$/, '') === pathname);
        const target = match ?? routes.find((route) => route.file === '404.html');
        if (!target) return next();
        const depth = target.depth;
        const prefix = depth === 0 ? '' : '../'.repeat(depth);
        const assets = {
          js: '/app/client/main.ts',
          css: '',
          favicon: '/app/static/favicon.svg',
        };
        const html = target.render({ registry, prefix, assets });
        response.statusCode = match ? 200 : 404;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.setHeader('Cache-Control', 'no-store');
        response.end(html);
      });
    },
  };
}