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
  <div class="text">
    <div class="text-header">
      <h4>gallery -- {{ props.curNode.name }}</h4>
    </div>
    <a :href="props.curNode.fullPath.substr(1)" target="_blank">{{ props.curNode.name }}</a>
  </div>
</template>

<style scoped>

</style>