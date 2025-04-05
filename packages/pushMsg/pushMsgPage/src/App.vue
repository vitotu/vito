<template>
  <div>
    <div class="msg-tab">pushMsg后台调试页</div>
    <h1>查询数据</h1>
    <input type="date" v-model="selectedDate" @change="fetchData" />
    <template v-if="data.length">
      <div
        v-for="item in data"
        :key="item.id"
        class="msgBlock"
      >
        <div class="msg-title">
          <span>msg from {{ item.ref }}</span>
          <span>{{ item.id }}</span>
        </div>
        <div class="msg-content">
          <div class="text-title">
            <span class="text-number">{{ item.from }}</span>
            <span class="text-time">{{ item.revTime }}</span>
          </div>
          <div>{{ item.text }}</div>
        </div>
      </div>
    </template>
    <div v-else> no data </div>

    <h2>测试接口</h2>
    <button @click="testStore">测试存储</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectedDate: new Date().toISOString().split("T")[0],
      data: [],
      hostConfig: 'http://192.168.28.111:3000',
      productConfig: '/pushMsg'
    };
  },
  computed: {
    activeHost() {
      return this.productConfig
      // return this.hostConfig
    }
  },
  methods: {
    async fetchData() {
      try {
        const res = await axios.get(`${this.activeHost}/api/query?date=${this.selectedDate}`);
        const data = Array.isArray(res?.data) ? res.data : [];

        this.data = data.map(i => {
          const query = JSON.parse(i?.query)
          const contents = query?.content?.split('_')?.filter(t => t)
          return {
            ...(i || {}),
            ref: query?.ref,
            from: contents?.[1],
            revTime: contents?.[contents.length - 1],
            text: contents?.slice(2, contents.length - 1).join('_')
          }
        })
      } catch (error) {
        console.error("查询失败", error);
      }
    },
    async testStore() {
      try {
        const res = await axios.get(`${this.activeHost}/api/store`, {
          params: { 
            ref: "test data",
            content: "Hello World" 
          }
        });
        alert("存储成功: ID " + res.data.id);
        this.fetchData();
      } catch (error) {
        console.error("存储失败", error);
      }
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
.msg-tab {
  font-size: 30px;
  text-align: center;
}
.msgBlock {
  margin: 2px 0;
}
.msg-title {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #4A90E2, #8E44AD); /* 蓝紫渐变 */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 0 4px;
}
.msg-content {
  width: 100%;
  overflow-x: auto;
}
.text-title {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
  padding: 0 4px;
}
</style>
