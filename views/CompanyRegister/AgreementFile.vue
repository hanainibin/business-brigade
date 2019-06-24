<template>
  <div id="agreementFile-wrapper">
    <div id="agreementFile">
      <h3 class="agreementFile-title">注册协议</h3>
      <div class="agreementFile-content">
        <b>腾住订单不可退订</b><br>
        腾住智慧酒店目前只有在线支付一种订房付款模式，在线支付的订单不可退订；腾住智慧酒店投资举办特价房和代金券等诸多活动，能够为会员带来许多福利，约定不可退订，会员订房时务必确定接受不可退订的规定！<br>
        <b>关于不可抗力退订保障</b><br>
        腾住为在线支付的订单客人提供不可抗力退订保障：
        如客人的订单因不可抗力造成全部或部分行程取消，并提供合理证据，酒店方同意退订。注：不可抗力是指不能预见、不能避免并不能克服的客观情况。包括但不限于，恶劣天气、自然灾害、战争、罢工、骚乱、恐怖事件、政府行为、 公共卫生等客观原因，造成宾馆酒店临时被征用、出境管制、边境关闭、目的地入境政策临时变更、我国政府机构发布橙色及以上旅游预警信息等，导致旅游目的地无法实现。<br>
        如果客人遇行程变更等特殊情况，酒店方同意客人退订。如果退订成功，酒店方订房信息变更为新订的会员信息，并为新订会员提供正常的订房服务。所退的房款以会员订房实际支付的金额为准，不包含所使用的抵用券及其它返点。
        <br>服务时间:我们为您提供24小时全天服务，节假日照常服务。<br>
        <b>预订时间</b><br>
        1、建议您最多提前半个月，一般提前2-3天左右就可以。<br>
        2、但节假日、会展期间或旅游旺季最好提前5-6周预订，以防酒店客满。<br>
        <b>订单提交后确认时间</b><br>
        在您提交订单后，我们一般会在2-10分钟内以短信形式回复您，如遇特殊情况（如酒店忙、系统出错、短信延迟等）会延时，如果25分钟内仍没有收到短信，请登录个人中心查询或致电客服电话查询，我们会尽力给您解决问题。<br>
        <b>价格和房费</b><br>
        1、 网上所公布的价格均为同各宾馆签定的协议价，它是宾馆给予网站的优惠价，此价格比酒店前台当日挂牌价要低。<br>
        2、 网站上公布的网上预订价已包含服务费，不包含酒店其他费用及税收。<br>
        <b>入住、离店时间</b><br>
        按国际惯例，宾馆的入住时间应为当天24:00前，离店时间为次日12:00前。如提前入住或推迟离店，可以咨询下酒店前台，根据酒店不同要求，某些酒店须酌情加收一定的费用。酒店方按会员价为客人出具正规发票。<br>
        <b>保留时间</b><br>
        如在订单上无特别注明，一般情况下宾馆将保留至入住次日的12:00。<br>
        <b>不能顺利入住</b><br>
        如发生不能顺利入住情况，酒店方应免费为客人升级或征得客人同意后安排在同区域同等或更高服务等级的酒店并承担由此产生的相关费用。相关费用包括但不限于房费差额损失、交通费用等。酒店方应向客人解释说明不能兑现预订承诺的具体原因。
      </div>
      <ButtonNext :button-text="buttonKnow" :clickEvent="goBack"/>
    </div>
  </div>
</template>

<script>
import ButtonNext from '@/components/ButtonNext.vue'

export default {
  name: 'AgreementFile',
  components: {
    ButtonNext
  },
  data() {
    return {
      buttonKnow: '我知道了'
    }
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  created() {
    if(this.userInfo.status) {
      this.$router.push('/')
    }
  },
  methods: {
    goBack(){
      window.close()
    }
  }
}
</script>

<style lang="less" scoped>
#agreementFile-wrapper{
  width: 100%;
  background-color: #f5f6f8;
  padding: 30px 0;
  #agreementFile{
    width: 1072px;
    margin: 0 auto;
    background-color: #fff;
    text-align: center;
    padding-bottom: 80px;
    border-radius: 8px;
    color: #58666e;
    .agreementFile-title{
        height: 45px;
        background: linear-gradient(to bottom, #ffffff 0%,#f3f3f3 100%);
        border-bottom: 0.5px solid #ebebeb;
        font-size: 15px;
        line-height: 45px;
        box-sizing: border-box;
        font-weight: normal;
        text-align: center;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }
    .agreementFile-content{
        line-height: 28px;
        font-size: 14px;
        text-align: left;
        padding: 40px;
    }
  }
}
</style>
