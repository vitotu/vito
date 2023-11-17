<template>
  <div class="video-container">
    <van-text-ellipsis
      class="video-title"
      :content="`${node.name}.${node.extendName}`"
      position="middle"
    />
    <lazy-component>
      <video controls width="250">
        <source
          :type="node.extendName == 'ts' ? 'application/x-mpegurl' : ''"
          :src="getResourceUrl(node.fullPath)"
        />
      </video>
    </lazy-component>
  </div>
</template>

<script setup>
import {} from 'vue'
import { getResourceUrl } from '../utils'

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
})

</script>

<style lang="less" scoped>
.video-container {
  width: 100%;
  video {
    width: 100%;
  }
}
.video-title {
  text-align: center;
}
</style>
