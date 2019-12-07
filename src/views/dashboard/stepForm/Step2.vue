<template>
  <div>
    <a-spin :spinning="spinning" tip="上传中...">
      <a-form layout="vertical" :form="form" style="max-width: 500px; margin: 40px auto 0;">
        <a-alert
          :closable="true"
          message="请确保您上传的证件真实有效"
          style="margin-bottom: 24px;"
          type="error"
        />
        <a-form-item
          label="营业执照副本"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          class="stepFormText"
        >
		<img style="height: 150px;" alt="example" src="https://askyisheng.oss-cn-hangzhou.aliyuncs.com/yyzz.jpeg" />
          <a-upload
            v-decorator="['yyzz', { rules: [{required: true, message: '营业执照副本必填'}] }]"
            accept="image/*"
            name="file"
            action="https://askapp.wxori.top/index/uploadfile"
            list-type="picture"
            @change="handleChange"
            :fileList="fileyyzz"
          >
            <a-button> <a-icon type="upload" /> 点击上传 </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item
          label="药品经营许可证"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          class="stepFormText"
        >
        <img style="height: 150px;" alt="example" src="https://askyisheng.oss-cn-hangzhou.aliyuncs.com/ypjyxkz.jpeg" />
          <a-upload
            v-decorator="['ypjyxkz', { rules: [{required: true, message: '药品经营许可证必填'}] }]"
            accept="image/*"
            name="file"
            action="https://askapp.wxori.top/index/uploadfile"
            list-type="picture"
            @change="handleChange2"
            :fileList="fileypjyxkz"
          >
            <a-button> <a-icon type="upload" /> 点击上传 </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item
          label="药品质量管理规范证书"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          class="stepFormText"
        >
        <img style="height: 150px;" alt="example" src="https://askyisheng.oss-cn-hangzhou.aliyuncs.com/ypzlglgf.jpg" />
          <a-upload
            v-decorator="['ypzlglgf', { rules: [{required: true, message: '药品质量管理规范证书必填'}] }]"
            accept="image/*"
            name="file"
            action="https://askapp.wxori.top/index/uploadfile"
            list-type="picture"
            @change="handleChange3"
            :fileList="fileypzlglgf"
          >
            <a-button> <a-icon type="upload" /> 点击上传 </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item
          label="医疗器械经营许可证"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          class="stepFormText"
        >
        <img style="height: 150px;" alt="example" src="https://askyisheng.oss-cn-hangzhou.aliyuncs.com/ylqxjyxk.jpg" />
          <a-upload
            v-decorator="['ylqx']"
            accept="image/*"
            name="file"
            action="https://askapp.wxori.top/index/uploadfile"
            list-type="picture"
            @change="handleChange4"
            :fileList="fileylqx"
          >
            <a-button> <a-icon type="upload" /> 点击上传 </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item
          label="食品经营许可证"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          class="stepFormText"
        >
        <img style="height: 150px;" alt="example" src="https://askyisheng.oss-cn-hangzhou.aliyuncs.com/spjyxk.jpg" />
          <a-upload
            v-decorator="['spjy']"
            accept="image/*"
            name="file"
            action="https://askapp.wxori.top/index/uploadfile"
            list-type="picture"
            @change="handleChange5"
            :fileList="filespjy"
          >
            <a-button> <a-icon type="upload" /> 点击上传 </a-button>
          </a-upload>
        </a-form-item>
        <a-divider />

        <a-form-item :wrapperCol="{span: 19, offset: 5}">
          <a-button :loading="loading" type="primary" @click="nextStep">提交</a-button>
          <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script>
import { saveStep2, getStep2 } from '@/api/login'
export default {
  name: 'Step2',
  data () {
    return {
      // labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      // wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      labelCol: {},
      wrapperCol: {},
      form: this.$form.createForm(this),
      loading: false,
      timer: 0,
      fileyyzz: [],
      fileypjyxkz: [],
      fileypzlglgf: [],
      fileylqx: [],
      filespjy: [],
      spinning: false
    }
  },
  mounted () {
    getStep2({ 'token': this.$store.getters.token }).then(res => {
      this.fileyyzz.push(res.data.fileyyzz)
      this.fileypjyxkz.push(res.data.fileypjyxkz)
      this.fileypzlglgf.push(res.data.fileypzlglgf)
      res.data.fileylqx.url !== '' && this.fileylqx.push(res.data.fileylqx)
      res.data.filespjy.url !== '' && this.filespjy.push(res.data.filespjy)
    })
  },
  methods: {
    handleChange (info) {
      this.gospinning(info)
      if (info.fileList.length > 0) {
        let fileyyzz = [...info.fileList]
        let status = 0
        // 1. Limit the number of uploaded files
        //    Only to show two recent uploaded files, and old ones will be replaced by the new
        fileyyzz = fileyyzz.slice(-1)
        // 2. read from response and show file link
        fileyyzz = fileyyzz.map(file => {
          if (file.response) {
            if (file.response.code !== '0') {
              this.$message.error(`${file.response.msg}.`)
              status = 1
            } else {
              file.url = file.response.data.yt
            }
          }
          return file
        })
        this.fileyyzz = status === 1 ? [] : fileyyzz
      } else {
        this.fileyyzz = []
      }
    },
    handleChange2 (info) {
      this.gospinning(info)
      if (info.fileList.length > 0) {
        let fileypjyxkz = [...info.fileList]
        let status = 0
        // 1. Limit the number of uploaded files
        //    Only to show two recent uploaded files, and old ones will be replaced by the new
        fileypjyxkz = fileypjyxkz.slice(-1)
        // 2. read from response and show file link
        fileypjyxkz = fileypjyxkz.map(file => {
          if (file.response) {
            if (file.response.code !== '0') {
              this.$message.error(`${file.response.msg}.`)
              status = 1
            } else {
              file.url = file.response.data.yt
            }
          }
          return file
        })
        this.fileypjyxkz = status === 1 ? [] : fileypjyxkz
      } else {
        this.fileypjyxkz = []
      }
    },
    handleChange3 (info) {
      this.gospinning(info)
      if (info.fileList.length > 0) {
        let fileypzlglgf = [...info.fileList]
        let status = 0
        // 1. Limit the number of uploaded files
        //    Only to show two recent uploaded files, and old ones will be replaced by the new
        fileypzlglgf = fileypzlglgf.slice(-1)
        // 2. read from response and show file link
        fileypzlglgf = fileypzlglgf.map(file => {
          if (file.response) {
            if (file.response.code !== '0') {
              this.$message.error(`${file.response.msg}.`)
              status = 1
            } else {
              file.url = file.response.data.yt
            }
          }
          return file
        })
        this.fileypzlglgf = status === 1 ? [] : fileypzlglgf
      } else {
        this.fileypzlglgf = []
      }
    },
    handleChange4 (info) {
      this.gospinning(info)
      if (info.fileList.length > 0) {
        let fileylqx = [...info.fileList]
        let status = 0
        // 1. Limit the number of uploaded files
        //    Only to show two recent uploaded files, and old ones will be replaced by the new
        fileylqx = fileylqx.slice(-1)
        // 2. read from response and show file link
        fileylqx = fileylqx.map(file => {
          if (file.response) {
            if (file.response.code !== '0') {
              this.$message.error(`${file.response.msg}.`)
              status = 1
            } else {
              file.url = file.response.data.yt
            }
          }
          return file
        })
        this.fileylqx = status === 1 ? [] : fileylqx
      } else {
        this.fileylqx = []
      }
    },
    handleChange5 (info) {
      this.gospinning(info)
      if (info.fileList.length > 0) {
        let filespjy = [...info.fileList]
        let status = 0
        // 1. Limit the number of uploaded files
        //    Only to show two recent uploaded files, and old ones will be replaced by the new
        filespjy = filespjy.slice(-1)
        // 2. read from response and show file link
        filespjy = filespjy.map(file => {
          if (file.response) {
            if (file.response.code !== '0') {
              this.$message.error(`${file.response.msg}.`)
              status = 1
            } else {
              file.url = file.response.data.yt
            }
          }
          return file
        })
        this.filespjy = status === 1 ? [] : filespjy
      } else {
        this.filespjy = []
      }
    },
    gospinning (info) {
      if (info.file.status === 'uploading') { this.spinning = true }
      if (info.file.status === 'done') { this.spinning = false }
    },
    nextStep () {
      const that = this
      console.log(this.fileyyzz)
      if (this.fileyyzz.length < 1) {
        this.form.setFieldsValue({
          'yyzz': null
        })
      } else {
        this.form.setFieldsValue({
          'yyzz': this.fileyyzz[0].url
        })
      }
      if (this.fileypjyxkz.length < 1) {
        this.form.setFieldsValue({
          'ypjyxkz': null
        })
      } else {
        this.form.setFieldsValue({
          'ypjyxkz': this.fileypjyxkz[0].url
        })
      }
      if (this.fileypzlglgf.length < 1) {
        this.form.setFieldsValue({
          'ypzlglgf': null
        })
      } else {
        this.form.setFieldsValue({
          'ypzlglgf': this.fileypzlglgf[0].url
        })
      }
      if (this.fileylqx.length < 1) {
        this.form.setFieldsValue({
          'ylqx': null
        })
      } else {
        this.form.setFieldsValue({
          'ylqx': this.fileylqx[0].url
        })
      }
      if (this.filespjy.length < 1) {
        this.form.setFieldsValue({
          'spjy': null
        })
      } else {
        this.form.setFieldsValue({
          'spjy': this.filespjy[0].url
        })
      }
      const { form: { validateFields } } = this
      that.loading = true
      validateFields((err, values) => {
        if (!err) {
          values.token = this.$store.getters.token
          saveStep2(values).then(res => {
            if (res.code !== '0') {
              this.$notification['error']({
                message: '错误',
                description: res.msg || '请求出现错误，请稍后再试',
                duration: 4
              })
            } else {
              this.$emit('nextStep')
            }
          }).finally(res => {
            that.loading = false
          })
        } else {
          that.loading = false
        }
      })
    },
    prevStep () {
      this.$emit('prevStep')
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 24px;
    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }
</style>
