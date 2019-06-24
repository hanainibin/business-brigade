<template>
  <div class="order-list-wrapper">
    <div class="order-list">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label='酒店订单' name="first">
          <el-row class="order-search" :gutter="20">
            <el-col class="order-date" :span="10">
              <span class="order-search-condition">预订日期</span>
              <el-date-picker
                class="order-date-input order-date-startdate"
                v-model="orderValue.startDate"
                type="date"
                prefix-icon="time-icon"
                placeholder="年/月/日"
                ref="startDateRef"
                :editable="false"
                :picker-options="pickerToday"/>
              &nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;&nbsp;&nbsp;
              <el-date-picker
                class="order-date-input"
                v-model="orderValue.endDate"
                type="date"
                prefix-icon="time-icon"
                placeholder="年/月/日"
                ref="endDateRef"
                :editable="false"
                :picker-options="pickerTomorrow"/>
            </el-col>
            <el-col class="search-order-status" :span="6">
              <span class="order-search-condition">订单状态</span>
              <el-select class="order-status-input" v-model="orderValue.orderStatus" placeholder="请选择">
                <el-option
                  v-for="item in statuOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col class="search-order-person" :span="6">
              <span class="order-search-condition">预订人</span>
              <el-input class="order-person-input" v-model="orderValue.contactName" placeholder="请输入预订人"
                        @keyup.enter.native="touchSearch($event)"/>
            </el-col>
            <el-col class="search-btn" :span="2">
              <el-button @click="handleSearch" type="primary" :disabled="queryButton" ref="searchRef">查询</el-button>
            </el-col>
          </el-row>
          <div class="order-list-content">
            <el-table :data="orderList.data" border fit style="width: 100%" v-loading="loading">
              <el-table-column label="预订日期" width="120" align="center">
                <template slot-scope="scope">
                  {{formatDate(scope.row.orderDate, 'yyyy-MM-dd hh:mm')}}
                </template>
              </el-table-column>
              <el-table-column label="入住日期" width="120" align="center">
                <template slot-scope="scope">
                  {{formatDate(scope.row.checkDate, 'yyyy-MM-dd')}}
                </template>
              </el-table-column>
              <el-table-column prop="contactName" label="预订人" width="115" align="center">
              </el-table-column>
              <el-table-column prop="hotelName" label="酒店" width="189" align="center">
              </el-table-column>
              <el-table-column prop="roomTypeDesc" label="房型" width="110" align="center">
              </el-table-column>
              <el-table-column label="间夜" width="85" align="center">
                <template slot-scope="scope">
                  {{formatNightCount(scope.row.roomCount, scope.row.night)}}
                </template>
              </el-table-column>
              <el-table-column label="价格" width="90" align="center">
                <template slot-scope="scope">
                  {{fomatMoney(scope.row.orderMoney)}}
                </template>
              </el-table-column>
              <el-table-column label="订单状态" width="90" align="center">
                <template slot-scope="scope" style="color: red">
                  <span :style="`color: ${formatOrderStatus(scope.row.orderStatus).orderColor}`">
                    {{formatOrderStatus(scope.row.orderStatus).orderStatusDesc}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="出行类型" width="80" align="center">
                <template slot-scope="scope">
                  <span :style="`color: ${formatTravelType(scope.row.travelType).travelColor}`">
                    {{formatTravelType(scope.row.travelType).travelTypeDesc}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="支付方式" width="80" align="center">
                <template slot-scope="scope">
                  <span :style="`color: ${formatTradeType(scope.row.payStatus, scope.row.tradeType).tradeColor}`">
                    {{formatTradeType(scope.row.payStatus, scope.row.tradeType).tradeTypeDesc}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button @click="toOrderPay(scope.row.orderNo)" type="text" size="small">详情</el-button>
                  <!-- <el-button @click="openDialog(scope.row.id)" type="text" size="small">删除</el-button> -->
                </template>
              </el-table-column>
            </el-table>
            <TablePagination :tableCount="orderList.count" :getList="getOrderListData" :pageIndex="pageIndex"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="机票订单" name="second">
          <fly-order-list :userInfo= userInfo> </fly-order-list>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="删除"
      :visible.sync="dialogVisible"
      width="300px">
      <span>确定删除该订单？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { getOrderList } from '@/api/order.js'
import { dateFormat } from '@/util/lobal.js'
import { mapGetters, mapMutations } from 'vuex'
import TablePagination from '@/components/TablePagination.vue'
import { increaseMonth } from '@/util/util.js'
import FlyOrderList from '@/views/FlyOrderList/index'

export default {
  name: 'OrderList',
  components: {
    TablePagination,
    FlyOrderList
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      statuOptions: [
        {
          value: -1,
          label: '全部'
        },
        {
          value: 0,
          label: '等待支付'
        },
        {
          value: 1,
          label: '等待确认'
        },
        {
          value: 2,
          label: '预订成功'
        },
        {
          value: 3,
          label: '交易成功'
        },
        {
          value: 4,
          label: '交易关闭'
        },
        {
          value: 5,
          label: '订单取消'
        },
        {
          value: 6,
          label: '预订失败'
        }
      ],
      activeName: 'first',
      orderValue: {
        startDate: '',
        endDate: '',
        orderStatus: -1,
        contactName: ''
      },
      orderList: {
        count: 0,
        data: []
      },
      // dialogVisible: false,
      rowId: '',
      cankaoDate: Date.now() + this.timeOffset - 61200000,
      today: new Date(Date.now()),
      pickerToday: {
        disabledDate: time => {
          return time.getTime() > increaseMonth(this.today, 2) + this.timeOffset
        }
      },
      pickerTomorrow: {
        disabledDate: time => {
          return time <= this.orderValue.startDate || time.getTime() > increaseMonth(this.today, 2) + this.timeOffset + 8.64e7
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
        console.log('getOrderListData')
        this.getOrderListData()
      }
    },
    timeOffset (value) {
      this.cankaoDate = Date.now() + value - 61200000
    }
  },
  created () {
    if (!this.userInfo.status) {
      this.setState({
        key: 'dialogLoginVisible',
        value: true,
        module: 'user'
      })
    } else if (this.accountId.length > 0) {
      console.log('getOrderListData')
      this.getOrderListData()
    }
  },
  methods: {
    ...mapMutations(['setState']),
    getOrderListData ({
      userId = this.accountId,
      userType = this.accountType,
      page = 1,
      limit = 10,
      startDate = '',
      endDate = '',
      orderStatus = this.orderValue.orderStatus,
      contactName = ''
    } = {}) {
      this.loading = true
      this.queryButton = true
      getOrderList({
        userId,
        userType,
        page,
        limit,
        startDate,
        endDate,
        orderStatus,
        contactName
      }).then(res => {
        this.loading = false
        this.queryButton = false
        this.pageIndex = page
        if (res.data.code === 0) {
          this.orderList = { ...res.data.data }
        } else {
          if (res.data.msg) {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        }
      })
    },
    formatDate (dateTime) {
      return dateFormat(new Date(dateTime), 'yyyy-MM-dd hh:mm')
    },
    formatNightCount (roomCount, night) {
      return `${roomCount}间/${night}夜`
    },
    fomatMoney (orderMoney) {
      return `￥${parseInt(orderMoney / 100)}.00`
    },
    formatOrderStatus (orderStatus) {
      let orderColor, orderStatusDesc
      switch (orderStatus) {
        case 0:
          orderStatusDesc = '等待支付'
          orderColor = '#C6A300'
          break
        case 1:
          orderStatusDesc = '等待确认'
          orderColor = '#C6A300'
          break
        case 2:
          orderStatusDesc = '预订成功'
          orderColor = '#0f3'
          break
        case 3:
          orderStatusDesc = '交易成功'
          orderColor = '#4A9FF8'
          break
        case 4:
          orderStatusDesc = '交易关闭'
          orderColor = '#272727'
          break
        case 5:
          orderStatusDesc = '订单取消'
          orderColor = '#272727'
          break
        case 6:
          orderStatusDesc = '预订失败'
          orderColor = '#272727'
          break
        default:
          orderStatusDesc = '查询失败'
          orderColor = '#272727'
          break
      }
      return {
        orderStatusDesc,
        orderColor
      }
    },
    formatTravelType (travelType) {
      let travelColor, travelTypeDesc
      switch (travelType) {
        case 0:
          travelTypeDesc = '因公'
          travelColor = '#8A2BE2'
          break
        case 1:
          travelTypeDesc = '因私'
          travelColor = '#1E90FF'
          break
        default:
          travelTypeDesc = '查询失败'
          travelColor = '#272727'
          break
      }
      return {
        travelTypeDesc,
        travelColor
      }
    },
    formatTradeType (payStatus, tradeType) {
      if (payStatus === 0) {
        return {
          tradeColor: '#272727',
          tradeTypeDesc: '未支付'
        }
      } else if (payStatus === 1 && tradeType === 0) {
        return {
          tradeColor: '#05af10',
          tradeTypeDesc: '微信'
        }
      } else {
        return {
          tradeColor: '#00aaef',
          tradeTypeDesc: '支付宝'
        }
      }
    },
    toOrderPay (orderNo) {
      this.$router.push({
        name: 'OrderPay',
        query: {
          orderNo
        }
      })
    },
    handleSearch () {
      if (this.orderValue.startDate && this.orderValue.endDate && this.orderValue.startDate >= this.orderValue.endDate) {
        this.$message({
          message: '开始时间不能晚于或等于结束时间',
          type: 'warning'
        })
        this.$refs.startDateRef.focus()
      } else {
        if (this.orderValue.startDate && !this.orderValue.endDate) {
          this.getOrderListData({
            ...this.orderValue,
            startDate: dateFormat(this.orderValue.startDate, 'yyyy-MM-dd'),
            endDate: ''
          })
        } else if (!this.orderValue.startDate && this.orderValue.endDate) {
          this.getOrderListData({
            ...this.orderValue,
            startDate: '',
            endDate: dateFormat(this.orderValue.endDate, 'yyyy-MM-dd')
          })
        } else if (this.orderValue.startDate && this.orderValue.endDate) {
          this.getOrderListData({
            ...this.orderValue,
            startDate: dateFormat(this.orderValue.startDate, 'yyyy-MM-dd'),
            endDate: dateFormat(this.orderValue.endDate, 'yyyy-MM-dd')
          })
        } else {
          this.getOrderListData({
            ...this.orderValue,
            startDate: '',
            endDate: ''
          })
        }
      }
    },
    touchSearch (e) {
      if (e && e.keyCode === 13 || e.charCode === 13) {
        this.handleSearch()
      }
    },
    // deleteRow() {
    //   deleteOrder({
    //     orderId: this.rowId
    //   }).then( () => {
    //     this.getOrderListData()
    //     this.dialogVisible = false 
    //   })
    // },
    // openDialog(val) {
    //   this.dialogVisible = true
    //   this.rowId = val
    // }
  }
}
</script>

<style lang="less">
.order-list-wrapper {
  margin-top: 32px;
  width: 100%;
  background-color: #fff;
  .order-list {
    width: 1180px;
    margin: 0 auto;
    .order-search {
      padding: 30px 0;
      .order-search-condition {
        display: inline-block;
        height: 40px;
        line-height: 1;
        padding: 12px 30px;
        background-color: #fbfbfb;
        border: 0.5px solid #e6e6e6;
        border-radius: 2px 0 0 2px;
        box-sizing: border-box;
        font-size: 14px;
        margin-top: 1px;
        border-right: none;
      }
      .order-date {
        float: left;
        .order-date-input {
          width: 154px;
        }
        .order-date-startdate {
          input {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
      }
      .search-order-status {
        float: left;
        .order-status-input {
          width: 162px;
          input {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
      }
      .search-order-person {
        float: left;
        .order-person-input {
          width: 176px;
          input {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
      }
      .search-btn {
        float: left;
      }
    }
  }
}
</style>

