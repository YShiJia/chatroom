<template>
    <div ref="chatroom" class="chatroom">
        <div class="header">
            <span>{{ roomname + " 聊天室" }}</span>
        </div>
        <div class="msgpage">
            <TheChatMsg ref="chatMsgRef" />
        </div>
        <div class="userpage">
            <TheUserList ref="userListRef" />
        </div>
        <div class="inputpage">
            <Picker id="picker" v-if="showPicker" :data="emojiIndex" :emojiSize="18" :showPreview="false"
                :infiniteScroll="false" :i18n="emojiI18n" set="apple" @select="handleEmoji" />
            <button id="pickerButton" @click="showPicker = !showPicker"> </button>
            <textarea v-model="inputMsg" class="inputmsg" type="text" placeholder="请输入要发送的消息"></textarea>
            <button class="sendbutton" @click="sendMsgClick">发送</button>
            <div class="msgcolor">
                <span class="fontcolor">文字颜色</span>
                <input type="color" id="fontcolor" v-model="fontColor" />
            </div>
            <div class="roomcolor">
                <span class="backcolor">背景颜色</span>
                <input type="color" id="backcolor" v-model="bgColor" />
            </div>
        </div>

    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, watch } from 'vue';
import { fetchData, HttpMethod, Address } from '@/assets/request.js';
import TheChatMsg from './chat/TheChatMsg.vue';
import TheUserList from './chat/TheUserList.vue';
import data from 'emoji-mart-vue-fast/data/all.json'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'

const route = useRoute()
const showPicker = ref(false)
const chatroom = ref(null);
const bgColor = ref('#9acd32');
const fontColor = ref('#333333');
const inputMsg = ref('');
const username = route.params.username
const roomname = route.params.roomname
const startMsgId = route.params.msgid
const chatMsgRef = ref(null);
const userListRef = ref(null);

// 定义i18n
const emojiI18n = {
    search: '搜索',
    notfound: 'No Emoji Found',
    categories: {
        search: '搜索结果',
        recent: '经常使用',
        smileys: '表情与情感',
        people: '人物与身体',
        nature: '动物与自然',
        foods: '食物与饮料',
        activity: '活动',
        places: '旅行与地理',
        objects: '物品',
        symbols: '符号标志',
        flags: '旗帜',
        custom: 'Custom',
        joy: '哭笑'
    }
}
const emojiIndex = new EmojiIndex(data)
// 选中emoji
const handleEmoji = (emoji) => {
    // console.log(emoji)
    inputMsg.value += emoji.native
    showPicker.value = false 
}

onMounted(() => {
    /**
     * 1. 获取用户列表 + 房间消息
     * 2. 发送系统欢迎消息
     * 3. 开启定时器，定时更新消息列表
     */
    getRoomUserList(roomname);
    getRoomMsgList(startMsgId, roomname);
    // 定时器
    const timer = setInterval(() => {
        keepUserAlive(username, roomname)
        updateRoomData(startMsgId, roomname)
    }, 1000);
})
// 获取当前房间用户列表
const getRoomUserList = async (roomname) => {
    const url = `${Address}/room/userlist?roomname=${roomname}`;
    fetchData(url, HttpMethod.GET).then(response => {
        userListRef.value.userList = response.data;
    }).catch(error => {
        console.error('获取房间用户列表失败:', error);
    });
};
// 获取当前房间消息列表
/**
 * @param msgId 当前已获取到的最后一个消息的ID
 * @param roomname 对应的room名称
 */
const getRoomMsgList = async (msgId, roomname) => {
    const url = `${Address}/room/msglist?msgId=${msgId}&roomname=${roomname}`;
    fetchData(url, HttpMethod.GET).then(response => {
        chatMsgRef.value.msgList = response.data;
    }).catch(error => {
        console.error('获取房间消息列表失败:', error);
    });
};
// 发送消息
const sendMsg = async (msg, roomname) => {
    const url = `${Address}/room/sendmsg`;
    const data = {
        msg,
        roomname
    };
    fetchData(url, HttpMethod.POST, data).
        then(response => {
            // console.log(response.data.info);
        }).
        catch(error => {
            console.error('发送消息失败:', error);
        });

};
function sendMsgClick() {
    var msg = { id: -1, sender: username, time: new Date().toLocaleString(), content: inputMsg.value };
    // console.log(msg);
    sendMsg(msg, roomname);
    inputMsg.value = '';
}
// 心跳函数
const keepUserAlive = async (username, roomname) => {
    const url = `${Address}/user/keepalive?username=${username}&roomname=${roomname}`;
    await fetchData(url, HttpMethod.GET).then(response => {
        // console.log(response.data);
    }).catch(error => {
        console.error('心跳失败:', error);
    });
};
const updateRoomData = async (msgId, roomname) => {
    getRoomUserList(roomname);
    getRoomMsgList(msgId, roomname);
};
watch(bgColor, (newValue, oldValue) => {
    chatroom.value.style.backgroundColor = event.target.value;
});
watch(fontColor, (newValue, oldValue) => {
    chatroom.value.style.color = event.target.value;
});

</script>

<style scoped>
#pickerButton {
    position: absolute;
    z-index: 999;
    background-image: url('../../manbo.jpg');
    background-size: cover;
    margin-top: 2.5%;
    margin-left: 47%;
    height: 30%;
    width: 3%;
    border: none;
}

#picker {
    position: absolute;
    bottom: 100%;
    left: 46%;
}

#backcolor {
    position: absolute;
    align-content: center;
    margin-top: 5%;
    margin-left: 60%;
    border-width: 0;
}

.backcolor {
    position: absolute;
    align-content: center;
    margin-top: 5%;
    margin-left: 20%;
    font-size: 80%;
    font-family: 'Microsoft YaHei';
    font-weight: 1000;
}

#fontcolor {
    position: absolute;
    align-content: center;
    margin-top: 5%;
    margin-left: 60%;
    border-width: 0;
}

.fontcolor {
    position: absolute;
    align-content: center;
    margin-top: 5%;
    margin-left: 20%;
    font-size: 80%;
    font-family: 'Microsoft YaHei';
    font-weight: 1000;
}

.roomcolor {
    position: absolute;
    margin: 1%;
    margin-left: 72%;
    width: 24%;
    height: 60%;
    border-radius: 12px;
}

.msgcolor {
    position: absolute;
    margin: 1%;
    margin-left: 47%;
    width: 24%;
    height: 60%;
    border-radius: 12px;
}

.sendbutton {
    position: absolute;
    background-color: yellowgreen;
    margin: 1%;
    margin-left: 35%;
    width: 10%;
    height: 60%;
    border-color: green;
    border-radius: 12px;
}

.inputmsg {
    position: absolute;
    background-color: white;
    margin: 1%;
    width: 32%;
    height: 60%;
    overflow: hidden;
    line-height: 1.5;
    resize: none;
    border-color: yellowgreen;
    border-radius: 12px;
}

.inputpage {
    position: absolute;
    margin-top: 70%;
    margin-left: 1%;
    width: 98%;
    /* 设置userpage的宽度 */
    height: 12%;
    border-radius: 12px;
    box-shadow: 0 2px 5px white;
}

.userpage {
    position: absolute;
    margin-top: 9%;
    margin-left: 74%;
    width: 25%;
    /* 设置userpage的宽度 */
    height: 75%;
    border-radius: 12px;
    box-shadow: 0 2px 5px white;
}

.msgpage {
    position: absolute;
    margin-top: 9%;
    margin-left: 1%;
    align-self: flex-start;
    width: 72%;
    height: 75%;
    border-radius: 12px;
    box-shadow: 0 2px 5px white;
}

.header span {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.header {
    position: absolute;
    border-radius: 12px;
    width: 98%;
    height: 9%;
    min-height: 50px;
    margin: 1%;
    box-shadow: 0 2px 5px white;
    text-align: center;
}

.chatroom {
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-color: yellowgreen;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 1000px;
    height: 100%;
    max-height: 800px;
    /* 增加最大宽度 */
    margin: 2% auto 0;
    font-size: 1.6em;
}
</style>
