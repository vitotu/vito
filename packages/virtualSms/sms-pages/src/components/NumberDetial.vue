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
    <div>{{ `${curNumber}(${refreshTimes})` }}</div>
    <div
      v-if="smsList.length"
      class="sms-list"
    >
      <div>
        <li v-for="text in smsList" :key="text">
          {{ text }}
        </li>
      </div>
    </div>
    <VanLoading v-else class="sms-loading" vertical>短信加载中。。。</VanLoading>
  </div>
</template>

<style scoped>
.sms-list {
  font-size: 12px;
}
.number-detail {
  text-align: center;
}
</style>