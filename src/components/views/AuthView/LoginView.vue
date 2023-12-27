<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { setCookie } from '@/plugins/cookies';

  // Type Checker
  type Form = {
    username: string,
    password: string
  }

  // Static Data
  const formRules = {
    username: [
      { required: true, message: 'Please input username.', trigger: 'change' }
    ],
    password: [
      { required: true, message: 'Please input password.', trigger: 'change' }
    ],
  };

  // State
  const router = useRouter();
  const formRef = ref();
  const loginForm = reactive<Form>({ username: 'admin', password: 'admin' });

  // Actions
  const generateToken = () => Math.random().toString(36).substring(2, 15);
  const handelSubmit = () => {
    formRef.value.validate((valid: boolean) => {
      if (valid) {
        setCookie('token', generateToken());
        router.push({ name: 'main-view' });
      }
    });
  };
</script>

<template>
  <div id="login-wrapper">
    <p id="title">Login</p>
    <el-form ref="formRef" :model="loginForm" :rules="formRules" @submit.prevent>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" type="text" placeholder="Username" autofocus @keyup.enter="handelSubmit" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="Password" show-password @keyup.enter="handelSubmit" />
          </el-form-item>
        </el-col>
        <el-col id="button-wrapper" :span="24">
          <el-button @click="handelSubmit">Login</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
  #login-wrapper {
    max-width: 300px;

    #title {
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 15px;
    }

    .el-row {
      .el-col {
        margin-bottom: 5px;

        &#button-wrapper {
          display: flex;
          justify-content: end;
          margin: 10px 0 5px 0;
        }
      }
    }
  }
</style>