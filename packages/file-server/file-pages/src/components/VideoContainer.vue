<template>
  <div class="video-container" @click="onVideoPlay">
    <van-text-ellipsis
      class="video-title"
      :content="`${node.name}.${node.extendName}`"
      position="middle"
    />
    <van-image-preview
      v-model:show="showVideo"
      :images="videos"
      closeable
      :show-index="false"
    >
      <template #image="{ src }">
        <div v-if="node.extendName == 'ts'">
          {{ src }}
          <a :href="`xplayer://play?url=http:${src}`">play video in xplayer</a>
        </div>
        <video v-else controls width="250">
          <source
            :type="node.extendName == 'ts' ? 'application/x-mpegurl' : ''"
            :src="src"
          />
        </video>
      </template>
    </van-image-preview>

  </div>
</template>

<script setup>
// TODO: 视频因缺少流媒体， 采用点击弹窗的形式播放， ts使用deeplink跳转至xplayer播放
import { ref, reactive } from 'vue'
import { getResourceUrl } from '../utils'

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
})

const showVideo = ref(false)
const videos = reactive([
  getResourceUrl(props.node.fullPath)
])

function onVideoPlay() {
  showVideo.value = true
}

</script>

<style lang="less" scoped>
.video-container {
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  video {
    width: 100%;
  }
}
.video-title {
  text-align: center;
}
</style>
