<script lang="ts" setup>
import { ref, inject, reactive, onDeactivated, onActivated } from 'vue'
import type { Ref } from 'vue'
import { Ws } from '../utils'
import { NumberDetail } from '../types'
import { listenByNumbers, stopTaskByIds } from '../apis'
import NumberDetailVue from '../components/NumberDetail.vue'

const ws:Ref<Ws> = inject('ws')
let wsCbId = ref('')
let numberDetail: NumberDetail = reactive({
  curNumber: '',
  smsList: [],
  taskId: '',
  refreshTimes: 0,
})

function handleSearch() {
  if(numberDetail.curNumber) {
    numberDetail.smsList = []
    numberDetail.refreshTimes = 0
    listenByNumbers([numberDetail.curNumber], [ws.value.wsId]).then(r => {
      if(r.code == 200) numberDetail.taskId = r.ids?.[0]?.taskId || ''
    })
    wsCbId.value = ws.value.addCb(updateSms)
  }
}

function updateSms(data) {
  if(data.taskId == numberDetail.taskId) {
    console.log(data)
    numberDetail.refreshTimes = data.count
    if(data?.data?.lastSMSs) numberDetail.smsList = data?.data?.lastSMSs || []
  }
}
onActivated(() => {
  numberDetail.smsList = []
  numberDetail.refreshTimes = 0
  handleSearch()
})

onDeactivated(() => {
  if(numberDetail.taskId){
    stopTaskByIds([numberDetail.taskId]).then(r => console.log(r))
  }
})


</script>

<template>
  <div class="custom-number-detail">
    <div class="content">
      <NumberDetailVue
        :cur-number="numberDetail.curNumber"
        :refresh-times="numberDetail.refreshTimes"
        :sms-list="numberDetail.smsList"
      />
    </div>
    <div class="footer">
      <VanField
        v-model="numberDetail.curNumber" 
        placeholder="请输入要查询的号码"
      />
      <VanButton type="primary" @click="handleSearch">查询</VanButton>
    </div>
  </div>
</template>

<style scoped>
.footer {
  display: flex;
}
</style>
