<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '库存',
    enablePullDownRefresh: true,
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
        cancel-txt="搜索"
        @search="onQuery"
        @cancel="onQuery"
      />
      <wd-drop-menu>
        <wd-drop-menu-item v-model="query.ctype" :options="option1" />
        <wd-drop-menu-item v-model="query.ctype2" :options="option2" />
        <wd-drop-menu-item v-model="query.ctype3" :options="option3" />
      </wd-drop-menu>
    </view>
    <view class="container">
      <view v-for="item in datalist.calsslist" :key="item.objid">
        <wd-card>
          <wd-row class="mt-1">
            <wd-col :span="8"><view class="">名称: 8</view></wd-col>
            <wd-col :span="8"><view class="">单位: 8</view></wd-col>
            <wd-col :span="8"><view class="">数量: 8</view></wd-col>
            <wd-col :span="8"><view class="">价格: 8</view></wd-col>
          </wd-row>
          <view class="" style="padding: 2px; text-align: right">
            <wd-button class="" style="margin-right: 20rpx" type="text">归档</wd-button>
            <wd-button type="text" @click="toDetail({ id: item.objid })">修改</wd-button>
          </view>
        </wd-card>
      </view>
    </view>
    <wd-fab
      type="primary"
      position="right-bottom"
      direction="top"
      :expandable="false"
      :draggable="true"
      @click="toAddDetail"
    />
  </view>
</template>

<script lang="ts" setup>
import { TestEnum } from '@/typings'
import PLATFORM from '@/utils/platform'
import { httpGet } from '@/utils/http'
import { empty } from '@/utils/test'
import { Categories, Inventory } from '@/pages/inventory/entity'
import { easyRequest } from '@/hooks/useRequest'

defineOptions({
  name: 'inventory',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

onShow(() => {
  onQuery()
})
onPullDownRefresh(() => {
  onQuery(1)
})

interface DtoList {
  calsslist: Categories[]
  felist: Map<string, Inventory>
}

const datalist = ref<DtoList>()

function onQuery(ctype: number = 0) {
  easyRequest(() => httpGet<DtoList>('/api/feitem/list', query.value)).then((res) => {
    datalist.value = res
    if (ctype === 1) {
      uni.stopPullDownRefresh()
      uni.showToast({
        title: '刷新成功',
        icon: 'none',
      })
    }
  })
}

const query = ref({
  name: '',
  ctype: 0,
  ctype2: 0,
  ctype3: 0,
})

const cancel = () => {
  query.value = {
    name: '',
    ctype: 0,
    ctype2: 0,
    ctype3: 0,
  }
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

function toDetail({ objid }) {
  uni.navigateTo({
    url:
      '/pages/inventory/filedetail?params=' +
      encodeURIComponent(
        JSON.stringify({
          title: empty(objid) ? '新增' : '修改',
          objid,
        }),
      ),
  })
}

function toAddDetail() {
  toDetail({ objid: '' })
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
