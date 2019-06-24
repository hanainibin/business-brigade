<template>
  <el-dialog title="邀请信息" :visible.sync="invitationDialogVisible" custom-class="invitation-dialog" :close-on-click-modal="false" :close-on-press-escape="false">
    <span>{{invitationMessage}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="acceptInvitation">接 受</el-button>
      <el-button @click="refuseInvitation">拒 绝</el-button>
    </span>
  </el-dialog>
</template>

<script>
	import { getMessage, isAgreeMessage } from '@/api/message'
	import { mapGetters } from 'vuex'

	export default {
		name: "MessageDialog",

		data () {
			return {
				invitationDialogVisible: false,
				invitationMessage: '',
				message: {
					employeeName: '',
					employeePhone: '',
					entName: '',
					isRead: '',
					messageId: '',
				},
			}
		},

		created () {
			if(this.accountId) {
				getMessage(this.accountId).then((res) => {
					if(res.data && res.data.code === 0) {
						if(res.data.data.messageDetails && res.data.data.messageDetails.length > 0) {
							let message = res.data.data.messageDetails[0]
							this.message = {...message}
							if(message.isRead == '0') {
								this.invitationMessage = `【${message.entName}】邀请您加入该团队，是否接受？`
								this.invitationDialogVisible = true
							}
						}
					}
				})
			}
		},

		computed: {
			...mapGetters(['accountId'])
		},

		watch: {
			accountId (value) {
				if(value) {
					getMessage(value).then((res) => {
						if(res.data && res.data.code === 0) {
							if(res.data.data.messageDetails && res.data.data.messageDetails.length > 0) {
								let message = res.data.data.messageDetails[0]
								this.message = {...message}
								if(message.isRead == '0') {
									this.invitationMessage = `【${message.entName}】邀请您加入该团队，是否接受？`
									this.invitationDialogVisible = true
								}
							}
						}
					})
				}
			},
		},

		methods: {
			processInvitation(isAgree) {
				isAgreeMessage(isAgree, this.message.messageId, this.accountId).then((res) => {
					this.invitationDialogVisible = false
					if(res.data && res.data.code != 0) {
						if (res.data.msg) {
							this.$message.error(res.data.msg)
						}
					}
				})
			},
			acceptInvitation() {
				this.processInvitation(1)
			},
			refuseInvitation() {
				this.processInvitation(0)
			},
		},
	}
</script>

<style scoped>

</style>