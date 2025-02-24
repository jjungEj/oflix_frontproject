
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // '@'를 src 디렉토리로 설정
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      '/login': { 
        target: 'http://localhost:8080',
        changeOrigin: true, 
      },
      '/logout': { 
        target: 'http://localhost:8080',
        changeOrigin: true, 
      },
    },
  },
});
