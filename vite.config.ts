import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
            eslint({
              cache: false,
              include: ['./src/**/*.js', './src/**/*.jsx','./src/**/*.ts', './src/**/*.tsx'],
              exclude: [],
              failOnError: false
            })
           ],
  server: {
    open: true,
    port: 3000,
    strictPort: true
  }
});