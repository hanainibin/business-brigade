<template>
  <div class="bg" v-loading="loading" element-loading-text="正在读取价格，请稍候。">
    <div class="orderWrapper">
      <el-dialog
        :visible.sync="roomApplyDialogVisible"
        custom-class="add-room-user"
      >
        <choose-user :userInfo= "userInfo" @childRoomAdd='childRoomAdd'></choose-user>
      </el-dialog>
      <el-dialog
        :visible.sync="roomCheckDialogVisible"
        custom-class="add-room-check"
      >
        <choose-user :userInfo= "userInfo" @childRoomCheck='childRoomCheck'></choose-user>
      </el-dialog>
      <el-dialog title="出差申请" 
                 :visible.sync="addApprovalDialogVisible" 
                 custom-class="add-approval-dialog">
        <el-dialog title="添加申请人" 
                   :visible.sync="addUserDialogVisible" 
                   append-to-body
                   width="490px"
                   custom-class="add-user-dialog">
          <choose-user :userInfo= "userInfo" @childByValue='childByValue'></choose-user>
        </el-dialog>
        <el-dialog title="添加审批人" 
                   :visible.sync="addCheckerDialogVisible" 
                   append-to-body
                   width="490px"
                   custom-class="add-user-dialog">
          <choose-user :userInfo= "userInfo" @approvalValue='approvalValue'></choose-user>
        </el-dialog>
        <div class="dialog-content">
          <div class="top-content-head">
            <div class="top-content-head-l">
              <span class="">申请类型:</span>
              <span class="">出差申请</span>
            </div>
            <div class="top-content-head-r">
              <span class="">目的地:</span>
              <order-select-city class="city-inline" :cityId ="cityId"/>
            </div>
          </div>
          <div class="top-content">
            <div class="title-wrapper">
              <span class="title-span">标题:</span>
              <el-input 
                ref="title"
                class="title-input" 
                v-model="titleInput" 
                placeholder="请输入内容" 
                clearable>
              </el-input>
            </div>
          </div>
          <div class="center-content-l">
            <span class="span-reason">申请理由:</span>
            <el-input
              ref="reason"
              class="text-area"
              type="textarea"
              maxlength="400"
              :autosize="{ minRows: 2, maxRows: 3}"
              placeholder="请输入内容"
              v-model="reasonArea"
              clearable>
            </el-input>
          </div>
          <div class="center-content-s">
            <div class="applyuser-wrapper">
              <span>申请人:</span>
              <span class="apply-user-item" v-for="(item,index) in childUserName" :key="item.index">{{item}}
                <i class="el-icon-close"  @click="delInnerUser(index)"> </i>
              </span>
              <i class="el-icon-circle-plus" @click="addUser"></i>
              <!-- <i class="el-icon-delete"></i> -->
            </div>
          </div>
          <div class="bottom-content">
            <div class="check-user-wrapper">
              <span>审批人:</span>
              <span class="checked-user-item" v-for="(item,index) in childApprovalName" :key="item.index">{{item}}
                <i class="el-icon-close" @click="delInnerChecker(index)"></i>
              </span>
              <i class="el-icon-circle-plus" @click="addChecker"></i>
              <!-- <i class="el-icon-delete" @click="delInnerChecker"></i> -->
              <span class="inner-finalAdmin">{{finalAdmin}}</span>
            </div>
          </div>
          <div class="bottom-content-foot">
            <div class="botton-wrapper">
              <el-button type="danger" class="button-lf" @click="reset">重置</el-button>
              <el-button type="primary" class="botton-rg" @click="save">保存</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
      <div class="order-header">
        <div class="head-content">
          <i class="iconfont icon-left">&#xe632;</i>
          <span class="item-left">填写订单信息</span>
          <i class="iconfont icon-center">&#xe6b0;</i>
          <i class="iconfont icon-right">&#xe602;</i>
          <span class="item-right item-right">确认并支付</span>
        </div>
      </div>
      <div class="order-plane">
        <div class="plane-wrapper">
          <div class="plane-content">
            <div class="plane-top">
              <img :src="formatImg(flyOrderQuery.carrierCode)" alt="无图" class="plane-img">
              <div style="width:190px; height:65px; margin-left: 10px; float:right; position: relative;">
                <span class="carrierName">{{flyOrderQuery.carrierName}}  {{flyOrderQuery.flightNo}}</span>
                <span class="airplaneType" v-if="flyOrderQuery.itemIndex.airplaneType">{{flyOrderQuery.itemIndex.airplaneType}}型客机</span>
                <span class="airplaneName">{{flyOrderQuery.itemIndex.airplaneName}}</span>
              </div>
            </div>
            <div class="plane-tip">
              <span class="tip-item">{{flyOrderQuery.seatClass.seatClassName}}</span>
              <span class="tip-item">{{flyOrderQuery.itemIndex.mealType.length == 0 ? none:have}}</span>
              <!-- <span></span> -->
            </div>
          </div>
        </div>
        <div class="plane-right">
          <div class="plane-right-head">
            <span class="head-time">{{flyOrderQuery.itemIndex.departureTime.slice(0,10)}}日</span>
            <span class="column-line"></span>
            <span class="head-city">
              {{flyOrderQuery.itemIndex.departureAirport.cityName}}
              <i class="iconfont fly">&#xe603;</i>
              {{flyOrderQuery.itemIndex.arrivalAirport.cityName}}
            </span>
          </div>
          <div class="center-time">
            <span class="time-start time-all">{{flyOrderQuery.itemIndex.departureTime.slice(11,16)}}</span>
            <span class="left-line"></span>
            <span class="center-circle">{{hour}}h{{mins}}m</span>
            <span class="right-line"></span>
            <span class="time-end time-all">{{flyOrderQuery.itemIndex.arrivalTime.slice(11,16)}}</span>
          </div>
          <div class="bottom-station">
            <span class="left-station station">{{flyOrderQuery.itemIndex.departureAirport.airportName}}{{flyOrderQuery.itemIndex.departureAirport.termainalBuildingCode}}</span>
            <span class="right-station station">{{flyOrderQuery.itemIndex.arrivalAirport.airportName}}{{flyOrderQuery.itemIndex.arrivalAirport.termainalBuildingCode}}</span>
          </div>
        </div>
      </div>
      <div class="order-user">
        <div style="border-bottom: 0.5px solid RGBA(226, 232, 242, 1)">
          <el-form style="position: relative" :model="Passengers" ref="Passengers" label-width="100px" class="demo-dynamic">
            <div class="order_user_head">添加乘客</div>
            <el-form-item v-show="Passengers.passengersItem.length>1" v-for="(userItem, index) in Passengers.passengersItem.slice(1,Passengers.passengersItem.length)"
                          :label="'乘客' + passengerCount(index)" :key="userItem.key" :prop="'passengersItem[' + index + ']'">
              <div class="order_left order-item">
                <span class="order_item_name">姓名</span>
                <el-input v-model="userItem.passengerName" class="userItem-input" ref="passengerName" maxlength="20"></el-input>
              </div>
              <div class="order_center order-item">
                <div class="order_item_card">身份证号</div>
                <el-input v-model="userItem.passengerIDCardNo" class="userItem-input" ref="passengerIDCardNo"
                          maxlength="18"></el-input>
              </div>
              <div class="order_right order-item">
                <div class="order_item_phone">手机号码</div>
                <el-input v-model="userItem.cellphone" class="userItem-input" ref="cellphone"
                          maxlength="11">
                </el-input>
              </div>
              <el-button class="remove-btn" @click.prevent="removeuserItem(userItem)">删除</el-button>
              <!-- 禁删，这里是保险功能，不要删掉
                  <div class="order_item_key_color" v-if="insuranceInfoArr.length > 0">特殊要求</div>
                  <div class="order_item_line" v-if="insuranceInfoArr.length > 0" />
                  <i class="iconfont" v-if="insuranceInfoArr.length > 0" style="font-size: 14px; cursor:pointer;" @click="handleInsurance(isShowAddInsurance)">保险&#xe664;</i>
                  <collapse>
                      <div class="Insurance" v-if="isShowAddInsurance">
                          <li>
                              <div>
                                  <span>{{insuranceIntravelTypefoArr[0].insuranceClass.name}}
                                      <i class="iconfont" @click="changeIcon">&#xe68c;</i>
                                  </span>
                                  <span style="margin-left: 20px;">价格:￥{{insuranceInfoArr[0].insurancePrice}}</span>
                                  <span style="margin-left: 20px;">{{insuranceInfoArr[0].insuranceRemark}}</span>
                                  <el-checkbox-group v-model="insRemark1[index]" @change="handleOne(insuranceInfoArr[0],index)">
                                      <el-checkbox label="" />
                                  </el-checkbox-group>
                              </div>
                              <div>
                                  <span>{{insuranceInfoArr[0].name}}</span>
                              </div>classA
                          </li>
                          <li>
                              <div>
                                  <span>{{insuranceInfoArr[1].insuranceClass.name}}
                                      <i class="iconfont" @click="changeIcon">&#xe68c;</i>
                                  </span>
                                  <span style="margin-left: 20px;">价格:￥{{insuranceInfoArr[1].insurancePrice}}</span>
                                  <span style="margin-left: 20px;">{{insuranceInfoArr[1].insuranceRemark}}</span>
                                  <el-checkbox-group v-model="insRemark2[index]" @change="handleTwo(insuranceInfoArr[1],index)">
                                      <el-checkbox label="" />
                                  </el-checkbox-group>
                              </div>
                              <div>
                                  <span>{{insuranceInfoArr[1].name}}</span>
                              </div>
                          </li>
                      </div>
                  </collapse> -->
            </el-form-item>
            <el-form-item class="el-btn-item">
              <el-button class="add-btn" @click="adduserItem">新增</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="order-finder">
          <div class="user-title">填写联系人信息</div>
          <div class="flex-wrapper">
            <div class="order_bottom">
              <div class="order_name">联系人员</div>
              <el-input class="input-user input-user-name" v-model="userName" placeholder="联系人" ref="userNameRef" maxlength="20"
                        onkeyup="this.value=this.value.trim()"/>
            </div>
            <div class="order_end">
              <div class="order_tel">联系电话</div>
              <el-input class="input-user input-user-tel" v-model="cellphone" placeholder="请输入号码" maxlength="11" ref="telPhone"
                        onkeyup="this.value=this.value.trim()"/>
            </div>
            <div class="order_bottom_type" v-if="!accountType == 0 ">
              <div class="order_left_height">
                <!-- <div class="order_item_key_color">出行类型</div> -->
                <div class="order_item_line"/>
                <el-radio v-model="travelType" :label="0">因公</el-radio>
                <el-radio v-model="travelType" :label="1">因私</el-radio>
              </div>
            </div>
          </div>
        </div>
        <!-- 出差申请功能 -->
        <div class="approval-wrapper" v-if="travelType == 0 && accountType ==1">
          <div class="user-title">出差申请</div>
          <div class="flex-wrapper">
            <div class="order_bottom">
              <span class="titleInput">{{titleInput}}</span>
              <i class="el-icon-circle-plus" @click="addApproval"></i>
            </div>
            <div class="order_end">
              <span class="user-lable">申请人:</span>
              <span class="bottom-appprovaler" v-for="(item,index) in LocalUserName" :key="item.index">{{item}}
                <i class="el-icon-close" @click="delOutUser(index)"></i>
              </span>
              <i class="el-icon-circle-plus" @click="addRoomUser"></i>
            </div>
            <div class="order_bottom_type" v-if="!accountType == 0 ">
              <span class="checker-lable">审批人:</span>
              <span class="bottom-appprovaler" v-for="(item,index) in LocalApprovalName" :key="item.index">{{item}}
                <i class="el-icon-close" @click="delOutChecker(index)"></i>
              </span>
              <i class="el-icon-circle-plus" @click="addRoomChecker"></i>
              <span class="out-finalAdmin">{{finalAdmin}}</span>
            </div>
          </div>
        </div>
        <div class="price-wrapper">
          <div class="order_price">支付金额</div>
          <div class="order_bottom_price">
            <span class="order-money" v-if="flyOrderQuery.seatClass.parPrice > 0">
              <span>¥</span>
              {{flyOrderQuery.seatClass.salesPrice * (Passengers.passengersItem.length - 1)}}
            </span>
            <span class="order-money" v-else>无</span>
          </div>
          <div class="btn-wrapper">
            <el-button
              @click="handleAirOrder"
              type="primary" 
              class="order_button">
              下一步，去支付
            </el-button>
          </div>
        </div>
      </div>
      <div class="hotel-wrapper">
        <div class="hot-head"><i class="iconfont hot-icon">&#xe60e;</i>{{flyOrderQuery.itemIndex.arrivalAirport.cityName}}热门酒店</div>  
        <div>精品商务酒店</div>
        <ul v-for="hotelItem in hotelData" :key="hotelItem.id">
          <li class="hotel-item" @click="toHotelDetail(hotelItem)">
            <div class="img-wrapper">
              <img :src="fomatImg(hotelItem.headImage)" alt="无图" class="hotel-img">
            </div>
            <span class="hotel-level" v-if="hotelItem.hotelLevel">{{hotelItem.hotelLevel}}</span>
            <div class="hotel-name">{{hotelItem.hotelName}}</div>
            <div class="bottom-item" style="color:red">
              <!-- <span class="bottom-left">续订优惠</span> -->
              <span class="bottom-right" v-if="hotelItem.priceLevel">￥{{hotelItem.priceLevel/100}}</span>
              <span class="bottom-right" v-if="!hotelItem.priceLevel">优惠价</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { dateFormat } from "@/util/lobal";
import { doAirOrder, searchInsurances } from "@/api/order";
import {
  loadList
} from "@/api/wxResign";
import { getModel } from '@/api/approval'
import { getStore, setStore, removeStore } from "@/util/store";
import { increaseMonth } from "@/util/util.js";
import collapse from "@/util/collapse.js";
import { validatename, cardid } from '@/util/validate'
import ChooseUser from '@/components/ChooseUser.vue'
import OrderSelectCity from '@/components/OrderSelectCity.vue'
export default {
  name: "Orderfly",
  components: {
    collapse,
    ChooseUser,
    OrderSelectCity
  },
  data () {
    doAirOrder;
    return {
      // cankaoDate: Date.now() + this.timeOffset,
      titleInput: `出差申请:${this.flyOrderQuery.itemIndex.arrivalAirport.cityName}`,
      reasonArea: `出差:${this.flyOrderQuery.itemIndex.arrivalAirport.cityName}`,
      finalAdmin: '',
      cityId: this.flyOrderQuery.toId,
      childUserName: [],
      childApprovalName: [],
      childUserId: [],
      LocalUserName: [],
      LocalApprovalName: [],
      LocalUserId: [],
      LocalApprovalId: [],
      childApprovalId: [],
      roomApplyDialogVisible: false,
      roomCheckDialogVisible: false,
      addApprovalDialogVisible: false,
      addUserDialogVisible: false,
      addCheckerDialogVisible: false,
      today: new Date(Date.now()),
      pickerOptions1: {
        disabledDate: time => {
          return (
            time.getTime() < this.cankaoDate - 8.64e7 ||
            time.getTime() > increaseMonth(this.today, 2) + this.timeOffset
          );
        }
      },
      pickerOptions2: {
        disabledDate: time => {
          return (
            time.getTime() <= this.value1 ||
            time.getTime() >
            increaseMonth(this.today, 2) + this.timeOffset + 8.64e7
          );
        }
      },
      Passengers: {
        passengersItem: [
          {
            passengerName: "11",
            passengerIDCardNo: "2206199810213015",
            cellphone: "13342277276",
          }
        ],
      },
      classB: 'classB',
      classA: 'classA',
      orderInsuranceItem1: {},
      orderInsuranceItem2: {},
      insRemark1: [],
      insRemark2: [],
      cardNum: "",
      gender: 0,
      orderPassengers: [],
      totalSalesAmount: 0,
      value1: new Date(this.flyOrderQuery.departureDate.replace(/-/g, "/")),
      value2: new Date(this.flyOrderQuery.arrivalTime.replace(/-/g, "/")),
      options: [
        {
          label: "身份证",
          value: 1
        },
        {
          label: "护照",
          value: 2
        },
        {
          label: "港澳通行证",
          value: 3
        },
        {
          label: "回乡证",
          value: 4
        },
        {
          label: "士兵证",
          value: 5
        },
        {
          label: "军官证",
          value: 6
        },
        {
          label: "台胞证",
          value: 7
        },
        {
          label: "其他",
          value: 8
        }
      ],
      have: '有餐食',
      none: '无餐食',
      hotelData: [],
      // passengerIDCardType: [
      //   'id',
      //   'passport',
      //   'GANGAO'
      // ],
      // flyCount:['身份证','护照','港澳通行证'],
      cardType: [],
      isShowAddInsurance: false,
      insuranceInfoArr: {},
      passengerBirthday: "",
      userName: "",
      cellphone: this.userInfo && this.userInfo.phone || "",
      passengerIDCardType: "ID",
      price: "0.00",
      travelType: 0,
      remarksArr: [],
      loading: false,
      isDisabled: false,
      iconDisplay: false
    };
  },
  computed: {
    ...mapGetters(["nickName", "accountId", "accountType", "userInfo", "timeOffset"])
  },
  watch: {
    accountType (value) {
      this.userType = value;
      this.childUserName.push(this.nickName)
      this.LocalUserName.push(this.nickName)
      this.childUserId.push(this.accountId)
      this.LocalUserId.push(this.accountId)
    },
    nickName (value) {
      this.userName = value
    },
    userInfo (value) {
      this.cellphone = value.phone
    }
  },
  beforeCreate () {
    this.flyOrderQuery = getStore({
      name: "flyOrderQuery"
    });
    this.passengerQuery = getStore({
      name: "passengersInfo"
    })
  },
  created () {
    window.globelEvent.$on('destinationId', cityId => {
      this.cityId = cityId;
    });
    window.globelEvent.$on('destinationName', name => {
      this.chineseCityName = name
      this.titleInput = '出差申请:' + name
      console.log(name, 'name')
      console.log(this.titleInput, 'titleInput')
      this.reasonArea = '出差:' + name
    });
    this.readyGetModel()
    this.loading = false;
    this.hour = Math.floor((this.value2 - this.value1) / (60 * 60 * 1000))
    this.min = (this.value2 - this.value1) / (60 * 60 * 1000) - Math.floor((this.value2 - this.value1) / (60 * 60 * 1000))
    this.mins = Math.floor(this.min * 60)
    console.log(this.userInfo, 'userinfo')
    this.cellphone = this.userInfo && this.userInfo.phone || ""
    let passengerQuery = getStore({
      name: "passengerQuery"
    })
    this.passengerQuery = { ...passengerQuery }
  },
  mounted () {
    searchInsurances({
      departDate: this.flyOrderQuery.departureDate,
      flightNos: [this.flyOrderQuery.flightNo]
    }).then(res => {
      this.insuranceInfoArr = res.data.data;
      console.log(this.insuranceInfoArr);
    });
    this.adduserItem()
    let arr = this.passengerQuery.passengersInfo
    if (typeof (arr) == "undefined") {
      //  this.Passengers.passengersItem[1] = arr
      console.log(arr, '11')
    } else {
      this.Passengers.passengersItem[1] = arr
    }
    this.hotelList()
  },
  methods: {
    save () {
      let bool = true
      let msg = ''
      if (this.reasonArea.length == 0) {
        bool = false
        msg = '请填写理由'
        this.$refs.reason.focus()

      }
      if (this.titleInput.length == 0) {
        msg = '请填写标题'
        bool = false
        this.$refs.title.focus()
      }
      if (this.childUserName.length == 0 && !this.reasonArea.length == 0 && !this.titleInput.length == 0) {
        msg = '请选择申请人'
        bool = false
        this.addUserDialogVisible = true
      }
      if (bool) {
        setStore({
          name: 'flyOutMan',
          content: {
            LocalApprovalName: this.childApprovalName,
            LocalUserName: this.childUserName,
            LocalApprovalId: this.childApprovalId,
            LocalUserId: this.childUserId
          }
        })
        this.LocalApprovalName = getStore({ name: 'flyOutMan' }).LocalApprovalName
        this.LocalUserName = getStore({ name: 'flyOutMan' }).LocalUserName
        this.LocalUserId = getStore({ name: 'flyOutMan' }).LocalUserId
        this.LocalApprovalId = getStore({ name: 'flyOutMan' }).LocalApprovalId
        this.addApprovalDialogVisible = false
        // this.$set(this.approvalOptions, '1', { label: this.titleInput, value: '选项0' })
        let setList = new Set()
        setList.add({ label: this.titleInput, value: '选项0' })
        this.approvalOptions = Array.from(setList)
      } else {
        this.$message(
          {
            type: 'warning',
            message: msg
          }
        )
      }
    },
    reset () {
      this.titleInput = '',
        this.reasonArea = '',
        this.childUserName = [],
        this.childApprovalName = []
    },
    // readyGetModel () {
    //   this.loading = true
    //   getModel().then(res => {
    //     console.log(res)
    //     this.loading = false
    //     let resData = res.data
    //     if (resData.code === 0) {
    //       this.finalAdmin = resData.data.approvalPeople.name
    //       this.finalAdminId = resData.data.approvalPeople.userId
    //       this.checkType = resData.data.checkType
    //       this.adminCheck = resData.data.adminCheck
    //     }
    //     if (resData.code === 1) {
    //       if (resData.msg.length > 0 && this.travelType == 1) {
    //         this.$message({
    //           message: resData.msg,
    //           type: 'warning'
    //         })
    //       }
    //     }
    //   })
    // },
    addRoomUser () {
      this.roomApplyDialogVisible = true
    },
    addRoomChecker () {
      this.roomCheckDialogVisible = true
    },
    addUser () {
      this.addUserDialogVisible = true
    },
    addChecker () {
      this.addCheckerDialogVisible = true
    },
    delInnerUser (index) {
      this.childUserName.splice(index, 1)
      this.childUserId.splice(index, 1)
    },
    delInnerChecker (index) {
      this.childApprovalName.splice(index, 1)
      this.childApprovalId.splice(index, 1)
    },
    delOutUser (index) {
      this.LocalUserName.splice(index, 1)
      this.LocalUserId.splice(index, 1)
    },
    delOutChecker (index) {
      this.LocalApprovalName.splice(index, 1)
      this.LocalApprovalId.splice(index, 1)
    },
    addApproval () {
      this.addApprovalDialogVisible = true
    },
    childRoomAdd (val, val2) {
      console.log(val, 'room')
      let bool = this.Passengers.passengersItem.length - 1 > this.LocalUserName.length
      let boolean = this.LocalUserId.indexOf(val.realUserId)
      let beforeBoolStore = typeof (getStore({ name: 'outMan1' })) == 'undefined'
      if (boolean == -1 && bool) {
        this.LocalUserName.push(val.userName)
        this.LocalUserId.push(val.realUserId)
        if (!beforeBoolStore) {
          let boolStore = typeof (getStore({ name: 'outMan1' })).LocalApprovalName == 'undefined'
          if (!boolStore) {
            setStore({
              name: 'outMan1',
              content: {
                LocalUserName: this.LocalUserName,
                LocalUserId: this.LocalUserId,
                LocalApprovalName: getStore({ name: 'outMan1' }).LocalApprovalName,
                LocalApprovalId: getStore({ name: 'outMan1' }).LocalApprovalId,
              }
            })
          } else {
            setStore({
              name: 'outMan1',
              content: {
                LocalUserName: this.LocalUserName,
                LocalUserId: this.LocalUserId,
                LocalApprovalName: [],
                LocalApprovalId: [],
              }
            })
          }
        }
      }
      else if (!bool) {
        this.$message({
          type: 'warning',
          message: `最多添加${this.LocalUserName.length}人`
        })
        this.roomApplyDialogVisible = val2
      }
      if (boolean >= 0) {
        this.$message({
          type: 'warning',
          message: '请勿重复添加'
        })
      }
      // if (finalAdminBool) {
      //   this.$message({
      //     type: 'warning',
      //     message: '申请人不能与审批人相同'
      //   })
      // }
      // if (checkerBool >= 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '申请人不能与审批人相同'
      //   })
      // }
      this.roomApplyDialogVisible = val2
    },
    childRoomCheck (val, val2) {
      let bool = this.LocalApprovalName.length
      let boolean = this.LocalApprovalId.indexOf(val.realUserId)
      let finalAdminBool = val.realUserId == this.finalAdminId
      let beforeBoolStore = typeof (getStore({ name: 'outMan1' })) == 'undefined'
      if (boolean == -1 && bool < 10 && !finalAdminBool) {
        this.LocalApprovalName.push(val.userName)
        this.LocalApprovalId.push(val.realUserId)
        if (!beforeBoolStore) {
          let boolStore = typeof (getStore({ name: 'outMan' })).LocalApprovalName == 'undefined'
          if (!boolStore) {
            setStore({
              name: 'outMan1',
              content: {
                LocalUserName: getStore({ name: 'outMan1' }).LocalApprovalName,
                LocalUserId: getStore({ name: 'outMan1' }).LocalApprovalId,
                LocalApprovalName: this.LocalApprovalName,
                LocalApprovalId: this.LocalApprovalId,
              }
            })
          } else {
            setStore({
              name: 'outMan1',
              content: {
                LocalUserName: [],
                LocalUserId: [],
                LocalApprovalName: this.LocalApprovalName,
                LocalApprovalId: this.LocalApprovalId,
              }
            })
          }
        }
      }
      else {
        this.$message({
          type: 'warning',
          message: `最多添加${this.LocalApprovalName.length}人`
        })
        this.addUserDialogVisible = val2
      }
      if (boolean >= 0) {
        this.$message({
          type: 'warning',
          message: '请勿重复添加'
        })
      }
      if (finalAdminBool) {
        this.$message({
          type: 'warning',
          message: '最终审批人已设置,请勿重复添加'
        })
      }
      // if (accountBool) {
      //   this.$message({
      //     type: 'warning',
      //     message: '自己不可以是审批人'
      //   })
      // }
      // if (travelerBool >= 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '审批人不能与申请人相同'
      //   })
      // }
      this.roomCheckDialogVisible = val2
    },
    childByValue (val, val2) {
      let bool = this.Passengers.passengersItem.length - 1 > this.childUserName.length
      let boolean = this.childUserId.indexOf(val.realUserId)
      // let finalAdminBool = this.finalAdminId == val.realUserId
      // let checkerBool = this.childApprovalId.indexOf(val.realUserId)
      if (bool && boolean == -1) {
        this.childUserName.push(val.userName)
        this.childUserId.push(val.realUserId)
        this.addUserDialogVisible = val2
      }
      else if (!bool) {
        this.$message({
          type: 'warning',
          message: `最多添加${this.childUserName.length}人`
        })
        this.addUserDialogVisible = val2
      }
      if (boolean >= 0) {
        this.$message({
          type: 'warning',
          message: '请勿重复添加'
        })
      }
      // if (finalAdminBool) {
      //   this.$message({
      //     type: 'warning',
      //     message: '申请人不能与审批人相同'
      //   })
      // }
      // if (checkerBool >= 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '申请人不能与审批人相同'
      //   })
      // }
    },
    approvalValue (val, val2) {
      let bool = this.childApprovalName.length
      let boolean = this.childApprovalId.indexOf(val.realUserId)
      // let accountBool = val.realUserId == this.accountId
      let finalAdminBool = val.realUserId == this.finalAdminId
      // let travelerBool = this.childUserId.indexOf(val.realUserId)
      if (boolean == -1 && bool < 10 && !finalAdminBool) {
        this.childApprovalName.push(val.userName)
        this.childApprovalId.push(val.realUserId)
      }
      else {
        this.$message({
          type: 'warning',
          message: `最多添加${this.childUserName.length}人`
        })
        this.addUserDialogVisible = val2
      }
      if (boolean >= 0) {
        this.$message({
          type: 'warning',
          message: '请勿重复添加'
        })
      }
      if (finalAdminBool) {
        this.$message({
          type: 'warning',
          message: '最终审批人已设置,请勿重复添加'
        })
      }
      // if (accountBool) {
      //   this.$message({
      //     type: 'warning',
      //     message: '自己不可以是审批人'
      //   })
      // }
      // if (travelerBool >= 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '审批人不能与申请人相同'
      //   })
      // }
      this.addCheckerDialogVisible = val2
    },
    hotelList () {
      loadList({
        city: this.flyOrderQuery.itemIndex.arrivalAirport.cityName,
        cityId: this.flyOrderQuery.toId,
        limit: 4,
        page: 1,
        sortField: "commentCount",
        sortType: "desc"
      }).then(res => {
        if (res.data.code == 0) {
          this.hotelData = [...res.data.data.results]
          console.log(this.hotelData, 'ss')
        }
      })
    },
    toHotelDetail (hotelItem) {
      setStore({
        name: 'HotelDetail',
        content: {
          startDate: dateFormat(new Date(this.value2)),
          endDate: dateFormat(this.getTomorrowDay(this.value2)),
          hotelId: hotelItem.id
        }
      });
      setTimeout(() => {
        window.open('/#/HotelDetail')
      }, 100)
    },
    getTomorrowDay (day) {
      let date = new Date(day)
      return new Date(date.getTime() + 24 * 60 * 60 * 1000);
    },
    formatImg (src) {
      if (src) {
        return require('@/assets/logo/' + src + '.png')
      }
    },
    passengerCount (index) {
      let count = index + 1
      return count
    },
    fomatImg (src) {
      if (!src) {
        return require('@/assets/default_hotel.jpg')
      }
      return "https://hotelpic-1254071088.file.myqcloud.com/hotel_pic/" + src + ".jpeg"
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    removeuserItem (item) {
      this.$confirm('此操作将删除乘客信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.Passengers.passengersItem.length == 2) {
          this.$message('至少要购买一张飞机票')
        } else {
          removeStore({
            name: 'passengerQuery'
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
        if (this.Passengers.passengersItem.length > 2) {
          var index = this.Passengers.passengersItem.indexOf(item)
          if (index !== -1) {
            this.Passengers.passengersItem.splice(index, 1)
          }
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    adduserItem () {
      if (this.Passengers.passengersItem.length < 10) {
        this.Passengers.passengersItem.push({
          gender: this.countOrderGender(),
          orderInsuranceRequests: [],
          cellphone: '',
          passengerBirthday: '',
          passengerIDCardNo: this.cardNum,
          passengerIDCardType: "ID",
          passengerName: '',
          passengerType: "ADULT"
        });
      } else {
        this.$alert('不能增加了,最多9个人', '提示', {
          confirmButtonText: '确定'
        });
      }
    },
    countOrderGender () {
      let gender
      for (let i = 0; i < this.Passengers.passengersItem.length; i++) {
        // 性别，生日
        let card = this.Passengers.passengersItem[i].passengerIDCardNo.toString()
        if (card.length === 15) {
          // passengerBirthday = `19${card.substring(6, 8)}-${card.substring(8, 10)}-${card.substring(10, 12)}`
          gender = card.slice(14, 15) % 2 === 0 ? 'FEMALE' : 'MALE'
        } else {
          // passengerBirthday = `${card.substring(6, 10)}-${card.substring(10, 12)}-${card.substring(12, 14)}`
          gender = card.substring(17, 18) % 2 === 0 ? 'FEMALE' : 'MALE'
        }
        return gender
      }
    },
    countOrderBirthday (i) {
      console.log(i, 'i')
      let passengerBirthday
      // 性别，生日
      let card = this.Passengers.passengersItem[i].passengerIDCardNo.toString()
      console.log(card)
      if (card.length === 15) {
        passengerBirthday = `19${card.substring(6, 8)}-${card.substring(8, 10)}-${card.substring(10, 12)}`
        console.log(passengerBirthday)
        // gender = card.slice(14, 15) % 2 === 0 ? 'FEMALE' : 'MALE'
      } else {
        passengerBirthday = `${card.substring(6, 10)}-${card.substring(10, 12)}-${card.substring(12, 14)}`
        console.log(passengerBirthday)
        // gender = card.substring(17, 18) % 2 === 0 ? 'FEMALE' : 'MALE'
      }
      return passengerBirthday
    },
    countTotalPrice (count) {
      let totalSalesAmount
      totalSalesAmount = this.flyOrderQuery.seatClass.salesPrice * count
      console.log(totalSalesAmount)
      return totalSalesAmount
    },
    handleOne (item, index) {
      this.orderInsuranceItem1 = {
        flightNo: this.flyOrderQuery.flightNo,
        insuranceInfoId: item.id,
        insuranceName: item.insuranceClass.name,
        insurancePrice: item.insurancePrice,
        insuranceType: item.insuranceType
      }
      // this.Passengers.passengersItem[index].orderInsuranceRequests = [];
      if (this.insRemark1.length > 0) {
        this.Passengers.passengersItem[index + 1].orderInsuranceRequests[0] = this.orderInsuranceItem1
      }
      else {
        this.Passengers.passengersItem[index + 1].orderInsuranceRequests[0] = []
      }
    },
    handleTwo (item, index) {
      this.orderInsuranceItem2 = {
        flightNo: this.flyOrderQuery.flightNo,
        insuranceInfoId: item.id,
        insuranceName: item.insuranceClass.name,
        insurancePrice: item.insurancePrice,
        insuranceType: item.insuranceType
      }
      // this.Passengers.passengersItem[index].orderInsuranceRequests = [];
      this.totalSalesAmount = 0;
      if (this.insRemark2[index].length > 0) {
        this.Passengers.passengersItem[index + 1].orderInsuranceRequests[1] = this.orderInsuranceItem2;

      }
      else {
        this.Passengers.passengersItem[index + 1].orderInsuranceRequests[1] = []
      }
    },
    readyGetModel () {
      getModel().then(res => {
        console.log(res)
        let resData = res.data
        if (resData.code === 0) {
          this.finalAdmin = resData.data.approvalPeople.name
          this.finalAdminId = resData.data.approvalPeople.userId
          this.checkType = resData.data.checkType
          this.adminCheck = resData.data.adminCheck
        }
        if (resData.code === 1) {
          this.noAdmin = 1
          if (resData.msg.length > 0) {
            this.$message({
              message: resData.msg,
              type: 'warning'
            })
          }
        }
        if (resData.code === 3 && this.accountType === 1) {
          this.noAdmin = 1
          this.$message({
            message: '未设置最终审批人,无法因公下单,请联系管理员',
            type: 'warning'
          })
        }
      })
    },
    handleAirOrder () {
      let passengersItem = this.Passengers.passengersItem.slice(0)
      passengersItem.splice(0, 1)
      let bool = true
      let privateOrder = false
      let msg = ''
      for (let i = 0; i < passengersItem.length; i++) {
        let arr = []
        arr.push(passengersItem[i].passengerIDCardNo)
        let nary = arr.sort()
        for (let index = 0; index < nary.length; index++) {
          if (nary[index] == nary[index + 1]) {
            bool = false
            msg = '请填写不同的身份证号'
            this.$refs.passengerIDCardNo[i].focus()
            break
          }
        }
        if (this.userName.length === 0) {
          bool = false
          msg = '请填写联系人员'
          this.$refs.userNameRef.focus()
          break
        }
        if (!validatename(this.userName)) {
          bool = false
          msg = '正确请填写联系人员'
          this.$refs.userNameRef.focus()
          break
        }
        if (this.cellphone.length === 0 || this.cellphone.length != 11 || this.cellphone.slice(0, 1) != 1) {
          bool = false
          msg = '请确保联系电话正确'
          this.$refs.telPhone.focus()
          break
        }
        if (passengersItem[i].passengerName.length === 0) {
          validatename
          bool = false
          msg = '请填写乘客姓名'
          this.$refs.passengerName[i].focus()
          break
        }
        if (!validatename(passengersItem[i].passengerName)) {
          validatename
          bool = false
          msg = '请填写正确乘客姓名'
          this.$refs.passengerName[i].focus()
          break
        }
        if ((cardid(passengersItem[i].passengerIDCardNo)[0])) {

          cardid
          bool = false
          msg = cardid(passengersItem[i].passengerIDCardNo)[1]
          this.$refs.passengerIDCardNo[i].focus()
          break
        }
        // if (arr) {
        //   bool = false
        //   msg = '请填写不同的身份证号'
        //   this.$refs.passengerIDCardNo[i].focus()
        //   break
        // }
        if (passengersItem[i].cellphone.length === 0 || passengersItem[i].cellphone.length != 11 || passengersItem[i].cellphone.slice(0, 1) != 1) {
          msg = '请填写正确手机号'
          this.$refs.cellphone[i].focus()
          bool = false
          break
        }
        if (this.titleInput.length == 0 && this.travelType == 0 && this.accountType == 1) {
          msg = '请填写申请单'
          bool = false
          this.addApprovalDialogVisible = true
          this.$refs.title.focus()
          bool = false
          break
        }
        if (this.reasonArea.length == 0 && this.travelType == 0 && this.accountType == 1) {
          msg = '请填写理由'
          this.addApprovalDialogVisible = true
          if (this.addApprovalDialogVisible) {
            this.$refs.title.focus()
          }
          bool = false
          break
        }
        if (this.childUserName.length == 0 && !this.reasonArea.length == 0
          && !this.titleInput.length == 0 && this.travelType == 0
          && this.formNo.length == 0 && this.accountType == 1) {
          this.addApprovalDialogVisible = true
          msg = '请选择出差申请人'
          bool = false
          break
        }
        if (this.LocalUserName.length == 0 && this.travelType == 0 && this.accountType == 1) {
          this.roomApplyDialogVisible = true
          msg = '请选择机票申请人'
          bool = false
          break
        }
        if (this.travelType == 1) {
          bool = false
          privateOrder = true
          break
        }
      }
      if (privateOrder) {
        for (let index = 0; index < passengersItem.length; index++) {
          passengersItem[index].passengerBirthday = this.countOrderBirthday(index + 1)
        }
        for (let index = 0; index < passengersItem.length; index++) {
          this.totalSalesAmount = this.countTotalPrice(passengersItem.length)
        }

        doAirOrder({
          arrivalAirportCode: this.flyOrderQuery.arrivalAirportCode,
          carrierCode: this.flyOrderQuery.carrierCode,
          cellphone: this.cellphone,
          departureAirportCode: this.flyOrderQuery.departureAirportCode,
          flightTripType: this.flyOrderQuery.flightTripType,
          departureTime: this.formatLabel(
            this.flyOrderQuery.departureDate, 0, 20
          ),
          arrivalTime: this.formatLabel(this.flyOrderQuery.arrivalTime, 0, 20),
          flightNo: this.flyOrderQuery.flightNo,
          mealType: this.flyOrderQuery.itemIndex.mealType,
          name: this.userName,

          orderPassengers: passengersItem,
          parPrice: this.flyOrderQuery.seatClass.parPrice,
          routeType: "OW",
          saleType: "NORMAL",
          salesPrice: this.flyOrderQuery.seatClass.salesPrice,
          seatClassCode: this.flyOrderQuery.seatClass.seatClassCode,
          totalSalesAmount: parseInt(
            this.totalSalesAmount
          ),
          travelType: this.travelType,
          seatClassDiscount: this.flyOrderQuery.seatClass.discount
        }).then(res => {
          console.log("订单", res.data);
          let num = res.data.data;
          let passengersInfo = this.Passengers.passengersItem[1]
          setStore({
            name: "passengerQuery",
            content: {
              passengersInfo
            }
          })
          console.log(passengersInfo, 'ps')
          if (res.data.code === 1) {
            console.log(res.data.msg);
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'error'
            })
          } else {
            setStore({
              name: "payNumQuery",
              content: {
                salesMainOrderNo: num
              }
            })
            setTimeout(() => {
              this.$router.replace('FlyOrderPay')
            }, 100)
          }
        })
      }
      else if (bool) {
        for (let index = 0; index < passengersItem.length; index++) {
          passengersItem[index].passengerBirthday = this.countOrderBirthday(index + 1)
        }
        for (let index = 0; index < passengersItem.length; index++) {
          this.totalSalesAmount = this.countTotalPrice(passengersItem.length)
        }

        doAirOrder({
          business: {
            checkUser: this.childApprovalId,
            content: this.reasonArea,
            destination: this.cityId,
            formNo: "",
            leaveDate: dateFormat(new Date(this.flyOrderQuery.itemIndex.departureTime), 'yyyy-MM-dd'),
            title: this.titleInput,
            travelUser: this.childUserId
          },
          travel: {
            checkUser: this.LocalApprovalId,
            content: this.reasonArea,
            destination: this.flyOrderQuery.toId,
            formNo: "",
            leaveDate: dateFormat(new Date(this.flyOrderQuery.itemIndex.departureTime), 'yyyy-MM-dd'),
            title: `住宿申请:${this.flyOrderQuery.itemIndex.arrivalAirport.cityName}`,
            travelUser: this.LocalUserId
          },
          arrivalAirportCode: this.flyOrderQuery.arrivalAirportCode,
          carrierCode: this.flyOrderQuery.carrierCode,
          cellphone: this.cellphone,
          departureAirportCode: this.flyOrderQuery.departureAirportCode,
          flightTripType: this.flyOrderQuery.flightTripType,
          departureTime: this.formatLabel(
            this.flyOrderQuery.departureDate, 0, 20
          ),
          arrivalTime: this.formatLabel(this.flyOrderQuery.arrivalTime, 0, 20),
          flightNo: this.flyOrderQuery.flightNo,
          mealType: this.flyOrderQuery.itemIndex.mealType,
          name: this.userName,

          orderPassengers: passengersItem,
          parPrice: this.flyOrderQuery.seatClass.parPrice,
          routeType: "OW",
          saleType: "NORMAL",
          salesPrice: this.flyOrderQuery.seatClass.salesPrice,
          seatClassCode: this.flyOrderQuery.seatClass.seatClassCode,
          totalSalesAmount: parseInt(
            this.totalSalesAmount
          ),
          travelType: this.travelType,
          seatClassDiscount: this.flyOrderQuery.seatClass.discount
        }).then(res => {
          console.log("订单", res.data);
          let num = res.data.data;
          let passengersInfo = this.Passengers.passengersItem[1]
          setStore({
            name: "passengerQuery",
            content: {
              passengersInfo
            }
          });
          console.log(passengersInfo, 'ps')
          if (res.data.code === 1) {
            console.log(res.data.msg);
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'error'
            });
          } else {
            setStore({
              name: "payNumQuery",
              content: {
                salesMainOrderNo: num
              }
            });
            setTimeout(() => {
              this.$router.replace('FlyOrderPay')
            }, 100);
          }
        });
      } else {
        this.$message.error(msg)
      }
    },
    changeIcon () {
      setStore({
        name: "insuranceQuery",
        content: {
          insurance: this.insuranceInfoArr
        }
      });
      setTimeout(() => {
        window.open("/#/InsuranceDetail");
      }, 100);
    },
    formatLabel (val, start, end) {
      if (!val) return;
      return val.slice(start, end);
    },
    handleCard (value) {
      switch (value) {
        case 1:
          this.passengerIDCardType = "ID";
          break;
        case 2:
          this.passengerIDCardType = "ID";
          break;
        case 3:
          this.passengerIDCardType = "ID";
          break;
        default:
          this.passengerIDCardType = "ID";
          break;
      }
      console.log(this.passengerIDCardType);
    },
    handleInsurance () {
      this.isShowAddInsurance = !this.isShowAddInsurance;
    },
    ...mapMutations(["setState"]),
    // changeValue3 (value) {
    //   this.params.departureDate = dateFormat(this.value1, "yyyy-MM-dd");
    //   this.params.arrivalTime = dateFormat(value, "yyyy-MM-dd");
    // }
  }
};
</script>

<style lang="less" scoped>
.bg {
  background-color: #f3f6fb;
  overflow: hidden;
}
.orderWrapper {
  width: 1180px;
  margin: 0px auto;
  border: 0.5px solid #d0d9e0;
  padding-top: 30px;
  border-radius: 4px;
  position: relative;
  .order-header {
    width: 920px;
    height: 80px;
    background: rgba(255, 255, 255, 1);
    border: NaNpx solid rgba(214, 221, 232, 1);
    border-radius: 3px;
    float: left;
    line-height: 80px;
    .head-content {
      margin: 0 auto;
      width: 600px;
      text-align: center;
      .icon-left {
        width: 20px;
        height: 20px;
        border-radius: 3px;
        font-size: 22px;
        color: #2e8cff;
      }
      .item-left {
        // width:99px;
        // height:17px;
        font-size: 16px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(34, 135, 255, 1);
        line-height: 22px;
      }
      .icon-center {
        color: rgba(226, 232, 242, 1);
        font-size: 10px;
        padding: 0 10px;
      }
      .item-right {
        // width:99px;
        // height:17px;
        font-size: 16px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(34, 135, 255, 1);
        line-height: 22px;
      }
      .icon-right {
        font-size: 20px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(34, 135, 255, 1);
        line-height: 22px;
      }
    }
  }
  .order-user {
    margin-top: 284px;
    width: 920px;
    // height: 200px;s
    background: #fff;
    .approval-wrapper {
      border-top: 0.5px solid #e2e8f2;
      width: 700px;
      margin: 0 auto;
      .flex-wrapper {
        padding-bottom: 100px;
        display: flex;
        justify-content: space-between;
        width: 700px;
      }
      .user-title {
        font-size: 21px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: rgba(62, 78, 98, 1);
        text-align: center;
        padding: 55px 0 30px;
      }
      .order_bottom_type {
        width: 189px;
        line-height: 47px;
        text-align: center;
        .checker-lable {
          font-size: 15px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: #3e4e62;
        }
        .bottom-appprovaler {
          .el-icon-close {
            color: red;
          }
        }
        .el-icon-circle-plus {
          font-size: 15px;
          color: #2186ff;
          padding-left: 5px;
        }
      }
      .order_end {
        float: left;
        width: 189px;
        height: 47px;
        position: relative;
        text-align: center;
        line-height: 47px;
        i {
          font-size: 15px;
          color: #2186ff;
        }
        .user-lable {
          font-size: 15px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: #3e4e62;
        }
        .bottom-appprovaler {
          padding: 0 5px 0 0;
          i :hover {
            cursor: pointer;
          }
          i {
            color: red;
            font-size: 8px;
          }
        }
      }
      .order_bottom {
        float: left;
        width: 189px;
        height: 47px;
        line-height: 47px;
        position: relative;
        text-align: center;
        .titleInput {
          font-size: 15px;
        }
        .el-icon-circle-plus {
          font-size: 15px;
          color: #2186ff;
        }
        .order_name {
          z-index: 2;
          position: absolute;
          top: 50%;
          left: 5%;
          margin-top: -11px;
          width: 60px;
          font-size: 15px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(62, 78, 98, 1);
          line-height: 22px;
        }
        /deep/.input-user {
          border: 0.5px solid #e0e6f1;
          border-radius: 3px;
          width: 200px;
          height: 47px;
          background: #f9fbff;
          .el-input__inner {
            background: #f9fbff;
            width: 200px;
            height: 47px;
            padding-left: 78px;
            padding-right: 12px;
            font-size: 16px;
          }
        }
      }
    }
    .price-wrapper {
      border-top: 0.5px solid #e2e8f2;
      .order_price {
        padding: 55px 0 10px;
        text-align: center;
        font-size: 21px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: rgba(62, 78, 98, 1);
      }
      .order_bottom_price {
        text-align: center;
        width: 100px;
        height: 50px;
        margin: 0 auto;
      }
      .btn-wrapper {
        margin: 0 auto;
        width: 780px;
        height: 58px;
        padding-bottom: 70px;
        padding-top: 65px;
        .el-button {
          width: 780px;
          height: 58px;
        }
      }
      .order_bottom_price {
        .order-money {
          font-size: 30px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(34, 134, 255, 1);
        }
      }
    }
    .order-finder {
      width: 700px;
      margin: 0 auto;
      .flex-wrapper {
        padding-bottom: 100px;
        display: flex;
        justify-content: space-between;
        width: 700px;
      }
      .user-title {
        font-size: 21px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: rgba(62, 78, 98, 1);
        text-align: center;
        padding: 55px 0 30px;
      }
      .order_bottom_type {
        line-height: 47px;
        width: 189px;
        i {
          font-size: 30px;
        }
      }
      .order_end {
        float: left;
        width: 189px;
        height: 47px;
        position: relative;
        // left: 50%;
        .order_tel {
          z-index: 2;
          position: absolute;
          top: 50%;
          left: 5%;
          margin-top: -11px;
          font-size: 15px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(62, 78, 98, 1);
          line-height: 22px;
        }
        /deep/.input-user {
          border: 0.5px solid #e0e6f1;
          border-radius: 3px;
          width: 200px;
          height: 47px;
          background: #f9fbff;
          .el-input__inner {
            background: #f9fbff;
            width: 200px;
            height: 47px;
            padding-left: 78px;
            padding-right: 12px;
            font-size: 16px;
          }
        }
      }
      .order_bottom {
        float: left;
        width: 189px;
        height: 47px;
        position: relative;
        .order_name {
          z-index: 2;
          position: absolute;
          top: 50%;
          left: 5%;
          margin-top: -11px;
          width: 60px;
          font-size: 15px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(62, 78, 98, 1);
          line-height: 22px;
        }
        /deep/.input-user {
          border: 0.5px solid #e0e6f1;
          border-radius: 3px;
          width: 200px;
          height: 47px;
          background: #f9fbff;
          .el-input__inner {
            background: #f9fbff;
            width: 200px;
            height: 47px;
            padding-left: 78px;
            padding-right: 12px;
            font-size: 16px;
          }
        }
      }
    }
    .order_user_head {
      font-size: 21px;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: rgba(62, 78, 98, 1);
      line-height: 27px;
      text-align: center;
      padding: 55px 0;
    }
    /deep/.el-btn-item {
      width: 192px;
      margin: 0 auto;
      .el-form-item__content {
        margin-left: 0px !important;
        .add-btn {
          width: 192px;
          height: 42px;
          background: linear-gradient(
            -90deg,
            rgba(86, 161, 255, 1),
            rgba(27, 130, 255, 1)
          );
          border-radius: 4px;
          span {
            font-size: 16px;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
          }
        }
      }
    }
    /deep/.el-form-item {
      position: relative;
      padding: 50px 0;
      .el-form-item__label {
        font-size: 19px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: rgba(62, 78, 98, 1);
        line-height: 27px;
        position: absolute;
        left: 60px;
        top: -20px;
      }
      .order-item {
        margin-right: 10px;
      }
      .remove-btn {
        margin-top: 4px;
        width: 70px;
        height: 42px;
        background: linear-gradient(
          -90deg,
          rgba(86, 161, 255, 1),
          rgba(27, 130, 255, 1)
        );
        border-radius: 4px;
        text-align: center;
        font-size: 16px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
      }
      .order_right {
        width: 200px;
        height: 47px;
        background: rgba(249, 251, 255, 1);
        border: 0px solid rgba(224, 230, 241, 1);
        border-radius: 3px;
        position: relative;
        float: left;
        .order_item_phone {
          font-size: 15px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(62, 78, 98, 1);
          line-height: 22px;
          position: absolute;
          top: 50%;
          margin-top: -11px;
          left: 10px;
          z-index: 2;
        }
        .el-input {
          border: 0.5px solid #e0e6f1;
          border-radius: 3px;
          width: 200px;
          height: 47px;
          .el-input__inner {
            background: #f9fbff;
            width: 200px;
            height: 47px;
            padding-left: 78px;
            padding-right: 12px;
            font-size: 16px;
          }
        }
      }
      .order_center {
        width: 305px;
        height: 47px;
        background: rgba(249, 251, 255, 1);
        border: 0px solid rgba(224, 230, 241, 1);
        border-radius: 3px;
        position: relative;
        float: left;
        .order_item_card {
          font-size: 15px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(62, 78, 98, 1);
          line-height: 22px;
          position: absolute;
          top: 50%;
          margin-top: -11px;
          left: 10px;
          z-index: 2;
          position: absolute;
        }
        .el-input {
          border: 0.5px solid #e0e6f1;
          border-radius: 3px;
          width: 305px;
          height: 47px;
          .el-input__inner {
            background: #f9fbff;
            width: 305px;
            height: 47px;
            padding-left: 78px;
            padding-right: 12px;
            font-size: 16px;
          }
        }
      }
      .order_left {
        width: 189px;
        height: 47px;
        position: relative;
        float: left;
        .order_item_name {
          font-size: 15px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(62, 78, 98, 1);
          line-height: 22px;
          position: absolute;
          top: 50%;
          margin-top: -11px;
          left: 10px;
          z-index: 2;
        }
        .el-input {
          border: 0.5px solid #e0e6f1;
          border-radius: 3px;
          width: 189px;
          height: 47px;
          .el-input__inner {
            background: #f9fbff;
            width: 189px;
            height: 47px;
            padding-left: 45px;
            padding-right: 12px;
            font-size: 15px;
          }
        }
      }
    }
  }
  .order-plane {
    margin-top: 30px;
    width: 920px;
    float: left;
    .bottom-station {
      height: 50px;
      width: 480px;
      display: flex;
      justify-content: space-between;
      margin: 20px auto 0;
      .station {
        font-size: 15px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(117, 136, 167, 1);
        line-height: 22px;
      }
    }
    .center-time {
      margin: 25px auto 0;
      text-align: center;
      height: 30px;
      width: 480px;
      line-height: 32px;
      position: relative;
      display: flex;
      justify-content: space-between;
      .time-all {
        font-size: 30px;
        font-family: Bahnschrift-Regular;
        font-weight: 400;
        color: rgba(62, 78, 98, 1);
        line-height: 26px;
      }
      .left-line {
        position: absolute;
        top: 50%;
        left: 28.3%;
        display: inline-block;
        width: 70px;
        border-bottom: 0.5px solid #b2bbcd;
      }
      .center-circle {
        display: inline-block;
        width: 70px;
        height: 24px;
        border: 0.5px solid rgba(178, 187, 205, 1);
        border-radius: 11px;
        text-align: center;
        line-height: 24px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -12px;
        margin-left: -35px;
      }
      .right-line {
        position: absolute;
        top: 50%;
        left: 57.4%;
        display: inline-block;
        width: 71px;
        border-bottom: 0.5px solid #b2bbcd;
      }
    }
    .plane-right {
      float: right;
      width: 619.5px;
      height: 173px;
      margin-top: -173.5px;
      background: #fff;
      .plane-right-head {
        width: 400px;
        margin: 0 auto;
        text-align: center;
        margin-top: 20px;
        .head-time {
          font-size: 19px;
          font-family: PingFang-SC-Heavy;
          font-weight: 800;
          color: rgba(62, 78, 98, 1);
        }
        .column-line {
          border-left: 0.5px solid #b2bbcd;
          margin-left: 29px;
          margin-right: 30px;
        }
        .head-city {
          font-size: 18px;
          font-family: PingFang-SC-Heavy;
          font-weight: 800;
          color: rgba(62, 78, 98, 1);
          line-height: 22px;
          .fly {
            color: #2186ff;
            padding: 0 5px;
          }
        }
      }
    }
    .plane-wrapper {
      width: 300px;
      height: 173px;
      position: relative;
      // top: -20px;
      background: #fff;
      .plane-content {
        position: absolute;
        left: 50%;
        top: 60%;
        margin-left: -125px;
        margin-top: -65px;
        width: 250px;
        height: 130px;
        .plane-top {
          height: 70px;
          width: 250px;
          margin: 0 auto;
          .plane-img {
            width: 50px;
            height: 50px;
            margin-top: 5px;
          }
          .carrierName {
            font-size: 18px;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            color: rgba(62, 78, 98, 1);
          }
          .airplaneType {
            display: inline-block;
            width: 60px !important;
            height: 23px;
            background: #d1e2f5;
            border: solid rgba(209, 226, 245, 1);
            border-radius: 2px;
            width: 59px;
            font-size: 15px;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            color: rgba(31, 132, 255, 1);
          }
          .airplaneName {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 75px;
            height: 30px;
            font-size: 15px;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            color: rgba(117, 136, 167, 1);
            line-height: 44px;
            // margin-left: 10px;
            // margin-top: 5px;
            position: absolute;
            bottom: 14px;
            left: 74px;
            display: inline-block;
            cursor: pointer;
          }
          .airplaneName:hover {
            width: 160px;
          }
        }
        .plane-tip {
          width: 210px;
          display: flex;
          justify-content: space-between;
          margin: 8px auto 0;
          .tip-item {
            font-size: 15px;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            color: rgba(37, 135, 255, 1);
          }
        }
      }
    }
  }
  .hotel-wrapper {
    position: absolute;
    top: 22px;
    right: 9px;
    width: 240px;
    padding-left: 20px;
    // border: 0.5px red solid;
    float: right;
    .hot-head {
      font-size: 25px;
      height: 40px;
      .hot-icon {
        color: #fb5217;
        font-size: 25px;
      }
    }
    .hotel-item {
      margin-top: 25px;
      display: block;
      width: 100%;
      height: 200px;
      //  background: green;
      position: relative;
      cursor: pointer;
      &:hover {
        transform: scale(1.05);
      }
      .img-wrapper {
        width: 100%;
        height: 140px;
        overflow: hidden;
        .hotel-img {
          position: absolute;
          left: 50%;
          margin-left: -120px;
          // width: 240px;
          // height: 140px;
          background-size: contain;
          border-radius: 5px;
          transition: transform 0.3s ease 0s;
          width: 100%;
          height: 80%;
        }
      }
      .hotel-level {
        max-width: 200px;
        height: 28px;
        background: linear-gradient(#55a2ff, #2186ff);
        position: absolute;
        left: 0;
        top: 0;
        padding: 0 5px;
        font-size: 16px;
        color: #fff;
        text-align: center;
        border-radius: 6px;
      }
      .hotel-name {
        height: 20px;
        padding-top: 30px;
        text-align: start;
      }
      .bottom-item {
        margin-top: 0px;
        display: flex;
        justify-content: space-between;
        .bottom-left {
          margin-top: 7px;
          width: 74px;
          height: 23px;
          background: rgba(234, 250, 242, 1);
          border: NaNpx solid rgba(200, 241, 209, 1);
          border-radius: 2px;
          text-align: center;
          border-radius: 2px;
          color: #2ba245;
          font-size: 15px;
        }
        .bottom-right {
          width: 50%;
          text-align: start;
          color: #2286ff;
          font-size: 22p;
        }
      }
    }
  }
}
// .classB::-webkit-scrollbar {
//   display: none;
// }
// .myWebket-box-flex-1 {
//   // overflow:-moz-scrollbars-none;
//   padding-left: 30px;
//   border: none;
//   width: 559px;
//   float: left;
//   & > .order_left_height {
//     .order_item_key_color {
//       width: 56px;
//     }
//   }
//   .el-checkbox-group {
//     display: inline-block;
//   }
// }
// .order_left_title_font {
//   color: #b4b4b4;
//   font-size: 21px;
// }
// .order_left_box {
//   border-right: solid 0.5px #d0d9e0;
//   // border-bottom: solid 1px #d0d9e0;
// }
// .order_left_height {
//   line-height: 50px;
//   .order-required {
//     color: #f40;
//     padding-left: 15px;
//   }
//   .el-select {
//     width: 350px;
//     height: 40px;
//   }
// }
// .order_item_key_color {
//   width: 52px;
//   color: #6a7689;
//   display: inline-block;
// }
// .order_item_line {
//   display: inline-block;
//   margin: 0px 14px;
//   background-color: #d0d9e0;
//   width: 1px;
//   height: 14px;
//   vertical-align: middle;
// }
// .showMe{
//   display: none;
// }
// .Insurance {
//   .iconfont {
//     color: #409eff;
//     font-size: 13px;
//     cursor:pointer;
//   }
// }
// .data-picker-box {
//   display: inline-block;
//   position: relative;
//   .el-date-editor.el-input {
//     width: 175px;
//   }
//   .el-input__inner {
//     height: 42px;
//   }
// }
// .tenzont-date-text {
//   position: absolute;
//   width: 30px;
//   z-index: 1;
//   transform: translateX(-30px);
// }
// .order_item_night {
//   position: absolute;
//   border-top: 0.5px solid #d0d9e0;
//   border-left: 0.5px solid #d0d9e0;
//   border-right: 0.5px solid #d0d9e0;
//   width: 162px;
//   height: 13px;
//   left: 89px;
//   top: -12px;
// }
// .night-text {
//   background-color: #fff;
//   position: absolute;
//   top: -15px;
//   line-height: 30px;
//   left: 40px;
// }
// .input-user {
//   width: 350px;
// }
// .input-name {
//   width: 157px;
// }
// .order_button {
//   clear: both;
//   display: block;
//   margin-left: 520px;
//   margin-top: 15px;
//   margin-bottom: 15px;
// }
// .order-money {
//   color: #59a1ea;
//   font-size: xx-large;
//   span {
//     font-size: 16px;
//   }
// }
// .userItem-input {
//   width: 300px;
// }
</style>
<style lang="less">
@import './style.less';
</style>
