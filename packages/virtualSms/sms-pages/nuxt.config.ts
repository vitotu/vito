// https://nuxt.com/docs/api/configuration/nuxt-config
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import { VarletUIResolver } from 'unplugin-vue-components/resolvers'
import { defineNuxtConfig } from 'nuxt/config'
import fs from 'fs'

const config:any = JSON.parse(fs.readFileSync('../config.json', 'utf-8'))
const hostConfig:any = config?.pageHostConfig?.local || {}

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
    port: hostConfig.port || 8080,
  },
  components: {
    dirs: ['~/src/pages'],
    global: true,
  }
})
