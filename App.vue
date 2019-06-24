<template>
  <div id="app">
    <div class="not-support-ie9" v-if="isIe9">
      {{tipText}}
      <span class="close-not-support" @click="handleClose">×</span>
    </div>
    <HeaderTop v-show="$route.name !== 'NotFoundComponent'"/>
    <LoginModal/>
    <BindMobileDialog/>
    <MessageDialog/>
    <TenzontMap/>
    <ReserveForm/>
    <LongRoom/>
    <div class="app-content">
      <router-view v-bind:userInfo = "userInfo"/>
    </div>
    <div class="tenzont-footer-bg" v-show="$route.name !== 'NotFoundComponent'">
      <div class="tenzont-footer">
        © 2016-2018 杭州腾住科技有限公司版权所有 &nbsp;&nbsp;浙ICP备17009745号-1
        <div style="width:300px;margin:0 auto; padding:10px 0;">
          <a target="_blank" href=" " style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"><img src="@/assets/netpolice.png" style="float:left;"/><p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">浙公网安备 33010602009653号</p ></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import LoginModal from '@/components/LoginModal'
import TenzontMap from '@/components/TenzontMap'
import ReserveForm from '@/components/ReserveForm'
import LongRoom from '@/components/LongRoom'
import BindMobileDialog from '@/components/BindMobileDialog'
import MessageDialog from '@/components/MessageDialog'
import { mapGetters } from 'vuex'

export default {
  components: {
    HeaderTop,
    LoginModal,
    TenzontMap,
    ReserveForm,
    LongRoom,
    BindMobileDialog,
    MessageDialog,
  },
  data () {
    return {
      tipText: '您的浏览器版本较低，有可能影响您的体验，建议您升级浏览器。',
      isIe9: false
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'accountId'])
  },
  created () {
    if (this.isNonsupport()) {
      this.isIe9 = true
    }
    if (this.userInfo.status) {
      this.$store.dispatch('GetUserInfo')
    }
  },
  methods: {
    isNonsupport () {
      let userAgent = navigator.userAgent
      let ies = 'MSIE 9.0'
      if (userAgent.indexOf(ies) > -1) {
        return true
      } else return false
    },
    handleClose () {
      this.isIe9 = false
    }
  }
}
</script>

<style lang="less">
@import './styles/init.less';
@font-face {
  font-family: 'iconfont';  /* project id 780922 */
  src: url('//at.alicdn.com/t/font_780922_8kxyccmkuzv.eot');
  src: url('//at.alicdn.com/t/font_780922_8kxyccmkuzv.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_780922_8kxyccmkuzv.woff') format('woff'),
  url('//at.alicdn.com/t/font_780922_8kxyccmkuzv.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_780922_8kxyccmkuzv.svg#iconfont') format('svg');
}
.iconfont {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.fontaddr {
  font-family: tahoma, arial, 'pingfang sc', 'Hiragino Sans GB', sans-serif;
  font-size: 14px;
  line-height: 1.5;
}
#app {
  position: absolute;
  min-height: 100%;
  width: 100%;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  .not-support-ie9 {
    height: 30px;
    line-height: 30px;
    background-color: #f3ea35;
    font-size: 14px;
    padding: 0 15px;
    .close-not-support {
      float: right;
      width: 20px;
      height: 20px;
      font-size: 22px;
      cursor: pointer;
      line-height: 1;
      margin: 3px 0 7px 0;
      text-align: center;
      &:hover {
        background-color: #999;
      }
    }
  }
  .app-content {
    min-width: 1180px;
    margin: 0 auto;
  }
  .tenzont-footer-bg {
    height: 60px;
  }
  .tenzont-footer {
    color: #999;
    width: 1180px;
    margin: 0 auto;
    text-align: center;
    position: absolute;
    height: 30px;
    line-height: 30px;
    bottom: 0;
    left: 0;
    right: 0;
    font-family: 'PingFang SC', 'Microsoft Yahei', SimSun, sans-serif;
  }
}
</style>
