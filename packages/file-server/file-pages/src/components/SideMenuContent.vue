<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useFileTreeStore } from '../stores/fileTree';

const fileTreeStore = useFileTreeStore()
const scrollMenu = ref(null)

const subFolders = computed(() => {
  const children = fileTreeStore.currentNode?.children
  return children?.filter(node => {
    if(node?.children.length > 0) return true
    else return false
  })?.reverse() || []
})

const unWatchEffect = watchEffect(async () => {
  console.log(props.showMenu)
  if(props.showMenu) {
    try {
      scrollMenu.value.scrollTop = scrollMenu.value.scrollHeight
    } catch (error) {
      console.log(error)
    }
  }
})

const props = defineProps({
  showMenu: {
    type: Boolean,
    required: true
  }
})

</script>

<template>
  <div
    class="side-menu-content"
    ref="scrollMenu"
  >
    <div
      v-for="(node, index) in subFolders"
      :key="node.name + index"
      class="menu-item"
    >
      {{ node.name }}
    </div>
    <div class="menu-preview">上一级</div>
  </div>
</template>

<style lang="less" scoped>
.side-menu-content {
  overflow-y: auto;
  color: black;
  height: 100%;
  width: 100%;
  .menu-item {
    text-overflow: ellipsis;
  }
}
</style>