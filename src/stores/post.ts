import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import api from '@/assets/script/api';

const generateID = (list: []): number => {
  const idList = list.map((data: any) => data.id);
  let id: number = 1;
  while (idList.includes(id)) { id++; }
  return id;
};

export const usePostStore = defineStore('post', () => {
  // State
  const post = reactive<{ list: any }>({ list: [] });

  // Getters
  const list = computed(() => post.list);

  // Actions
  const getList = async () => {
    try {
      api.main.cancelCurrentApiCall();
      const response: any = await api.main.get({ url: '/posts' });
      if (response?.status === 200) {
        post.list = response?.data.reverse();
        return response;
      }
    } catch (error) {
      // console.log(error);
      return error;
    }
  };
  const addData = async (data: any) => {
    try {
      api.main.cancelCurrentApiCall();
      const response: any = await api.main.post({ url: '/posts', data });
      if (response?.status === 200 || response?.status === 201) {
        post.list = [ ({ ...response.data, id: generateID(post.list as []) } as never), ...post.list ];
        return response;
      }
    } catch (error) {
      // console.log(error);
      return error;
    }
  };
  const updateData = async (data: any) => {
    try {
      api.main.cancelCurrentApiCall();
      const response: any = await api.main.put({ url: `/posts/${((data.id < 1 || data.id > 100) ? 100 : data.id)}`, data });
      if (response?.status === 200 || response?.status === 201) {
        const index = post.list.findIndex((value: any) => value.id === data.id);
        post.list[index] = { ...data };
        return response;
      }
    } catch (error) {
      // console.log(error);
      return error;
    }
  };
  const deleteData = async (id: number) => {
    try {
      api.main.cancelCurrentApiCall();
      const response: any = await api.main.delete({ url: `/posts/${id}` });
      if (response?.status === 200) {
        post.list = post.list.filter((data: any) => data?.id !== id);
        return response;
      }
    } catch (error) {
      // console.log(error);
      return error;
    }
  };
  const clearStore = () => {
    post.list = [];
  };
  
  return { list, getList, addData, updateData, deleteData, clearStore };
});
