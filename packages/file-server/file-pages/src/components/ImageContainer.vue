<script setup>
import {} from 'vue'

const props = defineProps({
  node: {
    type: Object,
    required: true,
  }
})

</script>

<template>
  <div class="image-container">
    <img :src="node.fullPath" alt="">
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
