<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 5px auto 0;" @submit="handleSubmit">
      <a-form-item
        label="药店名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-decorator="['name', { rules: [{required: true, message: '药店名称必填'}] }]"/>
      </a-form-item>
      <a-form-item
        label="联系电话"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-decorator="['tel', { rules: [{required: true, message: '联系电话必填'}] }]"/>
      </a-form-item>
      <a-form-item
        label="药店类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-checkbox
          v-decorator="[
            'ifzxy',
            {
              'initialValue':false,
              valuePropName: 'checked',
              checked: false
            },
          ]"
        >
          中西成药
        </a-checkbox>
        <a-checkbox
          v-decorator="[
            'ifzy',
            {
              'initialValue':false,
              valuePropName: 'checked',
              checked: false
            },
          ]"
        >
          饮片
        </a-checkbox>
      </a-form-item>
      <a-form-item
        label="快递"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-checkbox
          v-decorator="[
            'ifexpress',
            {
              'initialValue':false,
              valuePropName: 'checked',
              checked: false
            },
          ]"
        >
        </a-checkbox>
      </a-form-item>
      <a-form-item
        label="同城快递"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-checkbox
          v-decorator="[
            'ifintracity',
            {
              'initialValue':false,
              valuePropName: 'checked',
              checked: false
            },
          ]"
        >
        </a-checkbox>
      </a-form-item>
      <a-form-item
        label="所在地"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-cascader
          v-decorator="[
            'pca',
            {
              initialValue: defpca,
              rules: [
                { type: 'array', required: true, message: '请选择地址' },
              ],
            },
          ]"
          :options="options"
          @change="onChange"
          changeOnSelect
          placeholder="请选择"
        />
      </a-form-item>
      <a-form-item
        label="经纬度"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input :value="lng+','+lat" disabled />
        <div v-show="nomap" >
          <span style="color: red;">请选择经纬度</span>
        </div>
      </a-form-item>
      <a-form-item
        label="详细地址"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-decorator="['address', { rules: [{required: true, message: '详细地址必填'}] }]"/>
      </a-form-item>
      <a-form-item
        label="药店位置"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <baidu-map
          class="bm-view"
          style="width: 600px;height: 300px;"
          :center="center"
          :zoom="zoom"
          @click="mpoint"
          :scroll-wheel-zoom="true">
          <bm-marker :position="markerPoint" :dragging="true" animation="BMAP_ANIMATION_BOUNCE" />
          <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT" ></bm-navigation>
          <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
        </baidu-map>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button type="primary" @click="nextStep">下一步</a-button>
        <!-- <a-button html-type="submit">提交</a-button> -->
      </a-form-item>
    </a-form>
    <a-divider />
    <!-- <div class="step-form-style-desc">
      <h3>说明</h3>
      <h4>转账到支付宝账户</h4>
      <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
      <h4>转账到银行卡</h4>
      <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
    </div> -->
  </div>
</template>

<script>
import { getPca } from '@/api/manage'
import { saveStep1, getStep1 } from '@/api/login'
export default {
  name: 'Step1',
  data () {
    return {
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      options: [],
      defpca: [],
      nomap: false,
      // 百度地图
      center: '北京',
      zoom: 15,
      BMap: null,
      map: null,
      markerPoint: {
        lng: '121.4095',
        lat: '31.1796'
      },
      lng: '',
      lat: ''
    }
  },
  created () {
    getPca({ 'pid': 0 }).then(res => {
      this.options = res.data
    })
  },
  mounted () {
    getStep1({ 'token': this.$store.getters.token }).then(res => {
      if (res.code === '0') {
        const data = res.data
        this.form.setFieldsValue({ 'name': data.name })
        this.form.setFieldsValue({ 'tel': data.tel })
        this.form.setFieldsValue({ 'ifzxy': data.ifzxy === '1' })
        this.form.setFieldsValue({ 'ifzy': data.ifzy === '1' })
        this.form.setFieldsValue({ 'ifintracity': data.ifintracity === '1' })
        this.form.setFieldsValue({ 'ifexpress': data.ifexpress === '1' })
        this.defpca = [data.province, data.city, data.area]
        this.center = data.province
        this.center = data.city
        this.center = data.area
        this.markerPoint.lng = this.lng = data.longitude
        this.markerPoint.lat = this.lat = data.latitude
        this.form.setFieldsValue({ 'address': data.address })
      }
    })
  },
  methods: {
    onChange (value) {
      this.center = value[value.length - 1]
    },
    nextStep () {
      if (this.lng === '') {
        this.nomap = true
        return
      } else {
        this.nomap = false
      }
      const { form: { validateFields } } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          values.lng = this.lng
          values.lat = this.lat
          values.token = this.$store.getters.token
          console.log(values)
          saveStep1(values).then(res => {
            if (res.code !== '0') {
              this.$notification['error']({
                message: '错误',
                description: res.msg || '请求出现错误，请稍后再试',
                duration: 4
              })
            } else {
              this.$emit('nextStep')
            }
          })
        }
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      if (this.lng === '') {
        this.nomap = true
        return
      } else {
        this.nomap = false
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    mpoint (m) {
      this.markerPoint = m.point
      this.lng = m.point.lng
      this.lat = m.point.lat
    },
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      this.center = targetOption.value
      getPca({ 'pid': targetOption.id }).then(res => {
        targetOption.children = res.data
        targetOption.loading = false
        this.options = [...this.options]
      })
    }
  }
}
</script>

<style lang="less" scoped>
.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0,0,0,.45);

  h3 {
    margin: 0 0 12px;
    color: rgba(0,0,0,.45);
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
}
</style>
