<script lang="ts" setup>
import { onMounted } from 'vue'
import { listenByNumbers, stopTaskByIds } from '../apis'

async function startListen(numbers: string[], wsIds: string[]) {
  let [res, err] = await listenByNumbers(numbers, wsIds).then(r => [r, null], e => [null, e])
  if(res?.code == 200) {
    console.log(res)
  } else console.error(err)
}

</script>

<template>
  
</template>

<style scoped>

</style>