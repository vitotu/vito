<script setup>
import { computed } from 'vue'
import SideMenuContent from './SideMenuContent.vue';
const emit = defineEmits(['showChange', 'menuChange'])
const props = defineProps({
  showMenu: {
    type: Boolean,
    required: false
  }
})

let isShow = computed({
  get() {
    return props.showMenu
  },
  set(val) {
    emit('showChange', val)
  }
})

function onOpenMenu() {
  emit('showChange', true)
}
function onMenuChange() {
  emit('menuChange')
}
</script>

<template>
  <div
    class="hover-menu"
    @click="onOpenMenu"
  >
    <!-- hover menu content -->
    <van-popup
      class="side-menu"
      v-model:show="isShow"
      position="right"
      :style="{ height: '100%'}"
      teleport="body"
    >
      <SideMenuContent
        :showMenu="isShow"
        @current-node-change="onMenuChange"
      />
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.hover-menu {
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
}
.side-menu {
  width: 60%;
}
</style>