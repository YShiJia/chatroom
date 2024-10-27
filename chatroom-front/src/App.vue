<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
router.push('/welcome')
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style>
#app {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
