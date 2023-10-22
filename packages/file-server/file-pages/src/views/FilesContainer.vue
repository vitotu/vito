<script setup>
import { onMounted, computed } from 'vue'
import BreadCrumb from '../components/BreadCrumb.vue'
import { useFileTreeStore } from '../stores/fileTree.js'
const fileTreeStore = useFileTreeStore()
onMounted(async () => {
  const result = await fileTreeStore.initFileTree()
})

const mediaArray = computed(() => {
  const children = fileTreeStore.currentNode?.children
  return children?.filter(node => {
    if(node.extendName.match(/ts|mp4|avi|rmvb||jpg|jpeg|png|gif/g)) return true
    else return false
  })
})

</script>

<template>
  <div class="files-container">
    <BreadCrumb :path="fileTreeStore.pathStack"/>
    <div class="content">
      {{ mediaArray }}
    </div>
    <div class="hover-menu"></div>
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
</style>