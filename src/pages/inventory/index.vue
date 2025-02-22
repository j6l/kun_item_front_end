<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '库存',
  },
}
</route>
<template>
  <view
    class="overflow-hidden pt-2 px-4 bg-gray-100"
    :style="{ marginTop: safeAreaInsets?.top + 'px' }"
  >
    <view style="display: flex; justify-content: space-between; margin: 5rpx 30rpx 5rpx 50rpx">
      <view style="font-size: 20rpx; color: #ed7770">库存 {{ num }}种</view>
      <view style="font-size: 20rpx; color: #ed7770">近30天新增 {{ num }}种</view>
    </view>
    <view class="mt-1">
      <wd-search
        v-model="query.name"
        :placeholder-left="true"
        :light="true"
        :maxlength="10"
        cancel-txt="重置"
        @search="search"
        @clear="clear"
        @cancel="cancel"
      />
      <wd-drop-menu>
        <wd-drop-menu-item v-model="query.ctype" :options="option1" @change="handleChange1" />
        <wd-drop-menu-item v-model="query.ctype2" :options="option2" @change="handleChange2" />
        <wd-drop-menu-item v-model="query.ctype3" :options="option3" @change="handleChange3" />
      </wd-drop-menu>
    </view>
    <view class="container">
      <view v-for="index in num" :key="index">
        <wd-card>
          <wd-row class="mt-1">
            <wd-col :span="8"><view class="">名称: 8</view></wd-col>
            <wd-col :span="8"><view class="">单位: 8</view></wd-col>
            <wd-col :span="8"><view class="">数量: 8</view></wd-col>
            <wd-col :span="8"><view class="">价格: 8</view></wd-col>
          </wd-row>
          <wd-row>
            <wd-col :span="24">
              <view class="">备注: 这是一条测试{{ index + 1 }}</view>
            </wd-col>
          </wd-row>
          <view class="" style="padding: 2px; text-align: right">
            <wd-button class="" style="margin-right: 10rpx" type="text">归档</wd-button>
            <wd-button type="text" @click="toDetail({ id: index })">修改</wd-button>
          </view>
        </wd-card>
      </view>
      <wd-loadmore :state="state" @reload="loadmore" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { TestEnum } from '@/typings'
import PLATFORM from '@/utils/platform'

defineOptions({
  name: 'inventory',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 测试 uni API 自动引入
onLoad(() => {
  loadmore()
  console.log(TestEnum.A)
})

const state = ref<string>('loading')
const num = ref<number>(0)
const max = ref<number>(60)

onReachBottom(() => {
  if (num.value === 45) {
    state.value = 'error'
  } else if (num.value < max.value) {
    loadmore()
  } else if (num.value === max.value) {
    state.value = 'finished'
  }
})
const loadmore = () => {
  setTimeout(() => {
    num.value = num.value + 15
    state.value = 'loading'
  }, 200)
}

const query = ref({
  name: '',
  ctype: 0,
  ctype2: 0,
  ctype3: 0,
})
const search = () => {
  num.value = 0
  loadmore()
  console.log('搜索')
}
const clear = () => {
  query.value.name = ''
}
const cancel = () => {
  query.value.name = ''
  query.value.ctype = 0
  query.value.ctype2 = 0
  query.value.ctype3 = 0
  console.log(query.value)
}

const option1 = ref<Record<string, any>>([
  { label: '全部商品', value: 0 },
  { label: '新款商品', value: 1 },
  { label: '活动商品', value: 2 },
])
const option2 = ref<Record<string, any>>([
  { label: '综合', value: 0 },
  { label: '销量', value: 1 },
  { label: '上架时间', value: 2 },
])
const option3 = ref<Record<string, any>>([
  { label: '综合', value: 0 },
  { label: '销量', value: 1 },
  { label: '上架时间', value: 2 },
])

function handleChange1({ value }) {
  console.log(value)
  console.log(query.value)
}
function handleChange2({ value }) {
  console.log(value)
  console.log(query.value)
}
function handleChange3({ value }) {
  console.log(value)
  console.log(query.value)
}
function toDetail({ id }) {
  console.log(id)
  uni.navigateTo({
    url: '/pages/inventory/filedetail',
    query: {
      id,
    },
  })
}
</script>

<style lang="scss" scoped>
.main-title-color {
  color: #d14328;
}
::v-deep .wd-search__cancel {
  font-size: 25rpx;
  color: #4e4e4e;
}
</style>
