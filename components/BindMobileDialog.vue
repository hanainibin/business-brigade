<template>
  <el-dialog title="请先绑定手机号" :visible.sync="bindMobileDialogVisible" width="470px" :close-on-click-modal="false"
             :close-on-press-escape="false" class="bind-mobile-dialog" :before-close="handleClose">
    <el-form :model="bindValue" :rules="formRules" ref="bindFormRef">
      <el-form-item label="手机号码" label-width="110px" prop="mobile">
        <el-input class="mobile-input-cover" v-model="bindValue.mobile" auto-complete="off"
                  type="tel" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="手机验证码" label-width="110px" prop="vCode">
        <el-input class="vcode-input-cover" v-model="bindValue.vCode" auto-complete="off"></el-input>
        <GetIdentifyCode :code="bindValue.mobile"/>
      </el-form-item>
      <el-button class="bind-btn" type="primary" @click="handleBind">绑定</el-button>
    </el-form>
  </el-dialog>
</template>

<script>
import GetIdentifyCode from '@/components/GetIdentifyCode'
import { mapGetters, mapMutations } from 'vuex'
import { bindPhone } from '@/api/user'
import { removeStore } from '@/util/store'

export default {
  name: 'BindMobileDialog',
  components: {
    GetIdentifyCode
  },
  data() {
    return {
      bindValue: {
        mobile: '',
        vCode: ''
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确手机号码', trigger: 'blur' }
        ],
        vCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([ 'bindMobileDialogVisible', 'wechatId' ])
  },
  methods: {
    ...mapMutations([ 'setState' ]),
    handleClose() {
      this.setState({
        key: 'bindMobileDialogVisible',
        module: 'user',
        value: false
      })
    },
    handleBind() {
      this.$refs.bindFormRef.validate((valid) => {
        if(valid){
          console.log(valid)
          bindPhone({
            phone: this.bindValue.mobile,
            code: this.bindValue.vCode,
            unionid: this.wechatId,
            loginType: 1
          }).then(res => {
            if (res.data.code === 0) {
              let resDate = res.data
              this.$store.dispatch('LoginSuccess', {
                data: resDate.data,
                router: this.$router
              })
              this.$store.state.user.wechatId = ''
              removeStore({
                name: 'wechatId'
              })
              window.location.pathname = ''
            }
          })
        }else{
          return false
        }
      })
    }
  }
}
</script>
<style lang="less">
  .bind-mobile-dialog{
    .el-form-item{
      .el-form-item__label{
        text-align: left;
      }
      .mobile-input-cover{
        width: 265px;
      }
      .vcode-input-cover{
        width: 145px;
        padding-right: 26px;
      }
    }
    .bind-btn{
      margin-left: 110px;
    }
  }
</style>