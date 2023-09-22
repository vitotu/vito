<script setup>
import { reactive, computed } from 'vue'
import NodeItem from './NodeItem.vue'
const props = defineProps({
  node: Object,
  index:Number,
  initShowChildren: {
    type: Boolean,
    default: false
  }
})

let isShowMore = computed(() => initShowChildren)

function onShowMoreClick(){
  
}

</script>

<template>
  <div class="node-item" ref="curNode">
    <h4>{{node.name}}</h4>
    <span>{{index}}</span>
    <div class="path" v-if="node.children.length == 0">{{ node.fullPath }}</div>
    <template v-if="isShowMore">
      <node-item v-for="item in node.children" :key="item.name" :node="item" :index="index+1"/>
    </template>
  </div>
</template>

<style scoped>
.path {
  text-overflow: ellipsis;
  width: 100%;
}
.node-item {
  text-align: left;
}
</style>