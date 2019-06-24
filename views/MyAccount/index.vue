<template>
  <div class="my-account">
    <el-tabs v-model="activeItem" type="card" >
      <el-tab-pane label="基本信息" name="first">
        <el-form ref="accountInfo" :model="accountInfo" label-width="110px" v-if="accountType != 1">
          <el-form-item label="企业名称">
            <span>{{accountInfo.entName}}</span>
          </el-form-item>
          <el-form-item label="企业邮箱">
            <el-input v-model="accountInfo.entEmail" maxlength="30" auto-complete="off" />
            <span class="item-necessary">*</span>
          </el-form-item>
          <el-form-item label="账号密码" v-if="accountInfo.oldEntEmail != accountInfo.entEmail">
            <el-input v-model="accountInfo.password" auto-complete="off" placeholder="请输入密码" type="password" :maxlength="20" />
          </el-form-item>
          <el-form-item label="邮箱验证码" v-if="accountInfo.oldEntEmail != accountInfo.entEmail">
            <el-input v-model="accountInfo.entEmailCode" auto-complete="off" placeholder="请输入验证码" :maxlength="10" class="email-code" />
            <GetIdentifyCode :code="accountInfo.entEmail" type="email" style="height: 40px; line-height: 40px"/>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="accountInfo.entPhone" maxlength="13" auto-complete="off" type="tel" onkeyup="this.value=this.value.replace(/[^\d-]/g,'')"/>
          </el-form-item>
          <el-form-item label="联系地址">
            <el-input type="textarea" v-model="accountInfo.entAddress" autosize maxlength="50" auto-complete="off" />
          </el-form-item>
          <!--<el-form-item label="代理商邀请码">
            <el-input v-model="accountInfo.channelInvestCode" v-if="oldInfo.channelInvestCode === ''" maxlength="6" auto-complete="off" />
            <span v-else>{{accountInfo.channelInvestCode}}</span>
          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="saveInfo" :disabled="saveInfoButton">保存</el-button>
          </el-form-item>
        </el-form>
        <el-form ref="accountInfo" :model="accountInfo" label-width="110px" v-else>
          <el-form-item label="企业名称">
            <span>{{accountInfo.entName}}</span>
          </el-form-item>
          <el-form-item label="企业邮箱">
            <span>{{accountInfo.entEmail}}</span>
          </el-form-item>
          <el-form-item label="联系电话">
            <span>{{accountInfo.entPhone}}</span>
          </el-form-item>
          <el-form-item label="联系地址">
            <span>{{accountInfo.entAddress}}</span>
          </el-form-item>
          <!--<el-form-item label="代理商邀请码">
            <span>{{accountInfo.channelInvestCode}}</span>
          </el-form-item>-->
          <el-form-item label="个人名称">
            <el-input v-model="accountInfo.userName" maxlength="10" auto-complete="off" />
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="accountInfo.userPhone" maxlength="11" />
          </el-form-item>
          <el-form-item label="账号密码" v-if="accountInfo.oldUserPhone != accountInfo.userPhone">
            <el-input v-model="accountInfo.password" auto-complete="off" placeholder="请输入密码" type="password" :maxlength="20" />
          </el-form-item>
          <el-form-item label="手机验证码" class="alter-email" v-if="accountInfo.oldUserPhone != accountInfo.userPhone">
            <el-input v-model="accountInfo.userPhoneCode" auto-complete="off" placeholder="请输入验证码" :maxlength="10" class="phone-code" />
            <GetIdentifyCode :code="accountInfo.userPhone" type="phone" style="height: 40px; line-height: 40px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveInfo" :disabled="saveInfoButton">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="`企业成员(${totalCount})人`" name="second" v-if="accountType != 1">
        <input v-model="searchMember" placeholder="查找相关成员" class="search-member" />
        <el-button class="serachButton" type="primary" @click="searchByKeyword" :disabled="searchByKeywordButton">查询</el-button>
        <el-button class="serachButton" type="danger" @click="resetKeyword" :disabled="resetKeywordButton">重置</el-button>
        <el-table :data="showArr" stripe style="width: 620px" >
          <el-table-column prop="lastName" label="" width="80" >
            <template slot-scope="scope">
              <div class="username-circle">{{scope.row.lastName}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="姓名" width="180" />
          <el-table-column prop="phone" label="手机" width="180" />
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="danger"  @click="deleteMember(scope.row)" :disabled="deleteEmployeeButton">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--<el-table :data="showArr" stripe style="width: 440px" v-else>
          <el-table-column prop="lastName" label="" width="80" >
            <template slot-scope="scope">
              <div class="username-circle">{{scope.row.lastName}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="姓名" width="180" />
          <el-table-column prop="phone" label="手机" width="180" />
        </el-table>-->
        <TablePagination :tableCount="count" :getList="getEmployees" :pageIndex="pageIndex" v-show="showArr.length != 0"/>
        <el-button type="text" icon="el-icon-circle-plus" @click="addNewMemberDialogVisible = true" v-if="accountType != 1">添加新成员</el-button>
        <el-dialog title="邀请新成员" :visible.sync="addNewMemberDialogVisible" custom-class="invite-dialog" @close="closeAddDialog">
          <el-form v-model="inviteInfo">
            <el-form-item label="手机号码" :label-width="formLabelWidth">
              <el-input v-model="inviteInfo.userPhone" auto-complete="off" maxlength="11" type="tel" onkeyup="this.value=this.value.replace(/[^\d]/g,'')"/>
              <el-button type="text" @click="getMember" :disabled="searchEmployeeButton">搜索</el-button>
            </el-form-item>
            <el-form-item label="成员名称" :label-width="formLabelWidth">
              <el-input v-model="inviteInfo.userName" auto-complete="off" maxlength="10" />
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <el-button type="primary" @click="inviteMember" :disabled="inviteEmployeeButton">确定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="third">
        <el-form ref="password" :model="password" label-width="110px" >
          <el-form-item label="当前密码">
            <el-input v-model="password.oldPassword" type="password" maxlength="20" auto-complete="off" />
            <span class="item-necessary">*</span>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="password.newPassword1" type="password" maxlength="20" auto-complete="off" />
            <span class="item-necessary">*</span>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input v-model="password.newPassword2" type="password" maxlength="20" auto-complete="off" />
            <span class="item-necessary">*</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updatePassword" :disabled="updatePwdButton">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { updatePwd } from '@/api/password'
  import { getAccountInfo, updateAccountInfo, getEmployeeByPhne, inviteEmployee, getEmployeeInfo, deleteEmployee, updateInfoCheckPassword } from '@/api/account'
  import { mapGetters } from 'vuex'
  import { isvalidatemobile, isvalidatetel, validatename, validateEmail } from '@/util/validate'
	import GetIdentifyCode from '@/components/GetIdentifyCode.vue'
	import TablePagination from '@/components/TablePagination.vue'

	export default {
    name: 'MyAccount',

		components: {
			GetIdentifyCode,
			TablePagination,
		},

    data() {
      return {
        activeItem: 'first',
        count: 0,
        totalCount: 0,
        member: [],
        showArr: [],
        addNewMemberDialogVisible: false,
        formLabelWidth: '80px',
        searchMember: '',
        saveInfoButton: false,
        inviteEmployeeButton: false,
        updatePwdButton: false,
        deleteEmployeeButton: false,
				searchEmployeeButton: false,
				searchByKeywordButton: false,
				resetKeywordButton: false,
        loading: false,
				loadingDialog: false,
        inviteInfo: {
          userPhone: '',
          userName: '',
        },
        oldInfo: {
          entEmail: '',
          entPhone: '',
          entAddress: '',
					channelInvestCode: '',
					userName: '',
					userPhone: '',
        },
        accountInfo: {
          entName: '',
          entAddress: '',
          entDutyNo: '',
          entEmail: '',
					oldEntEmail: '',
					entEmailCode: '',
          channelInvestCode: '',
          entPhone: '',
          isBandWx: false,
          userName: '',
          userPhone: '',
          oldUserPhone: '',
          userPhoneCode: '',
          accountId: '',
          password: '',
        },
        password: {
          oldPassword: '',
          newPassword1: '',
          newPassword2: '',
        },
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
    created() {
      if(this.accountId) {
        this.init(this.accountId)
      }
			if(!this.userInfo.status) {
				this.$router.push('/')
			}
    },

    watch: {
      accountId(value) {
        if(value) {//退出登录时不请求接口
          this.init(value)
        } else {
          this.$router.push('/')
        }
      },

      member(value) {
        this.showArr = value
      },

/*
      searchMember(value) {
        let arr = []
        let member = this.member
        member.map(function (item) {
          if(item.userName.indexOf(value) != -1 || item.phone.indexOf(value) != -1) {
            arr.push(item)
          }
        })
        this.showArr = arr
        this.getEmployees({
					keyWord: value
        })
      }
*/
    },

    methods: {
      init (id) {
				this.getEmployees({
					userId: id
        })

        if(!this.loading) {
					this.loading = true
        }

        getAccountInfo(id).then((res) => {
          this.loading = false
          if(res.data) {
            let data = res.data.data
            this.accountInfo.entName = data.entName || ''
            this.accountInfo.entAddress = data.entAddress && data.entAddress.replace(/\n/g, '') || ''
            this.accountInfo.entDutyNo = data.entDutyNo || ''
            this.accountInfo.entEmail = data.entEmail || ''
            this.accountInfo.oldEntEmail = data.entEmail || ''
            this.accountInfo.entEmailCode = data.entEmailCode || ''
            this.accountInfo.channelInvestCode = data.channelInvestCode || ''
            if(this.accountInfo.channelInvestCode === 'TZ0000') {
							this.accountInfo.channelInvestCode = ''
            }
            this.accountInfo.entPhone = data.entPhone || ''
            this.accountInfo.oldEntPhone = data.entPhone || ''
            this.accountInfo.isBandWx = data.isBandWx
            this.accountInfo.userName = data.userName || ''
            this.accountInfo.userPhone = data.userPhone || ''
            this.accountInfo.oldUserPhone = data.userPhone || ''
            this.accountInfo.userPhoneCode = data.userPhoneCode || ''
            this.accountInfo.password = data.password || ''
            this.accountInfo.accountId = id
            this.oldInfo.entEmail = data.entEmail || ''
            this.oldInfo.entPhone = data.entPhone || ''
            this.oldInfo.entAddress = data.entAddress && data.entAddress.replace(/\n/g, '') || ''
            this.oldInfo.channelInvestCode = data.channelInvestCode || ''
						if(this.oldInfo.channelInvestCode === 'TZ0000') {
							this.oldInfo.channelInvestCode = ''
						}
						this.oldInfo.userPhone = data.userPhone || ''
						this.oldInfo.userName = data.userName || ''

					}
        })
      },
			getEmployees({
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
          if(this.totalCount === 0) {
						this.totalCount = count
          }
          this.count = count
					let newData = data.map(function (item) {
						item.userName = item.userName || '腾住会员'
						let lastName = item.userName[item.userName.length-1]
						return {
							...item,
							lastName: lastName
						}
					})
					this.member = newData
				})
      },
			searchByKeyword() {
        this.getEmployees({
          keyWord: this.searchMember
        })
      },
			resetKeyword() {
				this.searchMember = ''
				this.getEmployees({
					keyWord: this.searchMember
				})
      },
      saveInfo() {
        if(this.accountInfo.entEmail != this.oldInfo.entEmail
        || this.accountInfo.entPhone != this.oldInfo.entPhone
        || this.accountInfo.entAddress != this.oldInfo.entAddress
        || this.accountInfo.channelInvestCode != this.oldInfo.channelInvestCode
        || this.accountInfo.userName != this.oldInfo.userName
        || this.accountInfo.userPhone != this.oldInfo.userPhone) {
          this.accountInfo.entAddress = this.accountInfo.entAddress && this.accountInfo.entAddress.replace(/\n/g, '') || ''
					if(this.accountType === 0) {
						if(this.accountInfo.entEmail.length > 0) {
							if(validateEmail(this.accountInfo.entEmail)) {
								if(this.accountInfo.entEmail === this.accountInfo.oldEntEmail || ((this.accountInfo.entEmail != this.oldEntEmail) && this.accountInfo.password)) {
									if(this.accountInfo.entEmail === this.accountInfo.oldEntEmail || ((this.accountInfo.entEmail != this.accountInfo.oldEntEmail) && this.accountInfo.entEmailCode)) {
										if(this.accountInfo.entPhone.length <= 0 || isvalidatemobile(this.accountInfo.entPhone)[0] === true || isvalidatetel(this.accountInfo.entPhone)) {
											this.saveInfoButton = true
                      this.loading = true
											if(this.accountInfo.entEmail != this.accountInfo.oldEntEmail) {
												updateInfoCheckPassword(this.accountInfo.oldEntEmail, this.accountInfo.password).then((res) => {
                          console.log(res.data.data)
                          if(res.data && res.data.code === 0 && res.data.data) {
														updateAccountInfo(this.accountInfo).then((res) => {
															this.saveInfoButton = false
                              this.loading = false
															if(res.data && res.data.code === 0) {
																this.$message.success('信息修改成功')
																this.$store.dispatch('QuickLogin')
																this.$router.push('/')
															}else{
																if (res.data.msg) {
																	this.$message.error(res.data.msg)
																}
															}
														})
													} else {
														this.saveInfoButton = false
                            this.loading = false
														this.$message.error('请输入正确的密码')
													}
												})
											} else {
												updateAccountInfo(this.accountInfo).then((res) => {
													this.saveInfoButton = false
                          this.loading = false
													if(res.data && res.data.code === 0) {
														this.$message.success('信息修改成功')
													}else{
														if (res.data.msg) {
															this.$message.error(res.data.msg)
														}
													}
												})
											}
										} else {
											this.$message.error('请输入手机号或者固定电话')
										}
									} else {
										this.$message.error('请输入验证码')
									}
								} else {
									this.$message.error('请输入账号密码')
								}
							} else {
								this.$message.error('请输入正确的邮箱')
							}
						} else {
							this.$message.error('请输入邮箱账号')
						}
					} else {
            let isValidate = true
            if(this.accountInfo.userName.length > 0) {
              if(!validatename(this.accountInfo.userName)) {
                this.$message.error('请输入正确的姓名')
                isValidate = false
              }
            }
            if(this.accountInfo.userPhone.length > 0) {
              if(isvalidatemobile(this.accountInfo.userPhone)[0] === true) {
                if((this.accountInfo.userPhone != this.accountInfo.oldUserPhone) && !this.accountInfo.password) {
                  this.$message.error('请输入账号密码')
                  isValidate = false
                } else {
                  if((this.accountInfo.userPhone != this.accountInfo.oldUserPhone) && !this.accountInfo.userPhoneCode) {
                    this.$message.error('请输入验证码')
                    isValidate = false
                  }
                }
              } else {
                this.$message.error(isvalidatemobile(this.accountInfo.userPhone)[1])
                isValidate = false
              }

              if(isValidate) {
                this.saveInfoButton = true
                this.loading = true
                if(this.accountInfo.userPhone != this.accountInfo.oldUserPhone) {
                  updateInfoCheckPassword(this.accountInfo.oldUserPhone, this.accountInfo.password).then((res) => {
                    if(res.data && res.data.code === 0 && res.data.data) {
                      updateAccountInfo(this.accountInfo).then((res) => {
                        this.saveInfoButton = false
                        this.loading = false
                        if(res.data && res.data.code === 0) {
                          this.$message.success('信息修改成功')
                          this.$store.dispatch('QuickLogin')
                          this.$router.push('/')
                        }else{
                          if (res.data.msg) {
                            this.$message.error(res.data.msg)
                          }
                        }
                      })
                    } else {
                      this.saveInfoButton = false
                      this.loading = false
                      this.$message.error('请输入正确的密码')
                    }
                  })
                } else {
                  updateAccountInfo(this.accountInfo).then((res) => {
                    this.saveInfoButton = false
                    this.loading = false
                    if(res.data && res.data.code === 0){
                      this.$message.success('信息修改成功')
                    }else{
                      if (res.data.msg) {
                        this.$message.error(res.data.msg)
                      }
                    }
                  })
                }
              }
            } else {
              this.$message.error('请输入手机号')
            }
          }
        } else {
          this.$message.error('您未修改任何信息')
        }

      },

			updatePassword() {
        let password = this.password
        if(password.oldPassword.length > 0) {
          if(password.newPassword1.length > 0) {
            if(password.newPassword2.length > 0) {
              if(password.oldPassword.length < 6 || password.newPassword1.length < 6 || password.newPassword2.length < 6 || password.oldPassword.length > 20 || password.newPassword1.length > 20 || password.newPassword2.length > 20) {
                this.$message.error('密码长度为6-20位')
              } else {
								if(password.newPassword1 === password.newPassword2) {
                  if(password.newPassword1 === password.oldPassword) {
										this.$message.error('输入的新密码不能与输入的旧密码一致')
                  } else if (password.newPassword1.trim() === '') {
                    this.$message.error('密码不能为纯空格')
                  } else {
										this.updatePwdButton = true
                    this.loading = true
										updatePwd(this.accountId, this.accountType, password.newPassword1, password.oldPassword).then((res) => {
											this.updatePwdButton = false
                      this.loading = false
											if(res.data && res.data.code === 0){
												this.$message.success('密码修改成功')
												this.$store.dispatch('QuickLogin')
                        this.$router.push('/')
											}else{
                        if (res.data.msg) {
                          this.$message.error(res.data.msg)
                        }
											}
										})
									}
                } else {
                  this.$message.error('两次输入的密码不一致')
                }
              }
            } else {
              this.$message.error('请确认新密码')
            }
          } else {
            this.$message.error('请输入新密码')
          }
        } else {
          this.$message.error('请输入当前密码')
        }
      },

      getMember() {
        let inviteInfo = this.inviteInfo
        if(isvalidatemobile(inviteInfo.userPhone)[0] === true) {
          this.searchEmployeeButton = true
					this.loadingDialog = true

					getEmployeeByPhne(inviteInfo.userPhone).then((res) => {
						this.searchEmployeeButton = false
						this.loadingDialog = false

						if(res.data && res.data.code === 0) {
              if(res.data.data['userName']) {
                this.inviteInfo.userName = res.data.data['userName']
              } else {
                this.$message({
                  message: '未查找到成员名称，请手动输入成员姓名', 
                  type: 'warning'
                })
              }
            }else{
              if (res.data.msg) {
                this.$message.error(res.data.msg)
              }
            }
          })
        } else {
          this.$message.error(isvalidatemobile(inviteInfo.userPhone)[1])
        }
      },

      deleteMember(row) {
        this.deleteEmployeeButton = true
        this.loading = true
        this.$confirm('是否将该成员移除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteEmployee(this.accountId, row.userId).then((res) => {
            this.deleteEmployeeButton = false
            this.loading = false
            if(res.data && res.data.code === 0) {
              this.$message.success('该成员已移除')
              let member = this.member
              let arr = []
              member.map(function (item) {
                if(item.userId != row.userId) {
                  arr.push(item)
                }
              })
              this.member = arr

							this.count = this.arr.length

            } else {
              if (res.data.msg) {
                this.$message.error(res.data.msg)
              }
            }
          })
        }).catch(() => {
          this.deleteEmployeeButton = false
        })
      },

      inviteMember() {
        let inviteInfo = this.inviteInfo
        if(isvalidatemobile(inviteInfo.userPhone)[0] === true) {
          if(inviteInfo.userPhone.length > 0) {
            if(validatename(inviteInfo.userName)) {
              this.inviteEmployeeButton = true
              this.loadingDialog = true
              inviteEmployee(this.accountInfo.accountId, inviteInfo.userName, inviteInfo.userPhone).then((res) => {
                this.inviteEmployeeButton = false
                this.loadingDialog = false

                if(res.data && res.data.code === 0) {
									if(res.data.data.firstInvited) {
										this.$message.success('邀请已发送')
										this.addNewMemberDialogVisible = false
										this.member.push({
											lastName: inviteInfo.userName[inviteInfo.userName.length-1],
											userName: inviteInfo.userName,
											phone: inviteInfo.userPhone,
											userId: res.data.data.userId,
										})
										this.count = this.member.length
										this.inviteInfo = {
											userName: '',
											userPhone: '',
										}
									} else {
										this.$message.success('邀请已发送,等待成员确认！')
										this.addNewMemberDialogVisible = false
										this.inviteInfo = {
											userName: '',
											userPhone: '',
										}
									}

                }else{
                  if (res.data.msg) {
                    this.$message.error(res.data.msg)
                  }
                }
              })
            } else {
              this.$message.error('请输入正确的姓名')
            }
          } else {
            this.$message.error('请输入员工姓名')
          }
        } else {
          this.$message.error(isvalidatemobile(inviteInfo.userPhone)[1])
        }
      },

			closeAddDialog() {
        this.inviteInfo = {
					userPhone: '',
          userName: '',
				}
      },
    }
  }
</script>

<style lang="less">
	@import './style.less';
</style>
