<template>
  <div class="hotel-detail" v-loading="startLoading">
    <div class="tenzont-hotel-item">
      <div class="container">
        <div class="tenzont-hotel-item-title">
          <span>{{hotelInfos.hotelName}}</span>
        </div>
        <div class="tenzont-hotel-item-address">
          <span>
            {{hotelInfos.addr}}
          </span>
        </div>
        <div class="flag-list">
          <p class="hotel-label">商务出行</p>
          <p class="hotel-label">休闲度假</p>
          <p v-for="item in hotelInfos.commentLable" :key="item.index">{{item}}</p>
        </div>
      </div>
    </div>
    <div class="tenzont-hotel-detail-box">
      <div class="layui-carousel">
        <div class="commentCount">
          <div class="recommendation">
            {{hotelInfos.recommendation ? hotelInfos.recommendation : `${hotelInfos.score*2}%`}}
            <p>用户好评</p>
          </div>
          <div class="commentCount-p" v-if="hotelInfos.commentCount">
            {{hotelInfos.commentCount}}
            <p>人气</p>
          </div>
        </div>
        <div class="img-length" v-if="hotelInfos.hotelPic">
          {{hotelInfos.hotelPic.length}}张图片
        </div>
        <img v-if="hotelInfos.hotelPic" style="height: 393px" :src="formatSrc(hotelInfos.hotelPic[imageIndex])">
        <img v-if="!hotelInfos.hotelPic" style="height: 393px" src="@/assets/detail_default_hotel.jpg">
        <ul v-if="hotelInfos.hotelPic" class="hotelImageList" :style="'width: ' + hotelInfos.hotelPic.length * 163 + 'px; transform: translateX(-' + 162 * 4 * picPage + 'px'">
          <li v-for="(item, index) in hotelInfos.hotelPic" :key="item">
            <img :class="{active: imageIndex === index}" :src="formatSrc(item)" @mouseenter="imageIndex = index">
          </li>
        </ul>
        <ul v-if="!hotelInfos.hotelPic" class="hotelImageList">
          <li>
            <img src="@/assets/detail_default_hotel.jpg">
          </li>
        </ul>
        <span @click="toPrev" v-if="hotelInfos.hotelPic && hotelInfos.hotelPic.length > 4" class="prev">&#xe605;</span>
        <span @click="toNext" v-if="hotelInfos.hotelPic && hotelInfos.hotelPic.length > 4" class="next">&#xe606;</span>
      </div>
      <div class="hotel-describe">
        <div class="card-title">酒店简介
          <div class="hotel-switchboard">酒店电话：{{hotelInfos.switchboard}}</div>
          <img class="title-icon" src="@/assets/telphone.png">
        </div>
        <div style="height: 135px; position: relative;">
          <div class="hotel-score">
            <div class="score-up">{{hotelInfos.score/10}}<span class="score-down">分</span></div>
            <div class="score-down">{{hotelInfos.commentScore || '好'}}</div>
          </div>
          <div class="hotel-describe-words">
            {{hotelInfos.intro && hotelInfos.intro.substr(0, 70)}}
            <span v-if="hotelInfos.intro && hotelInfos.intro.length > 62">…</span>
            <span v-if="hotelInfos.intro && hotelInfos.intro.length > 70" class="seeall" 
                  @click="showAllDialogVisible = true">查看全部</span>
          </div>
        </div>
        <div class="card-title">设施和服务
          <div class="hotel-switchboard">14:00之后入住, 12:00之前离店</div>
          <img class="title-icon" src="@/assets/clock.png">
        </div>
        <!-- 开业时间等 -->
        <ul class="hotel-simple-info">
          <li v-for="item in showOpenArr" :key="item.index">
            <span>{{item.title}}</span>
            <span>{{item.content}}</span>
          </li>
        </ul>
        <!-- 设施和服务 -->
        <ul class="hotel-icon-cover">
          <div class="hotel-icons">
            <div class="hotel-icon" v-for="facility in hotelInfos.facilities"  :key="facility.label">
              <div class="icon" v-if="facility.label === '商务服务'">
                <img src="@/assets/boardroom.png" alt="">
                <span class="desc">会议室</span>
              </div>
              <div class="icon" v-if="facility.label === '休闲娱乐' && facility.values && facility.values.includes('健身室')">
                <img src="@/assets/bodybuilding.png" alt="">
                <span class="desc">健身房</span>
              </div>
              <div class="icon" v-if="facility.label === '前台服务' && facility.values && facility.values.includes('行李寄存')">
                <img src="@/assets/deposit.png" alt="">
                <span class="desc">行李寄存</span>
              </div>
              <div v-if="facility.label === '交通设施'" class="icon">
                <img src="@/assets/park.png" alt="">
                <span class="desc">停车场</span>
              </div>
              <div v-if="facility.label === '餐饮服务'" class="icon">
                <img src="@/assets/restaurant.png" alt="">
                <span class="desc">餐厅</span>
              </div>
            </div>
            <div class="hotel-icon">
              <div class="icon">
                <img src="@/assets/wifi.png" alt="">
                <span class="desc">无线上网</span>
              </div>
            </div>
            <div class="hotel-icon">
              <div class="icon">
                <img src="@/assets/commputer.png" alt="">
                <span class="desc">有线上网</span>
              </div>
            </div>
            <div class="hotel-icon">
              <div class="icon">
                <img src="@/assets/hair.png" alt="">
                <span class="desc">吹风机</span>
              </div>
            </div>
            <div class="hotel-icon">
              <div class="icon">
                <img src="@/assets/shower.png" alt="">
                <span class="desc">热水洗澡</span>
              </div>
            </div>
          </div>
          <span class="seeall" @click="showAllDialogVisible = true">查看全部</span>
        </ul>
        <div class="map-cover">
          <BMap :longitude="[hotelInfos.location.lon]" :latitude="[hotelInfos.location.lat]" 
                :name="[hotelInfos.hotelName]" :isShowControl="false"/>
        </div>
      </div>
    </div>
    <!-- 周边同类型酒店, 房型价格 -->
    <div class="hotel-detail-content">
      <div class="same-type-hotel">
        <div class="header">
          <img src="@/assets/hot.png" alt="">
          <span class="title">周边推荐酒店</span>
        </div>
        <p class="desc">商旅热门酒店</p>
        <ul class="same-hotel-list">
          <li class="list-item" v-for="(n, index) in sameTypeHotels" :key="index" @click="toAnotherHotelDetail(n.id)">
            <span class="image-cover fontaddr" v-if="n.hotelLevel">{{n.hotelLevel}}</span>
            <img :src="formatSrc(n.headImage)" alt="">
            <div class="hotel-info-cover">
              <p class="hotel-title">{{n.hotelName}}</p>
              <p class="zhoubian-score">{{(n.score / 10).toFixed(1)}}</p>
              <p class="zhoubian-commentScore">{{n.commentScore || '好'}}</p>
              <div class="hotel-info">
                <!-- <span class="tag">续订优惠</span> -->
                <span class="price-cover">
                  ￥<span class="price">{{n.priceLevel/100}}</span>
                  <span class="price-start">起</span>
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="roomType-and-price">
        <div class="search-box-cover">
          <h3>
            <span>房型价格</span>
          </h3>
          <div class="search-box">
            <span class="date-input-cover" @click="showStartDatePicker">
              <span class="search-date-title">入住</span>
              <el-date-picker
                class="search-date detail-startdate-picker"
                v-model="value1"
                align="right"
                type="date"
                prefix-icon="time-icon"
                :clearable="false"
                v-on:change="changeValue1"
                :picker-options="pickerOptions1"
                :editable="false"
                ref="startRef"/>
              <span class="search-date-week">，周{{startWeek}}</span>
            </span>
            <span class="date-input-cover" @click="showEndDatePicker">
              <span class="search-date-title">离店</span>
              <el-date-picker
                class="search-date detail-enddate-picker"
                v-model="value2"
                align="right"
                type="date"
                prefix-icon="time-icon"
                :clearable="false"
                v-on:change="changeValue2"
                :picker-options="pickerOptions2"
                :editable="false"
                ref="endRef"/>
              <span class="search-date-week">，周{{endWeek}}</span>
            </span>
            <span class="space-day">共{{spaceDay}}晚</span>
            <el-button class="search-btn" v-on:click="searchDate" type="primary" :disabled="searchButton">重新搜索</el-button>
          </div>
        </div>
        <ul v-loading="loading">
          <li v-for="(father, index) in hotelDetail" :key="index">
            <div class="first-floor" @click="showRoomType(index)">
              <img class="left" :src="formatSrc(father.image, 1)" alt="">
              <div class="center">
                <h4>{{father.tzRoomTypeDesc}}</h4>
                <div class="hotel-info">
                  <span>{{father.tzSpace}}</span>
                  <span class="line" v-if="father.tzSpace"></span>
                  <span>{{formatBedType(father.tzBed)}}</span>
                  <span class="line"></span>
                  <span>有会客厅</span>
                  <span class="line"></span>
                  <span>有线网和无线网</span>
                </div>
              </div>
              <div class="right">
                <div class="price-cover">
                  ￥
                  <span class="price">{{formatMinPrice(father.childe)}}</span>
                  <span class="price-start">起</span>
                  <span class="click-icon"></span>
                </div>
                <div class="tip">已为您筛选出最优的2个房型</div>
              </div>
            </div>
            <div class="second-floor">
              <div class="title-cover">
                <span class="item">床型</span>
                <span class="item">可住人数</span>
                <span class="item">早餐</span>
                <span class="item">取消规则</span>
                <span class="item">房价</span>
                <span class="item hide">按钮</span>
              </div>
              <ul class="content-list">
                <li class="content-item" v-for="(child, childIndex) in father.childe.slice(0, 2)" :key="childIndex">
                  <span class="item">{{child.bed || child.subRoomName}}</span>
                  <span class="item check-in-num-cover">
                    <img src="@/assets/check_in_num.png" alt="">
                    <img src="@/assets/check_in_num.png" alt="">
                  </span>
                  <span class="item">{{child.breakfastDesc}}</span>
                  <span class="item">
                    <el-popover
                      placement="bottom"
                      width="131"
                      trigger="hover"
                      :content="child.cancelPolicyDesc.split('|')[1] || '订单确认后不可取消变更，如未入住，酒店将扣除全额房费'">
                      <span class="cancel-proxy" slot="reference">
                        <img src="@/assets/cancel_proxy.png" alt="">
                        {{child.cancelPolicyDesc.split('|')[0]}}
                      </span>
                    </el-popover>
                  </span>
                  <span class="item price-cover">￥
                    <i class="price">{{child.price/100}}</i>
                  </span>
                  <span class="item item1">
                    <span class="order-btn" :class="child.roomNum <= 0 ? 'order-btn-disable' : ''"
                          @click="jump({
                            addr: hotelInfos.addr,
                            hotelName: hotelInfos.hotelName,
                            roomTypeDesc: father.tzRoomTypeDesc,
                            breakfast: child.breakfast,
                            startDate: dateFormat(value1, 'yyyy-MM-dd'),
                            endDate: dateFormat(value2, 'yyyy-MM-dd'),
                            hotelId: props.hotelId,
                            cityId: hotelInfos.cityId,
                            channelSubRoomTypeId: child.channelSubRoomTypeId,
                            suboomTypeDesc: child.subRoomName,
                            bed: child.bed,
                            cancelPolicyDesc: child.cancelPolicyDesc }, child.roomNum)">
                      预订
                    </span>
                  </span>
                </li>
                <li class="content-item" v-for="(child, childIndex) in father.childe.slice(2)" :key="childIndex+2"
                    v-if="isShowMoreRoomType">
                  <span class="item">{{child.bed || child.subRoomName}}</span>
                  <span class="item check-in-num-cover">
                    <img src="@/assets/check_in_num.png" alt="">
                    <img src="@/assets/check_in_num.png" alt="">
                  </span>
                  <span class="item">{{child.breakfastDesc}}</span>
                  <span class="item">
                    <el-popover
                      placement="bottom"
                      width="131"
                      trigger="hover"
                      :content="child.cancelPolicyDesc.split('|')[1] || '订单确认后不可取消变更，如未入住，酒店将扣除全额房费'">
                      <span class="cancel-proxy" slot="reference">
                        <img src="@/assets/cancel_proxy.png" alt="">
                        {{child.cancelPolicyDesc.split('|')[0]}}
                      </span>
                    </el-popover>
                  </span>
                  <span class="item price-cover">￥
                    <i class="price">{{child.price/100}}</i>
                  </span>
                  <span class="item item1">
                    <span class="order-btn" :class="child.roomNum <= 0 ? 'order-btn-disable' : ''"
                          @click="jump({
                            hotelName: hotelInfos.hotelName,
                            roomTypeDesc: father.tzRoomTypeDesc,
                            breakfast: child.breakfast,
                            startDate: dateFormat(value1, 'yyyy-MM-dd'),
                            endDate: dateFormat(value2, 'yyyy-MM-dd'),
                            hotelId: props.hotelId,
                            cityId: hotelInfos.cityId,
                            channelSubRoomTypeId: child.channelSubRoomTypeId,
                            suboomTypeDesc: child.subRoomName,
                            bed: child.bed,
                            cancelPolicyDesc: child.cancelPolicyDesc }, child.roomNum)">
                      预订
                    </span>
                  </span>
                </li>
              </ul>
              <div class="show-more-roomType" v-if="father.childe.length > 2" 
                   @click="showMoreRoomType">
                {{isShowMoreRoomType ? '收起更多' : '查看更多'}}
              </div>
            </div>
          </li>
          <div class="tenzont-roomtype-item" v-if="hotelDetail.length === 0" style="padding: 20px">没找到符合您要求的房间，试试其它酒店吧</div>
        </ul>
      </div>
    </div>
    <!-- 查看全部弹窗 -->
    <el-dialog :visible.sync="showAllDialogVisible" custom-class="show-all-dialog" :close-on-click-modal="false" 
               :close-on-press-escape="false" width="512">
      <el-tabs v-model="activeName">
        <el-tab-pane label="酒店简介" name="first" class="first-cover">{{hotelInfos.intro}}</el-tab-pane>
        <el-tab-pane label="设施和服务" name="second" class="second-cover">
          <div class="second-top">
            <div>
              <img class="title-icon" src="@/assets/clock.png">
              <div class="hotel-switchboard">14:00之后入住, 12:00之前离店</div>
            </div>
            <ul class="hotel-simple-info">
              <li v-for="item in showOpenArr" :key="item.index">
                <span>{{item.title}}</span>
                <span>{{item.content}}</span>
              </li>
            </ul>
          </div>
          <ul class="hotel-icon-cover">
            <div class="hotel-icon" v-for="facility in hotelInfos.facilities"  :key="facility.label">
              <div class="icon" v-if="facility.label === '商务服务'">
                <img src="@/assets/boardroom.png" alt="">
                <span class="desc">会议室</span>
              </div>
              <div class="icon" v-if="facility.label === '休闲娱乐' && facility.values && facility.values.includes('健身室')">
                <img src="@/assets/bodybuilding.png" alt="">
                <span class="desc">健身房</span>
              </div>
              <div class="icon" v-if="facility.label === '前台服务' && facility.values && facility.values.includes('行李寄存')">
                <img src="@/assets/deposit.png" alt="">
                <span class="desc">行李寄存</span>
              </div>
              <div v-if="facility.label === '交通设施'" class="icon">
                <img src="@/assets/park.png" alt="">
                <span class="desc">停车场</span>
              </div>
              <div v-if="facility.label === '餐饮服务'" class="icon">
                <img src="@/assets/restaurant.png" alt="">
                <span class="desc">餐厅</span>
              </div>
            </div>
            <div class="hotel-icon">
              <div class="icon">
                <img src="@/assets/wifi.png" alt="">
                <span class="desc">无线上网</span>
              </div>
            </div>
            <div class="hotel-icon">
              <div class="icon">
                <img src="@/assets/commputer.png" alt="">
                <span class="desc">有线上网</span>
              </div>
            </div>
            <div class="hotel-icon">
              <div class="icon">
                <img src="@/assets/hair.png" alt="">
                <span class="desc">吹风机</span>
              </div>
            </div>
            <div class="hotel-icon">
              <div class="icon">
                <img src="@/assets/shower.png" alt="">
                <span class="desc">热水洗澡</span>
              </div>
            </div>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { selectOneHotelInfoById, searchRecommendHotelListByLocation } from '@/api/hotel'
import { load } from '@/api/roomType'
import { dateFormat } from '@/util/lobal'
import { setStore, getStore } from '@/util/store'
import { increaseMonth } from '@/util/util.js'
import BMap from '@/components/BMap.vue'

const weekArr = ['日', '一', '二', '三', '四', '五', '六']
export default {
  name: 'HotelDetail',
  components: {
    BMap
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      startLoading: true,
      hotelDetail: [],
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
      value1: new Date(this.props.startDate.replace(/-/g, '/')),
      value2: new Date(this.props.endDate.replace(/-/g, '/')),
      breakfast: false,
      imageIndex: 0,
      loading: false,
      searchButton: false,
      picPage: 0,
      hotelInfos: {
        location: {},
        commentLable: []
      },
      showAllDialogVisible: false,
      activeName: 'first',
      showOpenArr: [],
      sameTypeHotels: [],
      params: {},
      startWeek: weekArr[new Date(this.props.startDate).getDay()],
      endWeek: weekArr[new Date(this.props.endDate).getDay()],
      isShowMoreRoomType: false
    }
  },
  watch: {
    timeOffset (value) {
      this.cankaoDate = Date.now() + value
    },
    accountType (value) {
      if (value >= 0) {
        this.getHotelInfo()
      }
    }
  },
  computed: {
    ...mapGetters(['accountId', 'timeOffset', 'accountType']),
    spaceDay () {
      return (this.value2 - this.value1) / (24 * 60 * 60 * 1000)
    }
  },
  beforeCreate () {
    this.props = getStore({
      name: 'HotelDetail'
    })
  },
  mounted () {
    if (this.userInfo.status) {
      if (this.accountType >= 0) {
        this.getHotelInfo()
      }
    } else {
      this.$store.dispatch('setState', {
        key: 'dialogLoginVisible',
        value: true,
        module: 'user'
      })
    }
  },
  methods: {
    showStartDatePicker () {
      this.$refs.startRef.focus()
    },
    showEndDatePicker () {
      this.$refs.endRef.focus()
    },
    showMoreRoomType () {
      this.isShowMoreRoomType = !this.isShowMoreRoomType
    },
    toAnotherHotelDetail (id) {
      setStore({
        name: 'HotelDetail',
        content: {
          hotelId: id,
          startDate: dateFormat(this.value1, 'yyyy-MM-dd'),
          endDate: dateFormat(this.value2, 'yyyy-MM-dd')
        }
      })
      setTimeout(() => {
        window.open('/#/HotelDetail')
      }, 100)
    },
    formatLabel (val, start, end) {
      if (!val) return
      return val.slice(start, end)
    },
    formatSrc (imgSrc, val) {
      if (!imgSrc && val) {
        return require("@/assets/roomType_default.jpg")
      } else if (!imgSrc) {
        return require('@/assets/detail_default_hotel.jpg')
      }
      return `https://hotelpic-1254071088.file.myqcloud.com/hotel_pic/${imgSrc}.jpeg`
    },
    formatBedType (num) {
      let beds = ['大床', '双床', '单人床', '多床房', '大/双房']
      return beds[num]
    },
    formatMinPrice (arr) {
      let priceArr = []
      arr.forEach(val => {
        priceArr.push(val.price / 100)
      })
      priceArr.sort()
      return priceArr[0]
    },
    dateFormat: dateFormat,
    ...mapMutations(['setState']),
    toPrev () {
      if (this.picPage > 0) {
        this.picPage--
      }
    },
    toNext () {
      console.log(this.picPage < this.hotelInfos.hotelPic.length / 4 - 1)
      if (this.picPage < this.hotelInfos.hotelPic.length / 4 - 1) {
        this.picPage++
      }
    },
    getHotelInfo () {
      selectOneHotelInfoById(this.props.hotelId).then(res => {
        this.startLoading = false
        if (res.data.code === 0) {
          if (!this.userInfo.status) {
            this.setState({
              key: 'dialogLoginVisible',
              value: true,
              module: 'user'
            })
          } else {
            this.hotelInfos = { ...res.data.data }
            // 开业时间，客房数量，酒店类型等组成数组
            if (this.hotelInfos.openTime) {
              this.showOpenArr.push({
                title: '开业：',
                content: this.formatLabel(this.hotelInfos.openTime, 0, 5)
              })
            } else {
              this.showOpenArr.push({
                title: '开业：',
                content: '未知'
              })
            }
            if (this.hotelInfos.roomCount) {
              this.showOpenArr.push({
                title: '规模：',
                content: `共${this.formatLabel(this.hotelInfos.roomCount, 0, 3)}客房`
              })
            } else {
              this.showOpenArr.push({
                title: '规模：',
                content: '未知'
              })
            }
            if (this.hotelInfos.hotelLevel) {
              this.showOpenArr.push({
                title: '类型：',
                content: `${this.hotelInfos.hotelLevel.substr(this.hotelInfos.hotelLevel.length - 3)}酒店`
              })
            } else {
              this.showOpenArr.push({
                title: '类型：',
                content: '未知'
              })
            }
            this.params = {
              "cityId": this.hotelInfos.cityId,
              "endDate": this.props.endDate,
              "hasBreakFast": 0,
              "hotelId": this.props.hotelId,
              "startDate": this.props.startDate,
              accountId: this.accountId,
              accountType: this.accountType
            }
            // 周边同类型酒店
            searchRecommendHotelListByLocation({
              latitude: this.hotelInfos.location.lat,
              longitude: this.hotelInfos.location.lon,
              size: 3,
              cateGory: this.hotelInfos.cateGory || 2
            }).then(res => {
              if (res.data.code === 0) {
                this.sameTypeHotels = [...res.data.data]
              } else {
                if (res.data.msg) {
                  this.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                }
              }
            })
            // 子房型接口
            this.getList()
          }
        } else {
          if (res.data.msg) {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        }
      })
    },
    jump (OrderDetails, num) {
      if (num > 0) {
        if (this.accountId.length > 0) {
          setStore({
            name: 'OrderDetails',
            content: OrderDetails
          })
          setTimeout(() => {
            window.open('/#/OrderDetails')
          }, 100)
        } else {
          this.setState({
            key: 'dialogLoginVisible',
            value: true,
            module: 'user'
          })
        }
      }
    },
    changeValue1 (value) {
      if (value >= this.value2) {
        this.value2 = new Date(value.getTime() + 86400000)
      }
      this.startWeek = weekArr[new Date(value).getDay()]
      this.endWeek = weekArr[new Date(this.value2).getDay()]
    },
    changeValue2 (value) {
      this.endWeek = weekArr[new Date(value).getDay()]
    },
    searchDate () {
      this.params.startDate = dateFormat(this.value1, 'yyyy-MM-dd')
      this.params.endDate = dateFormat(this.value2, 'yyyy-MM-dd')
      this.getList()
    },
    getList () {
      this.hotelDetail = []
      this.loading = true
      this.searchButton = true
      load(this.params).then(res => {
        this.searchButton = false
        if (res.data.code === 0) {
          this.loading = false
          if (res.data.data.length === 0) {
            this.$message({
              showClose: true,
              message: '很抱歉，该酒店没找到符合您要求的房间，试试其它酒店吧。',
              type: 'warning'
            })
          } else {
            this.hotelDetail = res.data.data
            let roomCount = 0;
            for (let i = 0; i < res.data.data.length; i++) {
              for (let j = 0; j < res.data.data[i].childe.length; j++) {
                roomCount += res.data.data[i].childe[j].roomNum
              }
            }
            if (roomCount <= 0) {
              this.$message({
                showClose: true,
                message: '很抱歉，该酒店没找到符合您要求的房间，试试其它酒店吧。',
                type: 'warning'
              })
            }
          }
        } else {
          this.loading = false
          if (res.data.msg) {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        }
      })
    },
    showRoomType (index) {
      let firstArr = document.getElementsByClassName('first-floor')
      let secondArr = document.getElementsByClassName('second-floor')
      let firstItem = document.getElementsByClassName('first-floor')[index]
      let secondItem = document.getElementsByClassName('second-floor')[index]
      for (let i = 0; i < secondArr.length; i++) {
        if (i !== index) {
          secondArr[i].style.height = 0
          firstArr[i].classList.remove('first-floor-rotate')
        }
      }
      if (secondItem.style.height === '0px' || secondItem.style.height === '') {
        secondItem.style.height = 'auto'
        firstItem.classList.add('first-floor-rotate')
      } else {
        secondItem.style.height = 0
        firstItem.classList.remove('first-floor-rotate')
      }
    }
  }
}
</script>

<style lang="less">
@import './style.less';
</style>
