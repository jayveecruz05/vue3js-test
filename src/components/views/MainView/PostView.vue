<script setup lang="ts">
  import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
  import { usePostStore } from '@/stores/post';
  import { ElMessage, ElMessageBox } from 'element-plus'

  // Type Checker
  type Form = {
    id?: number,
    userId?: number,
    title: string,
    body: string
  }

  // Static Data
  const formRules = {
    title: [
      { required: true, message: 'Please input title.', trigger: 'change' }
    ],
    body: [
      { required: true, message: 'Please input body.', trigger: 'change' }
    ],
  };

  // Store
  const store = usePostStore();

  // State
  const isLoading = ref<boolean>(true);
  const selectedDataID = ref<number>(0);
  const dialog = reactive({ type: 'add', visible: false, loading: false });
  const formRef = ref();
  const postForm = reactive<Form>({ id: undefined, userId: undefined, title: '', body: '' });

  // Actions
  const resetForm = () => {
    postForm.id = undefined;
    postForm.userId = undefined;
    postForm.title = '';
    postForm.body = '';
    formRef?.value?.clearValidate();
  };
  const showAddForm = () => {
    resetForm();
    dialog.type = 'add';
    dialog.visible = true;
  };
  const editData = (data: any) => {
    const { id, userId, title, body } = data.row;
    postForm.id = id;
    postForm.userId = userId;
    postForm.title = title;
    postForm.body = body;
    formRef?.value?.clearValidate();
    dialog.type = 'edit';
    dialog.visible = true;
  };
  const dialogClose = () => {
    resetForm();
    dialog.visible = false;
  };
  const handelSubmit = () => {
    formRef.value.validate(async (valid: boolean) => {
      if (valid) {
        dialog.loading = true;
        const { id, userId = 1, title, body } = postForm;
        const response = await store[(dialog.type === 'edit') ? 'updateData' : 'addData']({ id, userId, title, body });
        dialog.loading = false;
        if (response.status === 201 || response.status === 200) {
          ElMessage({ type: 'success', message: `Post ${(dialog.type === 'edit') ? 'Updated' : 'Added'}.` });
          dialogClose();
        } else {
          ElMessage({ type: 'error', message: `${(dialog.type === 'edit') ? 'Update' : 'Add'} Error.` });
        }
      }
    });
  };
  const deleteData = async (data: any) => {
    selectedDataID.value = data.row.id;
    await store.deleteData(selectedDataID.value);
    selectedDataID.value = 0;
  };
  const confirm = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string, data: any) => {
    ElMessageBox.confirm(
      message,
      title,
      { confirmButtonText: 'OK', cancelButtonText: 'Cancel', type }
    ).then(async () => {
      await deleteData(data);
      ElMessage({ type: 'success', message: 'Post Deleted.' });
    }).catch(() => {
      ElMessage({ type: 'info', message: 'Delete canceled.' });
    })
  };

  onMounted(async () => {
    await store.getList();
    isLoading.value = false;
  });

  onBeforeUnmount(() => {
    store.clearStore();
  });
</script>

<template>
  <h1>Post</h1>
  <el-button id="add-button" @click="showAddForm">Add Post</el-button>
  <el-table v-loading="isLoading" id="post-table" :data="store.list" :empty-text="(isLoading) ? 'Loading Data...' : null">
    <el-table-column prop="title" label="Title" width="300" />
    <el-table-column prop="body" label="Body" width="650" />
    <el-table-column fixed="right" label="Actions" width="130">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="editData(scope)">Edit</el-button>
        <el-button link type="primary" size="small" :loading="(scope.row.id === selectedDataID)" @click="confirm('warning', 'Warning', 'Are you sure you want to delete the data. Continue?', scope)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="dialog.visible" :title="`${(dialog.type === 'edit') ? 'Update' : 'Add'} Post`" width="30%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="!dialog.loading" :before-close="dialogClose">
    <el-form ref="formRef" :model="postForm" :rules="formRules" @submit.prevent :disabled="dialog.loading">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="title">
            <el-input class="pa-1" v-model="postForm.title" type="text" placeholder="Title" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="body">
            <el-input class="pa-1" v-model="postForm.body" type="textarea" :autosize="{ minRows: 10, maxRows: 15 }" placeholder="Body" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button :disabled="dialog.loading" @click="dialogClose">Cancel</el-button>
        <el-button type="primary" :loading="dialog.loading" @click="handelSubmit">{{ (dialog.type === 'edit') ? 'Update' : 'Add' }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
  #add-button {
    display: block;
    margin: 0 0 20px auto;
  }

  #post-table {
    width: 100%;
    height: 50vh;
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
</style>