<template>
  <div class="bread-crumb">
    <span
      v-for="(node, index) in path"
      :key="index"
    >
      <i v-if="index !== 0">{{ '/' }}</i>
      <span>{{ node.name }}</span>
    </span>
  </div>
</template>

<script setup>
import {  } from 'vue'
const props = defineProps({
  path: {
    type: Array,
    required: true,
  }
})
</script>

<style lang="less" scoped>
.bread-crumb {
  padding: 6px 12px;
  font-size: 14px;
  i {
    margin: 0 4px;
  }
}
</style>