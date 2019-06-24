<template>
  <div class="travel-standard-wrapper">
    <header>岗级差标设置</header>
    <div class="content">
      <section class="position">
        <h3>{{nickName || '测试用户昵称'}}</h3>
        <ul class="position-content">
          <li class="content-item" v-for="(item, index) in positionList" :key="index"
              @click="showPositionDetail(item.positionNo, index, item.isDefault)">
            <span class="position-name">{{item.positionName}}</span>
            <span v-if="item.isDefault === 0" class="delete-icon" @click="showDeletePositionDialog(item.positionNo)">&#xe618;</span>
          </li>
          <li class="add-icon" @click="addPositionDialogVisible = true">&#xe607;</li>
        </ul>
      </section>
      <section class="position-detail">
        <ul class="oprate-content" v-loading="loading">
          <li class="detail-item">
            <span class="title">岗级名称：</span>
            <input class="position-name-input" type="text" placeholder="请输入岗级名称" v-model="positionDetails.positionName">
          </li>
          <li class="detail-item">
            <span class="title">住宿标准：</span>
            <el-select class="hotel-select" v-model="hotelStandard" placeholder="请选择"
                       @change="changeHotelStandard" size="mini" ref="hotelStandardRef">
              <el-option
                v-for="item in hotelStandardList"
                :key="item.standardHotelNo"
                :label="item.standardName"
                :value="item.standardHotelNo"
              >
              </el-option>
            </el-select>
            <!-- 查看详情弹窗 -->
            <el-popover
              placement="right"
              width="245"
              trigger="hover">
              <ul class="hotel-standard-detail">
                <li class="item">
                  <span class="title">标准名称：</span>
                  <span class="content">{{hotelStandardDetail.standardName}}</span>
                </li>
                <li class="item">
                  <span class="title">预定限制：</span>
                  <span class="content">
                    {{hotelStandardDetail.manualStatus === 0 ? '自动审批' : '人工审批'}} 
                    {{hotelStandardDetail.travelApplyStatus === 0 ? '无限制' : '出差申请'}}
                  </span>
                </li>
                <!-- 暂时不要 -->
                <!-- <li class="item">
                  <span class="title">协议酒店：</span>
                  <span class="content">{{hotelStandardDetail.agreementHotelStatus === 0 ? '否' : '是'}}</span>
                </li> -->
                <li class="item">
                  <span class="title">出差预警：</span>
                  <span class="content">{{hotelStandardDetail.surpassWarnStatus === 0 ? '停用' : '启用'}}</span>
                </li>
                <li class="item">
                  <span class="title" v-if="positionDetails.aone && positionDetails.atwo || positionDetails.bone 
                    && positionDetails.btwo || positionDetails.cone && positionDetails.ctwo
                    || positionDetails.done && positionDetails.dtwo
                    || positionDetails.eone && positionDetails.etwo
                  || positionDetails.fone && positionDetails.ftwo">住宿标准：</span>
                  <ul class="city-standard-list">
                    <li>
                      {{positionDetails.aone && positionDetails.atwo ? 
                      `所有城市：${positionDetails.aone}-${positionDetails.atwo}￥/间夜` : ''}}
                    </li>
                    <li>
                      {{positionDetails.bone && positionDetails.btwo ? 
                      `一类：${positionDetails.bone}-${positionDetails.btwo}￥/间夜` : ''}}
                    </li>
                    <li>
                      {{positionDetails.cone && positionDetails.ctwo ? 
                      `二类：${positionDetails.cone}-${positionDetails.ctwo}￥/间夜` : ''}}
                    </li>
                    <li>
                      {{positionDetails.done && positionDetails.dtwo ? 
                      `三类：${positionDetails.done}-${positionDetails.dtwo}￥/间夜` : ''}}
                    </li>
                    <li>
                      {{positionDetails.eone && positionDetails.etwo ? 
                      `四类：${positionDetails.eone}-${positionDetails.etwo}￥/间夜` : ''}}
                    </li>
                    <li>
                      {{positionDetails.fone && positionDetails.ftwo ? 
                      `五类：${positionDetails.fone}-${positionDetails.ftwo}￥/间夜` : ''}}
                    </li>
                  </ul>
                </li>
              </ul>
              <span class="standard-btn" slot="reference" @click="toStandardType('first')">查看详情</span>
            </el-popover>
          </li>
          <li class="detail-item">
            <span class="title">机票标准：</span>
            <el-select class="ticket-select" v-model="ticketStandard" placeholder="请选择"
                       @change="changeTicketStandard" size="mini" ref="ticketStandardRef">
              <el-option
                v-for="item in ticketStandardList"
                :key="item.standardFlightNo"
                :label="item.standardName"
                :value="item.standardFlightNo">
              </el-option>
            </el-select>
            <!-- 查看详情弹窗 -->
            <el-popover
              placement="right"
              width="200"
              trigger="hover">
              <ul class="ticket-standard-detail">
                <li class="item">
                  <span class="title">标准名称：</span>
                  <span class="content">{{ticketStandardDetail.standardName}}</span>
                </li>
                <li class="item">
                  <span class="title">预定限制：</span>
                  <span class="content">
                    {{ticketStandardDetail.manualStatus === 0 ? '自动审批' : '人工审批'}} 
                    {{ticketStandardDetail.travelApplyStatus === 0 ? '无限制' : '出差申请'}}
                  </span>
                </li>
                <li class="item">
                  <span class="title">出差预警：</span>
                  <span class="content">{{ticketStandardDetail.surpassWarnStatus === 0 ? '停用' : '启用'}}</span>
                </li>
                <!-- 暂不展示航线最低 -->
                <!-- <li class="item">
                  <span class="title">航线最低：</span>
                  <span class="content">{{ticketStandardDetail.surpassWarnStatus === 0 ? '停用' : '启用'}}</span>
                </li> -->
                <li class="item">
                  <span class="title">舱位限制：</span>
                  <span class="content">
                    {{formatSeat(ticketStandardDetail.seatClassLimit)}}
                  </span>
                </li>
              </ul>
              <span class="standard-btn" slot="reference" @click="toStandardType('second')">查看详情</span>
            </el-popover>
          </li>
          <li class="detail-item employee-list-cover">
            <span class="title">员工列表：</span>
            <ul class="employee-list">
              <li class="employee-item" v-for="n in employeeListCheckedShow" :key="n.index">
                {{n.name}}
              </li>
              <li v-if="isShowEdit" class="edit-icon" @click="showTransfer">&#xe608;</li>
            </ul>
          </li>
        </ul>
        <div class="save-btn-cover">
          <el-button class="save-btn" type="primary" @click="positionModify">保存</el-button>
        </div>
      </section>
    </div>
    <!-- 员工编辑穿梭框 -->
    <el-dialog title="编辑员工" :visible.sync="transferVisible" width="600px" class="transfer-dialog">
      <el-transfer
        v-model="employeeListChecked"
        :data="employeeList"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入员工姓名"
        :titles="['全部员工', positionDetails.positionName]">
        <div slot="left-footer"></div>
        <div slot="right-footer" class="transfer-footer">
          <el-button class="right-btn" size="small" @click="employeeBind">保存</el-button>
        </div>
      </el-transfer>
    </el-dialog>
    <!-- 岗级删除dialog -->
    <el-dialog
      title="提示"
      :visible.sync="deletePositionDialogVisible"
      width="30%">
      <span>确定删除该岗位？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletePositionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletePosition">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 岗级新增dialog -->
    <el-dialog
      title="新增岗级"
      :visible.sync="addPositionDialogVisible"
      width="25%">
      <div class="add-position-dialog">
        <span>岗级名称：</span>
        <input type="text" placeholder="请输入岗级名称" v-model="addPositionName">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPositionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPosition">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getEmployeeInfo  } from '@/api/account'
import { entQueryList, hotelListQuery, entNew, entQueryDetails, queryEmployee, flightListQuery,
         entClose, employeeBinding, entModify } from '@/api/travelStandard.js'

export default {
  name: 'TravelStandard',
  data() {
    return {
      positionList: [],
      positionDetails: {
        flightStandard: {},
        hotelStandard: {}
      },
      standardList: [],
      hotelStandard: '',
      hotelStandardList:[],
      ticketStandard: '',
      ticketStandardList:[],
      transferVisible: false,
      employeeListChecked: [],
      employeeList: [],
      employeeListCheckedShow: [],
      deletePositionDialogVisible: false,
      positionNoChecked: '',
      addPositionDialogVisible: false,
      addPositionName: '',
      hotelStandardDetail: {},
      ticketStandardDetail: {},
      isShowEdit: false,
      loading: false
    }
  },
  beforeRouteLeave(to, from, next) {
    const answer = window.confirm('请确保本页面所有修改已保存，否则将丢失修改，是否继续？')
    if (answer) {
      next()
    } else {
      next(false)
    }
  },
  computed: {
    ...mapGetters([ 'nickName', 'accountId' ])
  },
  watch: {
    accountId(value) {
      if (value.length < 0) {
        this.setState({
          key: "dialogLoginVisible",
          value: true,
          module: "user"
        })
      }
    }
  },
  mounted() {
    // 住宿标准列表
    hotelListQuery().then(res => {
      if (res.data.code === 0 && res.data.data.length > 0) {
        this.hotelStandardList.length = 0
        res.data.data.forEach(val => {
          if (val.status) {
            this.hotelStandardList.push(val)
          }
          if (val.isDefault && val.status) {
            this.hotelStandardDetail = {...val}
          }
        })
      } else {
        this.$message.error(res.data.msg)
      }
    })
    // 机票标准列表
    flightListQuery().then(res => {
      if (res.data.code === 0 && res.data.data.length > 0) {
        this.ticketStandardList.length = 0
        res.data.data.forEach(val => {
          if (val.status) {
            this.ticketStandardList.push(val)
          }
          if (val.isDefault && val.status) {
            this.ticketStandardDetail = {...val}
          }
        })
      } else {
        this.$message.error(res.data.msg)
      }
    })
    this.getPositionInit()
   },
  methods: {
    // 岗级绑定员工列表
    getEmployeeInfo(positionNo) {
      queryEmployee({positionNo}).then(res => {
        this.loading = false
        if (res.data.code === 0) {
          this.employeeListChecked = []
          if (res.data.data && res.data.data.length > 0) {
            this.employeeListCheckedShow.length = 0
            res.data.data.forEach((val, index) => {
              this.employeeListChecked.push(val.employeeId)
              if (index < 20) {
                this.employeeListCheckedShow.push({
                  key: index,
                  name: val.employeeName
                })
              }
            })
          } else {
            this.employeeListCheckedShow.length = 0
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 初始化岗级及岗级详情
    getPositionInit() {
      this.loading = true
      // 岗级列表
      entQueryList().then(res => {
        if (res.data.code === 0) {
          this.positionList = [...res.data.data]
          this.positionList.forEach((val, index) => {
            if (val.isDefault === 1) {
              // 显示普通员工
              setTimeout(() => {
                document.getElementsByClassName('content-item')[index].classList.add('bg-checked')
              }, 500)
              // 岗级详情
              entQueryDetails({positionNo: val.positionNo}).then(res => {
                if (res.data.code === 0) {
                  this.positionDetails = {...res.data.data}
                  this.ticketStandard = this.positionDetails.flightStandard.standardName
                  this.hotelStandard = this.positionDetails.hotelStandard.standardHotelNo
                  // 重新设置标准详情，因为标准列表不一定有默认标准
                  this.hotelStandardDetail = {...this.positionDetails.hotelStandard}
                  this.ticketStandardDetail = {...this.positionDetails.flightStandard}
                } else {
                  this.$message.error(res.data.msg)
                }
              })
              // 岗级绑定员工列表
              this.getEmployeeInfo(val.positionNo)
            }
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    formatSeat(num) {
      let seatArr = ['经济舱', '头等舱', '公务舱']
      return seatArr[num]
    },
    filterMethod(query, item) {
      return item.label.indexOf(query) > -1
    },
    showTransfer() {
      // 企业账号下得所有员工
      getEmployeeInfo({
        keyWord: '',
        limit: 20,
        offset: 0,
        page: 1,
        userId: this.accountId
      }).then(res => {
        if (res.data.code === 0 && res.data.data.data.length > 0) {
          this.employeeList.length = 0
          res.data.data.data.forEach(val => {
            this.employeeList.push({
              label: `${val.userName} ${val.phone}`,
              key: val.userId
            })
          })
          this.transferVisible = true
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    showDeletePositionDialog(positionNo) {
      this.positionNoChecked = positionNo
      this.deletePositionDialogVisible = true
    },
    deletePosition() {
      entClose({positionNo: this.positionNoChecked}).then(res => {
        if (res.data.code === 0) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getPositionInit()
        } else this.$message.error(res.data.msg)
      })
      this.deletePositionDialogVisible = false
    },
    addPosition() {
      this.loading = true
      let arr = [], newIndex
      this.positionList.forEach(val => {
        arr.push(val.positionNo)
      })
      entNew({positionName: this.addPositionName}).then(res => {
        if (res.data.code === 0) {
          // 岗级列表和岗级详情接口
          entQueryList().then(res => {
            if (res.data.code === 0) {
              let arr2 = []
              this.positionList = [...res.data.data]
              this.positionList.forEach(val => {
                arr2.push(val.positionNo)
              })
              // 比较前后两组数组找出最新添加的元素的位置
              for (let i=0; i<arr2.length; i++) {
                if (arr.indexOf(arr2[i]) < 0) {
                  newIndex = i
                }
              }
              // 调用岗级详情和岗级对应员工列表接口
              this.showPositionDetail(this.positionList[newIndex].positionNo, newIndex, this.positionList[newIndex].isDefault)
            } else {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          this.$message.error(res.data.msg)
        }
        this.addPositionDialogVisible = false
      })
    },
    changeHotelStandard(data) {
      this.hotelStandardList.forEach(val => {
        if (data === val.standardHotelNo) {
          this.hotelStandardDetail = {...val}
        }
      })
    },
    changeTicketStandard(data) {
      this.ticketStandardList.forEach(val => {
        if (data === val.standardFlightNo) {
          this.ticketStandardDetail = {...val}
        }
      })
    },
    showPositionDetail(positionNo, index, isDefault) {
      this.loading = true
      if (!isDefault) {
        this.isShowEdit = true
      } else {
        this.isShowEdit = false
      }
      let items = document.getElementsByClassName('content-item')
      for (let i=0; i<items.length; i++) {
        items[i].classList.remove('bg-checked')
      }
      document.getElementsByClassName('content-item')[index].classList.add('bg-checked')
      entQueryDetails({positionNo}).then(res => {
        if (res.data.code === 0) {
          this.positionDetails = {...res.data.data}
          this.ticketStandard = this.positionDetails.flightStandard.standardName
          this.hotelStandard = this.positionDetails.hotelStandard.standardHotelNo
          this.hotelStandardDetail = {...this.positionDetails.hotelStandard}
          this.ticketStandardDetail = {...this.positionDetails.flightStandard}
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 岗级绑定员工列表
      this.getEmployeeInfo(positionNo)
    },
    employeeBind() {
      this.loading = true
      employeeBinding({
        employeeIds: this.employeeListChecked,
        positionNo: this.positionDetails.positionNo 
      }).then(res => {
        if (res.data.code === 0 && res.data.msg === 'success') {
          // 岗级绑定员工列表
          this.getEmployeeInfo(this.positionDetails.positionNo)
          this.transferVisible = false
          this.$message({
            message: '绑定成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    positionModify() {
      if (!this.positionDetails.positionName) {
        this.$message({
          message: '岗级名称不能为空！',
          type: 'warning'
        })
        document.getElementsByClassName('position-name-input')[0].focus()
        return
      } else if (!this.hotelStandardDetail.standardHotelNo) {
        this.$message({
          message: '请选择住宿标准！',
          type: 'warning'
        })
        this.$refs.hotelStandardRef.focus()
        return
      } else if (!this.ticketStandardDetail.standardFlightNo) {
        this.$message({
          message: '请选择机票标准！',
          type: 'warning'
        })
        this.$refs.ticketStandardRef.focus()
        return
      } 
      entModify({
        flightStandardNo: this.ticketStandardDetail.standardFlightNo,
        hotelStandardNo: this.hotelStandardDetail.standardHotelNo,
        positionName: this.positionDetails.positionName,
        positionNo: this.positionDetails.positionNo
      }).then(res => {
        if (res.data.code === 0) {
          this.positionDetails = {...res.data.data}
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    toStandardType(val) {
      this.$router.push({
        name: 'StandardType',
        query: {
          activeName: val
        }
      })
    }
  }
}
</script>

<style lang="less">
@import './style.less';
</style>
