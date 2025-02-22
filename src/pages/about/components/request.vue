<route lang="json5">
{
  layout: 'demo',
  style: {
    navigationBarTitleText: '请求',
  },
}
</route>

<template>
  <view class="p-6 text-center">
    <view class="my-2">使用的是 laf 云后台</view>
    <view class="text-green-400">我的推荐码，可以获得佣金</view>

    <wd-button @click="run" class="my-6">发送请求</wd-button>
    <view class="h-16">
      <view v-if="loading">loading...</view>
      <block v-else>
        <view class="text-xl">请求数据如下</view>
        <view class="text-green leading-8">{{ JSON.stringify(data) }}</view>
      </block>
    </view>
    <wd-button type="error" @click="reset" class="my-6" :disabled="!data">重置数据</wd-button>
  </view>
</template>

<script lang="ts" setup>
import { IFooItem } from '@/service/index/foo'
import { httpGet } from '@/utils/http'

const recommendUrl = ref('http://laf.run/signup?code=ohaOgIX')

const initialData = undefined

const { loading, error, data, run } = useRequest<IFooItem>(
  () => httpGet('/openapi/version', { name: '菲鸽' }),
  {
    immediate: true,
    initialData,
  },
)
const reset = () => {
  data.value = initialData
}
</script>
