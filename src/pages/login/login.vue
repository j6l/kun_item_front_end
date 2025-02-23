<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '登录',
  },
}
</route>
<template>
  <view
    class="overflow-hidden pt-2 px-4 bg-gray-100"
    :style="{ marginTop: safeAreaInsets?.top + 'px', height: '87vh' }"
  >
    <view class="img-a">
      <view class="t-b">
        您好，
        <br />
        欢迎使用!
      </view>
    </view>
    <view class="login-view">
      <view class="t-login">
        <form class="cl">
          <view class="t-a">
            <text class="txt">用户名</text>
            <input
              name="username"
              placeholder="请输入您的用户名"
              maxlength="11"
              v-model="loginForm.username"
            />
          </view>
          <view class="t-a">
            <text class="txt">密码</text>
            <input
              type="password"
              name="code"
              maxlength="18"
              placeholder="请输入您的密码"
              v-model="loginForm.password"
            />
          </view>
          <button @tap="login()">登 录</button>
          <!-- <view class="reg" @tap="reg()">短信登录</view> -->
        </form>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { TestEnum } from '@/typings'
import { empty } from '@/utils/test'
import { httpPost } from '@/utils/http'
import { useUserStore, IUserInfo } from '@/store'

defineOptions({
  name: 'userLogin',
})
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

onLoad(() => {
  console.log(TestEnum.A)
})

const loginForm = reactive({
  username: 'admin',
  password: '123456',
})

function login() {
  if (empty(loginForm.username)) {
    uni.showToast({
      title: '用户名不能为空',
      icon: 'none',
    })
  } else if (empty(loginForm.password)) {
    uni.showToast({
      title: '密码不能为空',
      icon: 'none',
    })
  } else {
    httpPost('/openapi/login', loginForm)
      .then((res) => {
        console.log(res)
        if (+res.code === 200) {
          uni.showToast({
            title: '登录成功',
            icon: 'none',
          })
          useUserStore().setUserInfo({
            token: res.data.token || '',
            nickname: res.data.nickname || '',
            avatar: res.data.avatar,
          })
          uni.reLaunch({
            url: '/pages/index/index',
          })
        } else {
          uni.showToast({
            title: res.msg,
            icon: 'none',
          })
        }
      })
      .catch((err) => {
        uni.showToast({
          title: err.msg,
          icon: 'none',
        })
      })
  }
}
function toNextUrl({ url }) {
  console.log(url)
  uni.navigateTo({
    url,
  })
}
</script>

<style lang="scss" scoped>
page {
  background-color: #ffffff;
}

.txt {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}
.img-a {
  width: 100%;
  height: 450rpx;
  background-image: url(https://zhoukaiwen.com/img/loginImg/head.png);
  background-size: 100%;
}
.reg {
  font-size: 28rpx;
  color: #fff;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 50rpx;
  font-weight: bold;
  background: #f5f6fa;
  color: #000000;
  text-align: center;
  margin-top: 30rpx;
}

.login-view {
  width: 100%;
  position: relative;
  margin-top: -120rpx;
  background-color: #ffffff;
  border-radius: 8% 8% 0% 0;
}

.t-login {
  width: 600rpx;
  margin: 0 auto;
  font-size: 28rpx;
  padding-top: 80rpx;
}

.t-login button {
  font-size: 28rpx;
  background: #2796f2;
  color: #fff;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 50rpx;
  font-weight: bold;
}

.t-login input {
  height: 90rpx;
  line-height: 90rpx;
  margin-bottom: 50rpx;
  border-bottom: 1px solid #e9e9e9;
  font-size: 28rpx;
}

.t-login .t-a {
  position: relative;
}

.t-b {
  text-align: left;
  font-size: 42rpx;
  color: #ffffff;
  padding: 130rpx 0 0 70rpx;
  font-weight: bold;
  line-height: 70rpx;
}

.t-login .t-c {
  position: absolute;
  right: 22rpx;
  top: 22rpx;
  background: #5677fc;
  color: #fff;
  font-size: 24rpx;
  border-radius: 50rpx;
  height: 50rpx;
  line-height: 50rpx;
  padding: 0 25rpx;
}

.t-login .t-d {
  text-align: center;
  color: #999;
  margin: 80rpx 0;
}

.t-login .t-e {
  text-align: center;
  width: 250rpx;
  margin: 80rpx auto 0;
}

.t-login .t-g {
  float: left;
  width: 50%;
}

.t-login .t-e image {
  width: 50rpx;
  height: 50rpx;
}

.t-login .t-f {
  text-align: center;
  margin: 150rpx 0 0 0;
  color: #666;
}

.t-login .t-f text {
  margin-left: 20rpx;
  color: #aaaaaa;
  font-size: 27rpx;
}

.t-login .uni-input-placeholder {
  color: #aeaeae;
}

.cl {
  zoom: 1;
}

.cl:after {
  clear: both;
  display: block;
  visibility: hidden;
  height: 0;
  content: '\20';
}

.buttom {
  .loginType {
    display: flex;
    padding: 140rpx 0;
    justify-content: center;

    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #2979ff;
      font-size: 22rpx;
    }
  }

  .hint {
    position: absolute;
    bottom: 0;
    padding: 20rpx 40rpx;
    font-size: 20rpx;
    color: #2979ff;

    .link {
      color: #2979ff;
    }
  }
}

.clearBtn {
  margin: 0;
  padding: 0;
  line-height: 1;
  background-color: #ffffff;
}

.clearBtn::after {
  position: unset !important;
  border: unset;
}
</style>
