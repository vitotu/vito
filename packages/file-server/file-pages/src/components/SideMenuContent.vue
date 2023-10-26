<script setup>
import { computed } from 'vue'
import { useFileTreeStore } from '../stores/fileTree';

const fileTreeStore = useFileTreeStore()

const subFolders = computed(() => {
  const children = fileTreeStore.currentNode?.children
  return children?.filter(node => {
    if(node?.children.length > 0) return true
    else return false
  })?.reverse() || []
})

</script>

<template>
  <div>
    <div
      v-for="(node, index) in subFolders"
      :key="node.name + index"
    >
      {{ node.name }}
    </div>
  </div>
</template>

<style>

</style>