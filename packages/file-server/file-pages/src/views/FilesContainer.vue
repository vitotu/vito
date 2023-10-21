<script setup>
import {} from 'vue'
import BreadCrumb from '../components/BreadCrumb.vue';
const path = ['a','b','c']
</script>

<template>
  <div class="files-container">
    <BreadCrumb :path="path"/>
    <div class="content">

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