import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setupTests.js',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react')) return 'react-vendor'
          if (id.includes('node_modules/react-dom')) return 'react-vendor'
          if (id.includes('node_modules/html2canvas')) return 'pdf-html2canvas'
          if (id.includes('node_modules/jspdf')) return 'pdf-jspdf'
        },
      },
    },
  },
})
