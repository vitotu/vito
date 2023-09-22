<script setup>
import { computed } from 'vue'
const props = defineProps({
  curNode:{
    type:Object,
    require: true
  }
})

function convertUrl(){
  return 
}

</script>

<template>
  <div class="video">
    <div class="video-header">
      <h4>gallery -- {{ props.curNode.name }}</h4>
    </div>
    <video :key="props.curNode.name" width="800" height="600" controls>
      <source :src="props.curNode.fullPath.substr(1)" type="video/mp4">
      <source :src="props.curNode.fullPath.substr(1)" type="video/webm">
    </video>
  </div>
</template>

<style scoped>

</style>