<script setup>
import {} from 'vue'
import { getResourceUrl } from '../utils'

const props = defineProps({
  node: {
    type: Object,
    required: true,
  }
})

</script>

<template>
  <div class="image-container">
    <img
      v-lazy="getResourceUrl(node.fullPath)"
      :alt="node.name"
    >
  </div>
</template>

<style lang="less" scoped>
.image-container {
  width: 45%;
  img {
    width: 100%;
    height: auto;
  }
}
</style>
