<script lang="ts" setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <VanNavBar>
    <template #title>
      {{ `Numbers刷新次数：${count}` }}
    </template>
  </VanNavBar>
</template>