// https://nuxt.com/docs/api/configuration/nuxt-config
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import { VarletUIResolver } from 'unplugin-vue-components/resolvers'
import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  modules: ['@vant/nuxt'],
  runtimeConfig: {
    public: {
      target: process.env.target || 'dev-nuxt',
      apiPath: process.env.apiPath || '/api/sms/',
    }
  },
  vite: {
    ssr: {
      noExternal: ['@varlet/ui',]
    },
    plugins: [
      components({
        resolvers: [VarletUIResolver()]
      }),
      autoImport({
        resolvers: [VarletUIResolver({ autoImport: true })],
      })
    ]
  },
  devServer: {
    port: 8080,
  },
  components: {
    dirs: ['~/src/pages'],
    global: true,
  },
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:3080',
        changeOrigin: true,
        prependPath: true,
      },
      '/ws/': {
        target: 'ws://localhost:3080',
        changeOrigin: true,
        ws: true,
      }
    },
    experimental: {
      websocket: true
    }
  }
})
