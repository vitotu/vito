<script setup>
import { useSSRContext, reactive, ref, provide } from 'vue'
import NodeItem from './components/NodeItem.vue'
let ctx
if(import.meta.env.SSR){
  ctx = useSSRContext()
} else {
  ctx = window.__preFetchData__?.data
}
let data = reactive(ctx);
provide('fileTree', data)
</script>
<template>
  <div class="file-server-app">
    <router-view></router-view>
    <!-- <node-item :node="ctx.data.data" :index="index"/> -->
  </div>
</template>

<style>
@font-face {
  font-family: 'Inter';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url('./assets/fonts/Inter-Italic.woff2#iefix') format('woff2'),
    url('./assets/fonts/Inter-Italic.woff') format('woff');
}
.inter {
  font-family: 'Inter';
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
}
.file-server-app {
  height: 100%;
}
</style>
