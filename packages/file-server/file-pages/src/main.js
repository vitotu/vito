import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Popup, Cell, CellGroup, List } from 'vant'
import 'vant/lib/index.css';
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(Popup)
app.use(Cell)
app.use(CellGroup)
app.use(List)
app.use(createPinia())
app.use(router)

app.mount('#app')
