<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '菜单',
  },
}
</route>
<template>
  <view
    class="overflow-hidden pt-2 px-4 bg-gray-100"
    :style="{ marginTop: safeAreaInsets?.top + 'px', height: '87vh' }"
  >
    <view style="display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 10rpx">
      <wd-card
        v-for="(item, index) in menulist"
        :key="index"
        class="h-8 p-0.5"
        @click="toNextUrl(item)"
      >
        <view class="centered-light-gray-bg mt-1">{{ item.name }}</view>
      </wd-card>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { TestEnum } from '@/typings'

defineOptions({
  name: 'menuList',
})
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

onLoad(() => {
  console.log(TestEnum.A)
})

const menulist = ref<Record<string, any>>([
  { name: '类别管理', url: '/pages/categories/index' },
  { name: '关于', url: '/pages/about/about' },
])

function toNextUrl({ url }) {
  console.log(url)
  uni.navigateTo({
    url,
  })
}
</script>

<style lang="scss" scoped>
.centered-light-gray-bg {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
}
</style>
