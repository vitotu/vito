<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { listenMainPages } from '../apis'
const count = ref(0)
const wsId = '1008'
let numbers = reactive(<Array<{country:string, number:string}>>[])

onMounted(async () => {
  const res = await listenMainPages(wsId)
  console.log('listenMainPages', res)
  var ws = new WebSocket(`ws://localhost:3080/ws?id=${wsId}`)
  ws.onopen = function () {
    console.log('connected')
  }
  ws.onmessage = function (e) {
    let data = JSON.parse(e.data)
    if(data.code == 0){
      console.log('success', data.data, data.count)
      if(data.data?.length) numbers.push(...data.data)
      count.value = data.count
    } else {
      console.log('error: ', data?.old?.oldNumbers.length, data.count)
    }
  }
})

</script>

<template>
  <div>
    <VanNavBar>
      <template #title>
        {{ `Numbers刷新次数：${count}` }}
      </template>
    </VanNavBar>
    <div v-for="(item, index) in numbers" :key="index">
      {{ item.country }}: {{ item.number }}
    </div>
    <div>{{ numbers.length }}</div>
  </div>
</template>