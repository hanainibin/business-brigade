<template>
  <div>
    <!-- 登录对话框 -->
    <el-dialog :lock-scroll="false" :close-on-click-modal="false" :before-close="handleClose"
               :visible.sync="dialogLoginVisible" width="470px" custom-class="login-dialog" top="6%"
               :close-on-press-escape="false">
      <template slot="title">
        <div class="account_login" v-show="accountLogin || msgLogin">
          <span class="login_title" :class="{active: accountLogin}" v-on:click="toAccountLogin">
            帐号登录
          </span>
          <span class="login_title title2" :class="{active: !accountLogin}" v-on:click="toMsgLogin">
            短信登录
          </span>
          <div class="qr_icon" @click="toWechatLogin" >
            <img src="@/assets/qr_icon.png" />
          </div>
        </div>
        <div class="wechat_login" v-show="wechatLogin">
          <span class="login_title">
            微信方式登录
          </span>
          <div class="account_icon" @click="toAccountLogin">
            <img src="@/assets/account_login.png" />
          </div>
        </div>
      </template>
      <el-form class="login-form" :rules="accountLoginRules" ref="accountLoginForm" :model="accountLoginForm" label-width="0" v-show="accountLogin">
        <el-form-item prop="username">
          <el-input @keyup.enter.native.stop="handleAccountLogin" v-model="accountLoginForm.username" auto-complete="off" placeholder="企业邮箱/成员手机号">
            <img src="@/assets/1.png" slot="prepend">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input @keyup.enter.native.stop="handleAccountLogin" type="password" v-model="accountLoginForm.password" auto-complete="off"
                    placeholder="请输入密码" maxlength="20">
            <img src="@/assets/2.png" slot="prepend">
          </el-input>
        </el-form-item>
        <el-form-item prop="code" class="input-yzm">
          <el-row :span="24">
            <el-col :span="16">
              <el-input @keyup.enter.native.stop="handleAccountLogin" :maxlength="code.len" v-model="accountLoginForm.code" auto-complete="off"
                        placeholder="请输入验证码">
                <img src="@/assets/3.png" slot="prepend">
              </el-input>
            </el-col>
            <el-col :span="8">
              <div class="login-code">
                <span class="login-code-img" @click="refreshCode" v-if="code.type == 'text'">{{code.value}}</span>
                <img :src="code.src" alt="验证码" class="login-code-img" @click="refreshCode" v-else>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <div class="err-msg">{{errMsg}}</div>
        <span id="forgotPassword" @click="forgotPassword">忘记密码？</span>
        <a v-on:click="toReg" class="btn-toreg">没有账号，注册？</a>
        <el-button type="primary" size="medium" @click.native.prevent="handleAccountLogin" class="account-login-submit">立即登录</el-button>
      </el-form>
      <el-form class="login-form" :rules="msgLoginRules" ref="msgLoginForm" :model="msgLoginForm" label-width="0" v-show="msgLogin">
        <el-form-item prop="phone">
          <el-input @keyup.enter.native.stop="handleMsgLogin" :maxlength="msgLen.phone" v-model="msgLoginForm.phone" auto-complete="off" placeholder="手机号">
            <img src="@/assets/1.png" slot="prepend">
          </el-input>
        </el-form-item>
        <el-form-item prop="code" class="input-yzm">
          <el-row :span="24"  :gutter="20">
            <el-col :span="16">
              <el-input @keyup.enter.native.stop="handleMsgLogin" :maxlength="msgLen.code" v-model="msgLoginForm.code" auto-complete="off"
                        placeholder="验证码">
                <img src="@/assets/3.png" slot="prepend">
              </el-input>
            </el-col>
            <el-col :span="8">
              <div class="login-code">
                <GetIdentifyCode :isLogin="true" :code="msgLoginForm.phone.trim()" type="phone" components="LoginModal" style="width: 100%; height: 45px; background: linear-gradient(to right, #56A1FF, #1A82FF); color: #ffffff"/>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <div class="err-msg">{{errMsg}}</div>
        <div class="msg-blank">
          <a v-on:click="toReg" class="btn-toreg">没有账号，注册？</a>
        </div>
        <el-button type="primary" size="medium" @click.native.prevent="handleMsgLogin" class="msg-login-submit">立即登录</el-button>
      </el-form>
      <div v-show="wechatLogin" id="wxloginCode"></div>
    </el-dialog>
  </div>
</template>

<script>
  import GetIdentifyCode from '@/components/GetIdentifyCode.vue'
  import { randomLenNum } from '@/util/util'
  import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    GetIdentifyCode,
  },
  data () {
    let clearSpace = (rule, value, callback) => {
      this.accountLoginForm.code = value.trim()
      callback()
    }
    return {
      accountLoginForm: {
        username: '',
        password: '',
        code: '',
        randomStr: '',
      },
      msgLoginForm: {
        phone: '',
        code: '',
      },
      errMsg: '',
      accountLoginRules: {
        username: [
          { required: true, message: '请输入邮箱或手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '验证码长度为4位', trigger: 'blur' },
          { validator: clearSpace, trigger: 'change' }
        ],
      },
      msgLoginRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '手机号长度为11位', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入短信验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '短信验证码长度为6位', trigger: 'blur' },
          { validator: clearSpace, trigger: 'change' }
        ],
      },
      code: {
        src: '/admin/code',
        value: '',
        len: 4,
        type: 'image'
      },
      msgLen: {
        phone: 11,
        code: 6,
      },
      codeUrl: '/admin/code',
      accountLogin: true,
      msgLogin: false,
      wechatLogin: false,

    }
  },
  computed: {
    ...mapGetters(['dialogLoginVisible'])
  },
  created() {
    this.refreshCode()
  },
  methods: {
    ...mapMutations(['setState']),
    refreshCode() {
      this.accountLoginForm.code = ''
      this.accountLoginForm.randomStr = randomLenNum(this.code.len, true)
      this.code.type == 'text'
        ? (this.code.value = randomLenNum(this.code.len))
        : (this.code.src = `${this.codeUrl}/${this.accountLoginForm.randomStr}`)
    },
    handleClose () {
      this.setState({
        key: 'dialogLoginVisible',
        module: 'user',
        value: false
      })
			this.clearForm()
			this.accountLogin = true
      this.msgLogin = false
      this.wechatLogin = false
    },
    toReg () {
      this.setState({
        key: 'dialogLoginVisible',
        module: 'user',
        value: false
      })
			this.clearForm()
			this.$router.push('/CompanyRegister')
    },
    handleAccountLogin() {
      this.$refs.accountLoginForm.validate(valid => {
        if (valid) {
          console.log(this.$router)
          this.$store.dispatch('LoginByUsername', {
            userInfo: this.accountLoginForm,
            router: this.$router,
            isAccountLogin: this.accountLogin,
          }).then(
            () => {
              this.setState({
                key: 'dialogLoginVisible',
                module: 'user',
                value: false
              })
              this.$set(this.accountLoginForm, 'password', '')
							this.clearForm()
							this.refreshCode()
            },
            error => {
              this.errMsg = error
              this.refreshCode()
            }
          )
        }
      })
    },
    handleMsgLogin() {
      this.$refs.msgLoginForm.validate(valid => {
        if (valid) {
          console.log(this.$router)
          this.$store.dispatch('LoginByUsername', {
            userInfo: this.msgLoginForm,
            router: this.$router,
            isAccountLogin: this.accountLogin,
          }).then(
            () => {
              this.setState({
                key: 'dialogLoginVisible',
                module: 'user',
                value: false
              })
              this.clearForm()
            },
            error => {
              this.errMsg = error
            }
          )
        }
      })
    },
    forgotPassword() {
      this.setState({
        key: 'dialogLoginVisible',
        module: 'user',
        value: false
      })
			this.clearForm()
      this.$router.push('/ForgotPassword')
    },
    toWechatLogin() {
      this.accountLogin = false
      this.msgLogin = false
      this.wechatLogin = true
      let wx_callback_url = process.env.VUE_APP_URL
      console.log(wx_callback_url)
      let url = encodeURI(wx_callback_url);
      let obj = new window.WxLogin({
        self_redirect:false,
        id:"wxloginCode",
        appid: process.env.VUE_APP_APPID,
        scope: "snsapi_login",
        redirect_uri: url,
        state: "login",
        style: "",
        href: "https://hotelpic-1254071088.cossh.myqcloud.com/wxqrcode.css"
      })
      console.log(obj)
    },
    toAccountLogin() {
      this.accountLogin = true
      this.msgLogin = false
      this.wechatLogin = false
    },
    toMsgLogin () {
      this.accountLogin = false
      this.msgLogin = true
      this.wechatLogin = false
    },
    clearForm() {
			this.$refs['accountLoginForm'].resetFields();
      this.$refs['msgLoginForm'].resetFields();
			this.accountLoginForm.username = ''
			this.accountLoginForm.password = ''
			this.accountLoginForm.code = ''
			this.accountLoginForm.randomStr = ''
      this.msgLoginForm.phone = ''
      this.msgLoginForm.code = ''
      this.errMsg = ''
    }
  },
  watch: {
    dialogLoginVisible (value) {
      if (value) {
        this.refreshCode()
      }
    }
  }
}
</script>

<style lang="less">
.account-login-submit, .msg-login-submit, .get-msg-code {
  width: 100%;
  height: 53px;
  &:hover, &:focus {
    background-color: #409EFF;
  }
}
#wxloginCode {
  text-align: center;
}
#forgotPassword{
  color: #478ee1;
  cursor: pointer;
  line-height: 1;
  font-size: 14px;
}
.login-dialog {
  border-radius: 10px;
  // height: 414px;
  .el-button--medium {
    font-size: 18px;
    background: linear-gradient(to right, #56A1FF,#1A82FF); 
    background: -moz-linear-gradient(left, #56A1FF, #1A82FF); 
    background: -webkit-gradient(linear, left, right, color-stop(#56A1FF), color-stop(#1A82FF)); 
    background: -webkit-linear-gradient(left, #56A1FF,#1A82FF); 
    background: -o-linear-gradient(left, #56A1FF,#1A82FF); 
    background: -ms-linear-gradient(left, #56A1FF,#1A82FF); 
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#56A1FF', endColorstr='#1A82FF',GradientType=1); 
  }
  .el-form-item__error {
    left: auto;
    right: 9px;
    top: 0;
    line-height: 45px;
    padding-top: 0;
  }
  .input-yzm {
    .el-form-item__error {
      right: 141px;
    }
  }
  .el-input-group {
    input {
      background-color: #F3F6FB;
      border-width: 0.5px;
      font-family: tahoma, arial, 'pingfang sc', 'Hiragino Sans GB', sans-serif;
      font-size: 15px;
      &::-webkit-input-placeholder {
        color: #94a0b4;
      }
    }
    .el-input-group__prepend {
      padding: 0 11px;
      background-color: #F3F6FB;
      border-width: 0.5px;
      img {
        width: 24px;
        transform: translateY(2px);
      }
    }
  }
  input {
    height: 45px;
    &:-webkit-autofill {
      box-shadow: 0 0 0px 1000px white inset !important;
    }
  }
  .el-form-item {
    margin-bottom: 27px;
  }
  .el-dialog__header {
    padding: 28px 20px 9px 10px;
    .login_title {
      font-size: 20px;
      color: #3E4E62;
      position: absolute;
      left: 37px;
      font-weight: bold;
      font-family: 'pingfang sc', stheiti, 'microsoft yahei', arial, sans-serif;
      cursor: pointer;
      &.active {
        color: #2789FF;
        &::after {
          content: '';
          position: absolute;
          width: 77px;
          height: 3px;
          background: linear-gradient(to bottom, #63A9FF,#3791FF); 
          background: -moz-linear-gradient(top, #63A9FF, #3791FF); 
          background: -webkit-gradient(linear, top, bottom, color-stop(#63A9FF), color-stop(#3791FF)); 
          background: -webkit-linear-gradient(top, #63A9FF,#3791FF); 
          background: -o-linear-gradient(top, #63A9FF,#3791FF); 
          background: -ms-linear-gradient(top, #63A9FF,#3791FF); 
          filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#63A9FF', endColorstr='#3791FF',GradientType=0); 
          top: 36px;
          left: 1px;
        }
      }
      &.title2 {
        left: 179px;
      }
    }
    .qr_icon {
      width: 47px;
      position: absolute;
      right: 20px;
      top: 20px;
      cursor: pointer;
    }
    .account_icon {
      width: 47px;
      position: absolute;
      right: 20px;
      top: 20px;
      cursor: pointer;
    }
    img {
      width: 100%;
      height: 100%;
    }
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
    padding: 40px 38px;
    margin-top: 20px;
    font-family: tahoma, arial, 'pingfang sc', 'Hiragino Sans GB', sans-serif;
  }
}
.btn-toreg {
  color: #478ee1;
  font-size: 15px;
  float: right;
  margin-bottom: 20px;
  &:hover {
    color: #478ee1;
  }
}
.login-code-img {
  position: absolute;
  right: 0;
}
.err-msg {
  float: left;
  color: red;
}
</style>
