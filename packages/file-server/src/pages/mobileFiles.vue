<script setup>
import { useRoute, useRouter } from 'vue-router'
import { inject, ref } from 'vue'
const fileTree = inject('fileTree')
let curNode = ref(fileTree)
const isBrowser = typeof window !== 'undefined';
</script>

<template>
  <var-app-bar
    v-if="isBrowser"
    title="fileTree"
    title-position="center"
  >

  </var-app-bar>
</template>

<style scoped>

</style>