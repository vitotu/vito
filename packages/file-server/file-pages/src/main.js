import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Popup } from 'vant'
import 'vant/lib/index.css';
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(Popup)
app.use(createPinia())
app.use(router)

app.mount('#app')
