import { defineConfig } from 'vite';

import { devHtmlPlugin } from './app/build/dev-plugin.mjs';

export default defineConfig({
  base: './',
  appType: 'custom',
  plugins: [devHtmlPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    manifest: true,
    target: 'es2022',
    reportCompressedSize: true,
    rollupOptions: {
      input: {
        main: 'app/client/main.ts',
      },
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/chunk.[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
  },
});