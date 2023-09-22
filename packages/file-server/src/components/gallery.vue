<script setup>
import { computed } from 'vue'
const props = defineProps({
  curNode:{
    type:Object,
    require: true
  }
})

const imgsNode = computed(() => {
  console.log(props.curNode)
  let imgsNode = []
  try {
    imgsNode = props.curNode.children.filter(i => ['jpg', 'png', 'jpeg', 'gif'].includes(i.extendName))
  } catch (error) {
  }
  return imgsNode
})
</script>

<template>
  <div class="gallery">
    <div class="gallery-header">
      <h4>gallery -- {{ curNode.name }}</h4>
      <div class="gallery-pagination"></div>
    </div>
    <div class="img-container" v-for="(imgNode, index) in imgsNode" :key="index">
      <img loading='lazy' :src="imgNode.fullPath.substr(1)" />
    </div>
  </div>
</template>

<style scoped>
.img-container {
  width: 100%;
}
img {
  width: 100%;
}
</style>