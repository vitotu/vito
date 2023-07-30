<script lang="ts" setup>
import { onMounted } from 'vue'
import { listenByNumbers, stopTaskByIds } from '../apis'

interface DetailProps {
  curNumber: string;
  refreshTimes: number;
  smsList: string[];
}

const props = withDefaults(defineProps<DetailProps>(), {
  curNumber: "",
  refreshTimes: 0,
  smsList: () => []
})

</script>

<template>
  <div class="number-detail">
    <div class="detail-title">{{ `${curNumber}(${refreshTimes})` }}</div>
    <div
      v-if="smsList.length"
      class="sms-list"
    >
      <div>
        <div class="sms-item" v-for="text in smsList" :key="text">
          {{ text }}
        </div>
      </div>
    </div>
    <VanLoading v-else class="sms-loading" vertical>短信加载中。。。</VanLoading>
  </div>
</template>

<style scoped>
.sms-list {
  font-size: 14px;
}
.number-detail {
  text-align: center;
}
.sms-item {
  text-align: left;
  margin: 8px 6px;
  max-width: 100vw;
  word-wrap: break-word;
  background-color: rgba(57, 169, 237, 0.2);
}
.detail-title {
  margin: 8px;
}
</style>