<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '类别管理',
  },
}
</route>
<template>
  <view
    class="overflow-hidden pt-2 px-4 bg-gray-100"
    :style="{ marginTop: safeAreaInsets?.top + 'px', height: '87vh' }"
  >
    <view class="mt-1">
      <wd-search
        v-model="query.name"
        :placeholder-left="true"
        :light="true"
        :maxlength="100"
        cancel-txt="搜索"
        @search="onQuery"
        @clear="clear"
        @cancel="onQuery"
      />
    </view>
    <view class="container">
      <view v-for="item in datalist" :key="item.objid">
        <wd-card>
          <wd-row class="mt-1">
            <wd-col :span="8">
              <view class="">名称: {{ item.name }}</view>
            </wd-col>
            <wd-col :span="8" :offset="8">
              <view class="">序号: {{ item.sort }}</view>
            </wd-col>
          </wd-row>
          <wd-row class="mt-1" v-show="item.remark">
            <wd-col :span="24">
              <view class="">备注: {{ item.remark }}</view>
            </wd-col>
          </wd-row>
          <view class="" style="padding: 2px; text-align: right">
            <wd-button type="text" @click="toDetail(item)">修改</wd-button>
          </view>
        </wd-card>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { TestEnum } from '@/typings'
import { IFooItem } from '@/service/index/foo'
import { httpGet } from '@/utils/http'

defineOptions({
  name: 'categoriesList',
})
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

onLoad(() => {
  onQuery()
})

const query = ref({
  name: '',
})

const clear = () => {
  query.value.name = ''
}

export interface Categories {
  objid: string
  name: string
  remark: string
  sort: number
}

const datalist = ref<Categories[]>()
function onQuery() {
  const { loading, error, data, run } = useRequest<Categories[]>(
    () => httpGet('/api/categories/list', query.value),
    {
      immediate: true,
      initialData: datalist,
    },
  )
}

function toDetail({ objid }) {
  uni.navigateTo({
    url:
      '/pages/categories/edit?params=' +
      encodeURIComponent(
        JSON.stringify({
          title: '修改类别',
          objid,
        }),
      ),
  })
}
</script>

<style lang="scss" scoped>
::v-deep .wd-search__cancel {
  font-size: 25rpx;
  color: #4e4e4e;
}
</style>
