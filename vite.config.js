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
        //target: "https://839f-240e-47e-3852-d0b-193c-e99a-ba3b-a5a5.ngrok-free.app", // 公司服务器 photothermal
        //target: "http://192.168.0.102:18080",// 生产服务器
        target: "http://192.168.0.254:18080",//
         //target: "http://192.168.162.254:18080",//国虎http://192.168.21.64:18080
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/server-api/, ""),
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
