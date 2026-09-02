import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        creators: resolve(__dirname, 'creators.html'),
        community: resolve(__dirname, 'community.html'),
      },
    },
  },
});
