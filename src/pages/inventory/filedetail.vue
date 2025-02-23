<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '详情',
  },
}
</route>
<template>
  <view
    class="overflow-hidden pt-2 px-4 bg-gray-100"
    :style="{ marginTop: safeAreaInsets?.top + 'px' }"
  >
    <view class="mt-1">
      <wd-form ref="form" :model="editForm">
        <wd-cell-group border>
          <wd-input
            label-width="60px"
            label="名称"
            prop="name"
            maxlength="30"
            clearable
            v-model="editForm.name"
            placeholder="请输入名称"
            :rules="[{ required: true, message: '请填写名称' }]"
          />
          <wd-input
            label-width="60px"
            label="单位"
            prop="unit"
            maxlength="30"
            clearable
            v-model="editForm.unit"
            placeholder="请输入单位"
            center
          />
          <wd-input
            label-width="60px"
            label="数量"
            type="number"
            prop="cost"
            maxlength="30"
            clearable
            v-model="editForm.count"
            placeholder="请输入数量"
          />
          <wd-input
            label-width="60px"
            label="价格"
            type="number"
            prop="price"
            maxlength="30"
            clearable
            v-model="editForm.price"
            placeholder="请输入价格"
          />
          <wd-input
            label-width="60px"
            label="成本"
            type="number"
            prop="cost"
            maxlength="30"
            clearable
            v-model="editForm.cost"
            placeholder="请输入成本"
          />
          <wd-textarea
            label-width="60px"
            label="备注"
            prop="remark"
            maxlength="200"
            clearable
            v-model="editForm.remark"
            placeholder="请输入备注"
          />
        </wd-cell-group>
        <view class="footer">
          <view
            style="display: flex; justify-content: space-around; width: 98%; margin: 5rpx 10rpx"
          >
            <wd-button type="primary" @click="handleSubmit" block>保存</wd-button>
            <wd-button type="primary" @click="handleSubmit" block>保存并新增</wd-button>
          </view>
        </view>
      </wd-form>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { httpGet } from '@/utils/http'
import { Inventory } from '@/pages/inventory/entity'
import { easyRequest } from '@/hooks/useRequest'

defineOptions({
  name: 'fileDetail',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

const editFlag = ref(false)

onLoad(async (options) => {
  const { objid, title } = JSON.parse(options.params || '{}')
  console.log(options)
  if (objid) {
    getDetail(objid)
    editFlag.value = true
  }
  if (title) {
    await uni.setNavigationBarTitle({
      title,
    })
  }
})

const getDetail = async (objid: string) => {
  easyRequest<Inventory>(() => httpGet('/api/feitem/detail', { objid })).then((res) => {
    console.log(res, 'res')
  })
}

const editForm = ref({
  name: '',
  unit: '',
  count: '',
  price: '',
  cost: '',
  remark: '',
})
const form = ref()

function handleSubmit() {
  form.value
    .validate()
    .then(({ valid, errors }) => {
      if (valid) {
        uni.showToast({
          title: '校验通过',
          icon: 'none',
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1000)
      }
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}
</script>

<style>
.footer {
  padding: 12px;
}
</style>
