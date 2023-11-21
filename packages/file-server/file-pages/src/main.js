import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Popup, Cell, CellGroup, List, TextEllipsis, Lazyload, ImagePreview } from 'vant'
import 'vant/lib/index.css';
import App from './App.vue'
import router from './router'

import loadimage from './assets/logo.svg'

const app = createApp(App)
app.use(Popup)
app.use(Cell)
app.use(CellGroup)
app.use(List)
app.use(TextEllipsis)
app.use(Lazyload, {
  lazyComponent: true,
  loading: loadimage,
})
app.use(ImagePreview)
app.use(createPinia())
app.use(router)

app.mount('#app')
