<template>
  <div class="invoice-list-wrapper">
    <div class="invoice-list">
      <div class="invoice-head-cover">
        <el-row class="invoice-head" :gutter="40">
          <el-col class="invoice-date" :span="11.5">
            <span class="invoice-date-label">离店日期</span>
            <el-date-picker
              class="invoice-date-input startdate-input"
              v-model="invoiceValue.startDate"
              type="date"
              placeholder="年/月/日"
              value-format="yyyy-MM-dd"
              :picker-options="pickerToday"
              prefix-icon="time-icon"
              :editable="false"
              :clearable="false"/>&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;&nbsp;&nbsp;
            <el-date-picker
              class="invoice-date-input"
              v-model="invoiceValue.endDate"
              type="date"
              placeholder="年/月/日"
              value-format="yyyy-MM-dd"
              :picker-options="pickerTomorrow"
              prefix-icon="time-icon"
              :editable="false"
              :clearable="false"/>
          </el-col>
          <el-col class="invoice-search-btn" :span="2.5">
            <el-button size="small" type="primary" @click="handleSearch" :disabled="queryButton">查询</el-button>
          </el-col>
          <el-col class="invoice-apply-btn" :span="5">
            <el-button type="primary" @click="toApplyInvoice">
              <i class="el-icon-document"></i>
              申请开票
            </el-button>
          </el-col>
          <el-col class="invoice-record-btn" :span="5">
            <el-button type="primary" @click="toInvoiceRecords">
              <i class="el-icon-document"></i>
              开票记录
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div v-loading="loading">
        <div class="apply-makeinvoice-cover">
          <span>申请开票金额：</span>
          <span class="apply-total-momey">￥{{applyTotalMoney}}.00</span>
        </div>
        <div class="invoice-table-cover">
          <el-table :data="invoiceList.data" border fit style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60" align="center">
            </el-table-column>
            <el-table-column label="离店日期" width="150" align="center">
              <template slot-scope="scope">
                {{formatDate(scope.row.outDate, 'yyyy-MM-dd hh:mm')}}
              </template>
            </el-table-column>
            <el-table-column label="预订人" prop="contactName" width="160" align="center">
            </el-table-column>
            <el-table-column label="酒店" prop="hotelName" width="190" align="center">
            </el-table-column>
            <el-table-column label="房型" prop="roomTypeDesc" width="179" align="center">
            </el-table-column>
            <el-table-column label="间夜" width="110" align="center">
              <template slot-scope="scope">
                {{formatNightCount(scope.row.roomCount, scope.row.night)}}
              </template>
            </el-table-column>
            <el-table-column label="订单金额"  width="120" align="center">
              <template slot-scope="scope">
                {{fomatMoney(scope.row.orderMoney)}}
              </template>
            </el-table-column>
            <el-table-column label="交易状态" width="110" align="center">
              <template slot-scope="scope">
                <span style="color: #4A9FF8;">{{scope.row.orderStatusDesc}}</span>
              </template>
            </el-table-column>
            <el-table-column label="开票状态" prop="makeInvoice" width="100" align="center">
              <template slot-scope="scope">
                <span  :style="`color: ${formatMakeInvoice(scope.row.makeInvoice).invoiceColor}`">
                  {{formatMakeInvoice(scope.row.makeInvoice).makeInvoiceDesc}}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <TablePagination :tableCount="invoiceList.count" :getList="getInvoiceData" :pageIndex="pageIndex"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dateFormat } from '@/util/lobal'
import { getInvoiceOrderList } from '@/api/invoice.js'
import { mapGetters, mapMutations } from 'vuex'
import TablePagination from '@/components/TablePagination.vue'

export default {
  name: 'InvoiceOrderList',
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
      invoiceValue: {
        startDate: '',
        endDate: ''
      },
      invoiceList: {
        count: 0,
        data: []
      },
      yesterday: new Date(Date.now() + this.timeOffset - 24 * 60 * 60 * 1000),
      applyTotalMoney: 0,
      multipleSelection: [],
      pickerToday: {
        disabledDate: time => {
          return time.getTime() < new Date(Date.now() + this.timeOffset - 180 * 24 * 60 * 60 * 1000)
        }
      },
      pickerTomorrow: {
        disabledDate: time => {
          return time.getTime() > this.yesterday 
        }
      },
      loading: false,
      queryButton: false,
      pageIndex: 1
    }
  },
  computed: {
    ...mapGetters([
      'accountId', 'accountType', 'timeOffset'
    ])
  },
  watch: {
    accountId (value) {
      if (value) {
        this.getInvoiceData()
      }
    },
    'invoiceValue.startDate'(val) {
      if(this.invoiceValue.endDate) {
        let startTimestamp = new Date(val.replace(/\//g, '-')).getTime()
        let endTimestamp = new Date(this.invoiceValue.endDate.replace(/\//g, '-')).getTime()
        if(startTimestamp > endTimestamp) {
          this.$message({
            message: '开始时间不能晚于结束时间',
            type: 'warning'
          })
          this.invoiceValue.startDate = dateFormat(this.minusMonth(this.yesterday, 1), 'yyyy-MM-dd')
        }
      }
    },
    'invoiceValue.endDate'(val) {
      if(this.invoiceValue.startDate) {
        let startTimestamp = new Date(this.invoiceValue.startDate.replace(/\//g, '-')).getTime()
        let endTimestamp = new Date(val.replace(/\//g, '-')).getTime()
        if(startTimestamp > endTimestamp) {
          this.$message({
            message: '开始时间不能晚于结束时间',
            type: 'warning'
          })
          this.invoiceValue.endDate = dateFormat(this.yesterday, 'yyyy-MM-dd')
        }
      }
    }
  },
  created () {
    this.yesterday = new Date(Date.now() + this.timeOffset - 24 * 60 * 60 * 1000)
    this.invoiceValue.endDate = dateFormat(this.yesterday, 'yyyy-MM-dd')
    this.invoiceValue.startDate = dateFormat(this.minusMonth(this.yesterday, 1), 'yyyy-MM-dd')
    if(!this.userInfo.status){
      this.setState({
        key: 'dialogLoginVisible',
        value: true,
        module: 'user'
      })
    }else if(this.accountId.length > 0){
      this.getInvoiceData()
    }
  },
  methods: {
    ...mapMutations([ 'setState' ]),
    getInvoiceData({
      startDate = this.invoiceValue.startDate,
      endDate = this.invoiceValue.endDate,
      orderStatus = 3,
      page = 1,
      limit = 10,
      userId = this.accountId,
      userType = this.accountType
    } = {}) {
      this.loading = true
      this.queryButton = true
      getInvoiceOrderList({
        startDate,
        endDate,
        orderStatus,
        page,
        limit,
        userId,
        userType
      }).then((res) => {
        this.loading = false
        this.queryButton = false
        this.pageIndex = page
        if(res.data.code === 0){
          this.invoiceList = { ...res.data.data }
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
    minusMonth (date, num) {
      let value = new Date(date)
      value = new Date(value.setMonth(value.getMonth() - num) + 24 * 60 * 60 * 1000)
      let minus = date.getMonth() - value.getMonth()
      if (minus < 0) {
        minus += 12
      }
      if (minus < num) {
        value.setDate(1)
      }
      return value
    },
    handleSearch() {
      this.getInvoiceData()
    },
    formatDate(dateTime) {
      return dateFormat(new Date(dateTime))
    },
    formatNightCount(roomCount, night) {
      return `${roomCount}间/${night}夜`
    },
    fomatMoney(orderMoney) {
      return `￥${parseInt(orderMoney/100)}.00`
    },
    formatMakeInvoice(makeInvoice) {
      let makeInvoiceDesc, invoiceColor
      switch(makeInvoice) {
        case 0:
          makeInvoiceDesc = '未开票'
          invoiceColor = '#91A19F'
          break
        case 1:
          invoiceColor = '#0A1110'
          makeInvoiceDesc = '已开票'
          break
        default:
          makeInvoiceDesc = '查询失败'
          break
      }
      return {
        makeInvoiceDesc,
        invoiceColor
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      let moneyIndex = 0
      for(let i=0; i<val.length; i++){
        moneyIndex += val[i].orderMoney/100
      }
      this.applyTotalMoney = moneyIndex
    },
    toApplyInvoice() {
      if(this.applyTotalMoney === 0){
        this.$message({
          message: '请选择开票订单',
          type: 'warning'
        })
        return false
      }else{
        let strOrderIds = ''
        for(let i=0; i<this.multipleSelection.length; i++){
          strOrderIds += this.multipleSelection[i].id + ','
        }
        strOrderIds = strOrderIds.substr(0, strOrderIds.length - 1)
        this.$router.push({
          name: 'ApplyInvoice',
          query: {
            invoiceMoney: this.applyTotalMoney,
            orderIds: strOrderIds
          }
        })
      }
    },
    toInvoiceRecords() {
      this.$router.push({
        name: 'InvoiceRecords'
      })
    }
  }
}
</script>

<style lang="less">
.invoice-list-wrapper{
  width: 100%;
  background-color: #fff;
  border-top: 0.5px solid #e2e2e2;
  .invoice-list{
    width: 1180px;
    margin: 0 auto;
    .invoice-head-cover{
      padding: 30px 0;
      .invoice-head{
        height: 40px;
        box-sizing: border-box;
        .invoice-date{
          .invoice-date-label{
            display: inline-block;
            height: 40px;
            line-height: 1;
            padding: 12px 30px;
            background-color: #fbfbfb;
            border: 0.5px solid #e6e6e6;
            border-radius: 2px 0 0 2px;
            border-right: none;
            box-sizing: border-box;
            font-size: 14px;
          }
          .invoice-date-input{
            width: 203px;
          }
          .startdate-input{
            input{
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }
          }
        }
        .invoice-search-btn{
          height: 40px;
          button{
            width: 100%;
            height: 100%;
          }
        }
        .invoice-apply-btn{
          text-align: right;
        }
        .invoice-record-btn{
          text-align: left;
        }
      }
    }
    .apply-makeinvoice-cover{
      padding: 20px 0;
      border-top: 0.5px solid #e2e2e2;
      border-bottom: 0.5px solid #e2e2e2;
      .apply-total-momey{
        color: #ff0000;
        font-size: x-large;
        padding-left: 15px;
      }
    }
    .invoice-table-cover{
      padding: 30px 0;
    }
  }
}
</style>
