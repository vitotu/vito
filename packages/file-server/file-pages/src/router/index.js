import { createRouter, createWebHistory } from 'vue-router'
import FilesContainer from '../views/FilesContainer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'files',
      component: FilesContainer
    }
  ]
})

export default router
