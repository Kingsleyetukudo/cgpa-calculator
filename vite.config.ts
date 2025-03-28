import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'CGPA Calculator',
        short_name: 'CGPA Calc',
        description: 'Calculate your CGPA easily',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/calculator.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/calculator.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});