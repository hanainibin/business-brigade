<template>
  <div class="settlement-wrapper">
    <el-tabs v-model="activeItem" type="card" >
      <el-tab-pane label="结算单列表" name="first">
        <el-table ref="multipleTable" :data="tableDate" tooltip-effect="dark" style="width: 100%;" border fit>
          <el-table-column align="center" label="结算单编号" prop="statementNo" min-width="155" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="住宿单数量" prop="hotelCount" width="155" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="住宿单总金额(元)" prop="hotelTotalMoney" width="155" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="机票单数量" prop="flightCount" width="95" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="机票单总金额(元)" prop="flightTotalMoney" width="155" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="总金额(元)" prop="totalMoney" width="105" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="状态" prop="status" width="95" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="操作" min-width="100">
            <template slot-scope="scope">
              <i class="el-icon-tickets op-icon" @click="toList(scope.row.statementNo)"></i>
              <i class="el-icon-check op-icon" v-if="scope.row.status === '待确认'" @click="setCheck(scope.row.statementNo)"></i>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { statementList, statementCheck } from '@/api/settlement'
import { mapGetters } from "vuex";

export default {
	name: 'Settlement',
	data () {
		return {
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
    this.getStatementList();
  },
  methods: {
    getStatementList() {
      statementList().then(res => {
        if(res.data.code === 0) {
          if(res.data.data.length === 0) {
            this.$message({
              type: 'warning',
              message: '暂无数据'
            })
          } else {
            res.data.data.forEach(settlement => {
              let obj = {...settlement};
              if(settlement.status === 0) {
                obj.status = '待确认';
              } else if(settlement.status === 1) {
                obj.status = '已确认';
              } else if(settlement.status === 2) {
                obj.status = '已结清';
              } else {
                obj.status = '未知';
              }
              obj.flightTotalMoney = settlement.flightTotalMoney / 100 + '.00';
              obj.hotelTotalMoney = settlement.hotelTotalMoney / 100 + '.00';
              obj.totalMoney = (settlement.flightTotalMoney + settlement.hotelTotalMoney) / 100 + '.00';
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
    setCheck(statementNo) {
      statementCheck({statementNo}).then(res => {
        if(res.data.code === 0) {
          this.$message({
            type: 'info',
            message: '确认成功'
          });
          this.getStatementList();
        } else {
          this.$message({
            type: 'warning',
            message: res.data.msg
          })
        }
      });
    },
    toList(statementNo) {
      this.$router.push({
        name: 'SettlementList',
        query: {statementNo : statementNo}
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