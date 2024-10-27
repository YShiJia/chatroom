import { createRouter, createWebHistory  } from 'vue-router';
import TheChatRoom from '@/components/TheChatRoom.vue'; // 假设您有这个组件
import TheWelcome from '@/components/TheWelcome.vue'; // 假设您有这个组件


const routes = [
  {
    path: '/chatroom/:username/:roomname/:msgid',
    name: 'chatroom',
    component: TheChatRoom,
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: TheWelcome,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
