<template>
  <ImageContainer
    v-if="getComponentName(node.extendName) == 'ImgContainer'"
    :node="node"
    @click="onPreview('image')"
  />
  <VideoContainer
    v-else-if="getComponentName(node.extendName) == 'VideoContainer'"
    :node="node"
  />
  <van-cell
    v-else
    :title="`${index}+${node.name}.${node.extendName}`"
  ></van-cell>
</template>

<script setup>
import ImageContainer from './ImageContainer.vue'
import VideoContainer from './VideoContainer.vue';
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
  if(name.match(fileTypeReg.IMAGE)?.[0]) return 'ImgContainer'
  else if (name.match(fileTypeReg.VIDEO)?.[0]) return 'VideoContainer'
  else return 'TextContainer'
}

const emit = defineEmits(['preview'])

function onPreview(type) {
  emit('preview', type)
}

</script>

<style lang="less" scoped>

</style>
