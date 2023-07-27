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

let currentNumber = ref('')
let smsList:Array<string> = reactive([])
let smsTaskId = ref('')

let showDetail = ref(false)

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
    if(data.code == 0 && data.taskId){
      console.log('success', data, data.count)
      if(data.taskId === taskId.value) updateNumbers(data.data, data.count)
      else if(data.taskId === smsTaskId.value) updateSmsList(data?.data?.lastSMSs || [])
    } else {
      console.error('error: ', data?.old?.oldNumbers.length, data.count)
    }
  }
})

function updateNumbers(data: Array<NumberItem>, newCount:number) {
  if(data?.length) numbers.push(...data)
  count.value = newCount
}

function updateSmsList(data: Array<string>) {
  console.log('@@@', data)
  if(data?.length) smsList.push(...data)
}


function HandleNumberClick(item: NumberItem) {
  currentNumber.value = item.number
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
  // TODO: 打开弹窗
  listenByNumbers([item.number], [wsId]).then(r => {
    if(r.code == 200) {
      smsTaskId.value = r.ids?.[0]?.taskId || ''
    }
  })
  showDetail.value = true
}

function HandleCloseNumber(taskId: string) {
  stopTaskByIds([taskId]).then(r => {
    console.log(r)
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
    <VanPopup
      v-model:show="showDetail"
      position="top"
      round
      @close="HandleCloseNumber(smsTaskId)"
    >
      <div class="number-detail">
        <div>{{ currentNumber }}</div>
        <div>
          <li v-for="text in smsList" :key="text">
            {{ text }}
          </li>
        </div>
      </div>
    </VanPopup>
  </div>
</template>

<style scoped>
.number-item > :deep(div) {
  padding: 4px;
  border: 1px solid rgb(168, 210, 168);
  border-radius: 12px;
}
.number-loading {
  text-align: center;
}
.country .number {
  font-size: 14px;
}
.number-detail {
  min-height: 30vh;
}
</style>