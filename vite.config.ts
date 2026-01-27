import tailwindcss from "@tailwindcss/vite"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import viteReact from "@vitejs/plugin-react"
import dayjs from "dayjs"
import { defineConfig } from "vite"
// vite.config.ts

import path from "path"
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    TanStackRouterVite({
      target: "react",
      autoCodeSplitting: true,
    }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      {
        find: "@gearment/theme3",
        replacement: path.resolve(__dirname, "node_modules/@gearment/theme3"),
      },
      { find: "@", replacement: path.resolve(__dirname, "src") },
    ],
  },
  build: {
    minify: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash]-${dayjs().format("YYYYMMDDHHmm")}.js`,
        chunkFileNames: `assets/[name]-[hash]-${dayjs().format("YYYYMMDDHHmm")}.js`,
        assetFileNames: `assets/[name]-[hash]-${dayjs().format("YYYYMMDDHHmm")}.[ext]`,
        manualChunks: (id: string) => {
          // creating a chunk to react routes deps. Reducing the vendor chunk size
          if (
            id.includes("react-router-dom") ||
            id.includes("react") ||
            id.includes("@tanstack") ||
            id.includes("ui")
          ) {
            return "vendor"
          }
        },
      },
    },
  },
})
