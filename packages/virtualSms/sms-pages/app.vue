<template>
  <div class="app">
    <ClientOnly>
      <keep-alive>
        <component
          :is="active"
          class="content"
        >
        </component>
      </keep-alive>
    </ClientOnly>
    <VanTabbar placeholder v-model="active" bind:change="">
      <VanTabbarItem name="MainNumbers" icon="home-o">首页</VanTabbarItem>
      <VanTabbarItem name="Config" icon="setting-o">设置</VanTabbarItem>
    </VanTabbar>
  </div>
</template>


<script lang="ts" setup>
import { ref } from 'vue'
const active = ref('MainNumbers')
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
