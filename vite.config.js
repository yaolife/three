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
        //target: "http://172.10.30.135", // 不要写 photothermal
        //target: "http://172.10.30.135:18080",
         target: "https://d6d50229192a.ngrok-free.app",//国虎http://192.168.21.64:18080
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/server-api/, ""),
      },
    },
  },
})
