import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// Configurazione standalone: nessun plugin Base44.
// Il sito è servito dalla radice del dominio (francescomarzola.it), quindi base '/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
