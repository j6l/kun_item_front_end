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
            <wd-button type="primary" @click="handleSubmit" block>保存</wd-button>
            <wd-button type="primary" @click="handleSubmit" v-if="!editFlag" block>
              保存并新增
            </wd-button>
          </view>
        </view>
      </wd-form>
    </view>
    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { useToast } from 'wot-design-uni'
import { httpGet, httpPost } from '@/utils/http'
import { Categories } from '@/pages/categories/index.vue'
import { UnwrapRef } from 'vue'

defineOptions({
  name: 'categoriesDetail',
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
    if (title) {
      await uni.setNavigationBarTitle({
        title,
      })
    }
  }
})

const getDetail = async (objid: string) => {
  const { loading, error, data, run } = useRequest<Categories>(
    () => httpGet('/api/categories/detail', { objid }),
    {
      immediate: true,
      initialData: editForm,
    },
  )
}

const editForm = ref<Categories>({
  objid: '',
  name: '',
  sort: 99,
  remark: '',
})
const toast = useToast()
const form = ref()

function handleSubmit() {
  form.value
    .validate()
    .then(({ valid, errors }) => {
      if (valid) {
        httpPost('/api/categories/update', editForm.value)
          .then((res) => {
            console.log(res)
            toast.show({
              position: 'bottom',
              msg: '提交成功',
            })
            uni.navigateBack()
          })
          .catch((err) => {
            toast.error({
              position: 'bottom',
              msg: err,
            })
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
function closePage() {
  uni.navigateBack()
}
</script>

<style>
.footer {
  padding: 12px;
}
</style>
