<script setup lang="ts">
  import { RouterView } from 'vue-router';
</script>

<template>
  <div id="auth-wrapper">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
  #auth-wrapper {
    width: auto;
    height: auto;
    padding: 20px;
    border: 1px solid #4c4d50;
    border-radius: 5px;
    box-sizing: border-box;
  }
</style>