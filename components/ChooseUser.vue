<template>
  <div class="wrapper">
    <input v-model="searchMember" placeholder="查找相关成员" class="search-member" />
    <el-button class="serachButton" type="primary" @click="searchByKeyword" :disabled="searchByKeywordButton">查询</el-button>
    <el-button class="serachButton" type="danger" @click="resetKeyword" :disabled="resetKeywordButton">重置</el-button>
    <el-table :data="showArr"  ref="singleTable"
              highlight-current-row
              @row-click="handleCurrentChange"
              style="width: 620px" >
      <el-table-column prop="lastName" label="" width="80" >
        <template slot-scope="scope">
          <div class="username-circle">{{scope.row.lastName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="姓名" width="180" align= 'center'/>
      <el-table-column prop="phone" label="手机" width="180" align= 'center'/>
    </el-table>
    <TablePagination :tableCount="count" :getList="getEmployees" :pageIndex="pageIndex" v-show="showArr.length != 0"/>
  </div>
</template>

<script>
import { getEmployeeByPhne, getEmployeeInfo } from '@/api/account'
import { mapGetters } from 'vuex'
import { isvalidatemobile } from '@/util/validate'
import TablePagination from '@/components/TablePagination.vue'

export default {
  name: 'ChooseUser',
  components: {
    TablePagination,
  },

  data () {
    return {
      activeItem: 'first',
      count: 0,
      totalCount: 0,
      member: [],
      showArr: [],
      currentRow: [],
      searchMember: '',
      saveInfoButton: false,
      searchEmployeeButton: false,
      searchByKeywordButton: false,
      resetKeywordButton: false,
      loading: false,
      loadingDialog: false,
      pageIndex: 1,
    }
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'accountId', 'accountType'
    ])
  },
  created () {
    if (this.accountId) {
      this.init(this.accountId)
    }
    if (!this.userInfo.status) {
      this.$router.push('/')
    }
  },

  watch: {
    accountId (value) {
      if (value) {//退出登录时不请求接口
        this.init(value)
      } else {
        this.$router.push('/')
      }
    },
    member (value) {
      this.showArr = value
    },
  },

  methods: {
    setCurrent (row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange (val) {
      this.addNewMemberDialogVisible = false
      this.currentRow = val
      this.currentUser = val
      console.log(this.currentUser, 'user')
      this.$emit('childByValue', this.currentUser, this.addNewMemberDialogVisible)
      this.$emit('approvalValue', this.currentUser, this.addNewMemberDialogVisible)
      this.$emit('childRoomAdd', this.currentUser, false)
      this.$emit('childRoomCheck', this.currentUser, false)
    },
    init (id) {
      this.getEmployees({
        userId: id
      })

      if (!this.loading) {
        this.loading = true
      }
    },
    getEmployees ({
      keyWord = this.searchMember,
      page = 1,
      userId = this.accountId,
      limit = 10,
      offset = 0,
    } = {}) {
      this.loading = true
      this.searchByKeywordButton = true
      this.resetKeywordButton = true
      getEmployeeInfo({
        keyWord,
        page,
        userId,
        limit,
        offset,
      }).then((res) => {
        this.loading = false
        this.searchByKeywordButton = false
        this.resetKeywordButton = false
        this.pageIndex = page
        let data = res.data.data.data
        let count = res.data.data.count
        if (this.totalCount === 0) {
          this.totalCount = count
        }
        this.count = count
        let newData = data.map(function (item) {
          item.userName = item.userName || '腾住会员'
          let lastName = item.userName[item.userName.length - 1]
          return {
            ...item,
            lastName: lastName
          }
        })
        this.member = newData
      })
    },
    searchByKeyword () {
      this.getEmployees({
        keyWord: this.searchMember
      })
    },
    resetKeyword () {
      this.searchMember = ''
      this.getEmployees({
        keyWord: this.searchMember
      })
    },

    getMember () {
      let inviteInfo = this.inviteInfo
      if (isvalidatemobile(inviteInfo.userPhone)[0] === true) {
        this.searchEmployeeButton = true
        this.loadingDialog = true
        getEmployeeByPhne(inviteInfo.userPhone).then((res) => {
          this.searchEmployeeButton = false
          this.loadingDialog = false

          if (res.data && res.data.code === 0) {
            if (res.data.data['userName']) {
              this.inviteInfo.userName = res.data.data['userName']
            } else {
              this.$message.error('未查到员工信息，请手动输入')
            }
          } else {
            if (res.data.msg) {
              this.$message.error(res.data.msg)
            }
          }
        })
      } else {
        this.$message.error(isvalidatemobile(inviteInfo.userPhone)[1])
      }
    },
  }
}
</script>

<style lang="less">
.wrapper {
  display: inline;
  text-align: center;
  .el-form {
    width: 472px;
  }
  .username-circle {
    background-color: #1e9fff;
    width: 28px;
    height: 28px;
    font-size: 14px;
    line-height: 28px;
    text-align: center;
    border-radius: 50%;
    color: #ffffff;
  }

  .el-input,
  .el-textarea {
    width: 220px;
    display: inline-block;
  }

  .el-form-item__label {
    text-align: left;
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

      /deep/.el-table__header-wrapper {
        cursor: pointer !important;
        .el-table__header {
          // .has-gutter {
          //   .el-table_1_column_2 {
          //     .cell {
          //       color: red;
          //     }
          //   }
          // }
          .el-table th > .cell {
            text-align: center;
          }
        }
      }
      .el-table__body-wrapper {
        // cursor: pointer;
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

  .search-member {
    width: 260px !important;
    height: 38px;
    border-radius: 4px;
    border: 0.5px solid #dcdfe6;
    outline: none;
    color: #606266;
    text-indent: 12px;
    line-height: 38px;
  }

  .serachButton {
    margin-left: 20px;
    span {
      color: #ffffff !important;
    }
  }
  .table-pagination {
    margin-left: -36px;
  }

  .is-in-pagination {
    width: 27px !important;
  }
  // el-button {
  //   i {
  //     color: #1e9fff !important;
  //   }
  // }
}
</style>
