<template>
    <div id="userContainer">
        <div class="userlist">
            <span>用户列表</span>
        </div>
        <div class="userInfo" v-for="(username, index) in userList" :key="index">
            {{ username }}
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const userList = ref([])

defineExpose({
    userList
})
</script>

<style scoped>
#userContainer {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    flex-direction: column-reverse;
}

.userlist span {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2%;
    margin-bottom: 2%;
    height: 100%;
}

.userInfo {
    display: flex;
    flex-direction: row;
    gap: 4px;
    padding-left: 4%;
}
</style>