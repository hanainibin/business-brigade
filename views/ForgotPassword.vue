<template>
  <div class="forgot-password-wrapper">
    <el-form class="forgot-password" :label-position="labelPosition" label-width="90px" :model="fogotPwdForm" 
             :rules="fogotPwdRules" ref="fogotPwdForm">
      <!-- 账号 -->
      <el-form-item prop="account" label="手机或邮箱" class="fogot-password-item">
        <el-input v-model="fogotPwdForm.account" auto-complete="off" placeholder="请输入手机号或邮箱" 
                  :maxlength="30"/>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item prop="identifyCode" label="验证码" class="fogot-password-item">
        <el-row :span="24">
          <el-col :span="16">
            <el-input type="tel" @keyup.enter.native="handleLogin" v-model="fogotPwdForm.identifyCode" 
                      auto-complete="off" placeholder="请输入验证码" :maxlength="10"/>
          </el-col>
          <el-col :span="8" class="button-code-cover">
            <GetIdentifyCode :code="fogotPwdForm.account"/>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 新密码 -->
      <el-form-item prop="newPassword" label="新密码" class="fogot-password-item">
        <el-input type="password" v-model="fogotPwdForm.newPassword" auto-complete="off" placeholder="请输入新密码" 
                  :maxlength="18"/>
      </el-form-item>
      <!-- 确认新密码 -->
      <el-form-item prop="checkPassword" label="确认密码" class="fogot-password-item">
        <el-input type="password" v-model="fogotPwdForm.checkPassword" auto-complete="off" placeholder="请确认新密码" 
                  :maxlength="18"/>
      </el-form-item>
      <!-- 提交 -->
      <el-button type="primary" size="medium" @click.native.prevent="handleSubmit('fogotPwdForm')" class="submit-button">提交</el-button>
    </el-form>
  </div>
</template>

<script>
import GetIdentifyCode from '@/components/GetIdentifyCode.vue'
import { forgotPwd } from '@/api/password.js'

export default {
  name: 'ForgotPassword',
  components: {
    GetIdentifyCode
  },
  data() {
    let validatePwd = (rule, value, callback) => {
      if(value === ''){
        callback(new Error('请输入密码'))
      }else{
        if(this.fogotPwdForm.checkPassword !== ''){
          this.$refs.fogotPwdForm.validateField('checkPassword')
        }
        callback()
      }
    }
    let validateCheckPwd = (rule, value, callback) => {
      if(value === ''){
        callback(new Error('请再次输入密码'))
      }else if(value !== this.fogotPwdForm.newPassword){
        callback(new Error('两次输入密码不一致!'))
      }else{
        callback()
      }
    }
    return {
      fogotPwdRules: {
        account: [
          { required: true, message: '请输入手机号或邮箱', trigger: 'blur' }
        ],
        identifyCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 10, message: '验证码长度错误', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { validator: validatePwd, trigger: 'change' },
          { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'change' }
        ],
        checkPassword: [
          { required: true, message: '请再次输入密码', trigger: 'change' },
          { validator: validateCheckPwd, trigger: 'change' },
          { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'change' }
        ]
      },
      labelPosition: 'right',
      fogotPwdForm: {
        account: '',
        identifyCode: '',
        newPassword: '',
        checkPassword: ''
      }
    }
  },
  methods: {
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if(valid) {
          forgotPwd(this.fogotPwdForm.account, this.fogotPwdForm.newPassword, this.fogotPwdForm.identifyCode).then( 
            res => {
              if(res.data.code === 0){
                this.$message({
                  message: '恭喜你，密码修改成功！即将跳转登录页面',
                  type: 'success'
                })
                setTimeout(() => {
                  this.$store.dispatch('LoginSuccess', {
                    data: res.data.data,
                    router: this.$router
                  })
                }, 2000)
              }else{
                if (res.data.msg) {
                  this.$message.error(res.data.msg)
                }
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
.forgot-password-wrapper {
  height: 372px;
  .forgot-password {
    width: 452px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding-top: 30px;
    box-sizing: border-box;
    text-align: center;
    .el-form-item__label{
      text-align: left;
    }
    .fogot-password-item {
      .button-code-cover {
        text-align: right;
      }
    }
    .el-form-item.is-required .el-form-item__label:before {
      position: absolute;
      left: 470px;
      z-index: 1;
    }
    .submit-button {
      width: 50%;
    }
  }
}
.fogot-password-item {
  .el-input__inner:focus {
    border-color: #c0c4cc;
  }
}
</style>
