import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' so the built app works from a githack CDN sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
});
