<template>
  <div class="video-container">
    <van-text-ellipsis
      class="video-title"
      :content="`${node.name}.${node.extendName}`"
      position="middle"
      @click="onVideoPlay"
    />
    <van-popup
      v-model:show="showVideo"
      :show-confirm-button="false"
      @close="onCloseVide"
    >
      <div v-if="node.extendName == 'ts'">
        <a :href="`xplayer://play?url=http:${videoSrc}`">play video in xplayer</a>
      </div>
      <video
        v-else 
        ref="videoPlayer"
        controls 
        width="250"
      >
        <source
          :type="node.extendName == 'ts' ? 'application/x-mpegurl' : ''"
          :src="videoSrc"
        />
      </video>
    </van-popup>
  </div>
</template>

<script setup>
// TODO: 视频因缺少流媒体， 采用点击弹窗的形式播放， ts使用deeplink跳转至xplayer播放
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { getResourceUrl } from '../utils'
import videojs from 'video.js'

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
})

const showVideo = ref(false)
const videoSrc = computed(() => {
  return getResourceUrl(props.node.fullPath)
})

function onVideoPlay() {
  showVideo.value = true
}

function onCloseVide() {
  showVideo.value = false
}

player = reactive(null)
videoPlayer = ref(null)
onMounted(() => {
  player = videojs(videoPlayer, {}, () {
    player?.log('ready')
  })
})

onBeforeUnmount(() => {
  if(player) player?.dispose()
})

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
