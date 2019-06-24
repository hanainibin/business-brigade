<template>
  <div>
    <div class="order-pay-wrapper">
      <div class="order-pay" style="background-color:#FFFFFF ;width:1180px;margin:20px auto;border: 0.5px solid #c3c3c3;">
        <div style="margin:0px 30px;height: 50px;">
          <span style=";line-height: 50px;">收银台</span>
          <span v-if="orderDesc.orderStatus === 0" class="order_countdown_time_text" id="djs">
            <span v-if="effect">支付剩余时间：<span style="color: red;">{{mm}}</span>分<span style="color: red;">{{ss}}</span>秒</span>
            <span v-if="!effect">订单已经失效</span>
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
                <span>预订酒店</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div class="layui-inline">{{orderDesc.hotelName}}</div>
            </div>
            <div class="order_details_height">
              <div class="layui-inline order_item_key_color">
                <span>预订房型</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div class="layui-inline">{{orderDesc.roomTypeDesc}}</div>
            </div>
            <div class="order_details_height">
              <div class="layui-inline order_item_key_color">
                <span>早餐情况</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div class="layui-inline">{{breakfastList[orderDesc.breakfast]}}</div>
            </div>
            <div class="order_details_height">
              <div class="layui-inline order_item_key_color">
                <span>入住时间</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div class="layui-inline" v-if="orderDesc.checkDate">
                {{dateFormat(new Date(orderDesc.checkDate), 'yyyy-MM-dd')}}&nbsp;至&nbsp;
                {{dateFormat(new Date(orderDesc.outDate), 'yyyy-MM-dd')}}&nbsp;
                共{{orderDesc.night}}晚
              </div>
            </div>
            <div class="order_details_height">
              <div class="layui-inline order_item_key_color">
                <span>共计金额</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div class="layui-inline" v-if="orderDesc.price">
                <span class="order_money">￥{{orderDesc.price}}</span>
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
              <div class="layui-inline" v-if="orderDesc.checkDate">{{orderNo}}</div>
            </div>
            <div class="order_details_height">
              <div class="layui-inline order_item_key_color order_right_text">
                <span>下单时间</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div class="layui-inline" v-if="orderDesc.orderDate">{{dateFormat(new Date(orderDesc.orderDate), 'yyyy-MM-dd hh:mm:ss')}}</div>
            </div>
            <div class="order_details_height">
              <div class="layui-inline order_item_key_color order_right_text">
                <span>联系人</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div class="layui-inline">{{orderDesc.contactName}}</div>
            </div>
            <div class="order_details_height">
              <div class="layui-inline order_item_key_color order_right_text">
                <span>联系电话</span>
              </div>
              <div class="layui-inline order_item_line"/>
              <div class="layui-inline">{{orderDesc.contactPhone}}</div>
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
        <el-tabs v-model="selected" type="card" @tab-click="selectPayType" v-if="orderDesc.orderStatus === 0 && effect && !apStatus" v-loading="paymentLoading">
          <el-tab-pane label="企业垫付" name="companyAdvance" v-if="payType[2]">
            <div class="advance-payment">
              <!--<span>你将使用企业账户进行垫付</span>-->
              <el-button type="primary" v-on:click="advancePayment(2)" :disabled="payDisable" v-if="payTypeActive[2]">确认支付</el-button>
              <span v-else class="balance-not-enough">余额不足</span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="钱包预付" name="personAdvance" v-if="payType[1]">
            <div class="advance-payment">
              <!--<span>你将使用个人账户进行预付</span>-->
              <el-button type="primary" v-on:click="advancePayment(1)" :disabled="payDisable" v-if="payTypeActive[1]">确认支付</el-button>
              <span v-else class="balance-not-enough">余额不足</span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="支付宝支付" name="aliPay" v-if="payType[0]">
            <div id="alipayqrcode" v-loading="qrcodeLoading" class="layui-inline" style="background-color: #fff;width: 320px;height: 440px;text-align: center;">
              <div style="position: absolute;left: 137px;top: 161px;"/>
              <div class="order_details_height">
                扫一扫付款（元）
              </div>
              <div class="order_details_height" style="font-size: x-large;color: #c5470b;">
                <b>￥{{orderDesc.price}}</b>
              </div>
              <div style="margin:0px 60px;width: 200px;    background-color: #fff;border: 0.5px solid #cecece;box-shadow: 1px 1px 1px #888888;">
                <div style="width: 200px; height: 200px; padding-top: 10px; padding-left:10px; position: relative">
                  <div id="qrcode1"></div>
                  <img class="qrcode-logo" src="@/assets/alipay_icon.png">
                </div>
                <div style="height: 50px;">
                  <div class="layui-inline">
                    <img src="@/assets/saoyisao.png" style="width: 36px;">
                  </div>
                  <div class="layui-inline">
                    <span>打开手机支付宝</span>
                    <br>
                    <span>扫一扫继续支付</span>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="微信支付" name="wechatPay" v-if="payType[0]">
            <div id="wechatqrcode" v-loading="qrcodeLoading" class="layui-inline" style="background-color: #fff;width: 320px;height: 440px;text-align: center;">
              <div style="position: absolute;left: 137px;top: 161px;"/>
              <div class="order_details_height">
                扫一扫付款（元）
              </div>
              <div class="order_details_height" style="font-size: x-large;color: #c5470b;">
                <b>￥{{orderDesc.price}}</b>
              </div>
              <div style="margin:0px 60px;width: 200px;    background-color: #fff;border: 0.5px solid #cecece;box-shadow: 1px 1px 1px #888888;">
                <div style="width: 200px; height: 200px; padding-top: 10px; padding-left:10px; position: relative">
                  <div id="qrcode2"></div>
                  <img class="qrcode-logo" src="@/assets/wechatpay_icon.png">
                </div>
                <div style="height: 50px;">
                  <div class="layui-inline">
                    <img src="@/assets/saoyisao.png" style="width: 36px;">
                  </div>
                  <div class="layui-inline">
                    <span>打开手机微信</span>
                    <br>
                    <span>扫一扫继续支付</span>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="bg-cover"></div>
  </div>
</template>

<script>
import { createOrder, getPayStatus, getPayType } from '@/api/pay'
import { getStatus, detail } from '@/api/approval'
// import VueQr from 'vue-qr'
import { pay } from '@/api/order'
import { breakfastList } from '@/views/data'
import { dateFormat } from '@/util/lobal'
import { mapMutations } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'OrderPay',
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
          text: '等待确认'
        },
        {
          color: '#0f3',
          text: '预订成功'
        },
        {
          color: '#007500',
          text: '交易成功'
        },
        {
          color: '#272727',
          text: '交易关闭'
        },
        {
          color: '#272727',
          text: '订单取消'
        },
        {
          color: '#272727',
          text: '预订失败'
        }
      ],
      effect: true,
      apStatus: false,
      mm: 0,
      ss: 0,
      apTitle: '',
      apNo: '',
      apTime: '',
      apReason: '',
      apPlace: '',
      apTrip: [],
      apChecker: [],
      breakfastList: breakfastList,
      orderDesc: {
        orderStatus: -1
      },
      params: {
        tzPayType: 0,
        payPlatform: 1,
        orderNo: this.orderNo,
        payType: 'NATIVE'
      },
      payType: [false, false, false],
      payTypeActive: [false, false, false],
      payTypeText: ['', '企业垫付', '钱包预付'],
      selected: 'companyAdvance',
      // qrcodeText: 'aaaaaaa',
      logoSrc: require('@/assets/alipay_icon.png'),
      qrcodeLoading: true,
      paymentLoading: true,
      payDisable: false,
    }
  },
  created () {
    console.log('in')
    this.params.orderNo = this.orderNo = this.$route.query.orderNo
    console.log(this.accountType, 11)
    if (!this.userInfo.status) {
      this.setState({
        key: 'dialogLoginVisible',
        value: true,
        module: 'user'
      })
    } else if (this.accountId.length > 0) {
      this.initAconut()
    }
  },
  methods: {
    ...mapMutations(['setState']),
    dateFormat: dateFormat,
    formatDate (dateTime) {
      return dateFormat(new Date(dateTime), 'yyyy-MM-dd hh:mm')
    },
    initAconut () {
      pay({
        orderNo: this.orderNo
      }).then(res => {
        this.orderDesc = res.data.data
        console.log(66)
        if (this.orderDesc.travelType == 0 && this.accountType == 1) {
          this.initPage()
        } else {
          this.initOrderPage()
        }
      })
      console.log(this.accountType, 22)
      console.log(this.orderDesc.travelType)
    },
    initPage () {
      // alert(11)
      // getStatus({
      //   orderNo: this.orderNo,
      //   orderType: 0
      // }).then(res => {
      //   this.resCode = res.data.data
      //   if (res.data.code == 0) {
      //     if (res.data.data == 1) {
      pay({
        orderNo: this.orderNo
      }).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          this.orderDesc = res.data.data
          if (this.orderDesc.travelType === 0 && this.orderDesc.orderStatus === 0) {
            getStatus({
              orderNo: this.orderNo,
              orderType: 0
            }).then(res => {
              this.resCode = res.data.data
              if (res.data.code == 0) {
                if (res.data.data == 1) {
                  getPayType({
                    orderNo: this.orderNo,
                    userId: this.accountId,
                    userType: this.accountType,
                  }).then(res => {
                    if (res.data.code === 0) {
                      let supportType = res.data.data
                      for (let i = 0; i < supportType.length; ++i) {
                        this.payType[supportType[i].payType] = true
                        this.payTypeActive[supportType[i].payType] = Boolean(supportType[i].active)
                      }

                      if (this.payType[2] === false) {
                        this.selected = 'personAdvance'
                        if (this.payType[1] === false) {
                          this.selected = 'aliPay'
                        }
                      }
                      if (this.selected == 'aliPay') {
                        this.getAliPayQRCode()
                      }
                    } else if (res.data.msg) {
                      this.$message({
                        message: res.data.msg,
                        type: 'warning'
                      })
                    }

                    this.paymentLoading = false
                  })
                }
                else if (res.data.data == 0) {
                  this.apStatus = true
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
                  pay({
                    orderNo: this.orderNo
                  }).then(res => {
                    console.log(res)
                    if (res.data.code === 0) {
                      this.orderDesc = res.data.data

                      // if (this.orderDesc.orderStatus === 0) {
                      //   this.getPayStatus()
                      // }
                      // if (this.orderDesc.orderStatus === 0 && this.orderDesc.times > 0) {
                      //   this.params.userId = this.accountId
                      //   this.params.userType = this.accountType
                      //   setInterval(() => {
                      //     console.log(2)
                      //     this.orderDesc.times--
                      //     this.getmmss(this.orderDesc.times)
                      //     if (this.orderDesc.times < 0) {
                      //       this.effect = false
                      //       this.orderStatus.orderStatus = 4
                      //     }
                      //   }, 1000)
                      // }
                    }
                  })
                }

              }
              if (res.data.code == 1) {
                this.$message({
                  tyep: 'warning',
                  message: res.data.msg
                })
              }
            })
          } else if (this.orderDesc.travelType === 1 && this.orderDesc.orderStatus === 0) {
            this.payType = [true, false, false]
            if (this.payType[2] === false) {
              this.selected = 'personAdvance'
              if (this.payType[1] === false) {
                this.selected = 'aliPay'
              }
            }
            if (this.selected == 'aliPay') {
              this.getAliPayQRCode()
            }
            this.paymentLoading = false
          }

          if (this.orderDesc.orderStatus === 0) {
            this.getPayStatus()
          }
          if (this.orderDesc.orderStatus === 0 && this.orderDesc.times > 0) {
            this.params.userId = this.accountId
            this.params.userType = this.accountType
            setInterval(() => {
              console.log(4)
              this.orderDesc.times--
              this.getmmss(this.orderDesc.times)
              if (this.orderDesc.times < 0) {
                this.effect = false
                this.orderStatus.orderStatus = 4
              }
            }, 1000)
          }
        }
      })
      // }
      // else if (res.data.data == 0) {
      //   this.apStatus = true
      //   detail({
      //     orderNo: this.orderNo,
      //     type: 0
      //   }).then(res => {
      //     let resData = res.data.data
      //     this.apTitle = resData.title
      //     this.apNo = resData.formNo
      //     this.apTime = resData.createDate
      //     this.apPlace = resData.destination
      //     this.apReason = resData.content
      //     this.apTrip = resData.tripPeopleList
      //     this.apChecker = resData.approvalPeopleList
      //   })
      //   pay({
      //     orderNo: this.orderNo
      //   }).then(res => {
      //     console.log(res)
      //     if (res.data.code === 0) {
      //       this.orderDesc = res.data.data

      //       // if (this.orderDesc.orderStatus === 0) {
      //       //   this.getPayStatus()
      //       // }
      //       if (this.orderDesc.orderStatus === 0 && this.orderDesc.times > 0) {
      //         this.params.userId = this.accountId
      //         this.params.userType = this.accountType
      //         setInterval(() => {
      //           this.orderDesc.times--
      //           this.getmmss(this.orderDesc.times)
      //           if (this.orderDesc.times < 0) {
      //             this.effect = false
      //             this.orderStatus.orderStatus = 4
      //           }
      //         }, 1000)
      //       }
      //     }
      //   })
      // }
      // }
      // if (res.data.code == 1) {
      //   this.$message({
      //     tyep: 'warning',
      //     message: res.data.msg
      //   })
      // }
      // }
      // )

    },
    initOrderPage () {
      this.apStatus = false
      console.log(this.orderNo, 'this')
      pay({
        orderNo: this.orderNo
      }).then(res => {
        if (res.data.code === 0) {
          this.orderDesc = res.data.data
          console.log(this.orderDesc, 33)
          if (this.orderDesc.travelType === 0 && this.orderDesc.orderStatus === 0) {
            getPayType({
              orderNo: this.orderNo,
              userId: this.accountId,
              userType: this.accountType,
            }).then(res => {
              if (res.data.code === 0) {
                let supportType = res.data.data
                for (let i = 0; i < supportType.length; ++i) {
                  this.payType[supportType[i].payType] = true
                  this.payTypeActive[supportType[i].payType] = Boolean(supportType[i].active)
                }

                if (this.payType[2] === false) {
                  this.selected = 'personAdvance'
                  if (this.payType[1] === false) {
                    this.selected = 'aliPay'
                  }
                }
                if (this.selected == 'aliPay') {
                  this.getAliPayQRCode()
                }
              } else if (res.data.msg) {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }

              this.paymentLoading = false
            })
          } else if (this.orderDesc.travelType === 1 && this.orderDesc.orderStatus === 0) {
            this.payType = [true, false, false]
            if (this.payType[2] === false) {
              this.selected = 'personAdvance'
              if (this.payType[1] === false) {
                this.selected = 'aliPay'
              }
            }
            if (this.selected == 'aliPay') {
              this.getAliPayQRCode()
            }
            this.paymentLoading = false
          }

          if (this.orderDesc.orderStatus === 0) {
            this.getPayStatus()
          }
          if (this.orderDesc.orderStatus === 0 && this.orderDesc.times > 0) {
            this.params.userId = this.accountId
            this.params.userType = this.accountType
            setInterval(() => {
              console.log(1)
              this.orderDesc.times--
              this.getmmss(this.orderDesc.times)
              if (this.orderDesc.times < 0) {
                this.effect = false
                this.orderStatus.orderStatus = 4
              }
            }, 1000)
          }
        }
      })
    },
    selectPayType () {
      if (this.selected === 'aliPay') {
        this.getAliPayQRCode()
      } else if (this.selected === 'wechatPay') {
        this.getWechatQRCode()
      }
    },
    getAliPayQRCode () {
      this.params.payPlatform = 1
      this.params.tzPayType = 0
      createOrder(this.params).then(res => {
        if (res.data.code === 0) {
          if (this.alipayqrcode) {
            this.alipayqrcode.clear()
            this.alipayqrcode.makeCode(res.data.data && res.data.data.codeUrl || '')
          } else {
            this.alipayqrcode = new window.QRCode('qrcode1', {
              text: res.data.data && res.data.data.codeUrl || '',
              width: 180,
              height: 180,
              colorDark: '#000000',
              colorLight: '#ffffff',
              correctLevel: window.QRCode.CorrectLevel.H
            })
          }
        } else if (res.data.msg) {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }

        this.qrcodeLoading = false
      })
    },
    getWechatQRCode () {
      this.params.payPlatform = 0
      this.params.tzPayType = 0
      createOrder(this.params).then(res => {
        if (res.data.code === 0) {
          if (this.wechatqrcode) {
            this.wechatqrcode.clear()
            this.wechatqrcode.makeCode(res.data.data && res.data.data.codeUrl || '')
          } else {
            this.wechatqrcode = new window.QRCode('qrcode2', {
              text: res.data.data && res.data.data.codeUrl || '',
              width: 180,
              height: 180,
              colorDark: '#000000',
              colorLight: '#ffffff',
              correctLevel: window.QRCode.CorrectLevel.H
            })
          }
        } else if (res.data.msg) {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }

        this.qrcodeLoading = false
      })
    },
    advancePayment (num) {
      this.$confirm(`你将使用${this.payTypeText[num]}进行支付`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.payDisable = true
        this.$message({
          type: 'success',
          message: '支付中，请稍候!'
        });
        this.params.tzPayType = num
        createOrder(this.params).then(res => {
          this.payDisable = false
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '支付成功！'
            });
          } else if (res.data.msg) {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        })
      }).catch(() => {

      })
    },
    getmmss (times) {
      this.mm = parseInt(times / 60)
      this.ss = times - this.mm * 60
    },
    getPayStatus () {
      getPayStatus(this.orderNo).then(res => {
        if (res.data.data.payStateCode === 0) {
          this.orderDesc.orderStatus = 1
        } else if (res.data.data.payStateCode === 2) {
          this.orderDesc.orderStatus = 5
        } else if (res.data.data.payStateCode === 3) {
          this.orderDesc.orderStatus = 4
        } else {
          if (this.$route.name === 'OrderPay') {
            setTimeout(() => {
              this.getPayStatus()
            }, 1000)
          }
        }
      })
    }
  },
  computed: {
    ...mapGetters(['accountId', 'accountType']),
    /*
        payPlatformName () {
          return (this.params.payPlatform === 1) ? '支付宝' : '微信'
        }
    */
  },
  watch: {
    accountId () {
      if (this.accountId.length > 0) {
        // this.initPage()
        this.initAconut()
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
  padding-bottom: 0px;
  .detail-wrapper {
    border: none;
    width: 1180px;
    margin-top: 1px;
  }
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
.order_right_text {
  width: 56px;
  text-align: left;
}
.qrcode-logo {
  position: absolute;
  top: 83px;
  left: 83px;
}
.advance-payment {
  margin: 10px 0 30px 50px;
}
.balance-not-enough {
  font-size: 30px;
  color: red;
}
</style>
