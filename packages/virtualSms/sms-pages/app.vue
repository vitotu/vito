<template>
  <div>
    <MainNumbers />
    <VanTabbar placeholder v-model="active">
      <VanTabbarItem icon="home-o">首页</VanTabbarItem>
      <VanTabbarItem icon="search">搜索</VanTabbarItem>
      <VanTabbarItem icon="friends-o">朋友</VanTabbarItem>
      <VanTabbarItem icon="setting-o">设置</VanTabbarItem>
    </VanTabbar>
  </div>
</template>


<script lang="ts" setup>
import { ref } from 'vue'
import MainNumbers from './src/pages/MainNumbers.vue'
const active = ref(0)
function showNotify(res:string) {
  console.log('demo', res)
}
</script>