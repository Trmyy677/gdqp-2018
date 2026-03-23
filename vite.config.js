import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/gdqp-2018/', // Đảm bảo tên này trùng khớp hoàn toàn với tên Repository trên GitHub của bạn
  build: {
    outDir: 'dist',
  }
})