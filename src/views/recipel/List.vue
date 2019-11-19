<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="订单号">
              <a-input v-model="queryParam.sn" placeholder="输入订单号"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="订单状态">
              <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                <a-select-option value="-1">全部</a-select-option>
                <a-select-option :value="index" v-for="(item,index) in orderstatus" :key="index">{{ item }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="医生姓名">
                <a-input-number v-model="queryParam.doctorname" style="width: 100%" placeholder="输入医生姓名"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="省/市/区">
                <a-cascader
                  :options="options"
                  @change="onChange"
                  changeOnSelect
                  placeholder="请选择"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="订单类型">
                <a-select v-model="queryParam.type" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">中西成药</a-select-option>
                  <a-select-option value="2">饮片</a-select-option>
                  <a-select-option value="3">中药配方颗粒</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
      :scroll="{ x: 2000 }"
    >
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <span slot="description" slot-scope="text">
        <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">配置</a>
          <a-divider type="vertical" />
          <a @click="handleSub(record)">订阅报警</a>
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getRecipelList, getPca } from '@/api/manage'

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      options: [],
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      orderstatus: ['待完善信息', '已完善待药师审核', '已审核待输入价格', '待用户支付', '已支付待发货', '已发货', '已完成', '已取消', '待医生完善'],
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'id',
          width: 100
        },
        {
          title: '患者姓名',
          dataIndex: 'nickname',
          width: 100
        },
        {
          title: '医生姓名',
          dataIndex: 'doctorname',
          width: 200
        },
        {
          title: '病状',
          dataIndex: 'illness',
          width: 250
        },
        {
          title: '类型',
          dataIndex: 'type',
          width: 100
        },
        {
          title: '生活指导',
          dataIndex: 'lifeguide',
          width: 200
        },
        {
          title: '注意事项',
          dataIndex: 'careinfo',
          width: 200
        },
        {
          title: '总额',
          dataIndex: 'amount',
          customRender: (text) => text + '元',
          width: 100
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 200
        },
        {
          title: '配送方式',
          dataIndex: 'sendtype',
          width: 200
        },
        {
          title: '用药时间',
          width: 150,
          dataIndex: 'create_time'
        },
        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getRecipelList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.data
          })
      }
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
    getPca({ 'pid': 0 }).then(res => {
      this.options = res.data
    })
  },
  methods: {
    onChange (value) {
      this.queryParam.province = value[0] || ''
      this.queryParam.city = value[1] || ''
      this.queryParam.area = value[2] || ''
    },
    handleEdit (record) {
      console.log(record)
      this.$refs.modal.edit(record)
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
