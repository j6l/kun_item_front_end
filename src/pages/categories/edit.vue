<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" >
{
  style: {
    navigationBarTitleText: '详情',
  },
}
</route>
<template>
  <view
    class="overflow-hidden pt-2 px-4 bg-gray-100"
    :style="{ height: '100vh' }"
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
            label="序号"
            type="number"
            prop="sort"
            maxlength="5"
            clearable
            v-model="editForm.sort"
            placeholder="请输入序号"
            :rules="[{ required: true, message: '请填写序号' }]"
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
            <wd-button type="info" @click="closePage" v-if="editFlag" block>关闭</wd-button>
            <wd-button type="primary" @click="handleSubmit(0)" block>保存</wd-button>
            <wd-button type="primary" @click="handleSubmit(1)" v-if="!editFlag" block>
              保存并新增
            </wd-button>
          </view>
        </view>
      </wd-form>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { httpGet, httpPost } from '@/utils/http'
import { Categories } from '@/pages/categories/index.vue'
import { empty } from '@/utils/test'
import { easyRequest } from '@/hooks/useRequest'
import { Inventory } from '@/pages/inventory/entity'

defineOptions({
  name: 'categoriesDetail',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

const editFlag = ref(false)

onLoad(async (options) => {
  const { objid, title } = options || {}
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
  easyRequest<Categories>(() => httpGet('/api/categories/detail', { objid })).then((res) => {
    editForm.value = res
  })
}

const editForm = ref<Categories>({
  objid: '',
  name: '',
  sort: 99,
  remark: '',
})
const form = ref()

function handleSubmit(ctype: number) {
  form.value
    .validate()
    .then(({ valid, errors }) => {
      if (valid) {
        const url = editFlag.value ? '/api/categories/update' : '/api/categories/add'
        easyRequest<Inventory>(() => httpPost(url, editForm.value)).then((res) => {
          uni.showToast({
            title: '保存成功',
            icon: 'none',
          })
          if (ctype === 0) {
            uni.navigateBack()
          } else {
            editForm.value = {
              objid: '',
              name: '',
              sort: 99,
              remark: '',
            }
          }
        })
      }
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}
function closePage() {
  uni.navigateBack()
}
</script>

<style>
.footer {
  padding: 12px;
}
</style>
