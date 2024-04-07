<script lang="ts" setup>
import { ref, onMounted, reactive, nextTick, inject } from 'vue'
import type { Ref } from 'vue'
import Clipboard from "clipboard"
import { showToast } from 'vant'
import { Ws } from '../utils'
import { listenMainPages, listenByNumbers, stopTaskByIds } from '../apis'
import { type NumberItem, type NumberDetail, type NotificationMsg } from '../types'
import NumberDetailVue from '../components/NumberDetail.vue'
const count = ref(0)
const ws:Ref<Ws> = inject('ws')
const wsId = ws.value.wsId
let numbers:Array<NumberItem> = reactive([])
let taskId = ref('')
const numbersContent = ref<HTMLDivElement | null>(null)

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
  if(res.cacheNumbers?.length) numbers.push(...res.cacheNumbers.map((i:NumberItem) => {
    i.isClick = true
    return i
  }))

  function updateCb (data) {
    if(data.taskId === taskId.value) updateNumbers(data.data, data.count)
    else if(data.taskId === numberDetail.taskId) updateSmsList(data)
  }
  let id = ws.value.addCb(updateCb)
})

function updateNumbers(data: Array<NumberItem>, newCount:number) {
  if(data?.length) {
    if(count.value == 0) numbers.push(...data.map((i:NumberItem) => {
      i.isClick = true
      return i
    }))
    else numbers.push(...data)
    let numberItem: NumberItem = data[0]
    NotificationNew({
      title: "发现新号码",
      body: numberItem.country+numberItem.number,
      icon: ''
    })
    nextTick(() => {
      // 更新号码后滚动到底部， 即最新的号码处
      const contentDom = numbersContent.value
      if(contentDom) contentDom.scrollTop = contentDom?.scrollHeight
    })
  }
  count.value = newCount
}



function updateSmsList(data: {count: number, data: {lastSMSs: string[]}}) {
  numberDetail.refreshTimes = data.count
  numberDetail.smsList = data?.data?.lastSMSs || []
}

function NotificationNew(msg: NotificationMsg) {
  if(typeof window != 'undefined' && window.Notification.permission == "granted") {
    new Notification(msg.title, {
      body: msg.body,
      icon: msg.icon,
    })
  } else if (typeof window != 'undefined' && window.Notification.permission != "denied") {
    window.Notification.requestPermission(function(permission) {
      new Notification(msg.title, {
        body: msg.body,
        icon: msg.icon,
      })
    })
  }
}

function HandleNumberClick(item: NumberItem) {
  numberDetail.curNumber = item.number
  item.isClick = true
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
    <VanNavBar placeholder fixed>
      <template #title>
        {{ `第${count}次刷新` }}
      </template>
      <template #right>
        total: {{ numbers.length }}
      </template>
    </VanNavBar>
    <div
      v-if="numbers.length"
      class="numbers-content"
      ref="numbersContent"
    >
      <VanGrid
        :column-num="2"
      >
        <VanGridItem
          class="number-item"
          v-for="(item, index) in numbers"
          :key="index+item.number"
          @click="HandleNumberClick(item)"
        >
          <VanBadge :content="item.isClick ? '' : 'new'">
            <div class="country">
              <van-icon name="location" />
              {{ item.country }}
            </div>
            <div class="number">
              <van-icon name="phone" />
              {{ item.number }}
            </div>
          </VanBadge>
        </VanGridItem>
      </VanGrid>
    </div>
    <VanLoading v-else class="number-loading" vertical>号码加载中。。。</VanLoading>
    <VanPopup
      v-model:show="showDetail"
      position="top"
      round
      @close="HandleCloseNumber(numberDetail.taskId)"
    >
      <NumberDetailVue
        :cur-number="numberDetail.curNumber"
        :refresh-times="numberDetail.refreshTimes"
        :sms-list="numberDetail.smsList"
      />
    </VanPopup>
  </div>
</template>

<style scoped>
.main-numbers-page {
  display: flex;
  flex-direction: column;
}
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
.numbers-content {
  flex: 1;
  overflow-y: auto;
}
</style>