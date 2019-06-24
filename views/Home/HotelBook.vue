<template>
  <div class="tenzont-hotel-book">
    <div class="hotel-book-div hotel-book-address">
      <span class="hotel-book-option">地点</span>
      <CityList v-model="inputValue.city" :isShow="isShow"/>
    </div>
    <div class="hotel-book-div hotel-book-time">
      <div class="book-time-div book-startdate" :class="{active: focus[0]}">
        <span class="hotel-book-option">入住</span>
        <el-date-picker
          class="book-time"
          :class="{active: focus[0]}"
          @blur="setFocus(0, false)" 
          @focus="setFocus(0, true)"
          v-model="inputValue.startDate"
          type="date"
          placeholder="请选择入住时间"
          prefix-icon="time-icon"
          :picker-options="pickerToday"
          @change="changeEndDate"
          :clearable="false"
          :editable="false"/>
      </div>
      <div class="book-time-div book-enddate" :class="{active: focus[1]}">
        <span class="hotel-book-option">离店</span>
        <el-date-picker
          class="book-time"
          :class="{active: focus[1]}"
          @blur="setFocus(1, false)" 
          @focus="setFocus(1, true)"
          v-model="inputValue.endDate"
          type="date"
          placeholder="请选择退房时间"
          prefix-icon="time-icon"
          :picker-options="pickerTomorrow"
          :clearable="false"
          :editable="false"/>
      </div>
    </div>
    <div class="hotel-book-div hotel-book-star" :data-status="focus[2]">
      <span class="hotel-book-option">星级</span>
      <el-select class="book-star-select" v-model="inputValue.star" placeholder="请选择星级" :class="{active: focus[2]}" @blur="setFocus(2, false)" @focus="setFocus(2, true)">
        <el-option
          v-for="item in starOptions" :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
    </div>
    <div class="hotel-book-div hotel-book-selecfill">
      <KeywordSearch v-model="inputValue.keywords" :cityId="inputValue.cityId"></KeywordSearch>
      <div class="book-search-cover">
        <button class="book-search" @click="handleSearch">立即搜索</button>
      </div>
    </div>
  </div>
</template>

<script>
import { imgSrcs, starOptions, tenzontAds, hotelShowHead } from "./data.js";
import { dateFormat } from "@/util/lobal.js";
import CityList from "@/components/CityList.vue";
import { setStore, getStore } from "@/util/store";
import { mapGetters, mapMutations } from "vuex";
import { increaseMonth } from "@/util/util.js";
import KeywordSearch from '@/components/KeywordSearch'

export default {
  name: 'HotelBook',
  components: {
    CityList,
    KeywordSearch
  },
  data() {
    return {
      focus: new Array(3).fill(false),
      isShow: false,
      imgSrcs,
      tenzontAds,
      hotelShowHead,
      hotelArr: [],
      hotelTag: "",
      inputValue: {
        city: getStore({name: 'HomeQuery1'}) ? getStore({name: 'HomeQuery1'}).city : '杭州',
        cityId: getStore({name: 'HomeQuery1'}) ? getStore({name: 'HomeQuery1'}).cityId : '330100',
        startDate: this.getToDay(),
        endDate: this.getTomorrowDay(this.getToDay()),
        keywords: "",
        star: ""
      },
      tapList: [{ title: "酒店预订" }, { title: "航班预订" }],
      tapToPage: [this.toHome, this.toFly, this.toAnchor],
      starOptions,
      cankaoDate: Date.now() + this.timeOffset,
      today: new Date(Date.now()),
      pickerToday: {
        disabledDate: time => {
          return (
            time.getTime() < this.cankaoDate - 8.64e7 ||
            time.getTime() > increaseMonth(this.today, 2) + this.timeOffset
          );
        }
      },
      pickerTomorrow: {
        disabledDate: time => {
          return (
            time <= this.inputValue.startDate ||
            time.getTime() >
              increaseMonth(this.today, 2) + this.timeOffset + 8.64e7
          );
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      "accountId",
      "timeOffset",
      "cityList",
      "userInfo",
      "wechatId"
    ])
  },
  watch: {
    timeOffset(value) {
      this.cankaoDate = Date.now() + value;
    }
  },
  created () {
    window.globelEvent.$on('cityId', cityId => {
      this.inputValue.cityId = cityId
    })
    window.globelEvent.$on('hotel', hotelId => {
      setStore({
        name: 'HotelDetail',
        content: {
          hotelId: hotelId,
          startDate: dateFormat(this.inputValue.startDate, 'yyyy-MM-dd'),
          endDate: dateFormat(this.inputValue.endDate, 'yyyy-MM-dd')
        }
      })
      setTimeout(() => {
        this.$router.push({
          name: 'HotelDetail'
        })
      }, 100)
    })
    window.globelEvent.$on('enter', () => {
      if (!this.inputValue.city) {
        return false;
      } else {
        this.handleSearch();
      }
    })
  },
  methods: {
    setFocus (n, v) {
      console.log(n, v)
      this.$set(this.focus, n, v)
    },
    getSearch() {
      let search = window.location.search;
      if (search.length > 0) {
        search = search.split("?")[1];
      }
      let searchArr = search.split("&");
      let searchObj = {};
      if (searchArr.length > 1) {
        for (let i = 0; i < searchArr.length; i++) {
          let searchI = searchArr[i].split("=");
          searchObj[searchI[0]] = searchI[1];
        }
      }
      return searchObj;
    },
    changeEndDate(value) {
      if (value.getTime() >= this.inputValue.endDate.getTime()) {
        this.inputValue.endDate = new Date(value.getTime() + 86400000);
      }
    },
    ...mapMutations(["setState"]),
    getTomorrowDay(today) {
      return new Date(today.getTime() + 24 * 60 * 60 * 1000);
    },
    getToDay() {
      let now = new Date(Date.now() + (this.timeOffset || 0));
      // if (now.getHours() >= 17) {
      //   now = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      // }
      return new Date(now.toDateString());
    },
    mapCity() {
      let isCityMap = false;
      for (let i = 0; i < this.cityList.list.citys.length; i++) {
        if (
          this.cityList.list.citys[i].indexOf(
            this.inputValue.city.toLocaleLowerCase()
          ) > -1
        ) {
          isCityMap = true;
        }
      }
      return isCityMap;
    },
    handleSearch() {
      console.log(this.accountId)
      if (this.accountId.length <= 0) {
        console.log(this.wechatId);
        if (
          this.wechatId &&
          this.wechatId.length > 0 &&
          window.location.pathname.includes("/wxlogin")
        ) {
          this.$store.state.user.bindMobileDialogVisible = true;
        } else {
          this.setState({
            key: "dialogLoginVisible",
            value: true,
            module: "user"
          });
        }
      } else {
        if (!this.inputValue.city || !this.inputValue.cityId) {
          this.isShow = !this.isShow;
          this.$message({
            message: "请选择城市！",
            type: "warning"
          });
        } else {
          setStore({
            name: "HomeQuery1",
            content: {
              city: this.inputValue.city,
              cityId: this.inputValue.cityId,
              startDate: dateFormat(
                this.inputValue.startDate,
                "yyyy-MM-dd"
              ),
              endDate: dateFormat(this.inputValue.endDate, "yyyy-MM-dd"),
              keywords: this.inputValue.keywords,
              star: this.inputValue.star
            }
          });
          setTimeout(() => {
            this.$router.push({
              name: "HotelList"
            });
          }, 100);
        }
      }
    }
  }
 }
</script>

<style lang="less" scoped>
</style>
