<template>
  <div class="invoice-records-wrapper">
    <div class="invoice-records">
      <el-row class="records-search" :gutter="40">
        <el-col class="invoice-records-date" :span="11">
          <span class="records-search-label">离店日期</span>
          <el-date-picker
            class="records-date-input startdate-input"
            v-model="recordsValue.startDate"
            type="date"
            placeholder="年/月/日"
            value-format="yyyy-MM-dd"
            prefix-icon="time-icon"
            :editable="false"
            :clearable="false"
            ref="startDateRef"/>&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;&nbsp;&nbsp;
          <el-date-picker
            class="records-date-input"
            v-model="recordsValue.endDate"
            type="date"
            placeholder="年/月/日"
            value-format="yyyy-MM-dd"
            prefix-icon="time-icon"
            :editable="false"
            :clearable="false"/>
        </el-col>
        <el-col class="invoice-status" :span="7">
          <span class="records-search-label">发票状态</span>
          <el-select class="order-status-input" v-model="recordsValue.invoiceStatus" placeholder="请选择">
            <el-option
              v-for="item in statuOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="handleSearch" :disabled="queryButton">查询</el-button>
        </el-col>
      </el-row>
      <div class="records-content" v-loading="loading">
        <el-table :data="recordsList.data" border style="width: 100%">
          <el-table-column label="开票时间" width="190" align="center">
            <template slot-scope="scope">
              {{formatDate(scope.row.createDate, 'yyyy-MM-dd')}}
            </template>
          </el-table-column>
          <el-table-column label="发票性质" width="180" align="center">
            <template slot-scope="scope">
              {{fomatInvoiceType(scope.row.invoiceType)}}
            </template>
          </el-table-column>
          <el-table-column label="发票抬头" prop="invoiceTitle" width="220" align="center">
          </el-table-column>
          <el-table-column label="发票金额" width="149" align="center">
            <template slot-scope="scope">
              {{fomatMoney(scope.row.invoiceMoney)}}
            </template>
          </el-table-column>
          <el-table-column label="包含订单" width="140" align="center">
            <template slot-scope="scope">
              共{{scope.row.orderCount}}单
            </template>
          </el-table-column>
          <el-table-column label="发票状态" width="150" align="center">
            <template slot-scope="scope">
              <span :style="`color: ${formatInvoiceStatus(scope.row.invoiceStatus).invoiceStatusDescColor}`">
                {{formatInvoiceStatus(scope.row.invoiceStatus).invoiceStatusDesc}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="订单明细" width="150" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="toOrderListByInvoiceId(scope.row.id)">查看</el-button>
              <el-button v-if="scope.row.invoiceStatus === 6" size="mini" type="primary" @click="jump(scope.row.nnInvoiceUrl)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
        <TablePagination :tableCount="recordsList.count" :getList="getInvoiceListData" :pageIndex="pageIndex"/>
      </div>
    </div>
  </div>
</template>

<script>
import { getInvoiceList } from '@/api/invoice.js'
import { mapGetters, mapMutations } from 'vuex'
import { dateFormat } from '@/util/lobal'
import TablePagination from '@/components/TablePagination.vue'

export default {
  name: 'InvoiceRecords',
  components: {
    TablePagination
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      recordsValue: {
        startDate: '',
        endDate: '',
        invoiceStatus: 0
      },
      statuOptions: [
        {
          value: 0,
          label: '全部'
        },
        // {
        //   value: 1,
        //   label: '待审核'
        // },
        // {
        //   value: 2,
        //   label: '已开票'
        // },
        // {
        //   value: 3,
        //   label: '已邮寄'
        // },
        // {
        //   value: 4,
        //   label: '审核不通过'
        // }
        {
          value: 5,
          label: '开票中'
        },
        {
          value: 6,
          label: '开票成功'
        },{
          value: 7,
          label: '开票失败'
        }
      ],
      recordsList: {
        count: 0,
        data: []
      },
      pageIndex: 1,
      loading: false,
			queryButton: false,
    }
  },
  computed: {
    ...mapGetters([
      'accountId'
    ])
  },
  watch: {
    accountId(value) {
      if(value) {//退出登录时不请求接口
        this.getInvoiceListData()
      } else {
        this.$router.push('/')
      }
    },
    'recordsValue.startDate'(val, old) {
      if(this.recordsValue.endDate) {
        let startTimestamp = new Date(val.replace(/\//g, '-')).getTime()
        let endTimestamp = new Date(this.recordsValue.endDate.replace(/\//g, '-')).getTime()
        if(startTimestamp >= endTimestamp) {
          this.$message({
            message: '开始时间不能晚于或等于结束时间',
            type: 'warning'
          })
          this.recordsValue.startDate = old
        }
      }
    },
    'recordsValue.endDate'(val, old) {
      if(this.recordsValue.startDate) {
        let startTimestamp = new Date(this.recordsValue.startDate.replace(/\//g, '-')).getTime()
        let endTimestamp = new Date(val.replace(/\//g, '-')).getTime()
        if(startTimestamp >= endTimestamp) {
          this.$message({
            message: '开始时间不能晚于或等于结束时间',
            type: 'warning'
          })
          this.recordsValue.endDate = old
        }
      }
    }
  },
  created() {
    if(!this.userInfo.status){
      this.setState({
        key: 'dialogLoginVisible',
        value: true,
        module: 'user'
      })
    } else if(this.accountId.length > 0) {
      this.getInvoiceListData()
    }
  },
  methods: {
    ...mapMutations([ 'setState' ]),
    jump (url) {
      window.open(url)
    },
    getInvoiceListData({
      page = 1,
      limit = 10,
      state = 0,
      userId = this.accountId,
      startDate = '',
      endDate = ''
    } = {} ) {
      this.loading = true
      this.queryButton = true
      getInvoiceList({
        page,
        limit,
        state,
        userId,
        startDate,
        endDate
      }).then(res => {
        this.loading = false
				this.queryButton = false
				this.pageIndex = page
        if(res.data.code === 0){
          this.recordsList = { ...res.data.data }
        }else{
          if (res.data.msg) {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        }
      })
    },
    formatDate(dateTime) {
      return dateFormat(new Date(dateTime))
    },
    fomatInvoiceType(invoiceType) {
      let invoiceTypeDesc
      switch(invoiceType) {
        case 0:
          invoiceTypeDesc = '电子发票'
          break
        case 1:
          invoiceTypeDesc = '增值税普通发票'
          break
        case 2:
          invoiceTypeDesc = '增值税专用发票'
          break
        default:
          invoiceTypeDesc = '查询失败'
          break
      }
      return invoiceTypeDesc
    },
    formatInvoiceStatus(invoiceStatus) {
      let invoiceStatusDesc, invoiceStatusDescColor
      switch(invoiceStatus) {
        case 0:
          invoiceStatusDesc = '全部'
          break
        case 1:
          invoiceStatusDesc = '待审核'
          invoiceStatusDescColor = '#cfde2b'
          break
        case 2:
          invoiceStatusDesc = '审核通过'
          invoiceStatusDescColor = '#00de00'
          break
        case 3:
          invoiceStatusDesc = '已邮寄'
          invoiceStatusDescColor = '#4A9FF8'
          break
        case 4:
          invoiceStatusDesc = '审核不通过'
          invoiceStatusDescColor = '#de1211'
          break
        case 5:
          invoiceStatusDesc = '开票中'
          invoiceStatusDescColor = '#cfde2b'
          break
        case 6:
          invoiceStatusDesc = '开票成功'
          invoiceStatusDescColor = '#00de00'
          break
        case 7:
          invoiceStatusDesc = '开票失败'
          invoiceStatusDescColor = '#de1211'
          break
        default:
          invoiceStatusDesc = '查询失败'
          break
      }
      return {
        invoiceStatusDesc,
        invoiceStatusDescColor
      }
    },
    fomatMoney(invoiceMoney) {
      return `￥${parseInt(invoiceMoney/100)}.00`
    },
    handleSearch() {
      if(this.recordsValue.startDate && this.recordsValue.endDate && this.recordsValue.startDate >= this.recordsValue.endDate) {
        this.$message({
          message: '开始时间不能晚于或等于结束时间',
          type: 'warning'
        })
        this.$refs.startDateRef.focus()
      }else{
        this.getInvoiceListData({
          startDate: this.recordsValue.startDate,
          endDate: this.recordsValue.endDate,
          state: this.recordsValue.invoiceStatus
        })
      }
    },
    toOrderListByInvoiceId(id) {
      this.$router.push({
        name: 'OrderListByInvoiceId',
        query: {
          invoiceId: id
        }
      })
    }
  }
}
</script>

<style lang="less">
  .invoice-records-wrapper{
    width: 100%;
    background-color: #fff;
    .invoice-records{
      width: 1180px;
      margin: 0 auto;
      .records-search{
        padding: 30px 0;
        .invoice-records-date{
          .records-date-input{
            width: 177px;
          }
          .startdate-input{
            input{
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }
          }

        }
        .records-search-label{
          display: inline-block;
          height: 40px;
          line-height: 1;
          padding: 12px 30px;
          background-color: #fbfbfb;
          border: 0.5px solid #e6e6e6;
          border-radius: 2px 0 0 2px;
          border-right: none;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          font-size: 14px;
        }
        .invoice-status{
          .order-status-input{
            width: 197px;
            input{
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }
          }
        }
      }
    }
  }
</style>
