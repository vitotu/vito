<script setup>
import { onMounted, computed, ref, reactive } from 'vue'
import BreadCrumb from '../components/BreadCrumb.vue'
import SideMenuContent from '../components/SideMenuContent.vue';
import { useFileTreeStore } from '../stores/fileTree.js'
import { paginationConfig, fileTypeReg } from '../config'
const fileTreeStore = useFileTreeStore()
onMounted(async () => {
  const result = await fileTreeStore.initFileTree()
  onListLoad() // 首屏检查后数据还未请求到，需要等到数据加载完成后重新触发一次ListLoad回调
})

const mediaArray = computed(() => {
  const children = fileTreeStore.currentNode?.children
  return children?.filter(node => {
    if(node.extendName.match(/ts|mp4|avi|rmvb||jpg|jpeg|png|gif/g)?.[0]) return true
    else return false
  }) || []
})

const currentList = reactive([])

const pagination = reactive({
  currentNumber: 0,
  total: mediaArray.length / paginationConfig.NumbersPerPage,
  perNumber: paginationConfig.NumbersPerPage
})

const listLoading = ref(false)
const listFinished = ref(false)

function onListLoad() {
  console.log('onLoad', pagination.currentNumber)
  currentList.push.apply(currentList,
    mediaArray.value.slice(
      pagination.currentNumber * pagination.perNumber,
      (pagination.currentNumber + 1) * pagination.perNumber
    )
  )
  pagination.currentNumber++
  listLoading.value = false
  if(currentList.length >= mediaArray.length) listFinished.value = true
}

let showMenu = ref(false)

function onOpenMenu() {
  showMenu.value = !showMenu.value
}

function getComponentName(name) {
  if(name.match(fileTypeReg.IMAGE)?.[0]) return 'ImgContainer'
  else if (name.match(fileTypeReg.VIDEO)?.[0]) return 'VideoContainer'
  else return 'TextContainer'
}

</script>

<template>
  <div class="files-container">
    <BreadCrumb :path="fileTreeStore.pathStack"/>
    <div class="content">
      <van-list
        v-model:loading="listLoading"
        :finished="listFinished"
        finished-text="no more"
        @load="onListLoad"
      >
        <van-cell v-for="(node, index) in currentList" :key="node.name" :title="`${index}+${node.name}.${node.extendName}`"></van-cell>
      </van-list>
    </div>
    <div
      class="hover-menu"
      @click="onOpenMenu"
    ></div>
    <van-popup
      v-model:show="showMenu"
      position="right"
      :style="{ height: '100%'}"
      class="side-menu"
    >
      <SideMenuContent
        :showMenu="showMenu"
      />
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.files-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.content {
  height: 100%;
  width: 100%;
  overflow: auto;
  flex: 1;
}
.hover-menu {
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
}
.side-menu {
  width: 60%;
}
</style>