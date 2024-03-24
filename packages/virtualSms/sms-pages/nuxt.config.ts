// https://nuxt.com/docs/api/configuration/nuxt-config
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import { VarletUIResolver } from 'unplugin-vue-components/resolvers'
import { defineNuxtConfig } from 'nuxt/config'
import configData from '../envConfig.json'

const mode = process.env.target || 'dev'
const config:any = configData[mode] || {}
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
