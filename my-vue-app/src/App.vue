<template>
  <div id="app">
    <h1>角色状态管理</h1>

    <!-- 显示状态的表格 -->
    <table border="1" style="width: 100%; text-align: center;">
      <thead>
        <tr>
          <th>名字</th>
          <th>状态</th>
          <th>颜色</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="person in people" :key="person.name">
          <td>{{ person.name }}</td>
          <td>{{ person.status }}</td>
          <td>
            <span
              :style="{ backgroundColor: person.color, display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%' }">
            </span>
          </td>
          <td>
            <!-- 每行的「入力」按钮 -->
            <button @click="addStatusFor(person.name)">入力</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      people: [], // 存储从后端获取的状态数据
    };
  },
  methods: {
    // 获取最新状态数据
    async fetchStatuses() {
      try {
        const response = await axios.get("http://localhost:3001/api/statuses");
        this.people = response.data;
      } catch (error) {
        console.error("获取状态失败:", error);
      }
    },
    // 添加新状态
    async addStatusFor(name) {
      // 弹出输入框，获取用户输入的状态
      const newStatus = prompt(`为 ${name} 输入新的状态：`);
      if (newStatus) {
        try {
          // 发送 POST 请求，将新状态添加到数据库
          const response = await axios.post("http://localhost:3001/api/add-status", {
            name,
            status: newStatus,
          });
          console.log(response.data.message);
          this.fetchStatuses(); // 重新加载数据
        } catch (error) {
          console.error("添加状态失败:", error);
        }
      }
    },
  },
  created() {
    this.fetchStatuses(); // 页面加载时获取数据
  },
};
</script>

<style>
#app {
  margin: 20px auto;
  max-width: 600px;
  text-align: center;
  font-family: Arial, sans-serif;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
}

span {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

button {
  padding: 5px 10px;
  cursor: pointer;
}

button:hover {
  background-color: #ddd;
}
</style>





