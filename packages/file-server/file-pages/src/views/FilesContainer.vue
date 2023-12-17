<script setup>
import { onMounted, computed, ref, reactive } from 'vue'
import { showImagePreview } from 'vant'
import BreadCrumb from '../components/BreadCrumb.vue'
import ItemContainer from '../components/ItemContainer.vue';
import { useFileTreeStore } from '../stores/fileTree.js'
import { paginationConfig } from '../config'
import { getResourceUrl } from '../utils'
import SideMenu from '../components/SideMenu/index.vue';

const fileTreeStore = useFileTreeStore()
onMounted(async () => {
  const result = await fileTreeStore.initFileTree()
  onListLoad() // 首屏检查后数据还未请求到，需要等到数据加载完成后重新触发一次ListLoad回调
})

const mediaArray = computed(() => {
  const children = fileTreeStore.currentNode?.children
  return children?.filter(node => {
    if(['ts', 'mp4', 'avi', 'rmvb', 'jpg', 'jpeg', 'png', 'gif'].includes(node.extendName)) return true
    else return false
  }) || []
})

const currentList = reactive([])

const pagination = reactive({
  currentNumber: 0,
  total: mediaArray.value.length / paginationConfig.NumbersPerPage,
  perNumber: paginationConfig.NumbersPerPage
})

const listLoading = ref(false)
const listFinished = ref(false)

function onListLoad() {
  if(!fileTreeStore.currentNode?.name) return // 数据加载完成之前不调用load
  currentList.push.apply(currentList,
    mediaArray.value.slice(
      pagination.currentNumber * pagination.perNumber,
      (pagination.currentNumber + 1) * pagination.perNumber
    )
  )
  pagination.currentNumber++
  listLoading.value = false
  if(currentList.length >= mediaArray.value.length) listFinished.value = true
}

let showMenu = ref(false)

function onMenuChange() {
  Object.assign(pagination, reactive({
    currentNumber: 0,
    total: mediaArray.value.length / paginationConfig.NumbersPerPage,
    perNumber: paginationConfig.NumbersPerPage
  }))
  currentList.splice(
    0,
    Number.POSITIVE_INFINITY,
    ...mediaArray.value.slice(
      pagination.currentNumber * pagination.perNumber,
      (pagination.currentNumber + 1) * pagination.perNumber
    )
  )
  showMenu.value = false
}

function onShowChange(val) {
  showMenu.value = val
}

function onPreview(type, node) {
  if(type == 'image') {
    showImagePreview({
      images: [
        getResourceUrl(node.fullPath)
      ]
    })
  }
}

</script>

<template>
  <div class="files-container">
    <BreadCrumb :path="fileTreeStore.pathStack"/>
    <div class="content">
      <van-list
        class="list"
        v-model:loading="listLoading"
        :finished="listFinished"
        finished-text="no more"
        @load="onListLoad"
      >
        <ItemContainer
          v-for="(node, index) in currentList"
          :key="node.name"
          :node="node"
          :index="index"
          @preview="(e) => onPreview(e, node)"
        />
      </van-list>
    </div>
    <SideMenu
      :showMenu="showMenu"
      @showChange="onShowChange"
      @menuChange="onMenuChange"
    />
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
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

</style>