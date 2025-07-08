console.log('⚙️  Vite config cargado');

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

console.log('⚙️  Vite config cargado')

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['62ec-201-182-249-194.ngrok-free.app'],
  },
})
