import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/echoes',
  server: {
    // 设置 host 为 0.0.0.0 以便在同一局域网下的手机端访问进行测试
    host: '0.0.0.0', 
    port: 3000,
  },
  build: {
    // 确保构建目标支持现代浏览器特性
    target: 'esnext'
  }
})