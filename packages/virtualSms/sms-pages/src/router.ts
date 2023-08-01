// 改为动态组件
export default function getRouterConfig() {
  return [
    {
      name: 'config',
      path: '/config',
      component: 'src/pages/Config.vue'
    },
    {
      name: 'MainNumbers',
      path: '/',
      component: 'src/pages/MainNumbers.vue'
    }
  ]
}