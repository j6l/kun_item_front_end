import { UnwrapRef } from 'vue'

type IUseRequestOptions<T> = {
  /** 是否立即执行 */
  immediate?: boolean
  /** 初始化数据 */
  initialData?: T
}

/**
 * useRequest是一个定制化的请求钩子，用于处理异步请求和响应。
 * @param func 一个执行异步请求的函数，返回一个包含响应数据的Promise。
 * @param options 包含请求选项的对象 {immediate, initialData}。
 * @param options.immediate 是否立即执行请求，默认为false。
 * @param options.initialData 初始化数据，默认为undefined。
 * @returns 返回一个对象{loading, error, data, run}，包含请求的加载状态、错误信息、响应数据和手动触发请求的函数。
 */
export function useRequest<T>(
  func: () => Promise<IResData<T>>,
  options: IUseRequestOptions<T> = { immediate: false },
) {
  const loading = ref(false)
  const error = ref(false)
  const data = ref<T>(options.initialData)
  const run = async () => {
    loading.value = true
    return func()
      .then((res) => {
        data.value = res.data as UnwrapRef<T>
        error.value = false
        return data.value
      })
      .catch((err) => {
        error.value = err
        throw err
      })
      .finally(() => {
        loading.value = false
      })
  }

  options.immediate && run()
  return { loading, error, data, run }
}

export function easyRequest<T>(func: () => Promise<IResData<T>>) {
  return new Promise((resolve, reject) => {
    func()
      .then((res) => {
        if (res.code === 200) {
          resolve(res.data as UnwrapRef<T>)
        } else if (res.code === 401) {
          // 401错误  -> 清理用户信息，跳转到登录页
          // userStore.clearUserInfo()
          uni.showToast({
            icon: 'error',
            title: '登录失效',
          })
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res.msg)
        } else {
          uni.showToast({
            title: res.msg,
            icon: 'error',
          })
          reject(res.msg)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}
