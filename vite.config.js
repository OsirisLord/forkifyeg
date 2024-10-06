import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.svg'],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});