<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import type { Ref } from 'vue'
import Clipboard from "clipboard"
import { showToast } from 'vant'
import { listenMainPages, listenByNumbers, stopTaskByIds } from '../apis'
import { NumberItem, NumberDetail } from '../types'
import NumberDetial from '../components/NumberDetial.vue'
const count = ref(0)
const wsId = '1008'
let numbers:Array<NumberItem> = reactive([])
let taskId = ref('')

let numberDetail: NumberDetail = reactive({
  curNumber: '',
  smsList: [],
  taskId: '',
  refreshTimes: 0,
})

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
      if(data.taskId === taskId.value) updateNumbers(data.data, data.count)
      else if(data.taskId === numberDetail.taskId) updateSmsList(data)
    } else {
      console.error('error: ', data?.old?.oldNumbers.length, data.count)
    }
  }
})

function updateNumbers(data: Array<NumberItem>, newCount:number) {
  if(data?.length) numbers.push(...data)
  count.value = newCount
}

function updateSmsList(data: {count: number, data: {lastSMSs: string[]}}) {
  numberDetail.refreshTimes = data.count
  numberDetail.smsList = data?.data?.lastSMSs || []
}


function HandleNumberClick(item: NumberItem) {
  numberDetail.curNumber = item.number
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
      numberDetail.taskId = r.ids?.[0]?.taskId || ''
    }
  })
  showDetail.value = true
}

function HandleCloseNumber(taskId: string) {
  stopTaskByIds([taskId]).then(r => {
    console.log(r)
  })
  numberDetail.taskId = ''
  numberDetail.smsList = []
  numberDetail.curNumber = ''
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
      @close="HandleCloseNumber(numberDetail.taskId)"
    >
      <NumberDetial
        :cur-number="numberDetail.curNumber"
        :refresh-times="numberDetail.refreshTimes"
        :sms-list="numberDetail.smsList"
      />
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