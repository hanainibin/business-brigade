<template>
  <div class="bg" element-loading-text="正在读取房间价格，请稍候。">
    <div class="detailContent">
      <el-dialog
        :visible.sync="roomApplyDialogVisible"
        custom-class="add-room-user"
      >
        <choose-user :userInfo= "userInfo" @childRoomAdd= 'childRoomAdd'></choose-user>
      </el-dialog>
      <el-dialog
        :visible.sync="roomCheckDialogVisible"
        custom-class="add-room-check"
      >
        <choose-user :userInfo= "userInfo" @childRoomCheck= 'childRoomCheck'></choose-user>
      </el-dialog>
      <el-dialog title="出差申请"
                 :visible.sync="addApprovalDialogVisible"
                 custom-class="add-approval-dialog">
        <el-dialog title="添加申请人"
                   :visible.sync="addUserDialogVisible"
                   append-to-body
                   custom-class="add-user-dialog">
          <choose-user :userInfo= "userInfo" @childByValue= 'childByValue'></choose-user>
        </el-dialog>
        <el-dialog title="添加审批人"
                   :visible.sync="addCheckerDialogVisible"
                   append-to-body
                   custom-class="add-user-dialog">
          <choose-user :userInfo= "userInfo" @approvalValue= 'approvalValue'></choose-user>
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
      <div class="myWebket-box-flex-1">
        <div class="order_left_title_font">预订详情</div>
        <div class="order_left_box">
          <div class="order_left_height">
            <div class="order_item_key_color">预订酒店</div>
            <div class="order_item_line"/>
            {{OrderDetails.hotelName}}
          </div>
          <div class="order_left_height">
            <div class="order_item_key_color">预订房型</div>
            <div class="order_item_line"/>
            {{OrderDetails.roomTypeDesc}}
          </div>
          <div class="order_left_height">
            <div class="order_item_key_color">早餐情况</div>
            <div class="order_item_line"/>
            {{breakfastList[OrderDetails.breakfast]}}
          </div>
          <div class="order_left_height">
            <div class="order_item_key_color">入住时间</div>
            <div class="order_item_line">
              <div class="tenzont-col-date"/>
            </div>
            <div class="data-picker-box">
              <el-date-picker
                v-model="value1"
                align="right"
                type="date"
                :clearable="false"
                v-on:change="changeValue1"
                :picker-options="pickerOptions1"
                :editable="false"/>
              <span class="tenzont-date-text">入</span>
              <div class="order_item_night">
                <span class="night-text">共{{night}}晚</span>
              </div>
              <el-date-picker
                v-model="value2"
                align="right"
                type="date"
                :clearable="false"
                v-on:change="changeValue2"
                :picker-options="pickerOptions2"
                :editable="false"/>
              <span class="tenzont-date-text">离</span>
            </div>
          </div>
          <div class="order_left_height">
            <div class="order_item_key_color">房间数量</div>
            <div class="order_item_line"/>
            <el-select v-on:change="roomCountChange" @change="handleUserCount" v-model="roomCount" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </div>
          <div class="order_left_height">
            <div class="order_item_key_color">联系人员</div>
            <div class="order_item_line"/>
            <el-input class="input-user" v-model="userName" placeholder="联系人" ref="userNameRef" maxlength="20"
                      onkeyup="this.value=this.value.trim()"/>
            <span class="order-required">*</span>
          </div>
          <div class="order_left_height">
            <div class="order_item_key_color">联系电话</div>
            <div class="order_item_line"/>
            <el-input class="input-user" v-model="telphone" placeholder="联系电话" maxlength="11" ref="telPhone"
                      onkeyup="this.value=this.value.trim()"/>
            <span class="order-required">*</span>
          </div>
          <div class="order_left_height">
            <div class="order_item_key_color">共计金额</div>
            <div class="order_item_line"/>
            <span class="order-money" v-if="price > 0" v-loading="loading">
              <span>¥</span>{{(price / 100).toFixed(2)}}
            </span>
            <span class="order-money" v-else v-loading="loading">无房</span>
          </div>
        </div>
      </div>
      <div class="myWebket-box-flex-1">
        <div class="order_left_title_font">入住信息</div>
        <div class="order_left_height" v-for="i in roomCount" :key="i">
          <div class="order_item_key_color">住客{{i}}</div>
          <div class="order_item_line"/>
          <el-input class="input-name" v-model="nameList[i - 1]" placeholder="输入名字" ref="nameList"
                    maxlength="20" onkeyup="this.value=this.value.trim()"/>
          <span class="order-required">*</span>
        </div>
        <div class="order_left_height">
          <div class="order_item_key_color">出行类型</div>
          <div class="order_item_line"/>
          <el-radio v-model="travelType" :label="0" :disabled="noAdmin === 1">因公</el-radio>
          <el-radio v-model="travelType" :label="1" :disabled="accountType === 0">因私</el-radio>
        </div>
        <div class="approval-wrapper" v-if="travelType == 0 && accountType == 1">
          <div class="order_left_height">
            <div class="order_item_key_color" style="padding-right: 4px">出差申请</div>
            <div class="order_item_line"/>
            <el-select class="small-select" v-model="apSlectValue" size="small" placeholder="请选择" v-if='tripFormData.length!==0'>
              <el-option
                v-for="(item,index) in approvalOptions"
                @change="chooseOrder(index,item.formNo)"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span v-show="tripFormData.length===0">{{titleInput}}</span>
            <i class="iconfont form-add" @click="addApproval">&#xe657;</i>
          </div>
          <div class="order_left_height">
            <div class="order_item_key_color" style="padding-right: 16px">出差人</div>
            <div class="order_item_line"/>
            <span class="bottom-appprovaler" v-for="(item,index) in LocalUserName" :key="item.index">{{item}}
              <i class="el-icon-close" @click="delOutUser(index)"></i>
            </span>
            <i class="el-icon-circle-plus" @click="addRoomUser"></i>
            <!-- <i class="el-icon-delete" ></i> -->
            <!-- <choose-user :userInfo= "userInfo" @childRoomApply= 'childRoomApply'></choose-user> -->
          </div>
          <div class="order_left_height">
            <div class="order_item_key_color" style="padding-right: 16px">审批人</div>
            <div class="order_item_line"/>
            <span class="bottom-appprovaler" v-for="(item,index) in LocalApprovalName" :key="item.index">{{item}}
              <i class="el-icon-close" @click="delOutChecker(index)"></i>
            </span>
            <i class="el-icon-circle-plus" @click="addRoomChecker"></i>
            <!-- <i class="el-icon-delete"></i> -->
            <span class="out-finalAdmin">{{finalAdmin}}</span>
          </div>
        </div>
        <div class="order_left_height">
          <!-- <div class="order_item_key_color">特殊要求</div>
          <div class="order_item_line"/>
          <el-checkbox-group v-model="remarksArr">
            <el-checkbox label="尽量无烟"/>
            <el-checkbox label="尽量安静"/>
            <el-checkbox label="尽量高层"/>
          </el-checkbox-group> -->
          <div style="margin-top: 20px;">
            <h2>温馨提示</h2>
            <ol style="color: #FFAD59;">
              <li>1.该店14:00办理入住，早到可能需要等待</li>
              <li>2.预订成功后，不可取消/变更</li>
              <li>3.离店6个月内可在发票管理页开具发票</li>
            </ol>
          </div>
        </div>
      </div>
      <div style="clear: both; overflow: hidden">
        <el-button type="primary" @click="next " class="order_button" :disabled="isDisabled">下一步，去支付</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { price } from '@/api/roomType'
import { getModel, queryTripForm } from '@/api/approval'
import { dateFormat } from '@/util/lobal'
import { doorder } from '@/api/order'
import { breakfastList } from '@/views/data'
import { getStore, setStore, removeStore } from '@/util/store'
import { isPhoneAvailable } from '@/util/validate.js'
import { increaseMonth } from '@/util/util.js'
import OrderSelectCity from '@/components/OrderSelectCity.vue'
// deleteProp
import ChooseUser from '@/components/ChooseUser.vue'

export default {
  name: 'OrderDetails',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  components: {
    ChooseUser,
    OrderSelectCity
  },
  data () {
    return {
      childUserName: [],
      childApprovalId: [],
      childUserId: [],
      childApprovalName: [],
      childAllApprovalName: [],
      tripFormData: [],
      orderNo: '',
      userTrip: [],
      reasonArea: '出差申请单',
      chineseCityName: '',
      LocalApprovalName: [],
      LocalUserId: [],
      LocalApprovalId: [],
      LocalUserName: [],
      localContent: {},
      addApprovalDialogVisible: false,
      addCheckerDialogVisible: false,
      addUserDialogVisible: false,
      roomApplyDialogVisible: false,
      roomCheckDialogVisible: false,
      breakfastList: breakfastList,
      approvalBool: true,
      noAdmin: 0,
      cankaoDate: Date.now() + this.timeOffset,
      today: new Date(Date.now()),
      pickerOptions1: {
        disabledDate: time => {
          return time.getTime() < this.cankaoDate - 8.64e7 || time.getTime() > increaseMonth(this.today, 2) + this.timeOffset
        }
      },
      pickerOptions2: {
        disabledDate: time => {
          return time.getTime() <= this.value1 || time.getTime() > increaseMonth(this.today, 2) + this.timeOffset + 8.64e7
        }
      },
      value1: new Date(this.OrderDetails.startDate.replace(/-/g, '/')),
      value2: new Date(this.OrderDetails.endDate.replace(/-/g, '/')),
      approvalOptions: [
        {
          value: '1',
          label: '无数据'
        }
      ],
      apSlectValue: '',
      options: [
        {
          label: '1间',
          value: 1
        },
        {
          label: '2间',
          value: 2
        },
        {
          label: '3间',
          value: 3
        },
        {
          label: '4间',
          value: 4
        },
        {
          label: '5间',
          value: 5
        }
      ],
      roomCount: 1,
      userName: '',
      telphone: '',
      nameList: ['', '', '', '', ''],
      price: '0.00',
      travelType: 1,
      remarksArr: [],
      loading: true,
      check: 0,
      formNo: '',
      cityId: this.OrderDetails.cityId,
      doorder: {
        breakfast: this.OrderDetails.breakfast,
        channelSubRoomTypeId: this.OrderDetails.channelSubRoomTypeId,
        cityId: this.OrderDetails.cityId,
        hotelId: this.OrderDetails.hotelId,
        hotelName: this.OrderDetails.hotelName,
        roomTypeDesc: this.OrderDetails.roomTypeDesc,
        suboomTypeDesc: this.OrderDetails.suboomTypeDesc,
        bed: this.OrderDetails.bed,
        cancelPolicyDesc: this.OrderDetails.cancelPolicyDesc
      },
      night: 0,
      isDisabled: false,
      finalAdmin: '',
      titleInput: '出差申请单:'
    }
  },
  computed: {
    ...mapGetters(['nickName', 'accountId', 'accountType', 'timeOffset'])
  },
  watch: {
    nickName (value) {
      this.userName = value
    },
    timeOffset (value) {
      this.cankaoDate = Date.now() + value
    },

    accountType (value) {
      console.log('accout', value)
      this.params = {
        checkInDate: this.OrderDetails.startDate,
        checkOutDate: this.OrderDetails.endDate,
        cityId: this.OrderDetails.cityId,
        hotelId: this.OrderDetails.hotelId,
        roomCount: 1,
        subId: this.OrderDetails.channelSubRoomTypeId,
        accountId: this.accountId,
        accountType: this.accountType
      }
      this.childUserName.push(this.nickName)
      this.LocalUserName.push(this.nickName)
      this.childUserId.push(this.accountId)
      this.LocalUserId.push(this.accountId)
      this.getPrice()
      if (value > 0) {
        this.travelType = 1
      }
      else {
        this.travelType = 0
      }
      this.readyGetModel()
    },
    approvalOptions (value) {
      this.apSlectValue = value[0].label
    }
  },
  beforeCreate () {
    this.OrderDetails = getStore({
      name: 'OrderDetails'
    }),
      this.CityAllList = getStore({
        name: 'cityList1'
      }),
      this.cityList = this.CityAllList.list.citys
  },
  created () {
    window.globelEvent.$on('destinationId', cityId => {
      this.cityId = cityId;
    });
    window.globelEvent.$on('destinationName', name => {
      this.chineseCityName = name
      this.titleInput = '出差申请:' + name
      this.reasonArea = '出差:' + name
    });
    this.userName = this.nickName
    this.telphone = this.userInfo.phone
    this.night = (this.value2 - this.value1) / (24 * 60 * 60 * 1000)
    this.apSlectValue = this.approvalOptions[0].label
    if (this.userInfo.status) {
      console.log(this.accountType)
      if (this.accountType >= 0) {
        console.log(1)
        this.params = {
          checkInDate: this.OrderDetails.startDate,
          checkOutDate: this.OrderDetails.endDate,
          cityId: this.OrderDetails.cityId,
          hotelId: this.OrderDetails.hotelId,
          roomCount: 1,
          subId: this.OrderDetails.channelSubRoomTypeId,
          accountId: this.accountId,
          accountType: this.accountType
        }
        console.log(2, this.params)
        this.getPrice()
        if (this.accountType > 0) {
          this.travelType = 1
        } else {
          this.travelType = 0
        }
        this.readyGetModel()
      }
    } else {
      this.setState({
        key: 'dialogLoginVisible',
        value: true,
        module: 'user'
      })
    }
  },
  mounted () {
    this.forCityList()
    this.readygetTripForm()
  },
  methods: {
    ...mapMutations(['setState']),
    readygetTripForm () {
      queryTripForm().then(res => {
        let resData = res.data.data
        if (res.data.code == 0) {
          this.tripFormData = resData
          if (resData.length > 0) {
            let resOptionsData = res.data.data
            this.formNo = resData[0].formNo
            resOptionsData.forEach(element => {
              element.label = element.title + '-' + element.formNo
              element.value = element.formNo
              this.check = element.value
              delete element.title
              delete element.id
            });
            this.approvalOptions = resOptionsData
            this.apSlectValue = this.approvalOptions[0].value
          }
        }
        else if (res.data.code == 1) {
          this.$message({
            type: 'error',
            message: '服务器错误:' + res.data.msg
          })
        }
      })
    },
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
          name: 'outMan',
          content: {
            LocalApprovalName: this.childApprovalName,
            LocalUserName: this.childUserName,
            LocalApprovalId: this.childApprovalId,
            LocalUserId: this.childUserId
          }
        })
        this.LocalApprovalName = getStore({ name: 'outMan' }).LocalApprovalName
        this.LocalUserName = getStore({ name: 'outMan' }).LocalUserName
        this.LocalUserId = getStore({ name: 'outMan' }).LocalUserId
        this.LocalApprovalId = getStore({ name: 'outMan' }).LocalApprovalId
        this.addApprovalDialogVisible = false
        let setList = new Set()
        setList.add({ label: this.titleInput, formNo: 0 })
        let connectArr = this.approvalOptions
        this.check = Array.from(setList)[0].formNo
        this.approvalOptions = [Array.from(setList)[0], ...connectArr]
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
      this.titleInput = ''
      this.reasonArea = ''
      this.childUserName = []
      this.childApprovalName = []
      removeStore({ name: 'outMan' })
    },
    addRoomUser () {
      this.roomApplyDialogVisible = true
    },
    addRoomChecker () {
      this.roomCheckDialogVisible = true
    },
    delRoomChecker () {

    },
    chooseOrder (i, check) {
      this.check = check
      if (!check == 0) {
        let index = i - 1
        if (this.tripFormData.length > 0) {
          this.formNo = this.tripFormData[index].formNo
          // this.reasonArea = this.tripFormData[index].content
          // this.childApprovalId = this.tripFormData[index].approvalPeopleList
          // this.titleInput = this.tripFormData[index].title
        }
      }
    },
    handleUserCount () {
      // this.childUserName = []
      console.log(this.childUserName, 'sasa')
    },
    childRoomAdd (val, val2) {
      console.log(val, 'room')
      // let bool = this.roomCount > this.LocalUserName.length
      let boolean = this.LocalUserId.indexOf(val.realUserId)
      // let finalAdminBool = this.finalAdminId == val.realUserId
      // let checkerBool = this.LocalApprovalId.indexOf(val.realUserId)
      let beforeBoolStore = typeof (getStore({ name: 'outMan' })) == 'undefined'
      if (boolean == -1) {
        this.LocalUserName.push(val.userName)
        this.LocalUserId.push(val.realUserId)
        if (!beforeBoolStore) {
          let boolStore = typeof (getStore({ name: 'outMan' })).LocalApprovalName == 'undefined'
          if (!boolStore) {
            setStore({
              name: 'outMan',
              content: {
                LocalUserName: this.LocalUserName,
                LocalUserId: this.LocalUserId,
                LocalApprovalName: getStore({ name: 'outMan' }).LocalApprovalName,
                LocalApprovalId: getStore({ name: 'outMan' }).LocalApprovalId,
              }
            })
          } else {
            setStore({
              name: 'outMan',
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
      // else if (!bool) {
      //   this.$message({
      //     type: 'warning',
      //     message: `最少添加${this.LocalUserName.length}人`
      //   })
      //   this.roomApplyDialogVisible = val2
      // }
      if (boolean >= 0) {
        this.$message({
          type: 'warning',
          message: '请勿重复添加'
        })
      }
      // if (finalAdminBool) {
      //   this.$message({
      //     type: 'warning',
      //     message: '出差人不能与审批人相同'
      //   })
      // }
      // if (checkerBool >= 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '出差人不能与审批人相同'
      //   })
      // }
      this.roomApplyDialogVisible = val2
    },
    childRoomCheck (val, val2) {
      let bool = this.LocalApprovalName.length
      let boolean = this.LocalApprovalId.indexOf(val.realUserId)
      let finalAdminBool = val.realUserId == this.finalAdminId
      let beforeBoolStore = typeof (getStore({ name: 'outMan' })) == 'undefined'
      if (boolean == -1 && bool < 10 && !finalAdminBool) {
        this.LocalApprovalName.push(val.userName)
        this.LocalApprovalId.push(val.realUserId)
        if (!beforeBoolStore) {
          let boolStore = typeof (getStore({ name: 'outMan' })).LocalApprovalName == 'undefined'
          if (!boolStore) {
            setStore({
              name: 'outMan',
              content: {
                LocalUserName: getStore({ name: 'outMan' }).LocalUserName,
                LocalUserId: getStore({ name: 'outMan' }).LocalUserId,
                LocalApprovalName: this.LocalApprovalName,
                LocalApprovalId: this.LocalApprovalId,
              }
            })
          } else {
            setStore({
              name: 'outMan',
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
      //     message: '审批人不能与出差人相同'
      //   })
      // }
      this.roomCheckDialogVisible = val2
    },
    childByValue (val, val2) {
      // let bool = this.childUserName.length < this.roomCount
      let boolean = this.childUserId.indexOf(val.realUserId)
      // let finalAdminBool = this.finalAdminId == val.realUserId
      // let checkerBool = this.childApprovalId.indexOf(val.realUserId)
      if (boolean == -1) {
        this.childUserName.push(val.userName)
        this.childUserId.push(val.realUserId)
        this.addUserDialogVisible = val2
      }
      // else if (bool) {
      //   this.$message({
      //     type: 'warning',
      //     message: `最少添加${this.childUserName.length}人`
      //   })
      //   this.addUserDialogVisible = val2
      // }
      if (boolean >= 0) {
        this.$message({
          type: 'warning',
          message: '请勿重复添加'
        })
      }
      // if (finalAdminBool) {
      //   this.$message({
      //     type: 'warning',
      //     message: '出差人不能与审批人相同'
      //   })
      // }
      // if (checkerBool >= 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '出差人不能与审批人相同'
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
      //     message: '审批人不能与出差人相同'
      //   })
      // }
      this.addCheckerDialogVisible = val2
    },
    forCityList () {
      let array = this.cityList
      for (let index = 0; index < array.length; index++) {
        let element = array[index]
        let bool = element.indexOf(this.OrderDetails.cityId)
        if (bool == 0) {
          this.cityName = element
        }
      }
      let cityName = this.cityName.split(',')[3].split('|')[0]
      this.chineseCityName = cityName
      this.titleInput = '出差申请:' + cityName
      this.reasonArea = '出差:' + cityName
    },
    addApproval () {
      this.addApprovalDialogVisible = true
    },
    addUser () {
      this.addUserDialogVisible = true
    },
    delInnerUser (index) {
      this.childUserName.splice(index, 1)
      this.childUserId.splice(index, 1)
    },
    addChecker () {
      this.addCheckerDialogVisible = true
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
    getPrice () {
      this.loading = true
      price(this.params).then(res => {
        this.loading = false
        let resDate = res.data.data || res && (res.data)
        this.price = resDate.list && resDate.list[0].totalAmount || 0
        if (resDate.code === 1) {
          if (resDate.msg.length > 0) {
            this.$message({
              message: resDate.msg,
              type: 'warning'
            })
          }
        }
      })
    },
    changeValue1 (value) {
      if (value >= this.value2) {
        this.value2 = new Date(value.getTime() + 86400000)
      }
      this.params.checkInDate = dateFormat(value, 'yyyy-MM-dd')
      this.params.checkOutDate = dateFormat(this.value2, 'yyyy-MM-dd')
      this.night = (this.value2 - value) / 86400000
      this.getPrice()
    },
    changeValue2 (value) {
      this.params.checkInDate = dateFormat(this.value1, 'yyyy-MM-dd')
      this.params.checkOutDate = dateFormat(value, 'yyyy-MM-dd')
      this.night = (value - this.value1) / 86400000
      this.getPrice()
    },
    roomCountChange (value) {
      this.params.roomCount = value
      this.getPrice()
    },
    // nextApproval () {
    //   this.childApprovalId.push(this.finalAdminId)
    //   let params = {
    //     approvalUsers: this.childApprovalId,
    //     checkType: this.checkType,
    //     content: this.reasonArea,
    //     destination: this.chineseCityName,
    //     formNo: "",
    //     orderNo: this.orderNo,
    //     title: this.titleInput,
    //     tripUsers: this.childUserId
    //   }
    //   addApproval(params).then(res => {
    //     console.log(res, 'addre')
    //   })
    // },
    next () {
      let isEmpty = false
      let emptyArr = []
      if (this.nameList.length > 0) {
        for (let i = 0; i < this.roomCount; i++) {
          if (!this.nameList[i] || this.nameList[i] === undefined || this.nameList[i].replace(/(^\s*)|(\s*$)/g, "") === "") {
            isEmpty = true
            emptyArr.push(i)
          }
        }
      }
      if (!this.userName || this.userName.replace(/(^\s*)|(\s*$)/g, "") === "") {
        this.$message.error('请输入联系人员！')
        this.$refs.userNameRef.focus()
      } else if (!this.telphone || this.telphone.replace(/(^\s*)|(\s*$)/g, "") === "" || !isPhoneAvailable(this.telphone.replace(/(^\s*)|(\s*$)/g, ""))) {
        this.$message.error('请输入正确手机号码！')
        this.$refs.telPhone.focus()
      } else if (this.nameList.length === 0) {
        this.$message.error('请输入住客姓名！')
        this.$refs.nameList[0].focus()
      } else if (isEmpty) {
        this.$message.error('请输入住客姓名！')
        this.$refs.nameList[emptyArr[0]].focus()
      } else if (this.price === 0) {
        this.$message.error('很抱歉，该酒店没找到符合您要求的房间，试试其它酒店吧。')
      } else if (this.titleInput.length == 0 && this.travelType == 0 && this.accountType == 1) {
        this.$message.error('请填写申请单')
        this.addApprovalDialogVisible = true
        this.$refs.title.focus()
      } else if (this.reasonArea.length == 0 && this.travelType == 0 && this.accountType == 1) {
        this.$message.error('请填写理由')
        this.addApprovalDialogVisible = true
        if (this.addApprovalDialogVisible) {
          this.$refs.title.focus()
        }
      }
      else if (this.childUserName.length == 0 && !this.reasonArea.length == 0
        && !this.titleInput.length == 0 && this.travelType == 0
        && this.formNo.length == 0 && this.accountType == 1) {
        this.addApprovalDialogVisible = true
        this.$message.error('请选择申请人')
      }
      else if (this.roomCount > this.LocalUserName.length && this.travelType == 0) {
        this.$message.error('出差人不能小于房间数')
      }
      else if (this.LocalUserName.length == 0 && this.travelType == 0 && this.accountType == 1) {
        this.roomApplyDialogVisible = true
        this.$message.error('请选择申请人')
      }
      else if (this.roomCount > this.childUserName.length && this.travelType == 0 && this.formNo.length < 0) {
        this.$message.error('申请人不能小于房间数')
      }

      else {
        if (this.accountType == 0 && this.travelType == 0) {
          this.isDisabled = true
          this.doorder.checkDate = dateFormat(this.value1, 'yyyy-MM-dd')
          this.doorder.contactName = this.userName
          this.doorder.contactPhone = this.telphone
          this.doorder.orderMoney = this.price
          this.doorder.outDate = dateFormat(this.value2, 'yyyy-MM-dd')
          this.doorder.roomCount = this.roomCount
          this.doorder.travelType = this.travelType
          this.doorder.userId = this.accountId
          this.doorder.userType = this.accountType
          this.doorder.people = []
          let business = {
          }
          let travel = {
          }
          this.doorder.business = business
          this.doorder.travel = travel
          for (let i = 0; i < this.roomCount; i++) {
            this.doorder.people.push({
              name: this.nameList[i]
            })
          }
          let str = ''
          for (let i = 0; i < this.remarksArr.length; i++) {
            str += this.remarksArr[i] + ','
          }
          this.doorder.remarks = str.substr(0, str.length - 1)
          console.log(this.doorder)
          doorder(this.doorder).then(res => {
            console.log(res)
            this.orderNo = res.data.data.orderNo
            // this.nextApproval()
            this.$router.push({
              name: 'OrderPay',
              query: {
                orderNo: res.data.data.orderNo
              }
            })
          })
        } else {
          this.isDisabled = true
          this.doorder.checkDate = dateFormat(this.value1, 'yyyy-MM-dd')
          this.doorder.contactName = this.userName
          this.doorder.contactPhone = this.telphone
          this.doorder.orderMoney = this.price
          this.doorder.outDate = dateFormat(this.value2, 'yyyy-MM-dd')
          this.doorder.roomCount = this.roomCount
          this.doorder.travelType = this.travelType
          this.doorder.userId = this.accountId
          this.doorder.userType = this.accountType
          this.doorder.people = []
          let business = {
            checkUser: this.childApprovalId,
            content: this.reasonArea,
            destination: this.cityId,
            formNo: '',
            leaveDate: dateFormat(this.value2, 'yyyy-MM-dd'),
            title: this.titleInput,
            travelUser: this.childUserId
          }
          let travel = {
            checkUser: this.LocalApprovalId,
            content: this.reasonArea,
            destination: this.cityId,
            formNo: "",
            leaveDate: dateFormat(this.value2, 'yyyy-MM-dd'),
            title: this.titleInput,
            travelUser: this.LocalUserId
          }
          console.log(this.formNo, 'this,form')
          if (this.formNo.length > 0 && !this.check == 0) {
            // this.doorder.business = {}
            this.doorder.business = {}
            this.doorder.travel = travel
            // if (this.doorder.business.length == 0) {
            //  this.doorder.business.formNo = this.formNo
            // }
            this.doorder.business.formNo = this.formNo
          } else {
            this.doorder.business = business
            this.doorder.travel = travel
          }
          for (let i = 0; i < this.roomCount; i++) {
            this.doorder.people.push({
              name: this.nameList[i]
            })
          }
          let str = ''
          for (let i = 0; i < this.remarksArr.length; i++) {
            str += this.remarksArr[i] + ','
          }
          this.doorder.remarks = str.substr(0, str.length - 1)
          console.log(this.doorder)
          doorder(this.doorder).then(res => {
            console.log(res)
            this.orderNo = res.data.data.orderNo
            // this.nextApproval()
            this.$router.push({
              name: 'OrderPay',
              query: {
                orderNo: res.data.data.orderNo
              }
            })
          })
        }      }
    }
  }
}
</script>

<style lang="less">
.add-room-user {
  width: 520px;
  .el-dialog__header {
    padding: 40px 20px 10px 40px;
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
    padding-left: 40px;
    .el-input {
      width: 70%;
    }
    .el-table__body-wrapper {
      cursor: pointer;
    }
    .el-button--text {
      margin-left: 20px;
    }
    .table-pagination {
      // background: red;
      text-align: center;
      .el-pagination__jump {
        margin-left: 0px;
      }
    }
  }
}
.add-room-check {
  width: 520px;
  .el-dialog__header {
    padding: 40px 20px 10px 40px;
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
    padding-left: 40px;
    .el-input {
      width: 70%;
    }
    .el-table__body-wrapper {
      cursor: pointer;
    }
    .el-button--text {
      margin-left: 20px;
    }
    .table-pagination {
      // background: red;
      text-align: center;
      .el-pagination__jump {
        margin-left: 0px;
      }
    }
  }
}
.add-user-dialog {
  width: 520px;
  .el-dialog__header {
    padding: 40px 20px 10px 40px;
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
    padding-left: 40px;
    .el-input {
      width: 70%;
    }
    .el-table__body-wrapper {
      cursor: pointer;
    }
    .el-button--text {
      margin-left: 20px;
    }
    .table-pagination {
      // background: red;
      text-align: center;
      .el-pagination__jump {
        margin-left: 0px;
      }
    }
  }
}
.bg {
  background-color: #fff;
  overflow: hidden;
}
.detailContent {
  width: 1180px;
  margin: 20px auto;
  border: 0.5px solid #d0d9e0;
  padding-top: 30px;
  border-radius: 4px;
  overflow: hidden;
  .add-approval-dialog {
    .el-dialog__header {
      padding: 40px 20px 10px 40px;
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
      padding-left: 40px;
      .el-input {
        width: 70%;
      }
      // .el-table__body-wrapper {
      // cursor: pointer;
      // }
      .el-button--text {
        margin-left: 20px;
      }
      .table-pagination {
        // background: red;
        text-align: center;
        .el-pagination__jump {
          margin-left: 0px;
        }
      }
      .dialog-content {
        margin: 0 auto;
        width: 600px;
        .top-content-head {
          .top-content-head-l {
            width: 300px;
            display: inline-block;
            text-align: left;
          }
          .top-content-head-r {
            width: 300px;
            display: inline-block;
            text-align: left;
            .city-inline {
              input {
                width: 130px !important;
                height: 38px;
                border: 1px solid #c2c7ce;
                background: white;
                border-radius: 4px;
                margin-bottom: 2px;
                text-indent: 10px;
              }
              span {
                right: -40px;
              }
            }
          }
        }
        .top-content {
          padding-top: 30px;
          .title-wrapper {
            // margin: 0 auto;
            width: 600px;
            .title-span {
              padding-right: 29px;
            }
            .title-input {
              width: 368px;
            }
          }
        }
        .center-content-l {
          text-align: left;
          padding-top: 30px;
          .span-reason {
            display: inline-block;
            height: 54px;
            line-height: 12px;
          }
          .text-area {
            width: 480px;
          }
        }
        .center-content-s {
          padding-top: 30px;
          .applyuser-wrapper {
            width: 600px;
            text-align: left;
            // margin: 0 auto;
            .apply-user-item {
              padding: 0 5px;
              // position: relative;
              i :hover {
                cursor: pointer;
              }
              i {
                color: red;
                font-size: 8px;
                // position: absolute;
                // bottom: 0px;
              }
            }
            // i {
            // position: absolute;
            // top: 10px;
            // left: 10px;
            // }
          }
        }
        .bottom-content {
          padding-top: 30px;
          .check-user-wrapper {
            width: 600px;
            text-align: left;
            // margin: 0 auto;
            .inner-finalAdmin {
              padding-left: 10px;
            }
            .checked-user-item {
              padding: 0 5px;
              // position: relative;
              i :hover {
                cursor: pointer;
              }
              i {
                color: red;
                font-size: 8px;
                // position: absolute;
                // bottom: 0;
              }
            }
            .el-icon-circle-plus {
              cursor: pointer;
            }
          }
        }
        .bottom-content-foot {
          padding-top: 30px;
          .botton-wrapper {
            width: 250px;
            margin: 0 auto;
            position: relative;
            .botton-lf {
              position: absolute;
              left: 0;
            }
            .botton-rg {
              margin-left: 130px;
              position: absolute;
              right: 0;
            }
          }
        }
      }
    }
  }
}
.myWebket-box-flex-1 {
  padding-left: 30px;
  width: 559px;
  float: left;
  & > .order_left_height {
    .order_item_key_color {
      width: 56px;
    }
  }
  .el-checkbox-group {
    display: inline-block;
  }
}
.order_left_title_font {
  color: #b4b4b4;
  font-size: 21px;
}
.order_left_box {
  border-right: solid 0.5px #d0d9e0;
}
.order_left_height {
  line-height: 50px;
  .order-required {
    color: #f40;
    padding-left: 15px;
  }
  .el-select {
    width: 350px;
    height: 40px;
  }
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
.out-finalAdmin {
  padding-left: 10px;
}
.small-select {
  width: 160px !important;
  padding-right: 20px;
}
.form-add {
  padding-left: 10px;
  cursor: pointer;
}
.form-add:hover {
  color: #59a1ea;
  cursor: pointer;
}
.order_item_key_color {
  color: #6a7689;
  display: inline-block;
}
.order_item_line {
  display: inline-block;
  margin: 0px 14px;
  background-color: #d0d9e0;
  width: 1px;
  height: 14px;
  vertical-align: middle;
}
.data-picker-box {
  display: inline-block;
  position: relative;
  .el-date-editor.el-input {
    width: 175px;
  }
  .el-input__inner {
    height: 42px;
  }
}
.tenzont-date-text {
  position: relative;
  margin-left: -26px;
  margin-right: 13px;
}
.order_item_night {
  position: absolute;
  border-top: 0.5px solid #d0d9e0;
  border-left: 0.5px solid #d0d9e0;
  border-right: 0.5px solid #d0d9e0;
  width: 162px;
  height: 13px;
  left: 89px;
  top: -12px;
}
.night-text {
  background-color: #fff;
  position: absolute;
  top: -15px;
  line-height: 30px;
  left: 70px;
}
.input-user {
  width: 350px;
}
.input-name {
  width: 157px;
}
.order_button {
  clear: both;
  display: block;
  margin-left: 520px;
  margin-top: 15px;
  margin-bottom: 15px;
}
.order-money {
  color: #59a1ea;
  font-size: xx-large;
  span {
    font-size: 16px;
  }
}
</style>
