<template>
  <div id='companyRegister'>
    <div class="companyRegister-left">
      <h3 class="companyRegister-title">{{registerData.title}}</h3>
      <div class="companyRegister-detail">
        <label class="detail-item">
          <span>{{registerData.name}}</span>
          <input type="text" v-model="input.entName" maxlength="20" autocomplete="off" ref="entNameRef" 
                 placeholder="请输入企业名称" onkeyup="this.value=this.value.trim()">
          <span class="item-necessary">*</span>
        </label>
        <label class="detail-item">
          <span>{{registerData.registerWay}}</span>
          <input type="text" v-model="input.entEmail" maxlength="30" autocomplete="off" ref="entEmailRef"
                 placeholder="请输入企业邮箱" onkeyup="this.value=this.value.trim()">
          <span class="item-necessary">*</span>
        </label>
        <label class="detail-item">
          <span>{{registerData.identifyCode}}</span>
          <input type="tel" class="identify-code-input" v-model="input.vcode" maxlength="6" autocomplete="off"
                 ref="vcodeRef" placeholder="请输入验证码">
          <GetIdentifyCode :code="input.entEmail.trim()"/>
          <span class="item-necessary">*</span>
          <p class="code-attention">{{registerData.attention}}</p>
        </label>
        <!-- <label class="detail-item">
          <span>{{registerData.invitationCode}}</span>
          <input type="text" v-model="input.channelInvestCode" maxlength="20" autocomplete="off"
                 placeholder="请输入代理商邀请码">
        </label> -->
        <div class="register-bottom">
          <p class="register-agreement">
            <el-checkbox v-model="checked">
              我同意并遵守
            </el-checkbox>
            <span class="agreement-file" @click="toGreementFile">
              腾住平台相关协议
            </span>
          </p>
          <ButtonNext class="button-next" :class="checked ? '' : 'notAgree'" :clickEvent="nextRegister"
                      :button-text="registerData.buttonNext" id="buttonNext" :disabled="checked ? false : true"/>
        </div>
      </div>
    </div>            
    <div class="companyRegister-right">
      <img src="@/assets/companyRegister_adImg.png" alt="">
    </div>
  </div>
</template>

<script>
import GetIdentifyCode from '@/components/GetIdentifyCode.vue'
import ButtonNext from '@/components/ButtonNext.vue'
import { saveEnt } from '@/api/ent'

export default {
  name: 'CompanyRegister',
  components: {
    GetIdentifyCode,
    ButtonNext
  },
  data(){
    return {
      registerData: {
        title: '企业账号注册',
        name: '企业名称',
        registerWay: '企业邮箱',
        identifyCode: '验证码',
        attention: '*请注意查收邮件，并填写邮箱中的验证码（邮箱可能会被拦截放置到垃圾箱）',
        // invitationCode: '代理商邀请码',
        buttonNext: '下一步'
      },
      input: {
        entName: '',
        entEmail: '',
        vcode: '',
        channelInvestCode: ''
      },
      checked: true
    }
  },
  created() {
    console.log('debug data userInfo',this.userInfo)
		if(this.userInfo.status) {
			this.$router.push('/')
		}
  },
  props: {
		userInfo: {
			type: Object,
			required: true
		}
  },
  methods: {
    toGreementFile(){
      window.open('#AgreementFile')
    },
    nextRegister () {
      if(!this.input.entName || this.input.entName.replace(/(^\s*)|(\s*$)/g, "") === ""){
        this.$message.error('企业名称不能为空！')
        this.$refs.entNameRef.focus()
      }else if(!this.input.entEmail || this.input.entEmail.replace(/(^\s*)|(\s*$)/g, "") === ""){
        this.$message.error('企业邮箱不能为空！')
        this.$refs.entEmailRef.focus()
      }else if(!this.input.vcode || this.input.vcode.replace(/(^\s*)|(\s*$)/g, "") === ""){
        this.$message.error('验证码不能为空！')
        this.$refs.vcodeRef.focus()
      }else{
        saveEnt(this.input).then((res) => {
          if( res.data && res.data.code === 0 ){
            this.$message({
              message: '恭喜你，注册成功！登录密码已经发送至您的邮箱，即将跳转到主页...',
              type: 'success'
            })
            setTimeout(() => {
              this.$store.dispatch('LoginSuccess', {
                data: res.data.data,
                router: this.$router
              })
            }, 2000)
          } else {
            if (res.data.msg) {
              this.$message.error(res.data.msg)
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="less">
#companyRegister{
  width: 1072px;
  margin: 30px auto;
  background-color: #fff;
  border-radius: 8px;
  .companyRegister-left{
    float: left;
    width: 645px;
    height: 600px;
    border-radius: 8px;
    border-bottom-right-radius: unset;
    border: 0.5px solid #ebebeb;
    box-sizing: border-box;
    color: #58666e;
    .companyRegister-title{
      height: 45px;
      background: linear-gradient(to bottom, #ffffff 0%,#f3f3f3 100%);
      border-bottom: 0.5px solid #ebebeb;
      font-size: 15px;
      line-height: 45px;
      box-sizing: border-box;
      font-weight: normal;
      text-align: center;
      border-top-left-radius: 8px;
    }
    .companyRegister-detail{
      padding-top: 40px;
      width: 476px;
      margin: 0 auto;
      .detail-item{
        margin-bottom: 15px;
        display: block;
        span{
          display: inline-block;
          width: 100px;
          height: 35px;
          line-height: 35px;
          text-align: left;
          font-size: 15px;
        }
        input{
          display: inline-block;
          width: 332px;
          height: 35px;
          border-radius: 3px;
          outline: none;
          border: 0.5px solid #e0e0e0;
          text-indent: 10px;
          font-size: 14px;
          box-sizing: border-box;
        }
        .item-necessary{
          color: red;
          font-size: 20px;
          width: 26px;
          margin-left: 15px;
          text-align: center;
          vertical-align: -webkit-baseline-middle;
        }
        .identify-code-input{
          width: 208px;
          margin-right: 31px;
        }
        .code-attention{
          font-size: 12px;
          color: red;
          margin-left: 100px;
          white-space: nowrap;
          padding: 9px 0 0 0;
        }
      }
      .register-bottom{
        text-align: center;
        .register-agreement{
          font-size: 13px;
          padding: 10px 0 25px 0;
          .agreement-file{
            color: #1e9fff;
            cursor: pointer;
            line-height: 19px;
            font-size: 14px;
          }
        }
        .notAgree{
          color: #848080;
          border: 0.5px solid #c2bcbc;
          background-color: #fbfbfb;
          cursor: not-allowed;
          opacity: 1;
          outline: none;
          &:hover{
            border-color: #e6e6e6;
            color: #C9C9C9;
          }
        }
      }
    }
  }
  .companyRegister-right{
    width: 427px;
    height: 600px;
    margin-left: 645px;
    img{
      width: 100%;
      height:100%;
    }
  }
}

.el-checkbox__input.is-checked+.el-checkbox__label{
  color: #606266;
}
</style>
