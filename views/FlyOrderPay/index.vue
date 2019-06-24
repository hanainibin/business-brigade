<template>
  <div>
    <div class="order-pay-wrapper">
      <div class="order-pay" style="background-color:#FFFFFF ;width:1180px;margin:20px auto;border: 0.5px solid #c3c3c3;">
        <div style="margin:0px 30px;height: 50px;">
          <span style=";line-height: 50px;">收银台</span>
          <span v-if="orderDesc.payStatus === 0" class="order_countdown_time_text" id="djs">
            <!-- <span v-if="effect">支付剩余时间：<span style="color: red;">{{mm}}</span>分<span style="color: red;">{{ss}}</span>秒</span> -->
            <span v-if="effect">{{orderDesc.orders && orderDesc.orders[0].expirationTime}}之前支付</span>
            <span v-if="!effect&&!apStatus">订单已经失效</span>
            <span v-if="apStatus">   待审批</span>
          </span>
        </div>
        <div>
          <img id="paid" style="display:none;  position: absolute;left: 200px;top: 54px;transform: rotate(-21deg);-ms-transform: rotate(-21deg);-moz-transform: rotate(-21deg);-webkit-transform: rotate(-21deg);-o-transform: rotate(-21deg);" src="/resource/private/images/C_152.png">
        </div>
        <div class="myWebKit-box" style="background-color: rgba(232, 232, 232, 0.34);padding-top: 30px; height: 260px;border-top: 0.5px solid #c3c3c3;border-bottom: 0.5px solid #c3c3c3;">
          <div class="myWebket-box-flex-1" style="padding-left: 30px;">
            <span class="order_left_title_font" style="color:#464646;">订单详情</span>
            <div class="order_details_height">
              <div class="layui-inline order_item_key_color">
                <span>航空公司</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div class="layui-inline">{{orderDetail.carrierName}}</div>
            </div>
            <div class="order_details_height">
              <div class="layui-inline order_item_key_color">
                <span>预订舱型</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div class="layui-inline">{{orderDetail.seatClass.seatClassName}}</div>
            </div>
            <!-- <div class="order_details_height">
              <div class="layui-inline order_item_key_color">
                <span>就餐情况</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div class="layui-inline">{{orderDetail.itemIndex.mealType}}</div>
            </div> -->
            <div class="order_details_height">
              <div class="layui-inline order_item_key_color order_left_text">
                <span>行&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;程</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div class="layui-inline">{{orderDesc.orders && orderDesc.orders[0].flightInfoVos[0].departureAirport.cityName}}----{{orderDesc.orders && orderDesc.orders[0].flightInfoVos[0].arrivalAirport.cityName}}</div>
            </div>
            <div class="order_details_height">
              <div class="layui-inline order_item_key_color">
                <span>起飞时间</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div class="layui-inline" v-if="this.orderDetail.departureDate  ">
                {{dateFormat(new Date(this.orderDetail.departureDate), 'yyyy-MM-dd hh:mm')}}&nbsp;至&nbsp;
                {{dateFormat(new Date(this.orderDetail.arrivalTime), 'yyyy-MM-dd hh:mm')}}&nbsp;
                共{{gethhmm(orderDetail.itemIndex.flyTimeMins)}}
              </div>
            </div>
            <div class="order_details_height">
              <div class="layui-inline order_item_key_color">
                <span>共计金额</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div class="layui-inline" v-if="orderDesc.totalAmount">
                <span class="order_money">￥{{orderDesc.totalAmount/100}}</span>
              </div>
            </div>
          </div>
          <div class="myWebket-box-flex-1" style="padding-left: 30px;">
            <span class="order_left_title_font">&nbsp;</span>
            <div class="order_details_height">
              <div class="layui-inline order_item_key_color order_right_text">
                <span>订单编号</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div class="layui-inline" v-if="this.orderDetail.departureDate">{{this.salesMainOrderNo}}</div>
            </div>
            <div class="order_details_height">
              <div class="layui-inline order_item_key_color order_right_text">
                <span>下单时间</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div class="layui-inline" v-if="this.orderDetail.departureDate && orderDesc.orders">{{dateFormat(new Date(orderDesc.orders[0].orderCreatTime), 'yyyy-MM-dd hh:mm:ss')}}</div>
            </div>
            <div class="order_details_height">
              <div class="layui-inline order_item_key_color order_right_text">
                <span>联系人</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div class="layui-inline">{{orderDesc.orderContacter.name}}</div>
            </div>
            <div class="order_details_height">
              <div class="layui-inline order_item_key_color order_right_text">
                <span>联系电话</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div class="layui-inline">{{orderDesc.orderContacter.cellphone}}</div>
            </div>
            <div class="order_details_height">
              <div class="layui-inline order_item_key_color order_right_text">
                <span>订单状态</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div id="paySta" class="layui-inline">
                <p :style="{color: orderStatusList[orderDesc.orderStatus] && orderStatusList[orderDesc.orderStatus].color}">{{orderStatusList[orderDesc.orderStatus] && orderStatusList[orderDesc.orderStatus].text}}</p>
                <p/>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-wrapper" v-if="apStatus">
          <div class="myWebKit-box" style="background-color: rgba(232, 232, 232, 0.34);padding-top: 30px; height: 260px;border-top: 0.5px solid #c3c3c3;">
            <div class="myWebket-box-flex-1" style="padding-left: 30px;">
              <span class="order_left_title_font" style="color:#464646;">申请单详情</span>
              <div class="order_details_height">
                <div class="layui-inline order_item_key_color">
                  <span style="padding-right:28px">标题</span>
                </div>
                <div class="layui-inline order_item_line"/>
                <div class="layui-inline">{{apTitle}}</div>
              </div>
              <div class="order_details_height">
                <div class="layui-inline order_item_key_color">
                  <span>出差理由</span>
                </div>
                <div class="layui-inline order_item_line"/>
                <div class="layui-inline">{{apReason}}</div>
              </div>
              <div class="order_details_height">
                <div class="layui-inline order_item_key_color">
                  <span style="padding-right:14px">目的地</span>
                </div>
                <div class="layui-inline order_item_line"/>
                <div class="layui-inline">{{apPlace}}</div>
              </div>
              <div class="order_details_height">
                <div class="layui-inline order_item_key_color">
                  <span style="padding-right:28px">状态</span>
                </div>
                <div class="layui-inline order_item_line"/>
                <div class="layui-inline"> <span v-if="apStatus">待审批</span></div>
              </div>
            </div>
            <div class="myWebket-box-flex-1" style="padding:32px 0 0 30px">
              <!-- <span class="order_left_title_font" style="color:#464646;">订单详情</span> -->
              <div class="order_details_height">
                <div class="layui-inline order_item_key_color">
                  <span>订单编号</span>
                </div>
                <div class="layui-inline order_item_line"/>
                <div class="layui-inline">{{apNo}}</div>
              </div>
              <div class="order_details_height">
                <div class="layui-inline order_item_key_color">
                  <span>创建时间</span>
                </div>
                <div class="layui-inline order_item_line"/>
                <div class="layui-inline">{{formatDate(new Date(apTime) )}}</div>
              </div>
              <div class="order_details_height">
                <div class="layui-inline order_item_key_color">
                  <span style="padding-right:14px">出差人</span>
                </div>
                <div class="layui-inline order_item_line"/>
                <div class="layui-inline">
                  <span style="padding: 0 10px 0 0;" v-for="item in apTrip" :key="item.index">{{item.name}}</span>
                </div>
              </div>
              <div class="order_details_height">
                <div class="layui-inline order_item_key_color">
                  <span style="padding-right:14px">审批人</span>
                </div>
                <div class="layui-inline order_item_line"/>
                <div class="layui-inline">
                  <span style="padding: 0 10px 0 0;" v-for="item in apChecker" :key="item.index">{{item.name}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="tabbar" v-if="orderDesc.payStatus === 0 && effect" class="layui-tab layui-tab-brief" lay-filter="filter">
          <ul class="layui-tab-title">
            <li :class="{active: params.payPlatform === 1 }" v-on:click="changePlatform(1)">支付宝支付</li>
            <li :class="{active: params.payPlatform === 0 }" v-on:click="changePlatform(0)">微信支付</li>
          </ul>
          <div class="layui-tab-content"/>
        </div>
        <div id="qrcode" v-loading="loading" v-if="orderDesc.payStatus === 0 && effect" class="layui-inline" style="background-color: #fff;width: 320px;height: 440px;text-align: center;">
          <div style="position: absolute;left: 137px;top: 161px;"/>
          <div class="order_details_height">
            扫一扫付款（元）
          </div>
          <div class="order_details_height" style="font-size: x-large;color: #c5470b;">
            <b>￥{{(orderDesc.totalAmount/100).toFixed(2)}}</b>
          </div>
          <div style="margin:0px 60px;width: 200px;    background-color: #fff;border: 0.5px solid #cecece;box-shadow: 1px 1px 1px #888888;">
            <div style="width: 200px; height: 200px; padding-top: 10px; padding-left:10px; position: relative">
              <div id="qrcode1"></div>
              <img class="qrcode-logo" :src="logoSrc">
            </div>
            <div style="height: 50px;">
              <div class="layui-inline">
                <img src="@/assets/saoyisao.png" style="width: 36px;">
              </div>
              <div class="layui-inline">
                <span id="payStayText">打开手机{{payPlatformName}}</span>
                <br>
                <span>扫一扫继续支付</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-cover"></div>
  </div>
</template>

<script>
import { createFlyOrder, getFlyPayStatus, queryOrderInfo } from '@/api/pay'
import { getStatus, detail } from '@/api/approval'
// import VueQr from 'vue-qr'
import { breakfastList } from '@/views/data'
import { dateFormat } from '@/util/lobal'
import { mapMutations } from 'vuex'
import { mapGetters } from 'vuex'
import { getStore } from "@/util/store";

export default {
  name: 'FlyOrderPay',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      orderStatusList: [
        {
          color: '#C6A300',
          text: '等待支付'
        },
        {
          color: '#C6A300',
          text: '等待出票'
        },
        {
          color: '#007500',
          text: '出票成功'
        },
        {
          color: '#007500',
          text: '退款中（订位失败）'
        },
        {
          color: '#272727',
          text: '退票中'
        },
        {
          color: '#272727',
          text: '已退款'
        },
        {
          color: '#272727',
          text: '已取消'
        }
      ],
      apTitle: '',
      apNo: '',
      apTime: '',
      apReason: '',
      apPlace: '',
      apTrip: [],
      apChecker: [],
      effect: true,
      apStatus: false,
      payBool: false,
      mm: 0,
      ss: 0,
      times: 0,
      breakfastList: breakfastList,
      orderDesc: {
        payStatus: -1,
        orderContacter: {}
      },
      params: {
        payPlatform: 0,
        orderNo: this.orderNo,
        salesMainOrderNo: this.payNumQuery.salesMainOrderNo,
        payType: 'NATIVE'
      },

      // qrcodeText: 'aaaaaaa',
      logoSrc: require('@/assets/alipay_icon.png'),
      loading: true
    }
  },
  beforeCreate () {
    this.payNumQuery = getStore({
      name: "payNumQuery"
    });
    this.orderDetail = getStore({
      name: "flyOrderQuery"
    })
  },
  created () {
    console.log('in')
    this.params.orderNo = this.orderNo = this.salesMainOrderNo = this.payNumQuery.salesMainOrderNo
    if (!this.userInfo.status) {
      this.setState({
        key: 'dialogLoginVisible',
        value: true,
        module: 'user'
      })
    } else if (this.accountId.length > 0) {
      this.initAcount()
    }
  },
  methods: {
    ...mapMutations(['setState']),
    dateFormat: dateFormat,
    initAcount () {
      queryOrderInfo({
        salesMainOrderNo: this.payNumQuery.salesMainOrderNo
      }).then(res => {
        this.orderDesc = res.data.data
        if (this.orderDesc.travelType == 0) {
          this.initOrderPage()
          console.log('oder')
        }
      })
    },
    formatDate (dateTime) {
      return dateFormat(new Date(dateTime), 'yyyy-MM-dd hh:mm')
    },
    changePlatform (num) {
      this.params.payPlatform = num
      createFlyOrder({
        flightNo: this.orderDetail.flightNo,
        flightOrderNo: this.salesMainOrderNo,
        // this.salesMainOrderNo
        payPlatform: this.params.payPlatform,
        payType: this.params.payType
      }).then(res => {
        if (res.data.code === 0) {
          if (this.qrcode) {
            this.qrcode.clear()
            this.qrcode.makeCode(res.data.data && res.data.data.codeUrl || '')
          } else {
            this.qrcode = new window.QRCode('qrcode1', {
              text: res.data.data && res.data.data.codeUrl || '',
              width: 180,
              height: 180,
              colorDark: '#000000',
              colorLight: '#ffffff',
              correctLevel: window.QRCode.CorrectLevel.H
            })
          }
        }
        if (this.params.payPlatform === 1) {
          this.logoSrc = require('@/assets/alipay_icon.png')
        } else {
          this.logoSrc = require('@/assets/wechatpay_icon.png')
        }
        this.loading = false
      })
    },
    initOrderPage () {
      queryOrderInfo({
        salesMainOrderNo: this.payNumQuery.salesMainOrderNo
      }).then(res => {
        this.orderDesc = res.data.data
        let orDesc = res.data.data
        if (res.data.code === 0) {
          getStatus({
            orderNo: this.payNumQuery.salesMainOrderNo,
            orderType: 0
          }).then(res => {
            if (res.data.code == 0) {
              if (res.data.data == 0) {
                this.apStatus = true
                this.effect = false
                detail({
                  orderNo: this.orderNo,
                  type: 0
                }).then(res => {
                  let resData = res.data.data
                  this.apTitle = resData.title
                  this.apNo = resData.formNo
                  this.apTime = resData.createDate
                  this.apPlace = resData.destination
                  this.apReason = resData.content
                  this.apTrip = resData.tripPeopleList
                  this.apChecker = resData.approvalPeopleList
                })
              }
              if (res.data.data == 1) {
                if (orDesc.payStatus === 0) {
                  this.getPayStatus()
                  this.changePlatform(1)
                }
                if (new Date(orDesc.orders[0].expirationTime).getTime() - (Date.now() + this.timeOffset) < 0) {
                  this.effect = false
                }
              }
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
          if (orDesc.payStatus === 0 && this.payBool) {
            this.getPayStatus()
            this.changePlatform(1)
          }
          if (new Date(orDesc.orders[0].expirationTime).getTime() - (Date.now() + this.timeOffset) < 0 || this.payBool) {
            this.effect = false
          }
        } else if (res.data.msg) {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    getmmss (expirationTime) {
      this.mm = parseInt(expirationTime / 60)
      this.ss = expirationTime - this.mm * 60
    },
    gethhmm (mm) {
      let hh = parseInt(mm / 60)
      return hh + '小时' + (mm - hh * 60) + '分钟'
    },
    getPayStatus () {
      getFlyPayStatus({
        orderNo: this.orderNo
      }).then(res => {
        console.log(res.data.data)
        if (res.data.data.payStateCode === 0) {
          this.orderDesc.payStatus = 3
          window.location.reload()
        } else if (res.data.data.payStateCode === 2) {
          this.orderDesc.payStatus = 5
        } else if (res.data.data.payStateCode === 3) {
          this.orderDesc.payStatus = 4
          this.$set(this.orderDesc, "orderStatus", 6)
        } else {
          if (this.$route.name === 'FlyOrderPay') {
            setTimeout(() => {
              this.getPayStatus()
            }, 1000)
          }
        }
      })
    }
  },
  computed: {
    ...mapGetters(['accountId', 'accountType', 'timeOffset']),
    payPlatformName () {
      return (this.params.payPlatform === 1) ? '支付宝' : '微信'
    }
  },
  watch: {
    accountId () {
      if (this.accountId.length > 0) {
        this.initAcount()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.order-pay-wrapper {
  width: 100%;
  position: relative;
  z-index: 2;
}
.bg-cover {
  width: 100%;
  position: absolute;
  top: 148px;
  background-color: #f5f6f8;
  bottom: 90px;
  left: 0;
  right: 0;
  min-width: 1180px;
  z-index: 1;
}
.order-pay {
  font-size: 14px;
  color: #000;
}
.order_left_title_font {
  font-size: 21px;
}
.order_details_height {
  height: 40px;
  line-height: 40px;
}
.layui-inline {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  text-align: left;
}
.order_item_line {
  margin: 0px 14px;
  background-color: #d0d9e0;
  width: 1px;
  height: 14px;
}
.order_item_key_color {
  color: #6a7689;
}
.myWebket-box-flex-1 {
  float: left;
  width: 50%;
  box-sizing: border-box;
}
.order_money {
  font-size: xx-large;
  color: #59a1ea;
}
.order_countdown_time_text {
  float: right;
  line-height: 50px;
  font-size: 20px;
  color: #c5470b;
}
.layui-tab-title li {
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  transition: all 0.2s;
  position: relative;
  line-height: 40px;
  min-width: 65px;
  padding: 0 15px;
  text-align: center;
  cursor: pointer;
}
.layui-tab-brief > .layui-tab-title .active {
  color: #59a1ea;
}
.order_left_text {
  width: 56px;
}
.order_right_text {
  width: 56px;
  text-align: left;
}
.qrcode-logo {
  position: absolute;
  top: 83px;
  left: 83px;
}
</style>
