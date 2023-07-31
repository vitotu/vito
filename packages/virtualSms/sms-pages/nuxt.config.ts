// https://nuxt.com/docs/api/configuration/nuxt-config
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import { VarletUIResolver } from 'unplugin-vue-components/resolvers'
import { defineNuxtConfig } from 'nuxt/config'
import getRouterConfig from './src/router'
export default defineNuxtConfig({
  modules: ['@vant/nuxt'],
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
  router: {
    extendRoutes(routes, resolve) {
      routes.splice(0)
      let routerConfig = getRouterConfig()
      routerConfig.forEach((item) => {
        item.component = resolve(__dirname, item.component)
      })
      routes.push(...routerConfig)
    }
  }
})
