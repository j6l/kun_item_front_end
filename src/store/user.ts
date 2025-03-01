import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface IUserInfo {
  token: string
  refreshtoken: string
  nickname: string
  avatar: string
}
const initState = { nickname: '', token: '', refreshtoken: '', avatar: '' }

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<IUserInfo>({ ...initState })

    const setUserInfo = (val: IUserInfo) => {
      userInfo.value = val
      console.log('setUserInfo', userInfo.value)
    }
    const setToken = (val: string, refreshval: string) => {
      userInfo.value.token = val
      if (refreshval) {
        userInfo.value.refreshtoken = refreshval
      }
      console.log('setToken', userInfo.value)
    }

    const clearUserInfo = () => {
      userInfo.value = { ...initState }
    }
    // 一般没有reset需求，不需要的可以删除
    const reset = () => {
      userInfo.value = { ...initState }
    }
    const isLogined = computed(() => !!userInfo.value.token)

    return {
      userInfo,
      setUserInfo,
      setToken,
      clearUserInfo,
      isLogined,
      reset,
    }
  },
  {
    persist: true,
  },
)
