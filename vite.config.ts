import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import mkcert from 'vite-plugin-mkcert';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [ solidPlugin(), mkcert(), VitePWA({
    registerType: "autoUpdate",
    devOptions: {
      enabled: true
    },
    workbox: {
      globPatterns: [ "**/*.{js,css,html,ico,png,svg}" ]
    },
    manifest: {
      name: 'Dobrowraca',
      short_name: 'Dobrowraca',
      description: '',
      theme_color: '#ffffff',
      icons: [
        {
          src: '/assets/pwaIcons/192x192-icon.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/assets/pwaIcons/512x512-icon.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  }) ],
  server: {
    port: 3000,
    https: true
  },
  build: {
    target: 'esnext',
  },
  base: ""
});