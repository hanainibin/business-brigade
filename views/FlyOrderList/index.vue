<template>
  <div class="fly-order-list-wrapper">
    <div class="order-list">
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
        <!-- <el-col class="search-order-person" :span="6">
          <span class="order-search-condition">预订人</span>
          <el-input class="order-person-input" v-model="orderValue.contactName" placeholder="请输入预订人"
                    @keyup.enter.native="touchSearch($event)"/>
        </el-col> -->
        <el-col class="search-btn" :span="2">
          <el-button @click="handleSearch" type="primary" :disabled="queryButton" ref="searchRef">查询</el-button>
        </el-col>
      </el-row>
      <div class="order-list-content">
        <el-table :data="orderList.data" border fit style="width: 100%" v-loading="loading">
          <el-table-column label="预订日期" width="177" align="center">
            <template slot-scope="scope">
              {{formatDate(scope.row.orderCreatTime)}}
            </template>
          </el-table-column>
          <el-table-column label="起飞日期" width="177" align="center">
            <template slot-scope="scope">
              {{formatDate(scope.row.departureTime)}}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="contactName" label="预订人" width="115" align="center">
          </el-table-column> -->
          <el-table-column label="机场" width="189" align="center">
            <template slot-scope="scope">
              {{scope.row.departureAirportName}} -----
              {{scope.row.arrivalAirportName}}
            </template>
          </el-table-column>
          <el-table-column  label="舱型" width="110" align="center">  
            <template slot-scope="scope">
              {{scope.row.seatClassName}}
            </template>
          </el-table-column>
          <el-table-column label="航班号" width="85" align="center">
            <template slot-scope="scope">
              {{scope.row.flightNo}}
            </template>
          </el-table-column>
          <el-table-column label="价格" width="90" align="center">
            <template slot-scope="scope">
              {{fomatMoney(scope.row.totalAmount)}}
            </template>
          </el-table-column>
          <el-table-column label="订单状态" width="90" align="center">
            <template slot-scope="scope" style="color: red">
              <span :style="`color: ${formatOrderStatus(parseInt(scope.row.flightOrderStatus)).orderColor}`">
                {{formatOrderStatus(scope.row.flightOrderStatus).orderStatusDesc}}
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
              <span :style="`color: ${formatTradeType(scope.row.flightOrderStatus, scope.row.tradeType).tradeColor}`">
                {{formatTradeType(scope.row.flightOrderStatus, scope.row.tradeType).tradeTypeDesc}}
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
        
      </div>
      <TablePagination :tableCount="orderList.count" :getList="getOrderListData" :pageIndex="pageIndex"/>
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
import { queryOrderList } from '@/api/order.js'
import { dateFormat } from '@/util/lobal.js'
import { mapGetters, mapMutations } from 'vuex'
import TablePagination from '@/components/TablePagination.vue'
import { increaseMonth } from '@/util/util.js'
import { setStore } from '@/util/store.js'
export default {
  name: 'FlyOrderList',
  components: {
    TablePagination
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
          label: '等待出票'
        },
        {
          value: 2,
          label: '出票成功'
        },
        {
          value: 3,
          label: '退款中（订位失败）'
        },
        {
          value: 4,
          label: '退票中'
        },
        {
          value: 5,
          label: '已退款'
        },
        {
          value: 6,
          label: '已取消'
        }
      ],
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
      // dialogVisible: false,已退款
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
          return time.getTime() > increaseMonth(this.today, 2) + this.timeOffset
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
        this.getOrderListData({})
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
      this.getOrderListData({})
    }
  },
  methods: {
    ...mapMutations(['setState']),
    getOrderListData ({
      orderStatus = -1,
      startDate = '',
      endDate = '',
      page = 1,
      limit = 10,
    } = {}) {
      this.loading = true
      this.queryButton = true
      let orderStatusList
      if (orderStatus === -1) {
        orderStatusList = []
      } else {
        orderStatusList = [orderStatus]
      }
      queryOrderList({
        startDate,
        endDate,
        orderStatus: orderStatusList,
        page,
        limit,
      }).then(res => {
        this.loading = false
        this.queryButton = false
        this.pageIndex = page
        if (res.data.code === 0) {
          this.orderList.data = [...res.data.data.records]
          this.orderList.count = res.data.data.total
          console.log(this.orderList)
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
      // let d = new Date(dateTime); 
      // let times=d.getFullYear() 
      // + '-' + (d.getMonth() + 1) + '-'
      // + d.getDate() + ' ' + d.getHours() + ':' 
      // + d.getMinutes();
      // return times
      return dateFormat(new Date(dateTime), 'yyyy-MM-dd hh:mm')
    },
    // formatNightCount(roomCount, night) {
    //   return `${roomCount}间/${night}夜`
    // },
    fomatMoney (orderMoney) {
      return `￥${parseInt(orderMoney)}.00`
    },
    formatOrderStatus (flightOrderStatus) {
      let formatFlightOrderStatus = parseInt(flightOrderStatus)
      let orderColor, orderStatusDesc
      switch (formatFlightOrderStatus) {
        case 0:
          orderStatusDesc = '等待支付'
          orderColor = '#C6A300'
          break
        case 1:
          orderStatusDesc = '等待出票'
          orderColor = '#C6A300'
          break
        case 2:
          orderStatusDesc = '出票成功'
          orderColor = '#0f3'
          break
        case 3:
          orderStatusDesc = '退款中（订位失败）'
          orderColor = '#4A9FF8'
          break
        case 4:
          orderStatusDesc = '退票中'
          orderColor = '#272727'
          break
        case 5:
          orderStatusDesc = '已退款'
          orderColor = '#272727'
          break
        case 6:
          orderStatusDesc = '已取消'
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
      let formatTravelType = parseInt(travelType)
      switch (formatTravelType) {
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
      if (payStatus === '0') {
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
      setStore({
        name: "payNumQuery",
        content: {
          salesMainOrderNo: orderNo
        }
      });
      setTimeout(() => {
        window.open("/#/FlyOrderPay");
      }, 100);
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
            endDate: dateFormat(this.orderValue.endDate, )
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
.fly-order-list-wrapper {
  margin-top: 0px;
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

