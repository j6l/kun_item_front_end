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
          <wd-picker
            label-width="60px"
            label="类别"
            prop="classid"
            :columns="classColumn"
            v-model="editForm.classid"
            value-key="objid"
            label-key="name"
            placeholder="请选择类别"
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
            prop="ccount"
            maxlength="30"
            clearable
            v-model="editForm.ccount"
            placeholder="请输入数量"
          />
          <wd-input
            label-width="60px"
            label="价格"
            type="number"
            prop="feprice"
            maxlength="30"
            clearable
            v-model="editForm.feprice"
            placeholder="请输入价格"
          />
          <wd-input
            label-width="60px"
            label="成本"
            type="number"
            prop="fecost"
            maxlength="30"
            clearable
            v-model="editForm.fecost"
            placeholder="请输入成本"
          />
          <wd-input
            label-width="60px"
            label="利润"
            type="number"
            maxlength="30"
            clearable
            disabled
            v-model="fprofitStr"
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
import { Categories, Inventory } from '@/pages/inventory/entity'
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
  findColumn()
})

const getDetail = async (objid: string) => {
  easyRequest<Inventory>(() => httpGet('/api/feitem/detail', { objid }))
    .then((res) => {
      editForm.value = res
    })
    .catch(() => {
      closePage()
    })
}
const classColumn = ref([])

function findColumn() {
  easyRequest<Categories[]>(() => httpGet('/api/categories/list')).then((res) => {
    classColumn.value = res || []
  })
}

const editForm = ref<Inventory>({
  objid: '',
  name: '',
  classid: '',
  unit: '',
  ccount: '',
  feprice: '',
  fecost: '',
  remark: '',
})
const fprofitStr = computed(() => {
  const { feprice, fecost } = editForm.value
  if (feprice && fecost) {
    return (feprice - fecost).toFixed(2)
  } else {
    return ''
  }
})
const form = ref()

function handleSubmit(ctype: number) {
  form.value
    .validate()
    .then(({ valid, errors }) => {
      if (valid) {
        const url = editFlag.value ? '/api/feitem/update' : '/api/feitem/add'
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
              classid: '',
              unit: '',
              ccount: '',
              feprice: '',
              fecost: '',
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
