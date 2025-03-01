import { CustomRequestOptions } from '@/interceptors/request'
import { IUserInfo, useUserStore } from '@/store'
import { UnwrapRef } from 'vue'

function refreshtoken(options: CustomRequestOptions, resolve, reject) {
  const userStore = useUserStore()
  const { refreshtoken } = userStore.userInfo
  if (refreshtoken) {
    httpPost('/openapi/refreshtoken', {
      refreshtoken: userStore.userInfo.refreshtoken,
    })
      .then((res) => {
        if (res.code === 200) {
          userStore.setToken(res.data.token, res.data.refreshtoken)
          http(options)
            .then((res) => {
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
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
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res.msg)
        }
      })
      .catch((err) => {
        reject(err)
      })
  }
}

export const http = <T>(options: CustomRequestOptions) => {
  // 1. 返回 Promise 对象
  return new Promise<IResData<T>>((resolve, reject) => {
    uni.request({
      ...options,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      // 响应成功
      success(res) {
        console.log('res', res)
        // 状态码 2xx，参考 axios 的设计
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 2.1 提取核心数据 res.data
          resolve(res.data as IResData<T>)
        } else if (res.statusCode === 401) {
          // 401错误  -> 清理用户信息，跳转到登录页
          // userStore.clearUserInfo()
          uni.showToast({
            icon: 'error',
            title: '登录失效',
          })
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else if (res.statusCode === 409) {
          refreshtoken(options, resolve, reject)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          !options.hideErrorToast &&
            uni.showToast({
              icon: 'none',
              title: (res.data as IResData<T>).msg || '请求错误',
            })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        console.log('res', err)
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @returns
 */
export const httpGet = <T>(url: string, query?: Record<string, any>) => {
  return http<T>({
    url,
    query,
    method: 'GET',
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数，post请求也支持query，很多微信接口都需要
 * @returns
 */
export const httpPost = <T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
) => {
  return http<T>({
    url,
    query,
    data,
    method: 'POST',
  })
}

http.get = httpGet
http.post = httpPost
