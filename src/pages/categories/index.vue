<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '类别管理',
    enablePullDownRefresh: true,
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
            <wd-button style="margin-right: 20rpx" @click="toDel(item)" type="text">
              删除
            </wd-button>
            <wd-button type="text" @click="toDetail(item)">修改</wd-button>
          </view>
        </wd-card>
      </view>
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
</template>

<script lang="ts" setup>
import { TestEnum } from '@/typings'
import { IFooItem } from '@/service/index/foo'
import { httpGet, httpPost } from '@/utils/http'
import { empty } from '@/utils/test'
import { easyRequest } from '@/hooks/useRequest'
import { Inventory } from '@/pages/inventory/entity'

defineOptions({
  name: 'categoriesList',
})
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

onShow(() => {
  onQuery()
})
onPullDownRefresh(() => {
  onQuery(1)
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

function onQuery(ctype: number = 0) {
  easyRequest<Categories[]>(() => httpGet('/api/categories/list', query.value)).then((res) => {
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

function toDel({ objid }) {
  uni.showModal({
    title: '提示',
    content: '确定删除?',
    success: (res) => {
      if (res.confirm) {
        easyRequest(() => httpPost('/api/categories/del', { objid })).then((res) => {
          uni.showToast({
            title: '删除成功',
            icon: 'none',
          })
          onQuery()
        })
      }
    },
  })
}

function toDetail({ objid }) {
  uni.navigateTo({
    url:
      '/pages/categories/edit?params=' +
      encodeURIComponent(
        JSON.stringify({
          title: empty(objid) ? '新增类别' : '修改类别',
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
:deep(.wd-search__cancel) {
  font-size: 25rpx;
  color: #4e4e4e;
}
:deep(.custom-button) {
  min-width: auto !important;
  box-sizing: border-box;
  width: 32px !important;
  height: 32px !important;
  border-radius: 16px !important;
  margin: 8rpx;
}

:deep(.custom-radio) {
  height: 32px !important;
  line-height: 32px !important;
}
</style>
