import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        merch: resolve(__dirname, 'merch.html'),
        community: resolve(__dirname, 'community.html'),
      },
    },
  },
});
