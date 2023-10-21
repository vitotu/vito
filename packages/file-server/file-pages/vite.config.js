import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'

let configData
try {
  configData = JSON.parse(fs.readFileSync('../config.json', 'utf-8'))
} catch (error) {
  console.log('read config file error: ', error)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: configData.pageLocal.port
  },
  css: {
    preprocessorOptions: {
      less: {
        Math: "always"
      }
    }
  }
})
