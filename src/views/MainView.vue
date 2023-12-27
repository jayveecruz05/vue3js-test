<script setup lang="ts">
  import { RouterView, useRouter } from 'vue-router';
  import { removeCookie } from '@/plugins/cookies';

  // State
  const router = useRouter();

  // Action
  const logout = () => {
    removeCookie('token');
    router.push({ name: 'auth-view' });
  };
</script>

<template>
  <div id="navigation">
    <el-button text @click="router.push({ name: 'post' });">Post</el-button>
    <el-button text @click="router.push({ name: 'about' });">About</el-button>
    <el-button text @click="logout">Logout</el-button>
  </div>
  <RouterView />
</template>

<style lang="scss" scoped>
  #navigation {
    width: 230px;
    margin: 0 auto 20px auto;
    display: flex;
  }
</style>