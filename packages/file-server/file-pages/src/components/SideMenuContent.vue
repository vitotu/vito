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

const emit = defineEmits(['currentNodeChange'])

function onSubFolder(node) {
  fileTreeStore.pushStack(node)
  emit('currentNodeChange')
}

function onPreFolder() {
  fileTreeStore.popStack()
  emit('currentNodeChange')
}

</script>

<template>
  <div
    class="side-menu-content"
    ref="scrollMenu"
  >
    <van-cell-group>
      <van-cell
        v-for="(node, index) in subFolders"
        :key="node.name + index"
        is-link
        @click="onSubFolder(node)"
      >
        <template #title>
          <span>{{ node.name }}</span>
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell
      v-show="fileTreeStore.pathStack.length > 1"
      class="menu-preview"
      title="上一级"
      icon="arrow-left"
      @click="onPreFolder"
    ></van-cell>
  </div>
</template>

<style lang="less" scoped>
.side-menu-content {
  position: relative;
  overflow-y: auto;
  color: black;
  height: 100%;
  width: 100%;
  padding-bottom: 30px;
  .menu-item {
    text-overflow: ellipsis;
  }
  .menu-preview {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
  }
}
</style>