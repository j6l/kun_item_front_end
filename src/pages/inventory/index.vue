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
      <view style="font-size: 20rpx; color: #ed7770">库存 {{ headerNum.count }}种</view>
      <view style="font-size: 20rpx; color: #ed7770">近30天新增 {{ headerNum.count30 }}种</view>
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
    </view>
    <view class="container">
      <wd-collapse v-model="showclassid">
        <wd-collapse-item
          :title="item.name + '(' + item.count + ')'"
          :name="item.objid"
          v-for="item in datalist.classlist"
          :key="item.objid"
        >
          <wd-card v-for="item2 in datalist.felist[item.objid]" :key="item2.objid">
            <wd-row class="mt-1 text-xs">
              <wd-col :span="10">
                <view class="">名称: {{ item2.name }}</view>
              </wd-col>
              <wd-col :span="7">
                <view class="">单位: {{ item2.unit }}</view>
              </wd-col>
              <wd-col :span="7">
                <view class="">数量: {{ item2.ccount }}</view>
              </wd-col>
              <wd-col :span="7" :offset="10">
                <view class="" style="display: flex">
                  价格:
                  <view class="text-base">{{ item2.feprice }}</view>
                </view>
              </wd-col>
              <wd-col :span="7" @click="showFprofit(item2)">
                <view class="" style="display: flex">
                  利:
                  <view :class="{'text-base': true ,' text-rose-500':showfprofitMap[item2.objid]}">
                    {{ showfprofitMap[item2.objid] ? getFprofit(item2) : '***' }}
                  </view>
                </view>
              </wd-col>
              <wd-col :span="24">
                <view class="">备注: {{ item2.remark }}</view>
              </wd-col>
            </wd-row>
            <view class="" style="padding: 2px; text-align: right">
              <wd-button style="margin-right: 20rpx" @click="toDel(item2)" type="text">
                删除
              </wd-button>
              <wd-button type="text" @click="toDetail(item2)">修改</wd-button>
            </view>
          </wd-card>
        </wd-collapse-item>
      </wd-collapse>
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
import { httpGet, httpPost } from '@/utils/http'
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
  classlist: Categories[]
  felist: Map<string, Inventory>
}

const headerNum = reactive({
  count: 0,
  count30: 0,
})
const datalist = ref<DtoList>()

function onQuery(ctype: number = 0) {
  easyRequest(() => httpGet<DtoList>('/api/feitem/list', query.value)).then((res) => {
    showfprofitMap.value = {}
    datalist.value = res
    const classlist = datalist.value.classlist || []
    showclassid.value = classlist.length > 0 ? [classlist[0].objid] : []
    if (ctype === 1) {
      uni.stopPullDownRefresh()
      uni.showToast({
        title: '刷新成功',
        icon: 'none',
      })
    }
  })
  easyRequest(() => httpGet<DtoList>('/api/feitem/headernum', query.value)).then((res) => {
    headerNum.count = res.countall || 0
    headerNum.count30 = res.count30 || 0
  })
}

const showclassid = ref([])

const query = ref({
  name: '',
})

const showfprofitMap = ref({})

function showFprofit({ objid }) {
  showfprofitMap.value[objid] = !(showfprofitMap.value[objid] || false)
}

function getFprofit({ feprice, fecost }) {
  if (feprice && fecost) {
    return (feprice - fecost).toFixed(2)
  } else {
    return ''
  }
}

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
function toDel({ objid }) {
  uni.showModal({
    title: '提示',
    content: '确定删除?',
    success: (res) => {
      if (res.confirm) {
        easyRequest(() => httpPost('/api/feitem/del', { objid })).then((res) => {
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
