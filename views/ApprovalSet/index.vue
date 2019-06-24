<template>
  <div class="content-wrapper">
    <el-tabs v-model="activeItem" type="card" >
      <el-tab-pane label="审批设置" name="first" v-if="userType === 0">
        <div class="top">
          <span class="final-admin">最终审批人:</span>
          <el-dialog title="添加成员" :visible.sync="addNewMemberDialogVisible" custom-class="user-set-dialog">
            <choose-user :userInfo= "userInfo" @childByValue= 'childByValue'></choose-user>
          </el-dialog>
          <span>{{childUserName}}</span>
          <i class="el-icon-circle-plus el-icon--center"
             @click="addNewMemberDialogVisible = true"
          >
          </i>
        </div>
        <div class="center">
          <span>审批模式:</span>
          <el-switch
            :class="topDisplay ? classR: classL"
            :width = 90
            style="display: inline"
            v-model="modelValue"
            active-value='0'
            inactive-value='1'
            @change="changeModel(modelValue)"
            active-color="#13ce66"
            inactive-color="gray"
            active-text="平行审批"
            inactive-text="逐级审批">
          </el-switch>
        </div>
        <div class="bottom">
          <span> 管理员审批:</span>
          <el-switch
            :class="displayBool ? classB : classA"
            :width=100
            style="display: inline"
            v-model="adminValue"
            active-value='0'
            inactive-value='1'
            @change="changeAdmin(adminValue)"
            active-color="#13ce66"
            inactive-color="gray"
            active-text="人工审批"
            inactive-text="自动审批">
          </el-switch>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="userType === 0 ? '申请列表' : '我的申请单'" name="second">
        <MyApproval :userType="userType" :entMembers="entMembers"/>
      </el-tab-pane>
      <el-tab-pane label="审批列表" name="third" v-if="userType === 1">
        <ApprovalList :userType="userType" :entMembers="entMembers" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ChooseUser from '@/components/ChooseUser.vue'
import { approvalSet, getModel, getEntMembers } from '@/api/approval'
import ApprovalList from './ApprovalList'
import MyApproval from './MyApproval'
import { mapGetters } from "vuex";
import { getUserInfo } from '@/api/login'

export default {
  name: 'ApprovalSet',
  components: {
    ChooseUser,
    ApprovalList,
    MyApproval
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    },
  },
  data () {
    return {
      modelValue: '',
      adminValue: '',
      // userChildValue: '',
      childUserId: '',
      childUserName: '',
      addNewMemberDialogVisible: false,
      userChildValue: '',
      activeItem: 'first',
      displayBool: true,
      topDisplay: true,
      classA: 'left',
      classB: 'right',
      classL: 'classL',
      classR: 'classR',
      userType: 0,
      firstTime: true,
      entMembers: []
    }
  },
  mounted () {
    this.readygetModel();
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
    getEntMembers().then(res => {
      if (res.data.code === 0) {
        this.entMembers = res.data.data;
      } else {
        if (res.data.msg) {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      }
    });
  },
  watch: {
    modelValue (val) {
      if (val == 0) {
        this.topDisplay = true
      }
      if (val == 1)
        this.topDisplay = false
      // this.readyApproval()
    },
    adminValue (val) {
      if (val == 0) {
        this.displayBool = true
      }
      if (val == 1) {
        this.displayBool = false
      }
      // this.readyApproval()
    }
  },
  methods: {
    readyApproval () {
      if (this.childUserId.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择最终审批人'
        })
      }
      approvalSet({
        finalCheckPepole: this.childUserId,
        checkType: this.modelValue,
        adminCheck: this.adminValue,
      }).then(res => {
        console.log(res)
        let bool = typeof (res.data.data.entId) === "undefined"
        if (!bool) {
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.readygetModel()
        }
        // else {
        //   this.$message({
        //     type: 'warning',
        //     message: res.data.data.msg
        //   })
        // }
      })
    },
    readygetModel () {
      getModel().then(res => {
        console.log(res)
        let resData = res.data
        if (resData && resData.code == 0 && resData.data.constructor === Object) {
          this.childUserName = resData.data.approvalPeople.name
          console.log(this.childUserName, 'this.childUserName')
          this.childUserId = resData.data.approvalPeople.userId
          this.modelValue = resData.data.checkType.toString()
          this.adminValue = resData.data.adminCheck.toString()
          console.log(resData.data.checkType, ' this.modelValue')
        }
        else {
          this.$message({
            message: resData.msg,
            type: 'warning'
          })
        }
      })
    },
    childByValue (val, val2) {
      console.log(val, 'child')
      console.log(val2, 'bool')
      // this.userChildValue = val
      this.childUserId = val.realUserId
      this.childUserName = val.userName
      this.addNewMemberDialogVisible = val2
      this.readyApproval()
    },
    changeModel () {
      this.readyApproval()
    },
    changeAdmin () {
      this.readyApproval()
    }
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
    .final-admin {
      color: #58666e;
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
        right: 11px;
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
        left: 11px;
        top: -1px;
        z-index: 3;
        span {
          font-size: 10px;
          color: #e6e6e6;
        }
      }
      .el-switch__label--left {
        position: absolute;
        right: 15px;
        top: -1px;
        display: none;
      }
      span {
        font-size: 10px;
        color: #e6e6e6;
      }
    }
  }
  .bottom {
    padding: 20px 10px;
    span {
      font-size: 14px;
    }
    .left {
      position: relative;
      top: -3px;
      .el-switch__label--right {
        position: absolute;
        left: 14px;
        top: -2px;
        display: none;
        span {
          font-size: 10px;
          color: #ffffff;
        }
      }
      .el-switch__label--left {
        position: absolute;
        left: 29px;
        top: -2px;
        z-index: 3;
        // display: none;
        span {
          font-size: 10px;
          color: #ffffff;
        }
      }
    }
    .right {
      position: relative;
      top: -3px;
      .el-switch__label--right {
        position: absolute;
        left: 14px;
        top: -2px;
        // display: none;
        z-index: 3;
        span {
          font-size: 10px;
          color: #ffffff;
        }
      }
      .el-switch__label--left {
        position: absolute;
        right: 18px;
        top: -2px;
        display: none;
        span {
          font-size: 10px;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
