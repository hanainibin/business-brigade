<template>
  <div class="settlement-wrapper">
    <el-tabs v-model="activeItem" type="card" >
      <el-tab-pane label="结算单订单列表" name="first">
        <el-table ref="multipleTable" :data="tableDate" tooltip-effect="dark" style="width: 100%;" border fit>
          <el-table-column align="center" label="订单类型" prop="orderType" width="155" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="订单编号" prop="orderNo" min-width="155" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="联系人" prop="username" width="155" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="联系方式" prop="phone" width="155" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="交易时间" prop="tradeTime" width="155" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="金额(元)" prop="totalMoney" width="105" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="订单状态" prop="orderStatus" width="95" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="操作" min-width="100">
            <template slot-scope="scope">
              <i class="el-icon-tickets op-icon" @click="toDetail(scope.row.orderNo)"></i>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { statementOrderList } from '@/api/settlement'
	import { mapGetters } from "vuex";

export default {
  name: 'Settlement',
  data() {
    return{
      activeItem: 'first',
      tableDate: []
    }
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    },
  },
  computed: {
    ...mapGetters(["nickName", "accountId", "accountType"])
  },
  mounted () {
    this.getStatementOrderList();
  },
  methods: {
    getStatementOrderList() {
      statementOrderList({
        statementNo: this.$route.query.statementNo,
      }).then(res => {
        if(res.data.code === 0) {
          if(res.data.data.length === 0) {
            this.$message({
              type: 'warning',
              message: '暂无数据'
            })
          } else {
            res.data.data.forEach(settlement => {
              let obj = {...settlement};
              obj.totalMoney = settlement.totalMoney / 100 + '.00';
              this.tableDate.push(obj);
            });
          }
        } else {
          this.$message({
            type: 'warning',
            message: res.data.msg
          })
        }
      });
    },
    toDetail(orderNo) {
      this.$router.push({
        name: 'OrderPay',
        query: {
          orderNo
        }
      })
    },
  }
}
</script>

<style lang="less">
  .settlement-wrapper{
    width: 1180px;
    margin: 0 auto;
    padding-top: 30px;
    .op-icon{
      margin-left: 10px;
      cursor: pointer;
    }
  }
</style>