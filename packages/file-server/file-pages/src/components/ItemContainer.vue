<template>
  <div>
    <ImageContainer
      v-if="getComponentName(node.name) == 'ImgContainer'"
    />
  </div>
</template>

<script setup>
import ImageContainer from './ImageContainer.vue'
import { fileTypeReg } from '../config'

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
})

function getComponentName(name) {
  if(name.match(fileTypeReg.IMAGE)?.[0]) return 'ImgContainer'
  else if (name.match(fileTypeReg.VIDEO)?.[0]) return 'VideoContainer'
  else return 'TextContainer'
}
</script>

<style lang="less" scoped>

</style>
