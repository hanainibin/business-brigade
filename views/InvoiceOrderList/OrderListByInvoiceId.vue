<template>
  <div class="order-list-by-invoiceId-wrapper">
    <div class="order-list-by-invoiceId">
      <el-table :data="orderList.data" border style="width: 100%">
        <el-table-column label="预订日期" width="150" align="center">
          <template slot-scope="scope">
            {{formatDate(scope.row.createDate, 'yyyy-MM-dd')}}
          </template>
        </el-table-column>
        <el-table-column label="入住日期" width="150" align="center">
          <template slot-scope="scope">
            {{formatDate(scope.row.checkDate, 'yyyy-MM-dd')}}
          </template>
        </el-table-column>
        <el-table-column label="预订人" prop="contactName" width="160" align="center">
        </el-table-column>
        <el-table-column label="酒店" prop="hotelName" width="169" align="center">
        </el-table-column>
        <el-table-column label="房型" prop="roomTypeDesc" width="140" align="center">
        </el-table-column>
        <el-table-column label="间夜" width="100" align="center">
          <template slot-scope="scope">
            {{formatNightCount(scope.row.roomCount, scope.row.night)}}
          </template>
        </el-table-column>
        <el-table-column label="价格" width="110" align="center">
          <template slot-scope="scope">
            {{fomatMoney(scope.row.orderMoney)}}
          </template>
        </el-table-column>
        <el-table-column label="出行类型" prop="invoiceTitle" width="100" align="center">
          <template slot-scope="scope">
            <span :style="`color: ${formatTravelType(scope.row.travelType).travelColor}`">
              {{formatTravelType(scope.row.travelType).travelTypeDesc}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" prop="invoiceTitle" width="100" align="center">
          <template slot-scope="scope">
            <span :style="`color: ${formatTradeType(scope.row.payStatus, scope.row.tradeType).tradeColor}`">
              {{formatTradeType(scope.row.payStatus, scope.row.tradeType).tradeTypeDesc}}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <TablePagination :tableCount="orderList.count" :getList="getOrderListData" :pageIndex="pageIndex"/>
    </div>
  </div>
</template>

<script>
import { getOrderListByInvoiceId } from '@/api/invoice.js'
import { mapGetters, mapMutations } from 'vuex'
import { dateFormat } from '@/util/lobal'
import TablePagination from '@/components/TablePagination.vue'

export default {
  name: 'OrderListByInvoiceId',
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
      orderList: {
        count: 0,
        data: []
      },
      pageIndex: 1
    }
  },
  computed: {
    ...mapGetters(['accountId'])
  },
  watch: {
    accountId(value) {
      if (value) {
        this.getOrderListData()
      } else {
        this.$router.push('/')
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
      this.getOrderListData()
    }
  },
  methods: {
    ...mapMutations([ 'setState' ]),
    getOrderListData({
      invoiceId = this.$route.query.invoiceId,
      page = 1,
      limit = 10,
      userId = this.accountId
    } = {}) {
      getOrderListByInvoiceId({
        invoiceId,
        page,
        limit,
        userId
      }).then(res => {
        this.pageIndex = page
        if(res.data.code === 0){
          this.orderList = { ...res.data.data }
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
    formatNightCount(roomCount, night) {
      return `${roomCount}间/${night}夜`
    },
    fomatMoney(invoiceMoney) {
      return `￥${parseInt(invoiceMoney/100)}.00`
    },
    formatTravelType(travelType) {
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
    formatTradeType(payStatus, tradeType) {
      if(payStatus === 0) {
        return {
          tradeColor: '#272727',
          tradeTypeDesc: '未支付'
        }
      }else if(payStatus === 1 && tradeType === 0){
        return {
          tradeColor : '#8A2BE2',
          tradeTypeDesc: '微信'
        }
      }else{
        return {
          tradeColor : '#1E90FF',
          tradeTypeDesc: '支付宝'
        }
      }
    },
  }
}
</script>

<style lang="less" scoped>
.order-list-by-invoiceId-wrapper{
  width: 100%;
  background-color: #fff;
  .order-list-by-invoiceId{
    padding: 30px 0;
    width: 1180px;
    margin: 0 auto;
  }
}
</style>

