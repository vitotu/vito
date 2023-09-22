<script setup>
import { inject, reactive, ref } from 'vue'
import gallery from '../components/gallery.vue'
import video from '../components/video.vue'
import Text from '../components/Text.vue'
const fileTree = inject('fileTree')
const treeNodeAttrMap = {
  value: 'name',
  label: 'name',
  children: 'children'
}
let curNode = ref(fileTree)
let curNodeType = ref(fileTree.extendName)
function onSelect(node){
  curNode.value = node
  curNodeType.value = node.extendName
}
function mapToComponent(type){
  if(['mp4', 'm4a',].includes(type)) return video
  else if (['avi', 'rmvb', 'ts'].includes(type)) return Text
  else return gallery
}
</script>

<template>
  <header>
    fileTree
  </header>
  <div class="file-tree-content">
    <el-tree-v2 
      :data="[fileTree]" 
      :props="treeNodeAttrMap"
      @node-click="onSelect"
      class="side-menu"
      :height="800"
    >
      <template #default="{ node }">
        <div class="custom-tree-node">
          <div>{{ node.label }}</div>
        </div>
      </template>
    </el-tree-v2>
    <component :is="mapToComponent(curNodeType)" :curNode="curNode"></component>
  </div>
</template>

<style scoped>
.file-tree-content {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}
.side-menu {
  width: 200px;
  height: 100%;
  margin-right: 8px;
  border-right: solid 1px grey;
  flex: 0 0 auto;
}
</style>