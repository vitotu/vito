<script setup>
import {} from 'vue'
import { BackHost } from '../config'

const props = defineProps({
  node: {
    type: Object,
    required: true,
  }
})

function getUrl(fullPath) {
  return `${BackHost.host}${fullPath.substr(1)}`
}

</script>

<template>
  <div class="image-container">
    <img :src="getUrl(node.fullPath)" :alt="node.name">
  </div>
</template>

<style lang="less" scoped>
.image-container {
  width: 100%;
  img {
    width: 100%;
    height: auto;
  }
}
</style>
