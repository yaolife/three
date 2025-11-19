import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import path from "path"


export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  server: {
    proxy: {
      "/server-api": {
         target: "http://172.10.30.135:18080",
         //target: "http://192.168.21.64:18080",//国虎
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/server-api/, ""),
      },
    },
  },
})
