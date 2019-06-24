<template>
  <div class="hotel-list-wrapper">
    <div class="hotel-search-main-scroll">
      <div class="hotel-search-main-wrapper" :class="isSearchFixed ? 'search-fixed-class' : ''">
        <div class="hotel-search-main">
          <el-row :gutter="0">
            <el-col :span="5" class="search-main-item">
              <span class="search-input-title">地点</span>
              <CityList v-model="inputValue.city" :isShow="isShow"/>
            </el-col>
            <el-col :span="11" class="search-date-picker">
              <div class="search-main-item search-main-date search-main-startdate" :data-status="focus[0]">
                <span class="search-input-title">入住</span>
                <el-date-picker v-model="inputValue.startDate" placeholder="请选择入住时间" 
                                @blur="setFocus(0, false)" 
                                @focus="setFocus(0, true)"
                                prefix-icon="time-icon"
                                :picker-options="pickerToday" @change="changeStartDate"
                                :clearable="false" class="search-date" :editable="false" align="center"/>
                <span class="search-week">{{startWeek}}</span>
              </div>
              <div class="search-main-item search-main-date search-main-enddate" :data-status="focus[1]">
                <span class="search-input-title">离店</span>
                <el-date-picker v-model="inputValue.endDate" type="date" placeholder="请选择退房时间"
                                @blur="setFocus(1, false)" 
                                @focus="setFocus(1, true)"
                                prefix-icon="time-icon" :picker-options="pickerTomorrow" @change="changeEndDate"
                                :clearable="false" class="search-date" :editable="false" align="center"/>
                <span class="search-week">{{endWeek}}</span>
              </div>
            </el-col>
            <el-col :span="5" class="search-main-item search-right">
              <KeywordSearch v-model="inputValue.keywords" :cityId="inputValue.cityId"></KeywordSearch>
            </el-col>
            <el-col :span="3">
              <el-button class="search-main-button" size="medium" type="primary" @click="handleSearch" :disabled="searchButton">立即搜索</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="hotel-search-sub-wrapper">
      <div class="hotel-search-sub">
        <el-row :gutter="24" style="margin:0;">
          <el-col :span="3" class="search-select-item">
            <span class="search-select-title">差旅金额</span>
            <el-popover class="search-select-icon" trigger="click" width="264" v-model="priceVisible">
              <div class="search-select-options">
                <span class="options-close" @click="priceVisible = false">
                  <i class="el-icon-close"></i>
                </span>
                <span class="options-title">差标</span>
                <el-checkbox-group v-model="priceArr" size="mini">
                  <el-checkbox-button v-for="item in priceLabels" :label="item.label" :key="item.label"
                                      @click.native.prevent="priceGroupCheck(item)">
                    {{item.text}}
                  </el-checkbox-button>
                  <el-button size="mini" class="novalue" :type="selectPriceLabels.length > 0 ? '' : 'primary'" @click="priceReset">不限</el-button>
                  <span class="search-priceInput">
                    <label>
                      <span>￥</span>
                      <input type="number" onKeypress="if(event.key === 'Backspace') return; return (/[\d]/.test(String.fromCharCode(event.keyCode || event.charCode)))" placeholder="价格"
                             v-model="priceInputStart" oninput="if(value.length>5)value=value.slice(0,5)" @focus="displayConfirmButton"/>
                    </label>
                    <label>
                      <span>￥</span>
                      <input type="number" onKeypress="if(event.key === 'Backspace') return; return (/[\d]/.test(String.fromCharCode(event.keyCode || event.charCode)))" placeholder="价格"
                             v-model="priceInputEnd" oninput="if(value.length>5)value=value.slice(0,5)" @focus="displayConfirmButton"/>
                    </label>
                    <el-button size="mini" class="novalue" :type="selectPriceLabels.length > 0 ? '' : 'primary'" @click="handleSearch" v-show="confirmButtonVisible">确定</el-button>
                  </span>
                </el-checkbox-group>
              </div>
              <el-button slot="reference" @click="priceVisible = true">
                <span v-if="selectPriceLabels.length == 0">不限 </span>
                <span v-else-if="selectPriceLabels.length <= 1">
                  <span v-for="item in selectPriceLabels" :key="item.index">{{item.text}}</span>
                </span>
                <span v-else>
                  已选
                  <span>{{selectPriceLabels.length}}</span>
                  项
                </span>
                <i class="el-icon-arrow-down"></i>
              </el-button>
            </el-popover>
          </el-col>
          <el-col :span="3" class="search-select-item">
            <span class="search-select-title">级别筛选</span>
            <el-popover class="search-select-icon" trigger="click" width="205" v-model="starVisible">
              <div class="search-select-options">
                <span class="options-close" @click="starVisible = false">
                  <i class="el-icon-close"></i>
                </span>
                <span class="options-title">级别</span>
                <el-checkbox-group v-model="starArr" size="mini">
                  <el-checkbox-button v-for="item in starLabels" :label="item.label" :key="item.label" @click.native.prevent="starGroupCheck(item)">
                    {{item.text}}
                  </el-checkbox-button>
                  <el-button size="mini" class="novalue" :type="selectStarLabels.length > 0 ? '' : 'primary'" @click="starReset">不限</el-button>
                </el-checkbox-group>
              </div>
              <el-button slot="reference" @click="starVisible = true">
                <span v-if="selectStarLabels.length == 0">不限 </span>
                <span v-else-if="selectStarLabels.length <= 1">
                  <span v-for="item in selectStarLabels" :key="item.index">
                    {{item.text}}
                  </span>
                </span>
                <span v-else>
                  已选
                  <span>
                    {{selectStarLabels.length}}
                  </span>
                  项
                </span>
                <i class="el-icon-arrow-down"></i>
              </el-button>
            </el-popover>
          </el-col>
          <el-col :span="6" class="search-select-item">
            <span class="search-select-title">品牌筛选</span>
            <el-popover class="search-select-icon" trigger="click" width="306" v-model="brandVisible">
              <div class="search-select-options">
                <span class="options-close" @click="brandVisible = false">
                  <i class="el-icon-close"></i>
                </span>
                <span class="options-title">品牌</span>
                <p v-if="this.brandLabels.length === 0">请先选择级别</p>
                <el-checkbox-group v-model="brandArr" size="mini">
                  <el-checkbox-button v-for="item in brandLabels" :label="item.label" :key="item.label" @click.native.prevent="brandGroupCheck(item)">
                    {{item.text}}
                  </el-checkbox-button>
                  <el-button size="mini" class="novalue" :type="selectBrandLabels.length > 0 ? '' : 'primary'" @click="brandReset" v-if="brandLabels.length > 0">不限</el-button>
                </el-checkbox-group>
              </div>
              <el-button slot="reference" @click="brandVisible = true">
                <span v-if="selectBrandLabels.length == 0">不限 </span>
                <span v-else-if="selectBrandLabels.length <= 3">
                  <span v-for="item in selectBrandLabels" :key="item.index">
                    {{item.text}}
                  </span>
                </span>
                <span v-else>
                  已选
                  <span>
                    {{selectBrandLabels.length}}
                  </span>
                  项
                </span>
                <i class="el-icon-arrow-down"></i>
              </el-button>
            </el-popover>
          </el-col>
          <el-col :span="6" class="search-select-item">
            <span class="search-select-title">酒店设施和服务</span>
            <el-popover class="search-select-icon" trigger="click" width="232" v-model="facilitiesVisible">
              <div class="search-select-options">
                <span class="options-close" @click="facilitiesVisible = false">
                  <i class="el-icon-close"></i>
                </span>
                <span class="options-title">设施</span>
                <el-checkbox-group v-model="facilitiesArr" size="mini">
                  <el-checkbox-button v-for="item in facilitiesLabels" :label="item.label" :key="item.label" @click.native.prevent="facilitiesGroupCheck(item)">
                    {{item.text}}
                  </el-checkbox-button>
                </el-checkbox-group>
                <span class="options-title">服务</span>
                <el-checkbox-group v-model="facilitiesArr" size="mini">
                  <el-checkbox-button v-for="item in serviceLabels" :label="item.label" :key="item.label" @click.native.prevent="facilitiesGroupCheck(item)">
                    {{item.text}}
                  </el-checkbox-button>
                  <el-button size="mini" class="novalue" :type="selectFacilitiesLabels.length > 0 ? '' : 'primary'" @click="facilitiesReset">不限</el-button>
                </el-checkbox-group>
              </div>
              <el-button slot="reference" @click="facilitiesVisible = true">
                <span v-if="selectFacilitiesLabels.length == 0">不限 </span>
                <span v-else-if="selectFacilitiesLabels.length <= 4">
                  <span v-for="item in selectFacilitiesLabels" :key="item.index">
                    {{item.text}}
                  </span>
                </span>
                <span v-else>
                  已选
                  <span>
                    {{selectFacilitiesLabels.length}}
                  </span>
                  项
                </span>
                <i class="el-icon-arrow-down"></i>
              </el-button>
            </el-popover>
          </el-col>
          <el-col :span="6" class="search-select-item">
            <span class="search-select-title">酒店位置区域</span>
            <el-popover class="search-select-icon" trigger="click" width="290" v-model="areaVisible">
              <div class="search-select-options">
                <span class="options-close" @click="areaVisible = false">
                  <i class="el-icon-close"></i>
                </span>
                <span class="options-title">区域</span>
                <el-checkbox-group v-model="areaArr" size="mini">
                  <el-checkbox-button v-for="item in areaLabels" :label="item.label" :key="item.label" @click.native.prevent="areaGroupCheck(item)">
                    {{item.text}}
                  </el-checkbox-button>
                  <el-button size="mini" class="novalue" :type="selectAreaLabels.length > 0 ? '' : 'primary'" @click="areaReset">不限</el-button>
                </el-checkbox-group>
              </div>
              <el-button slot="reference" @click.native.prevent="areaClick()">
                <span v-if="selectAreaLabels.length == 0">不限 </span>
                <span v-else-if="selectAreaLabels.length <= 3">
                  <span v-for="item in selectAreaLabels" :key="item.label">
                    {{item.text}}
                  </span>
                </span>
                <span v-else>
                  已选
                  <span>
                    {{selectAreaLabels.length}}
                  </span>
                  项
                </span>
                <i class="el-icon-arrow-down"></i>
              </el-button>
            </el-popover>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="hotel-list">
      <div class="list-sort-method-scroll">
        <div class="list-sort-method-wrapper" >
          <div class="list-sort-method" :class="isSortFixed ? 'sort-fixed-class' : ''">
            <div class="list-sort-fixed">
              <span class="sort-method-default" :class="isDefaultClicked ? 'sort-this' : ''" @click="defaultSort">默认排序</span>
              <span class="sort-method-price" :class="isPriceClicked ? 'sort-this' : ''" @click="priceSort">
                价格<span v-if="!isPriceClicked">排序</span>
                <span v-if="isPriceAsc === 1">&nbsp;低 → 高</span>
                <span v-if="isPriceAsc === 2">&nbsp;高 → 低</span>
              </span>
              <span class="sort-method-price" :class="isSaleClicked ? 'sort-this' : ''" @click="saleSort">
                销量<span v-if="!isSaleClicked">排序</span>
                <span v-if="isSaleAsc === 1">&nbsp;低 → 高</span>
                <span v-if="isSaleAsc === 2">&nbsp;高 → 低</span>
              </span>
              <span class="sort-method-price" :class="isScoreClicked ? 'sort-this' : ''" @click="scoreSort">
                评分<span v-if="!isScoreClicked">排序</span>
                <span v-if="isScoreAsc === 1">&nbsp;低 → 高</span>
                <span v-if="isScoreAsc === 2">&nbsp;高 → 低</span>
              </span>
              <span class="list-length-wrapper">{{hotelData.totalCount}}家符合条件的酒店</span>
            </div>
          </div>
          <div class="hotel-list-content-wrapper">
            <div class="hotel-list-content">
              <ul class="hotel-list-items" v-loading="loading">
                <li class="hotel-list-item" v-for="item in hotelData.results" :key="item.index">
                  <div class="list-img-cover">
                    <img :src="fomatImg(item.headImage)" alt="">
                    <span class="image-cover fontaddr" v-if="item.hotelLevel">{{item.hotelLevel}}</span>
                  </div>
                  <div class="list-hotel-info">
                    <div class="hotel-title-cover" @mouseover="mouseOverMap(item)">
                      <span class="hotel-title" @click="toHotelDetail(item)">{{item.hotelName}}</span>
                    </div>
                    <div class="hotel-address-cover">
                      <span class="hotel-address fontaddr">{{item.addr}}</span>
                      <a class="hotel-map-btn fontaddr" @click="showMap(item.location.lon, item.location.lat, item.hotelName)">
                        <i class="iconfont">&#xe616;</i>查看地图
                      </a>
                    </div>
                    <div class="hotel-condition">
                      <div class="hotel-assess">
                        <span class="hotel-grade"><strong>{{item.score / 10}}</strong><span class="score">分</span></span>
                        <span class="hotel-people" v-if="item.commentCount && item.commentCount < 10000"><span class="number">{{item.commentCount}}</span>人气</span>
                        <span class="hotel-people" v-if="item.commentCount && item.commentCount >= 10000"><span class="number">{{Math.floor(item.commentCount/10000)}}</span>万+人气</span>
                        <span class="hotel-people" v-if="!item.commentCount"><span class="number">0</span>人气</span>
                      </div>
                      <div class="hotel-facilities-box">
                        <div class="hotel-facilities fontaddr" v-for="facility in item.facilities"  :key="facility.label">
                          <div v-if="facility.label === '商务服务'">
                            <img src="@/assets/boardroom.png" alt="">
                            <span>会议室</span>
                          </div>
                          <div v-if="facility.label === '休闲娱乐' && facility.values && facility.values.includes('健身室')">
                            <img src="@/assets/bodybuilding.png" alt="">
                            <span>健身房</span>
                          </div>
                          <!-- <div v-if="facility.label === '有线上网'">
                            <img src="@/assets/commputer.png" alt="">
                            <span>有线上网</span>
                          </div> -->
                          <div v-if="facility.label === '前台服务' && facility.values && facility.values.includes('行李寄存')">
                            <img src="@/assets/deposit.png" alt="">
                            <span>行李寄存</span>
                          </div>
                          <div v-if="facility.label === '交通设施'">
                            <img src="@/assets/park.png" alt="">
                            <span>停车场</span>
                          </div>
                          <div v-if="facility.label === '餐饮服务'">
                            <img src="@/assets/restaurant.png" alt="">
                            <span>餐厅</span>
                          </div>
                        </div>
                        <div class="hotel-facilities fontaddr">
                          <div>
                            <img src="@/assets/wifi.png" alt="">
                            <span>无线上网</span>
                          </div>
                        </div>
                        <div class="hotel-facilities fontaddr">
                          <div>
                            <img src="@/assets/commputer.png" alt="">
                            <span>有线上网</span>
                          </div>
                        </div>
                        <div class="hotel-facilities fontaddr">
                          <div>
                            <img src="@/assets/hair.png" alt="">
                            <span>吹风机</span>
                          </div>
                        </div>
                        <div class="hotel-facilities fontaddr">
                          <div>
                            <img src="@/assets/shower.png" alt="">
                            <span>热水洗澡</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="hotel-label-info">
                      <!--<span class="hotel-label-xd">续订优惠</span>-->
                      <span class="hotel-label fontaddr">商务出行</span>
                      <span class="hotel-label fontaddr">休闲度假</span>
                      <span v-for="(text, index) in item.commentLable" :key="text">
                        <span class="hotel-green-label fontaddr" v-if="index < 5">
                          {{text}}
                        </span>
                      </span>
                      <!--<div class="hotel-distance">-->
                      <!--<img src="@/assets/train.png" alt="">-->
                      <!--<span>距离火车站1.2km</span>-->
                      <!--</div>-->
                    </div>
                  </div>
                  <div class="list-gohotel-cover">
                    <div class="hotel-price-cover" v-if="!item.priceLevel">
                      促销价
                    </div>
                    <div class="hotel-price-cover" v-else-if="item.priceLevel">
                      <span class="price-rmb">￥</span>{{item.priceLevel/100}}<span class="price-start fontaddr">起</span>
                    </div>
                    <el-button class="hotel-gohotel-btn" type="primary" @click="toHotelDetail(item)">查看详情</el-button>
                    <!--<span class="price-reserve">5分钟前有人预定</span>-->
                  </div>
                </li>
              </ul>
              <TablePagination :pageIndex="pageIndex" :tableCount="hotelData.totalCount" :getList="getHotelList"/>
            </div>
          </div>
        </div>
        <div class="hotel-map" :class="isMapFixed ? 'map-fixed-class' : ''">
          <BMap class="map" :longitude="lonArr" :latitude="latArr"
                :name="nameArr" :isShowControl="false"></BMap>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {dateFormat, dataFormatWeek} from '@/util/lobal.js'
  import CityList from '@/components/CityList.vue'
  import {loadList} from '@/api/wxResign'
  import {mapGetters, mapMutations} from 'vuex'
  import TablePagination from '@/components/TablePagination.vue'
  import BMap from '@/components/BMap.vue'
  import {increaseMonth} from '@/util/util.js'
  import {setStore, getStore} from '@/util/store'
  import KeywordSearch from '@/components/KeywordSearch'
  import {getBusiZoneList} from '@/api/city'

  export default {
    name: 'HotelList',
    components: {
      CityList,
      TablePagination,
      BMap,
      KeywordSearch
    },
    props: {
      userInfo: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        focus: new Array(2).fill(false),
        latArr: [],
        lonArr: [],
        nameArr: [],
        maxPrice: null,
        minPrice: null,
        startWeek: '',
        endWeek: '',
        priceVisible: false,
        starVisible: false,
        brandVisible: false,
        facilitiesVisible: false,
        areaVisible: false,
        referentialDate: Date.now() + this.timeOffset,
        today: new Date(Date.now()),
        pickerToday: {
          disabledDate: time => {
            return time.getTime() < this.referentialDate - 8.64e7 || time.getTime() > increaseMonth(this.today, 2) + this.timeOffset
          }
        },
        reference: "<h1>标题</h1>",
        pickerTomorrow: {
          disabledDate: time => {
            return time <= this.inputValue.startDate || time.getTime() > increaseMonth(this.today, 2) + this.timeOffset + 8.64e7
          }
        },
        priceLabels: [
          {text: '￥200以下', label: '0-20000'},
          {text: '￥200-￥300', label: '20000-30000'},
          {text: '￥300-￥500', label: '30000-50000'},
          {text: '￥500-￥800', label: '50000-80000'},
          {text: '￥800以上', label: '80000-999999999'}
        ],
        priceArr: [],
        selectPriceLabels: [],
        priceInputStart: '',
        priceInputEnd: '',
        starLabels: [
          {text: '经济连锁', label: '1'},
          {text: '舒适快捷', label: '2'},
          {text: '高档精品', label: '3'},
          {text: '豪华五星', label: '4'}
        ],
        starArr: [],
        selectStarLabels: [],
        brandLabels: [],
        brand_JJLS: [
          {text: '如家', label: '如家'},
          {text: '汉庭', label: '汉庭'},
          {text: '派柏', label: '派柏'},
          {text: '桔子', label: '桔子'},
          {text: '速8', label: '速8'},
          {text: '锦江之星', label: '锦江之星'},
          {text: '华驿', label: '华驿'},
          {text: '格林豪泰', label: '格林豪泰'},
          {text: '布丁', label: '布丁'},
          {text: '莫泰', label: '莫泰'}
        ],
        brand_SSKJ: [
          {text: '桔子精选', label: '桔子精选'},
          {text: '智尚', label: '智尚'},
          {text: '曼居', label: '曼居'},
          {text: '柏曼', label: '柏曼'},
          {text: '智选假日', label: '智选假日'},
          {text: '星程', label: '星程'},
          {text: '全季', label: '全季'},
          {text: '如家商旅', label: '如家商旅'},
          {text: '如家精选', label: '如家精选'},
          {text: '麗枫', label: '麗枫'}
        ],
        brand_GDJP: [
          {text: '维景', label: '维景'},
          {text: '华天', label: '华天'},
          {text: '今旅', label: '今旅'},
          {text: '中奥凯富', label: '中奥凯富'},
          {text: '日航国际', label: '日航国际'},
          {text: '辉盛阁', label: '辉盛阁'},
          {text: '君莱', label: '君莱'},
          {text: '雅乐轩', label: '雅乐轩'},
          {text: '中州', label: '中州'},
          {text: '万怡', label: '万怡'}
        ],
        brand_HHWX: [
          {text: '皇冠假日', label: '皇冠假日'},
          {text: '维景国际', label: '维景国际'},
          {text: '凯宾斯基', label: '凯宾斯基'},
          {text: '世纪金源', label: '世纪金源'},
          {text: '希尔顿', label: '希尔顿'},
          {text: '香格里拉', label: '香格里拉'},
          {text: 'JW万豪', label: 'JW万豪'},
          {text: '威斯汀', label: '威斯汀'},
          {text: '洲际', label: '洲际'},
          {text: '万丽', label: '万丽'}
        ],
        brandArr: [],
        selectBrandLabels: [],
        facilitiesLabels: [
          {text: '商务中心', label: '商务中心'},
          {text: '健身房', label: '健身室'},
          {text: '游泳池', label: '游泳池'},
          {text: '高尔夫球场', label: '高尔夫球场'}
        ],
        serviceLabels: [
          {text: '洗衣', label: '洗衣'},
          {text: '停车', label: '停车'},
          {text: '餐饮', label: '餐厅'},
          {text: '会议', label: '会议'}
        ],
        facilitiesArr: [],
        selectFacilitiesLabels: [],
        areaLabels: [],
        areaArr: [],
        selectAreaLabels: [],
        hotelData: {
          totalCount: 0,
          results: []
        },
        inputValue: {},
        op: null,
        isDefaultClicked: true,
        isPriceClicked: false,
        isSaleClicked: false,
        isScoreClicked: false,
        isPriceAsc: 0,
        isSaleAsc: 0,
        isScoreAsc: 0,
        sort: null,
        isShow: false,
        loading: false,
        searchButton: false,
        pageIndex: 1,
        isSearchFixed: false,
        isSortFixed: false,
        isMapFixed: false,
        headerHeight: 0,
        sortTopHeight: 0,
        confirmButtonVisible: false,
      }
    },
    computed: {
      ...mapGetters(['accountId', 'timeOffset', 'cityList']),
      handleSelected() {
        if (this.priceArr.length === 0 && this.priceInputStart === '' && this.priceInputEnd === '') {
          return 'selected'
        } else {
          return ''
        }
      }
    },
    watch: {
      timeOffset(value) {
        this.referentialDate = Date.now() + value
      },
      accountId (value) {
        if (value.length > 0) {
          this.initGetDate()
        }
      }
    },
    created() {
      window.globelEvent.$on('hotel', hotelId => {
        setStore({
          name: 'HotelDetail',
          content: {
            hotelId: hotelId,
            startDate: dateFormat(this.inputValue.startDate, 'yyyy-MM-dd'),
            endDate: dateFormat(this.inputValue.endDate, 'yyyy-MM-dd'),
          }
        });
        setTimeout(() => {
          this.$router.push({
            name: 'HotelDetail'
          })
        }, 100)
      });
      window.globelEvent.$on('cityId', cityId => {
        this.inputValue.cityId = cityId;
        this.areaVisible = false;
        this.areaLabels = [];
        this.selectAreaLabels = [];
        this.areaArr = [];
      });
      let HomeQuery = getStore({name: 'HomeQuery1'});
      this.inputValue = {...HomeQuery};
      this.inputValue.startDate = new Date(HomeQuery.startDate.replace(/-/g, '/'));
      this.inputValue.endDate = new Date(HomeQuery.endDate.replace(/-/g, '/'));
      this.startWeek = dataFormatWeek(this.inputValue.startDate);
      this.endWeek = dataFormatWeek(this.inputValue.endDate);
      if (this.inputValue.star !== '') {
				this.starArr = [this.inputValue.star];
				this.selectStarLabels = [this.starLabels[this.inputValue.star-1]];
			}
    },
    mounted() {
      this.loading = true;
      if (this.userInfo.status) {
        if (this.accountId.length > 0) {
          this.initGetDate()
        }
      } else {
        this.$router.push('/')
      }
      this.headerHeight = document.getElementsByClassName('tenzont-header-bg')[0].scrollHeight;
      this.sortTopHeight = this.headerHeight + document.getElementsByClassName('hotel-search-sub-wrapper')[0].scrollHeight + 21;
      window.addEventListener('scroll', this.handleScroll)
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      setFocus (n, v) {
        console.log(n, v)
        this.$set(this.focus, n, v)
      },
      initGetDate () {
        loadList({
//					...this.inputValue,
          area: this.areaArr,
          cityId: this.inputValue.cityId,
          facility: this.facilitiesArr,
          hotelBrand: this.brandArr,
          hotelLevel: parseInt(this.starArr[0]),
          keyWord: this.inputValue.keywords,
          limit: 10,
          maxPrice: this.maxPrice,
          minPrice: this.minPrice,
          page: 1,
          sortField: this.sort,
          sortType: this.op,
        }).then(res => {
          this.latArr = [];
          this.lonArr = [];
          this.nameArr = [];
          this.loading = false;
          if (res.data.code === 0) {
            if (res.data.data.totalCount === 0) {
              this.$message('很抱歉，该搜索条件下没找到符合您要求的酒店，试试其他搜索条件吧。');
            } else {
              for (let hotel of res.data.data.results) {
                if (hotel.location) {
                  this.latArr.push(hotel.location.lat);
                  this.lonArr.push(hotel.location.lon);
                  this.nameArr.push(hotel.hotelName);
                }
              }
              this.latArr.reverse();
              this.lonArr.reverse();
              this.nameArr.reverse();
            }
            this.hotelData = {...res.data.data}
          } else {
            if (res.data.msg) {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          }
        });
      },
      handleScroll() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop >= this.headerHeight) {
          this.isSearchFixed = true
        } else {
          this.isSearchFixed = false
        }
        if (scrollTop >= this.sortTopHeight) {
          this.isSortFixed = true;
        } else {
          this.isSortFixed = false;
        }
        if (scrollTop >= this.sortTopHeight + 62) {
          this.isMapFixed = true;
        } else {
          this.isMapFixed = false;
        }
      },
      changeStartDate(value) {
        let endTime = this.inputValue.endDate;
        if (undefined !== endTime) {
          if (value.getTime() >= endTime.getTime()) {
            this.inputValue.endDate = new Date(value.getTime() + 86400000)
          }
        }
        this.startWeek = dataFormatWeek(this.inputValue.startDate);
        this.endWeek = dataFormatWeek(this.inputValue.endDate);
      },
      changeEndDate() {
        this.startWeek = dataFormatWeek(this.inputValue.startDate);
        this.endWeek = dataFormatWeek(this.inputValue.endDate);
      },
      ...mapMutations(['setState']),
      mapCity() {
        let isCityMap = false;
        for (let i = 0; i < this.cityList.list.citys.length; i++) {
          if (this.cityList.list.citys[i].indexOf(this.inputValue.city.toLocaleLowerCase()) > -1) {
            isCityMap = true
          }
        }
        return isCityMap
      },
      getHotelList({
         area = this.areaArr,
         cityId = this.inputValue.cityId,
         facility = this.facilitiesArr,
         hotelBrand = this.brandArr,
         hotelLevel = parseInt(this.starArr[0]),
         keyWord = this.inputValue.keywords,
         limit = 10,
         maxPrice = this.maxPrice,
         minPrice = this.minPrice,
         page = 1,
         sortField = this.sort,
         sortType = this.op,
       } = {}) {
        if (this.inputValue.city === '') {
          this.isShow = !this.isShow;
          this.$message({
            message: '请选择城市！',
            type: 'warning'
          })
        } else {
          this.loading = true;
          this.searchButton = true;
          this.hotelData = {
            totalCount: 0,
            results: []
          };
          cityId = this.inputValue.cityId;
          loadList({
            area,
            cityId,
            facility,
            hotelBrand,
            hotelLevel,
            keyWord,
            limit,
            maxPrice,
            minPrice,
            page,
            sortField,
            sortType,
          }).then(res => {
            this.latArr = [];
            this.lonArr = [];
            this.nameArr = [];
            this.loading = false;
            this.searchButton = false;
            if (res.data.code === 0) {
              if (res.data.data.totalCount === 0) {
                this.$message('很抱歉，该搜索条件下没找到符合您要求的酒店，试试其他搜索条件吧。');
              } else {
                for (let hotel of res.data.data.results) {
                  if (hotel.location) {
                    this.latArr.push(hotel.location.lat);
                    this.lonArr.push(hotel.location.lon);
                    this.nameArr.push(hotel.hotelName);
                  }
                }
                this.latArr.reverse();
                this.lonArr.reverse();
                this.nameArr.reverse();
              }
              this.pageIndex = page;
              this.hotelData = {...res.data.data}
            } else {
              if (res.data.msg) {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            }
          })
        }
      },
      priceGroupCheck(item) {
        if (this.priceArr[0] === item.label) {
          this.priceArr = [];
          this.selectPriceLabels = [];
          this.minPrice = null;
          this.maxPrice = null;
        } else {
          this.priceArr = [item.label];
          this.selectPriceLabels = [item];
          this.minPrice = item.label.split('-')[0];
          this.maxPrice = item.label.split('-')[1];
        }
        this.priceInputStart = '';
        this.priceInputEnd = '';
        this.getHotelList()
      },
      starGroupCheck(item) {
        if (this.starArr[0] === item.label) {
          this.starArr = [];
          this.selectStarLabels = [];
          this.brandLabels = [];
        } else {
          this.starArr = [item.label];
          this.selectStarLabels = [item];
          if ('1' === item.label) {
            this.brandLabels = this.brand_JJLS;
          }
          if ('2' === item.label) {
            this.brandLabels = this.brand_SSKJ;
          }
          if ('3' === item.label) {
            this.brandLabels = this.brand_GDJP;
          }
          if ('4' === item.label) {
            this.brandLabels = this.brand_HHWX;
          }
        }
        this.brandArr = [];
        this.selectBrandLabels = [];
        this.getHotelList();
      },
      brandGroupCheck(item) {
        let flag = true;
        let index = 0;
        for (let i = 0; i < this.brandArr.length; i++) {
          if (this.brandArr[i] === item.label) {
            flag = false;
            index = i;
            break;
          }
        }
        if (flag && this.selectBrandLabels.length < 3) {
          this.brandArr.push(item.label);
          this.selectBrandLabels.push(item);
          this.getHotelList();
        } else if (!flag) {
          this.brandArr.splice(index, 1);
          this.selectBrandLabels.splice(index, 1);
          this.getHotelList();
        } else {
          this.$message('最多只能选择三项');
        }
      },
      facilitiesGroupCheck(item) {
        let flag = true;
        let index = 0;
        for (let i = 0; i < this.facilitiesArr.length; i++) {
          if (this.facilitiesArr[i] === item.label) {
            flag = false;
            index = i;
            break;
          }
        }
        if (flag && this.selectFacilitiesLabels.length < 3) {
          this.facilitiesArr.push(item.label);
          this.selectFacilitiesLabels.push(item);
          this.getHotelList();
        } else if (!flag) {
          this.facilitiesArr.splice(index, 1);
          this.selectFacilitiesLabels.splice(index, 1);
          this.getHotelList();
        } else {
          this.$message('最多只能选择三项');
        }
      },
      areaGroupCheck(item) {
        let flag = true;
        let index = 0;
        for (let i = 0; i < this.areaArr.length; i++) {
          if (this.areaArr[i] === item.label) {
            flag = false;
            index = i;
            break;
          }
        }
        if (flag && this.selectAreaLabels.length < 3) {
          this.areaArr.push(item.label);
          this.selectAreaLabels.push(item);
          this.getHotelList();
        } else if (!flag) {
          this.areaArr.splice(index, 1);
          this.selectAreaLabels.splice(index, 1);
          this.getHotelList();
        } else {
          this.$message('最多只能选择三项');
        }
      },
      areaClick() {
        this.areaVisible = true;
        this.areaLabels = [];
        if (this.inputValue.cityId > 0) {
          getBusiZoneList({
            areaId: this.inputValue.cityId
          }).then(res => {
            if (res.data.code === 0) {
              for (let areaItem of res.data.data) {
                this.areaLabels.push({label: areaItem.id, text: areaItem.name.split('|')[0]});
              }
            }
          })
        } else {
          this.$message({
            message: '请选择城市！',
            type: 'warning'
          })
        }
      },
      priceReset() {
        this.priceArr = [];
        this.selectPriceLabels = [];
        this.maxPrice = null;
        this.minPrice = null;
        this.getHotelList();
      },
      starReset() {
        this.starArr = [];
        this.selectStarLabels = [];
        this.brandArr = [];
        this.selectBrandLabels = [];
        this.brandLabels = [];
        this.getHotelList();
      },
      facilitiesReset() {
        this.facilitiesArr = [];
        this.selectFacilitiesLabels = [];
        this.getHotelList();
      },
      brandReset() {
        this.brandArr = [];
        this.selectBrandLabels = [];
        this.getHotelList();
      },
      areaReset() {
        this.areaArr = [];
        this.selectAreaLabels = [];
        this.getHotelList();
      },
      handleSearch() {
        if (!this.priceInputStart && !this.priceInputEnd) {
          this.selectPriceLabels = [];
          this.priceArr = [];
          this.minPrice = null;
          this.maxPrice = null;
        }
        if (this.priceInputStart && this.priceInputEnd) {
          this.priceArr = [`${this.priceInputStart}00-${this.priceInputEnd}00`];
          this.selectPriceLabels = [{
            text: `￥${this.priceInputStart}-￥${this.priceInputEnd}`,
            label: `${this.priceInputStart}00-${this.priceInputEnd}00`
          }];
          this.minPrice = parseInt(`${this.priceInputStart}00`);
          this.maxPrice = parseInt(`${this.priceInputEnd}00`);
        } else if (!this.priceInputStart && this.priceInputEnd) {
          this.priceArr = [`0-${this.priceInputEnd}00`];
          this.selectPriceLabels = [{text: `￥0-￥${this.priceInputEnd}`, label: `0-${this.priceInputEnd}00`}];
          this.minPrice = 0;
          this.maxPrice = parseInt(`${this.priceInputEnd}00`);
        }
        else if (this.priceInputStart && !this.priceInputEnd) {
          this.priceArr = [`${this.priceInputStart}00-2000000`];
          this.selectPriceLabels = [{
            text: `￥${this.priceInputStart}-￥20000`,
            label: `${this.priceInputStart}00-2000000`
          }];
          this.minPrice = parseInt(`${this.priceInputStart}00`);
          this.maxPrice = 2000000;
        }
        if (this.priceInputEnd && parseInt(this.priceInputStart) > parseInt(this.priceInputEnd)) {
          let startPrice = this.priceInputStart;
          let endPrice = this.priceInputEnd;
          this.priceInputStart = endPrice;
          this.priceInputEnd = startPrice;
          this.priceArr = [`${this.priceInputStart}00-${this.priceInputEnd}00`];
          this.selectPriceLabels = [{
            text: `￥${this.priceInputStart}-￥${this.priceInputEnd}`,
            label: `${this.priceInputStart}00-${this.priceInputEnd}00`
          }];
          this.minPrice = parseInt(`${this.priceInputStart}00`);
          this.maxPrice = parseInt(`${this.priceInputEnd}00`);
        }
        this.getHotelList()
      },
      displayConfirmButton() {
        this.confirmButtonVisible = true
      },
      concealConfirmButton() {
        this.confirmButtonVisible = false
      },
      defaultSort() {
        this.isPriceClicked = false;
        this.isSaleClicked = false;
        this.isScoreClicked = false;
        this.isPriceAsc = 0;
        this.isSaleAsc = 0;
        this.isScoreAsc = 0;
        this.op = null;
        this.sort = null;
        this.isDefaultClicked = true;
        this.getHotelList()
      },
      priceSort() {
        this.isDefaultClicked = false;
        this.isPriceClicked = true;
        this.isSaleClicked = false;
        this.isScoreClicked = false;
        this.isSaleAsc = 0;
        this.isScoreAsc = 0;
        this.sort = 'priceLevel';
        if (this.isPriceAsc === 0 || this.isPriceAsc === 1) {
          this.isPriceAsc = 2;
          this.op = 'desc'
        } else if (this.isPriceAsc === 2) {
          this.isPriceAsc = 1;
          this.op = 'asc'
        }
        this.getHotelList()
      },
      saleSort() {
        this.isDefaultClicked = false;
        this.isSaleClicked = true;
        this.isPriceClicked = false;
        this.isScoreClicked = false;
        this.isPriceAsc = 0;
        this.isScoreAsc = 0;
        this.sort = 'commentCount';
        if (this.isSaleAsc === 0 || this.isSaleAsc === 1) {
          this.isSaleAsc = 2;
          this.op = 'desc'
        } else if (this.isSaleAsc === 2) {
          this.isSaleAsc = 1;
          this.op = 'asc'
        }
        this.getHotelList()
      },
      scoreSort() {
        this.isDefaultClicked = false;
        this.isScoreClicked = true;
        this.isPriceClicked = false;
        this.isSaleClicked = false;
        this.isPriceAsc = 0;
        this.isSaleAsc = 0;
        this.sort = 'score';
        if (this.isScoreAsc === 0 || this.isScoreAsc === 1) {
          this.isScoreAsc = 2;
          this.op = 'desc'
        } else if (this.isScoreAsc === 2) {
          this.isScoreAsc = 1;
          this.op = 'asc'
        }
        this.getHotelList()
      },
      ...mapMutations(['setState']),
      showMap(x, y, hotelName) {
        this.setState({
          key: 'showMap',
          module: 'common',
          value: true
        });
        setTimeout(() => {
          let BMap = window.BMap;
          let map = window.map;
          let point = new BMap.Point(x, y);
          let size = new BMap.Size(20);
          let marker = new BMap.Marker(point);
          let label = new BMap.Label(hotelName, {
            offset: size
          });
          label.setStyle({fontSize: "14px"});
          map = new BMap.Map("tenzont-map");
          map.centerAndZoom(point, 20);
          marker.setLabel(label);
          map.addOverlay(marker);
          marker.setAnimation(window.BMAP_ANIMATION_BOUNCE);
          marker.addEventListener('click', () => {
            map.centerAndZoom(point, 20)
          });
          map.addControl(new BMap.NavigationControl({
            anchor: window.BMAP_ANCHOR_TOP_RIGHT
          }));
          map.enableScrollWheelZoom(true)
        }, 100)
      },
      fomatImg(src) {
        if (!src) {
          return require('@/assets/default_hotel.jpg')
        }
        return "https://hotelpic-1254071088.file.myqcloud.com/hotel_pic/" + src + ".jpeg"
      },
      toHotelDetail(item) {
        setStore({
          name: 'HotelDetail',
          content: {
            startDate: dateFormat(this.inputValue.startDate, 'yyyy-MM-dd'),
            endDate: dateFormat(this.inputValue.endDate, 'yyyy-MM-dd'),
            hotelId: item.id
          }
        });
        setTimeout(() => {
          window.open('/#/HotelDetail')
        }, 100)
      },
      mouseOverMap(item) {
        if (item.location) {
          let latIndex = this.latArr.indexOf(item.location.lat);
          this.latArr.splice(latIndex, 1);
          this.latArr.push(item.location.lat);

          let lonIndex = this.lonArr.indexOf(item.location.lon);
          this.lonArr.splice(lonIndex, 1);
          this.lonArr.push(item.location.lon);

          let nameIndex = this.nameArr.indexOf(item.hotelName);
          this.nameArr.splice(nameIndex, 1);
          this.nameArr.push(item.hotelName);
        }
      }
    }
  }
</script>

<style lang="less">
@import './style.less';
</style>