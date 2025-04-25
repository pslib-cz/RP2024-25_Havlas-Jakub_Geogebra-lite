import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/RP2024-25_Havlas-Jakub_Geogebra-lite/',
  plugins: [react()],
})