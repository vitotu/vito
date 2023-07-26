<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import Clipboard from "clipboard"
import { showToast } from 'vant'
import { listenMainPages, listenByNumbers, stopTaskByIds } from '../apis'
import { NumberItem } from '../types'
const count = ref(0)
const wsId = '1008'
let numbers:Array<NumberItem> = reactive([])
let taskId = ref('')

onMounted(async () => {
  const [res, err] = await listenMainPages(wsId).then(r => [r, null], e => [null, e])
  if(err) return console.error(err)
  console.log('listenMainPages', res)
  taskId.value = res?.id
  if(res.cacheNumbers?.length) numbers.push(...res.cacheNumbers)
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
      console.error('error: ', data?.old?.oldNumbers.length, data.count)
    }
  }
})

function HandleNumberClick(item: NumberItem) {
  console.log(item)
  let clipboard = new Clipboard('.main-numbers-page', {
    text: () => {
      return item.number
    },
  })
  clipboard.on('success', () => {
    clipboard.destroy()
    showToast('复制成功')
  })
  clipboard.on('error', () => {
    clipboard.destroy()
    showToast('复制失败')
  })
}

</script>

<template>
  <div class="main-numbers-page">
    <VanNavBar placeholder>
      <template #title>
        {{ `第${count}次刷新` }}
      </template>
      <template #right>
        total: {{ numbers.length }}
      </template>
    </VanNavBar>
    <VanGrid
      v-if="numbers.length"
      :column-num="2"
    >
      <VanGridItem
        class="number-item"
        v-for="(item, index) in numbers"
        :key="index+item.number"
        @click="HandleNumberClick(item)"
      >
        <div class="country">
          <van-icon name="location" />
          {{ item.country }}
        </div>
        <div class="number">
          <van-icon name="phone" />
          {{ item.number }}
        </div>
      </VanGridItem>
    </VanGrid>
    <VanLoading v-else class="number-loading" vertical>号码加载中。。。</VanLoading>
  </div>
</template>

<style scoped>
.number-item > :deep(div) {
  padding: 4px;
}
.number-loading {
  text-align: center;
}
.country .number {
  font-size: 14px;
}
</style>