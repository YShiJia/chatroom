<template>
    <div id="messageContainer">
        <div class="message" v-for="(msg, index) in msgList" :key="msg.id">
            <div class="info">
                <div class="sender">{{ msg.sender }}</div>
                <div class="time">{{ msg.time }}</div>
            </div>
            <div class="msg">{{ msg.content }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
const msgList = ref([])

// 监听 newMessage 的变化
watch(msgList, async (newValue) => {
  if (newValue) {
    await nextTick(); // 等待 DOM 更新完成
    scrollToBottom(); 
  }
});
const scrollToBottom = () => {
  const container = document.getElementById('messageContainer');
  container.scrollTop = container.scrollHeight; 
};

defineExpose({
    msgList,
})
</script>

<style scoped>
#messageContainer {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    flex-direction: column-reverse;
}

.message {
    padding-left: 2%;
}

.info {
    display: flex;
    flex-direction: row;
    gap: 8px;
}

.msg {
    border-color: green;
    border-radius: 12px;
    border-width: 2px;
    border-style: solid;
    padding: 8px 12px;
    max-width: 75%;
    word-wrap: break-word;
}
</style>