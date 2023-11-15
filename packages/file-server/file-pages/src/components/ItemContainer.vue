<template>
  <ImageContainer
    v-if="getComponentName(node.extendName) == 'ImgContainer'"
    :node="node"
  />
  <van-cell
    v-else
    :title="`${index}+${node.name}.${node.extendName}`"
  ></van-cell>
</template>

<script setup>
import ImageContainer from './ImageContainer.vue'
import { fileTypeReg } from '../config'

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
  }
})

function getComponentName(name) {
  console.log(name)
  if(name.match(fileTypeReg.IMAGE)?.[0]){
    console.log('image', name)
    return 'ImgContainer'
  }
  else if (name.match(fileTypeReg.VIDEO)?.[0]) return 'VideoContainer'
  else return 'TextContainer'
}
</script>

<style lang="less" scoped>

</style>
