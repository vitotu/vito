<template>
  <div class="app">
    <MainNumbers class="content" />
    <VanTabbar placeholder v-model="active">
      <VanTabbarItem icon="home-o">首页</VanTabbarItem>
      <VanTabbarItem icon="setting-o">设置</VanTabbarItem>
    </VanTabbar>
  </div>
</template>


<script lang="ts" setup>
import { ref } from 'vue'
import MainNumbers from './src/pages/MainNumbers.vue'
const active = ref(0)
</script>

<style scoped>
.app {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1;
  overflow: hidden;
}
</style>
