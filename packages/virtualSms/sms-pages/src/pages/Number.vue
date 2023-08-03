<script lang="ts" setup>
import { ref, inject, reactive } from 'vue'
import type { Ref } from 'vue'
import { Ws } from '../utils'
import { NumberDetail } from '../types'
import { listenByNumbers } from '../apis'
const curNumber = ref('')
const ws:Ref<Ws> = inject('ws')
let numberDetail: NumberDetail = reactive({
  curNumber: '',
  smsList: [],
  taskId: '',
  refreshTimes: 0,
})

function handleSearch() {
  console.log(curNumber.value)
  if(curNumber.value) {
    listenByNumbers([curNumber.value], [ws.value.wsId]).then(r => {
      if(r.code == 200) numberDetail.taskId = r.ids?.[0]?.taskId || ''
    })
  }
}
</script>

<template>
  <div class="custom-number-detail">
    <div class="content"></div>
    <div class="footer">
      <VanField
        v-model="curNumber" 
        placeholder="请输入要查询的号码"
      />
      <VanButton type="primary" @click="handleSearch">查询</VanButton>
    </div>
  </div>
</template>

<style scoped>

</style>
