<template>
  <div class="tenzont-header-bg">
    <div class="tenzont-header">
      <div class="tenzont-logo">
        <router-link to="/">
          <img src="@/assets/logo.png" class="img-logo">
        </router-link>
      </div>
      <div class="nav-bar">
        <div class="nav-bar-login-area" v-if="nickName.length === 0">
          <div class="nav-bar-login">
            <span class="nav-bar-login-text">
              <el-button type="text" @click="showLogin">请登录</el-button>
            </span>
            <span id="cutOff"></span>
          </div>
        </div>
        <div class="nav-bar-register-area" v-if="nickName.length === 0">
          <div class="nav-bar-register">
            <router-link to="/CompanyRegister" class="nav-bar-register-text">免费注册</router-link>
          </div>
        </div>
        <el-popover
          v-if="nickName.length > 0"
          placement="bottom"
          class="popover-user"
          trigger="hover">
          <li class="li-user" @click="jump('/OrderList')">我的订单</li>
          <!-- <li class="li-user" @click="jump('/FlyOrderList')">机票订单</li> -->
          <li class="li-user" @click="jump('/MyAccount')">我的账户</li>
          <li v-if="!accountType" class="li-user" @click="jump('/TravelStandard')">差标管理</li>
          <li class="li-user" @click="jump('/ApprovalSet')">审批管理</li>
          <li class="li-user" @click="jump('/TravelSet')">行程管理</li>
          <li class="li-user" @click="jump('/InvoiceOrderList')">发票管理</li>
          <li class="li-user" @click="jump('/Settlement')" v-if="accountType === 0">结算管理</li>
          <li class="li-user" @click="openMessageBox">退出登录</li>
          <el-button slot="reference" class="hello-user">欢迎您，{{nickName}}</el-button>
        </el-popover>
        <div class="nav-bar-service">
          <img src="@/assets/tel.png" class="logo-phone">
          <div class="span-phone">
            <p class="phone-text">
              <span class="normal">24h</span>客服热线
            </p>
            <p class="phone-phone">0571-87967887</p>
          </div>
        </div>
        <!-- 公众号二维码 -->
        <el-popover
          placement="bottom"
          width="150px"
          trigger="hover">
          <img src="@/assets/qrcode.jpg" class="img-qrcode">
          <div class="div-qrcode">扫一扫关注 腾住商旅公众号</div>
          <el-button slot="reference">
            <img src="@/assets/wechatlogo.png" class="logo-wechat">
            <div class="span-wechat">
              <p class="wechat-text">扫一扫关注</p>
              <p class="wechat-green">微信公众号</p>
            </div>
          </el-button>
        </el-popover>
      </div>
    </div>
    <div class="tenzont-nav">
      <ul class="tenzont-nav-items">
        <li
          v-for="(nav, index) in navList" :key="index"
          :class="`nav-item nav-item${index}`"
          @click="navToPage[index] ? navToPage[index](index) : null"
        >{{nav.title}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'HeaderTop',
  data () {
    return {
      navList: [
        { title: '首页' },
        { title: '特惠酒店' },
        { title: '精品酒店' },
        { title: '积分商城' },
        { title: '企业长包房' },
        { title: '企业会展' }
      ],
      navToPage: [
        this.toHome, this.toAnchor, this.toAnchor, this.toDeveloping, this.toCompanyLong, this.toCompanyFair
      ]
    }
  },
  computed: {
    ...mapGetters(['nickName', 'wechatId', 'accountId', 'accountType'])
  },
  methods: {
    ...mapMutations(['setState']),
    openMessageBox () {
      this.$confirm('您确定要退出本系统?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.quickLogin()
      }).catch(() => {
        return false
      })
    },
    showLogin () {
      this.setState({
        key: 'dialogLoginVisible',
        module: 'user',
        value: true
      })
    },
    toAnchor (index) {
      let id = 'content' + (index - 1)
      if (this.$route.name === 'home') {
        setTimeout(() => {
          let offsetTop = document.getElementById(id).offsetTop
          window.scrollTo(0, offsetTop)
        }, 100)
      }
      this.$router.push(id)
    },
    toDeveloping () {
      this.$router.push('/Developing')
    },
    toFly () {
      this.$router.push('/Developing')
    },
    toHome () {
      this.$router.push('/')
    },
    quickLogin () {
      this.$store.dispatch('QuickLogin')
      this.$router.push('/')
    },
    jump (value) {
      if (this.accountId.length <= 0 && this.wechatId && this.wechatId.length > 0 && window.location.pathname.includes('/wxlogin')) {
        this.$store.state.user.bindMobileDialogVisible = true
      } else {
        this.$router.push(value)
      }
    },
    toCompanyFair () {
      this.$router.push('/CompanyFair')
    },
    toCompanyLong () {
      this.$router.push('/CompanyLong')
    },
  }
}
</script>

<style lang="less" scoped>
.background-hover {
  background-color: #128ce7;
}
.tenzont-header-bg {
  background-color: #fff;
  min-width: 1180px;
}
.tenzont-header {
  position: relative;
  width: 1180px;
  height: 83px;
  overflow: hidden;
  margin: 0 auto;
  .el-button {
    border: none;
    padding: 0;
    margin-top: -3px;
    &:hover,
    &:focus {
      background: #fff;
      color: #606266;
    }
    img {
      width: 30px;
      margin-top: -5px;
    }
  }
  .login-submit {
    width: 100%;
    height: 45px;
    &:hover,
    &:focus {
      background-color: #409eff;
    }
  }
}
.tenzont-logo {
  margin-top: 24px;
}
.img-logo {
  width: 197px;
  margin-top: -12px;
}
.nav-bar {
  font-size: 14px;
  position: absolute;
  right: 0px;
  top: 28px;
  font-family: tahoma, arial, 'pingfang sc', 'Hiragino Sans GB', sans-serif;
}
.img-qrcode {
  width: 150px;
}
.div-qrcode {
  font-size: 12px;
  text-align: center;
}
.nav-bar-service {
  float: left;
  height: 34px;
  padding-left: 22px;
  padding-right: 22px;
  border-left: 0.5px solid #E5E5E5;
  border-right: 0.5px solid #E5E5E5;
  margin-top: -5px;
}
.logo-phone {
  height: 32px;
  transform: translateY(1px);
}
.span-phone {
  line-height: 17px;
  // transform: translateY(-4px);
  display: inline-block;
  margin-left: 10px;
  .phone-text {
    font-size: 13px;
    color: #405266;
  }
  .phone-phone {
    font-size: 16px;
    font-weight: bold;
    color: #2588ff;
    font-family: Arial;
  }
}
.span-wechat {
  line-height: 17px;
  width: 80px;
  margin-left: 63px;
  transform: translateY(-6px);
  text-align: left;
  .wechat-text {
    font-size: 13px;
    font-weight: 600;
    color: #405266;
  }
  .wechat-green {
    font-size: 15px;
    font-weight: bold;
    color: #5bc13d;
  }
}
.hello-user.el-button {
  float: left;
  margin-top: 5px;
  margin-right: 20px;
  color: #333;
}
.li-user {
  height: 32px;
  width: 100px;
  text-align: center;
  line-height: 32px;
  cursor: pointer;
  &:hover {
    color: #777;
    a {
      color: #777;
    }
  }
  a {
    color: #606266;
  }
}
.tenzont-header {
  img.logo-wechat {
    width: 32px;
    float: left;
    margin-left: 20px;
  }
}
.nav-bar-register-area {
  float: left;
  line-height: 24px;
  margin-right: 23px;
}
.nav-bar-login-area {
  float: left;
  line-height: 24px;
}
.nav-bar-login-text {
  .el-button {
    padding: 0;
    color: #405266;
  }
}
.nav-bar-register-text {
  font-weight: 500;
  color: #405266;
}
#cutOff {
  margin: 0px 6px 0 7px;
  border-right: solid 0.5px #d8d8d8;
  width: 1px;
  display: inline-block;
  height: 14px;
  transform: translateY(2px);
}
.tenzont-nav {
  background: linear-gradient(to right, #56a1ff, #1a82ff);
  background: -moz-linear-gradient(left, #56a1ff, #1a82ff);
  background: -webkit-gradient(
    linear,
    left,
    right,
    color-stop(0%, #56a1ff),
    color-stop(100%, #1a82ff)
  );
  background: -webkit-linear-gradient(left, #56a1ff, #1a82ff);
  background: -o-linear-gradient(left, #56a1ff, #1a82ff);
  background: -ms-linear-gradient(left, #56a1ff, #1a82ff);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#56A1FF', endColorstr='#1A82FF',GradientType=1);
  height: 40px;
  width: 100%;
  min-width: 1180px;
  .tenzont-nav-items {
    width: 1180px;
    margin: 0 auto;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-family: 'PingFang SC', 'Microsoft Yahei', SimSun, sans-serif;
    .nav-item {
      display: inline-block;
      color: #fff;
      padding: 0 13px;
      line-height: 41px;
      height: 40px;
      cursor: pointer;
      &:hover,
      &:focus {
        background-color: #2d88f9;
      }
    }
    .nav-item0 {
      background-color: #2d88f9;
    }
  }
}
.tenzont-anchor {
  background-color: #fff;
  height: 42px;
  .tenzont-anchor-items {
    width: 1180px;
    margin: 0 auto;
    height: 42px;
    line-height: 42px;
    font-size: 14px;
    .anchor-item {
      display: inline-block;
      color: #333;
      .anchor-item0 {
        background-color: #1e9fff;
        color: #fff;
        padding: 4px 7px;
        border-radius: 2px;
        cursor: text;
      }
    }
  }
}
.anchor-item1,
.anchor-item2 {
  padding: 0 10px;
}
.anchor-item1:hover,
.anchor-item2:hover {
  color: #777;
}
</style>
