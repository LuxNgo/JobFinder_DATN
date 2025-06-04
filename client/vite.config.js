import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your backend server address
        changeOrigin: true,
        // secure: false, // Uncomment if your backend is not HTTPS and you encounter issues
        // rewrite: (path) => path.replace(/^\/api/, '') // Uncomment if your backend API routes don't start with /api
      },
    },
  },
  plugins: [react()],
})
