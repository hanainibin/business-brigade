<template>
  <div class="content-wrapper">
    <el-tabs v-model="activeItem" type="card" >
      <el-tab-pane label="行程设置" name="first" v-if="userType === 0">
        <div class="top">
          <span>审批人:</span>
          <el-dialog title="添加成员" :visible.sync="addNewMemberDialogVisible" custom-class="user-set-dialog">
            <choose-user :userInfo= "userInfo" @childByValue= 'childByValue'></choose-user>
          </el-dialog>
          <span class="user-item" v-for="(item,index) in childUserNames" :key="item.index">{{item}} <i class="el-icon-close" @click="delChecker(index)"></i></span>
          <i class="el-icon-circle-plus el-icon--center"
             @click="addNewMemberDialogVisible = true"
          >
          </i>
        </div>
        <div class="center">
          <span>审批模式:</span>
          <el-switch
            :class="topDisplay ? classL: classR"
            :width = 90
            style="display: inline"
            v-model="modelValue"
            active-value='0'
            inactive-value='1'
            @change="changeModel(modelValue)"
            active-color="#13ce66"
            inactive-color="gray"
            active-text="逐级审批"
            inactive-text="平行审批">
          </el-switch>
        </div>
      </el-tab-pane>
      <el-tab-pane label="行程列表" name="second">
        <TravelList :userType="userType" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TravelList from './TravelList'
import ChooseUser from '@/components/ChooseUser.vue'
import { selectCheckList, addPaidCheckSetting, addPaidCheckUser, deletePaidCheckSetting } from '@/api/approval'
import { mapGetters } from "vuex";
import { setStore, getStore } from '@/util/store'
import { getUserInfo } from '@/api/login'

export default {
  name: 'TravelSet',
  components: {
    TravelList,
    ChooseUser
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
  created () {
    this.userType = this.accountType;
    if (this.accountType === 1) {
      this.activeItem = "second";
    } else if (this.accountType === -1) {
      getUserInfo().then(res => {
        this.userType = res.data.data.accountType;
        if (this.userType === 1) {
          this.activeItem = "second";
        }
      })
    }
  },
  data () {
    return {
      activeItem: 'first',
      userType: 0,
      modelValue: '1',
      adminValue: '1',
      childUserNames: [],
      // userIds: [],
      // userChildValue: '',
      childUserId: '',
      childUserName: '',
      addNewMemberDialogVisible: false,
      userChildValue: '',
      displayBool: true,
      topDisplay: true,
      classA: 'left',
      classB: 'right',
      classL: 'classL',
      classR: 'classR',
      userIds: [],
      firstTime: true,
    }
  },
  mounted () {
    this.readygetModel();
  },
  watch: {
    modelValue (arg) {
      if (arg == 0) {
        this.topDisplay = false
      }
      if (arg == 1) {
        this.topDisplay = true
      }
    }
  },
  methods: {
    readygetModel () {
      selectCheckList().then(res => {
        let resData = res.data
        this.userIds = []
        this.childUserNames = []
        if (resData.code == 0) {
          resData.data.list.forEach(element => {
            this.userIds.push(element.userId)
            this.childUserNames.push(element.nickname)
            setStore({
              name: 'travel-set',
              content: { localUserId: this.userIds }
            })
            console.log(this.userIds, 'User')
          });
        }
      })
    },
    childByValue (val, val2) {
      this.addNewMemberDialogVisible = val2
      // console.log(, 'store')
      let storeBool = typeof (getStore({ name: 'travel-set' })) == 'undefined'
      if (!storeBool) {
        let storeUserId = getStore({ name: 'travel-set' }).localUserId
        if (storeUserId.indexOf(val.realUserId) !== -1) {
          this.$message({
            type: 'warning',
            message: '请勿重复添加'
          })
        } else {
          let valId = []
          valId.push(val.realUserId)
          this.addPaidCheckUserReady(valId)
        }
      }
      if (storeBool) {
        let valId = []
        valId.push(val.realUserId)
        this.addPaidCheckUserReady(valId)
      }
    },
    delChecker (index) {
      deletePaidCheckSetting({
        userId: this.userIds[index]
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.readygetModel()
        } else {
          this.$message({
            type: 'warning',
            message: '失败'
          })
        }
      })
    },
    addPaidCheckUserReady (val) {
      addPaidCheckUser({ userIds: val }).then(res => {
        let resData = res.data
        if (resData.code == 0) {
          this.$message({
            type: 'success',
            message: '成功'
          })
          // setStore({
          //   name: 'travel-set',
          //   content: { localUserId: val[0] }
          // })
          this.readygetModel()
        }
        if (resData.code == 1) {
          this.$message({
            type: 'warning',
            message: resData.msg
          })
        }
      })
    },
    changeModel (modelValue) {
      addPaidCheckSetting({
        mode: modelValue
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '成功'
          })
        } else {
          this.$message({
            type: 'success',
            message: '失败'
          })
        }
      })
    },
  }
}
</script>

<style lang="less">
.content-wrapper {
  width: 1180px;
  margin: 0 auto;
  padding-top: 30px;
  .top {
    height: 40px;
    padding: 20px 10px 10px;
    line-height: 40px;
    .user-item {
      padding: 0 5px;
      i :hover {
        cursor: pointer;
      }
      i {
        color: red;
        font-size: 8px;
      }
    }
    .el-icon-circle-plus {
      font-size: 18px;
      color: #2d88f9;
      position: relative;
      top: 2px;
    }
    .user-set-dialog {
      width: 520px;
      .el-dialog__header {
        padding: 40px 20px 10px 40px;
        .el-dialog__headerbtn {
          top: -10px;
          right: -10px;
          font-size: 23px;
          background: #e6e6e6;
          border-radius: 20px;
          line-height: 23px;
          border: 3px solid #ffffff;
          .el-dialog__close {
            color: #ffffff;
          }
        }
      }
      .el-dialog__body {
        padding-left: 40px;
        .el-input {
          width: 70%;
        }
        .el-table__body-wrapper {
          cursor: pointer;
        }
        .el-button--text {
          margin-left: 20px;
        }
        .table-pagination {
          // background: red;
          text-align: center;
          .el-pagination__jump {
            margin-left: 0px;
          }
        }
      }
    }
    span {
      height: 15px;
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      display: inline-block;
      i {
        font-size: 20px;
        color: #2d88f9;
        position: relative;
        top: 3px;
      }
    }
  }
  .center {
    padding: 20px 10px;
    line-height: 63.5px;
    span {
      font-size: 14px;
      font-weight: 500;
      color: #303133;
    }
    .classL {
      position: relative;
      .el-switch__label--right {
        position: absolute;
        left: 13px;
        top: -1px;
        display: none;
        span {
          font-size: 10px;
          color: #e6e6e6;
        }
      }
      .el-switch__label--left {
        position: absolute;
        right: 14px;
        top: -1px;
        z-index: 3;
      }
      span {
        font-size: 10px;
        color: #e6e6e6;
      }
    }
    .classR {
      position: relative;
      .el-switch__label--right {
        position: absolute;
        left: 13px;
        top: -1px;
        span {
          font-size: 10px;
          color: #e6e6e6;
        }
      }
      .el-switch__label--left {
        position: absolute;
        right: 15px;
        top: -1px;
        z-index: 3;
        display: none;
      }
      span {
        font-size: 10px;
        color: #e6e6e6;
      }
    }
  }
}
</style>

