<template>
  <div class="ticket-standard-wrapper">
    <header>
      <span class="add-btn" @click="addStandardDialogVisible = true">
        <i>&#xe607;</i>
        新增标准
      </span>
    </header>
    <div class="standard-content" v-loading="loading">
      <section class="standard-detail" v-for="(item, index) in ticketStandardList" :key="item.standardFlightNo" 
               :class="index%2 === 0 ? 'even-section' : ''">
        <h1>{{item.standardName}}</h1>
        <ul class="detail-list">
          <li class="list-item">
            <span class="title">标准名称：</span>
            <input class="standard-name-input" type="text" placeholder="请输入标准名称" v-model="item.standardName">
          </li>
          <li class="list-item" v-if="!item.isDefault">
            <span class="title">状态：</span>
            <SwitchItem :btnText="btnTextArr[index].status" :switchOn="item.status" @switchBoolean="statusSwitch(index, 'status')"/>
          </li>
          <li class="list-item">
            <span class="title">预订限制：</span>
            <el-popover placement="bottom" width="200" trigger="hover">
              <div>
                <p>
                  <strong>人工审批：</strong>
                  使用该标准的员工出差单需要所有审批人手工审批
                </p>
                <P>
                  <strong>自动审批：</strong>
                  使用该标准的员工出差单自动审批到最终审批人手中
                </P>
              </div>
              <SwitchItem slot="reference" :btnText="btnTextArr[index].manualStatus" :switchOn="item.manualStatus"
                          @switchBoolean="statusSwitch(index, 'manualStatus')"/>
            </el-popover>
            <el-popover placement="bottom" width="200" trigger="hover">
              <div>
                <p>
                  <strong>出差申请：</strong>
                  使用该标准的员工出差单需要手工填报出差申请单
                </p>
                <P>
                  <strong>无限制：</strong>
                  使用该标准的员工出差单会自动生成
                </P>
              </div>
              <SwitchItem slot="reference" :btnText="btnTextArr[index].travelApplyStatus" :switchOn="item.travelApplyStatus"
                          @switchBoolean="statusSwitch(index, 'travelApplyStatus')"/>
            </el-popover>
          </li>
          <li class="list-item">
            <span class="title">出差预警：</span>
            <el-popover placement="bottom" width="200" trigger="hover">
              <div>
                <p>
                  <strong>启用：</strong>
                  使用该标准的员工超标时需要最终审批人手工审批
                </p>
                <P>
                  <strong>停用：</strong>
                  使用该标准的员工超标不强制最终审批人手工审批
                </P>
              </div>
              <SwitchItem slot="reference" :btnText="btnTextArr[index].surpassWarnStatus" :switchOn="item.surpassWarnStatus"
                          @switchBoolean="statusSwitch(index, 'surpassWarnStatus')"/>
            </el-popover>
          </li>
          <!-- 暂不展示航线最低 -->
          <!-- <li class="list-item">
            <span class="title">航线最低：</span>
            <SwitchItem :btnText="btnTextArr[index].routePriceLimitStatus" :switchOn="item.routePriceLimitStatus"
                        @switchBoolean="statusSwitch(index, 'routePriceLimitStatus')"/>
          </li> -->
          <li class="list-item">
            <span class="title">舱位限制：</span>
            <el-select v-model="item.seatClassLimit" placeholder="请选择" size="mini">
              <el-option
                v-for="item in seatClassArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </li>
          <li class="save-btn-cover">
            <el-button class="save-btn" size="medium" @click="saveTicketStandardModify(item)">保存</el-button>
          </li>
        </ul>
      </section>
    </div>
    <el-dialog
      title="新增标准"
      :visible.sync="addStandardDialogVisible"
      width="450px">
      <div class="add-standard-dialog">
        <span>标准名称：</span>
        <input type="text" placeholder="请输入标准名称" v-model="addTicketStandardName">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addStandardDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTicketStandard">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { flightListQuery, flightNew, flightModify } from '@/api/travelStandard.js'
import SwitchItem from '@/components/SwitchItem.vue'

export default {
  components: {
    SwitchItem
  },
  data() {
    return {
      ticketStandardList: [],
      addStandardDialogVisible: false,
      addTicketStandardName: '',
      seatClassArr: [
        {
          value: 0,
          label: '经济舱'
        },
        {
          value: 1,
          label: '头等舱'
        },
        {
          value: 2,
          label: '公务舱'
        }
      ],
      loading: false,
      btnTextArr: [],
      text1: ['停用', '启用'], 
      text2: ['自动审批', '人工审批'],
      text3: ['无限制', '出差申请']
    }
  },
  mounted() {
    this.getTicketStandardList()
  },
  methods: {
    getTicketStandardList() {
      this.loading = true
      flightListQuery().then(res => {
        this.loading = false
        if (res.data.code === 0) {
          if (res.data.data.length > 0) {
            this.ticketStandardList = [...res.data.data]
            this.btnTextArr.length = 0
            for (let i=0; i<this.ticketStandardList.length; i++) {
              this.btnTextArr.push({
                status: this.text1[this.ticketStandardList[i].status],
                manualStatus: this.text2[this.ticketStandardList[i].manualStatus],
                travelApplyStatus: this.text3[this.ticketStandardList[i].travelApplyStatus],
                surpassWarnStatus: this.text1[this.ticketStandardList[i].surpassWarnStatus],
                routePriceLimitStatus: this.text1[this.ticketStandardList[i].routePriceLimitStatus],
                standardFlightNo: this.ticketStandardList[i].standardFlightNo,
                standardName: this.ticketStandardList[i].standardName
              })
            }
          }
        } else this.$message.error(res.data.msg)
      }) 
    },
    statusSwitch(index, str) {
      Object.keys(this.ticketStandardList[index]).forEach(val => {
        if (val === str) {
          if (this.ticketStandardList[index][val]) {
            this.ticketStandardList[index][val] = 0
          } else this.ticketStandardList[index][val] = 1
        }
      })
      if (str === 'manualStatus') {
        this.btnTextArr[index][str] = this.text2[this.ticketStandardList[index][str]]
      } else if (str === 'travelApplyStatus') {
        this.btnTextArr[index][str] = this.text3[this.ticketStandardList[index][str]]
      } else {
        this.btnTextArr[index][str] = this.text1[this.ticketStandardList[index][str]]
      }
    },
    saveTicketStandardModify(item) {
      flightModify({
        manualStatus: item.manualStatus,
        routePriceLimitStatus: item.routePriceLimitStatus,
        seatClassLimit: item.seatClassLimit,
        standardFlightNo: item.standardFlightNo,
        standardName: item.standardName,
        status: item.status,
        surpassWarnStatus: item.surpassWarnStatus,
        travelApplyStatus: item.travelApplyStatus
      }).then(res => {
        if (res.data.code === 0 && res.data.data) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getTicketStandardList()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    addTicketStandard() {
      if (!this.addTicketStandardName) {
        this.$message({
          message: '请输入标准名称！',
          type: 'warning'
        })
        return
      }
      flightNew({
        standardName: this.addTicketStandardName
      }).then(res => {
        if (res.data.code === 0 && res.data.data) {
          this.addStandardDialogVisible = false
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.getTicketStandardList()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less">
@import './style.less';
</style>
