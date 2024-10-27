<template>
  <div class="welcome">
    <h1 style="align-items: center;">加入聊天室</h1>
    <el-form label-width="auto" style="max-width: 600px" size="large">
      <el-form-item label="用户名">
        <el-input v-model="chatInfo.username" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item label="房&nbsp;&nbsp;&nbsp;&nbsp;间">
        <el-select v-model="chatInfo.selectRoom" filterable allow-create default-first-option :reserve-keyword="false"
          placeholder="请输入或选择加入房间" style="width: 240px">
          <el-option v-for="room in chatInfo.rooms" :key="room" :label="room" :value="room" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-button type="primary" round @click="enterRoom">进入房间</el-button>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onMounted } from 'vue';
import { fetchData, HttpMethod, Address } from '@/assets/request.js';
import { useRouter } from 'vue-router'; // 导入 useRouter

const router = useRouter();

const chatInfo = reactive({
  username: '',
  rooms: [],
  selectRoom: ref([])
})

async function enterRoom() {
  if (!chatInfo.username || !chatInfo.selectRoom) {
    alert('请输入用户名或选择房间');
    return;
  }
  const url = `${Address}/user/joinroom?username=${chatInfo.username}&roomname=${chatInfo.selectRoom}`;
  fetchData(url, HttpMethod.GET).then(response => {
    alert(response.data.info);
    router.push({ name: 'chatroom', params: { username: chatInfo.username, roomname: chatInfo.selectRoom, msgid : response.data.msgId} });
  }).catch(error => {
    alert(error.response.data)
  });
}
// // 在组件挂载后调用函数
onMounted(() => {
  //获取初始数据
  /**
   * 1. 获取可进入房间
   */
  const url = `${Address}/room/roomlist`;
  fetchData(url, HttpMethod.GET).then(response => {
    chatInfo.rooms = response.data;
    // console.log(response.data)
  }).catch(error => {
    console.error('发生错误:', error);
  });
});
</script>

<style scoped>
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 800px;
  height: 100%;
  max-height: 320px;
  /* 增加最大宽度 */
  margin: 10% auto 0;
  font-size: 1.6em;
}
</style>