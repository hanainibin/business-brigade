<template>
  <div class="fly-list-wrapper">
    <div class="fly-search-main-scroll">
      <div class="fly-search-main-wrapper" :class="isSearchFixed ? 'search-fixed-class' : ''">
        <div class="fly-search-main">
          <el-row style="margin-bottom: 20px; width: 1180px; margin-left: 0; margin-right: 0; margin: 0 auto">
            <el-col :span="6" class="search-main-item" >
              <div @click="chooseCity1">
                <span class="search-input-icon">
                  出发地
                </span>
                <AirCityList ref="c1" v-model="inputValue.cityFrom" :isShow="isShow" :fromName="inputValue.cityFrom"/>
              </div>
            </el-col>
            <el-col :span="1" class="fly-book-iocn">
              <i ref="iconSwitch" :class="{active: inputValue.cityFrom.length > 0 && inputValue.cityTo.length > 0}" class="iconfont iconDetail" @click="switchCity()">&#xe629;</i>
            </el-col>
            <el-col :span="6" class="search-main-item">
              <div @click="chooseCity2">
                <span class="search-input-icon">
                  目的地
                </span>
                <AirCityList  ref="c2" v-model="inputValue.cityTo" :isShow="isShow1" @toId="toId"  :toName="inputValue.cityTo"/>
              </div>
            </el-col>
            <el-col :span="5" class="search-date-picker">
              <div class="search-main-item search-main-date search-main-startdate">
                <span class="search-input-icon">
                  出发日期
                </span>
                <el-date-picker v-model="startDate" type="date" placeholder="请选择出发时间"
                                prefix-icon="time-icon" :picker-options="pickerToday"
                                value-format="yyyy-MM-dd"
                                :clearable="false" class="search-date" :editable="false"/>
              </div>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-button class="search-main-button" size="medium" type="primary" @click="handleSearch" :disabled="searchButton">立即搜索</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="fly-list">
      <div class="list-length-wrapper">
        <div class="list-length">
        </div>
      </div>
      <div class="fly-list-content-wrapper">
        <div class="hotel-wrapper" :class="matched ? classTop:''">
          <div class="hot-head">
            <img src="@/assets/hot.png" alt="">
            {{chineseName.chineseTo}}热门酒店
          </div>  
          <div>精品商务酒店</div>                                
          <ul v-for="hotelItem in hotelData" :key="hotelItem.id">
            <li class="hotel-item" @click="toHotelDetail(hotelItem)">
              <div class="img-wrapper">
                <img :src="fomatImg(hotelItem.headImage)" alt="无图" class="hotel-img">
              </div>
              <span class="hotel-level" v-if="hotelItem.hotelLevel">{{hotelItem.hotelLevel}}</span>
              <div class="hotel-name">{{hotelItem.hotelName}}</div>
              <div class="bottom-item" style="color:red">
                <div class="hotel-score">{{(hotelItem.score/10).toFixed(1)}}</div>
                <div class="bottom-right" v-if="hotelItem.priceLevel">￥{{hotelItem.priceLevel/100}}起</div>
                <span class="bottom-right" v-if="!hotelItem.priceLevel">优惠价</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="fly-match" v-if="matched">无满足条件航班</div>
        <div class="fly-list-content">
          <div v-if="!matched">
            <div class="fly-head-desc">
              您已选择:{{chineseName.chineseFrom}}<img src="@/assets/plane.png"> {{chineseName.chineseTo}},{{dateFormat(new Date(inputValue.departureDate.replace(/-/g, '/')), 'MM月dd日')}}{{dataFormatWeek(new Date(inputValue.departureDate.replace(/-/g, '/')), 'MM月dd日')}}出发
            </div>
            <p class="fly-head-p">共为您搜索到{{airCount}}趟航班</p>
          </div>
          <div class="fly-list-head" v-if="!matched">
            <span style="width: 236px" class="head-item">航班信息</span>
            <span class="head-item">起飞时间</span>
            <span class="head-item">到达时间</span>
            <span style="width: 152px" class="head-item">有无经济舱</span>
            <span style="width: 152px" class="head-item">价格</span>
          </div>
          <ul class="fly-list-items" v-loading="loading">
            <li class="fly-list-item" v-for="(item, index) in airData" :key="item.index">
              <img class="air-logo" :src="formatImg(item.carrierCode)" alt="">
              <span class="flyNum">
                <span class="left-top">{{item.carrierName}} {{item.flightNo}}</span>
                <span class="left-bottom">
                  <span class="blue-button" v-if="item.airplaneType">{{item.airplaneType}}型客机</span>
                  <span class="plane-name">
                    {{item.airplaneName}}
                  </span>
                </span>
              </span>
              <div class="fly-time" v-if="item.departureTime">
                <span class="time"><b>{{item.departureTime.substring(10,16)}}</b></span>
                <div class="icon-time">
                  <p>{{gethhmm(item.departureTime, item.arrivalTime)}}</p>
                </div>
                <span class="time"><b>{{item.arrivalTime.substring(10,16)}}</b></span>
                <span class="fly-detail-button iconfont" @click="handleDetailOpen(index,detailLoading)" v-show="!isActive[index]" ref="iconUp" :id="forId(index)">&#xe664;</span>
                <span class="fly-detail-button iconfont" @click="handleDetailClose(index)" v-show="isActive[index]" ref="iconDown" :id="forId(index)">&#xe663;</span>
                <span style="display:none">{{noShow}}</span>
              </div>
              <div class="fly-airport">
                <span class="fly-airport-from">{{item.departureAirportName}}{{item.departureTermainalBuilding}}</span>
                <span class="fly-airport-to">{{item.arrivalAirportName}}{{item.arrivalTerminalBuilding}}</span>
              </div>
              <div class="fly-lowSeat">
                <!-- {{typeof (item.lowSeats.Y) == }} -->
                <span v-if="item.lowSeats.Y" class="lowseat">有经济舱</span>
                <span v-else class="lowseat">无经济舱</span>
              </div>
              <div class="list-gohotel-cover">
                <div class="fly-price-cover" v-if="item.lowSeats.Y">
                  <span class="price-rmb">￥</span>
                  {{item.lowSeats.Y.salesParPrice}}
                  <span class="price-start">起</span>
                </div>
                <div class="fly-price-cover" v-if="item.lowSeats.C && !item.lowSeats.Y">
                  <span class="price-rmb">￥</span>
                  {{item.lowSeats.C.salesParPrice}}
                  <span class="price-start">起</span>
                </div>
                <div class="fly-price-cover" v-if="item.lowSeats.F && !item.lowSeats.Y && !item.lowSeats.C">
                  <span class="price-rmb">￥</span>
                  {{item.lowSeats.F.salesParPrice}}
                  <span class="price-start">起</span>
                </div>
              </div>
              <collapse>
                <div class="fly-detail-wrapper" v-if="isActive[index]" ref="list" :id="forId(index)">
                  <div class="fly-detail-overlay">
                    <ul v-loading="detailLoading[index]">
                      <span class="no-sale" v-show="noSale[index]">票被抢光了，请刷新后重新选择</span>
                      <div class="fly-list-type">
                        <a v-if="airDetailData[index] && airDetailData[index].seatList[0].length > 0" @click="airDetailData[index].seatType = 0" :class="{active: airDetailData[index].seatType === 0}">经济舱</a>
                        <a v-if="airDetailData[index] && airDetailData[index].seatList[1].length > 0" @click="airDetailData[index].seatType = 1" :class="{active: airDetailData[index].seatType === 1}">商务舱/头等舱</a>
                      </div>
                      <li v-for="(detailItem, detailIndex) in airDetailData[index] && airDetailData[index].seatList" 
                          :key="detailItem.index">
                        <div v-for="detailListItem in detailItem" :key="detailListItem.index" v-if="airDetailData[index] && airDetailData[index].seatType === detailIndex" class="fly-detail-content">
                          <img class="air-logo" :src="formatImg(item.carrierCode)" alt="">
                          <span class="carrierName">{{item.carrierName}}</span>
                          <span class="jscp">极速出票</span>
                          <!-- <el-popover
                            placement="bottom"
                            title="行李额说明"
                            width="200"
                            trigger="hover"
                            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                            <div class="xlesm" slot="reference">行李额说明</div>
                          </el-popover> -->
                          <span class="fly-seatType fly-detail-item">{{detailListItem.seatClassName}}</span>
                          <span class="fly-airplaneName fly-detail-item">机建燃油费:{{airDetailData[index].adultFees +  '+' +airDetailData[index].adultTaxs}}</span>
                          <span class="fly-salesParPrice fly-detail-item">
                            <i>
                              <span style="margin-right: 10px;" v-if="Math.floor(detailListItem.discount*10) < 10 && detailListItem.discount >0">
                                {{ Math.floor(detailListItem.discount*100)/10 + '折' }}
                              </span>
                              <span v-else-if="detailListItem.discount == 0" style="margin-left: 10px;"></span>
                              <span style="margin-right: 10px;" v-else>
                                原价
                              </span>
                              ¥
                            </i>
                            {{detailListItem.salesPrice}}
                          </span>
                          <span class="fly-button-wrapper fly-detail-item">
                            <button class="fly-buy-button" @click="toOrderFly(airDetailData[index],detailListItem)">购票</button>
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </collapse>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./FlyList.js"></script>

<style lang="less">
@import './style.less';
</style>