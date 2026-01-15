import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import path from "path"

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  server: {
    proxy: {
      "/server-api": {
        target: "http://172.10.30.135", // 公司服务器 photothermal
        //target: "http://192.168.0.102:18080",// 生产服务器
        //target: "http://172.10.30.135:18080",
         //target: "http://192.168.21.41:18080",//国虎http://192.168.21.64:18080
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/server-api/, "photothermal"),
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
