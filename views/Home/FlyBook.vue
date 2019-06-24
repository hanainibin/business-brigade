<template>
  <div class="tenzont-fly-book">
    <div class="fly-all-adress">
      <div class="fly-book-div fly-book-address fly-book-address-wrapper" @click="chooseCity1">
        <span class="fly-book-option">出发</span>
        <AirCityList ref="c1" class="fly-input" v-model="inputValue.airCityFrom" :isShow="isShow" @airFrom="airFrom" :fromName=" inputValue.airCityFrom"/>
      </div>
      <div class="fly-book-iocn">
        <i ref="iconSwitch" :class="{active: inputValue.airCityFrom.length > 0 && inputValue.cityTo.length > 0}" class="iconfont iconDetail" @click="switchCity()">&#xe629;</i>
      </div>
      <div class="fly-book-div fly-book-address fly-book-address-wrapper" @click="chooseCity2">
        <span class="fly-book-option">到达</span>
        <AirCityList ref="c2" class="fly-input" v-model="inputValue.cityTo" :isShow="isShow1" @airTo="airTo" @toId = 'toId' :toName=" inputValue.cityTo"/>
      </div>
    </div>
    <div class="fly-book-div fly-book-time" :class="{active: focus}">
      <div class="book-time-div fly-book-startdate">
        <span class="fly-book-option">日期</span>
        <el-date-picker
          class="book-time"
          :class="{active: focus}"
          @blur="setFocus(false)" 
          @focus="setFocus(true)"
          v-model="inputValue.startDate"
          type="date"
          align="center"
          placeholder="请选择出发时间"
          prefix-icon="time-icon"
          :picker-options="pickerToday"
          :clearable="false"
          :editable="false"/>
      </div>
    </div>
    <div class="fly-line"></div>
    <div class="fly-book-selecfill">
      <div class="icon-wrapper">
        <div class="icon-one">
          <img class="icon-content" src="../../assets/home-fly-book1.png" alt="">
          <img class="icon-content icon-scend" src="../../assets/home-fly-book2.png" alt="">
          <img class="icon-content icon-border" src="../../assets/home-fly-book3.png" alt="">
        </div>
        <div class="icon-two">
          <div class="icon-text">出票保障</div>
          <div class="icon-text icon-scend">标准退改签</div>
          <div class="icon-text icon-border">隐私保密</div>
        </div>
      </div>
      <div class="book-search-cover">
        <button class="book-search" @click="handleSearch">立即搜索</button>
      </div>
    </div>
  </div>
</template>

<script>
import { imgSrcs, starOptions, tenzontAds, hotelShowHead } from "./data.js";
// import HotelHead from "./HotelHead";
// import HotelItem from "./HotelItem";
// import HotelBook from "./HotelBook";
// tzHotels,
import { increaseMonth } from "@/util/util.js";
import { dateFormat } from "@/util/lobal.js";
import AirCityList from "@/components/AirCityList.vue";
import { setStore, getStore, removeStore } from "@/util/store";
// removeStore,
import { mapGetters, mapMutations } from "vuex";
export default {
  name: 'FlyBook',
  components: {
    AirCityList
  },
  data () {
    return {
      focus: false,
      isShow: false,
      isShow1: false,
      imgSrcs,
      tenzontAds,
      hotelShowHead,
      hotelArr: [],
      airId: '',
      hotelTag: "",
      inputValue: {
        // from:"",
        airCityFrom: "",
        cityTo: "",
        routeType: "OW",
        startDate: this.getToDay(),
        // endDate: this.getTomorrowDay(this.getToDay()),
        keywords: "",
        // star: ""
      },
      // tapList: [{ title: "酒店预订" }, { title: "航班预订" }],
      tapToPage: [this.toHome, this.toFly, this.toAnchor],
      starOptions,
      iconSwitch: "&#xe629;",
      cankaoDate: Date.now() + this.timeOffset,
      today: new Date(Date.now()),
      pickerToday: {
        disabledDate: time => {
          return (
            time.getTime() < Date.now() - 8.64e7 ||
            time.getTime() > increaseMonth(this.today, 6) + this.timeOffset
          );
        }
      }
      // pickerTomorrow: {
      //   disabledDate: time => {
      //     return (
      //       time <= this.inputValue.startDate ||
      //       time.getTime() >
      //         increaseMonth(this.today, 2) + this.timeOffset + 8.64e7
      //     );
      //   }
      // }
    };
  },
  computed: {
    ...mapGetters([
      "accountId",
      "timeOffset",
      "airCityList",
      "userInfo",
      "wechatId"
    ])
  },
  watch: {
    timeOffset (value) {
      this.cankaoDate = Date.now() + value;
    }
  },
  created () {
    this.removeCheckStore()
    let airCityListStore = getStore({ name: "flyCityList" });
    if (!airCityListStore) {
      this.$store.dispatch("GetAirCityList");
    }
  },
  mounted () {
    this.removeCheckStore()
    document.onkeyup = e => {
      var ev = document.all ? window.event : e;
      if (ev.keyCode === 13) {
        if (!this.inputValue.airCityFrom) {
          return false;
        } else {
          this.handleSearch();
        }
      }
    };
  },
  methods: {
    removeCheckStore () {
      removeStore({ name: 'cityCheck1' })
      removeStore({ name: 'cityCheck2' })
    },
    setFocus (v) {
      console.log(v)
      this.focus = v
    },
    chooseCity1 () {
      this.$refs.c1.chooseChildCity1()
    },
    chooseCity2 () {
      this.$refs.c2.chooseChildCity2()
      console.log(22)
    },
    switchCity () {
      setStore({
        name: 'arrCity',
        content: {
          name: this.inputValue.airCityFrom,
          code: this.inputValue.from,
          type: false
        }
      })
      setStore({
        name: 'depCity',
        content: {
          name: this.inputValue.cityTo,
          code: this.inputValue.to,
          type: false
        }
      })
      this.inputValue.airCityFrom = getStore({ name: 'depCity' }).name
      console.log(this.inputValue.airCityFrom, ' this.inputValue.airCityFrom')
      this.inputValue.cityTo = getStore({ name: 'arrCity' }).name
      console.log(this.inputValue.cityTo, 'this.inputValue.from')
      this.inputValue.from = getStore({ name: 'depCity' }).code
      this.inputValue.to = getStore({ name: 'arrCity' }).code
      this.$refs.c1.switchChildCity1(this.inputValue.airCityFrom)
      this.$refs.c2.switchChildCity2(this.inputValue.cityTo)
    },
    getSearch () {
      let search = window.location.search;
      if (search.length > 0) {
        search = search.split("?")[1];
        console.log(search)
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
    airFrom (airFrom) {
      // if (this.inputValue.to == airFrom) {
      //   this.$message({
      //     type: "warning",
      //     message: "请选择不同城市"
      //   })
      //   this.isShow = !this.isShow
      // }
      // else {
      this.inputValue.from = airFrom
      // }
      console.log(this.inputValue.airCityFrom)
    },
    airTo (airTo) {
      this.inputValue.to = airTo
      console.log(this.inputValue.to, 'test')
    },
    toId (toId) {
      this.inputValue.toId = toId
      console.log(this.inputValue.toId, 'emit')
    },
    // changeEndDate(value) {
    //   if (value.getTime() >= this.inputValue.endDate.getTime()) {
    //     this.inputValue.endDate = new Date(value.getTime() + 86400000);
    //   }
    // },
    ...mapMutations(["setState"]),
    // getTomorrowDay(today) {
    //   return new Date(today.getTime() + 24 * 60 * 60 * 1000);
    // },
    getToDay () {
      let now = new Date(Date.now() + (this.timeOffset || 0));
      // if (now.getHours() >= 17) {
      //   now = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      // }
      return new Date(now.toDateString());
    },
    mapCity () {
      let isAirCityMap = false;
      for (let i = 0; i < this.airCityList.list.length; i++) {
        if (
          this.airCityList.list[i].indexOf(
            this.inputValue.from
          ) > -1
        ) {
          isAirCityMap = true;
        }
      }
      return isAirCityMap;
    },
    handleSearch () {
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
        if (
          !/^[\u4e00-\u9fa5/(_A-Z0-9/)]+$/.test(this.inputValue.airCityFrom) ||
          !this.inputValue.airCityFrom || typeof (this.inputValue.from) == "undefined" ||
          typeof (this.inputValue.to) == "undefined" ||
          !this.mapCity()
        ) {
          if (typeof (this.inputValue.to) == "undefined") {
            this.isShow1 = !this.isShow1;
          } else {
            this.isShow = !this.isShow;
          }
          this.$message({
            message: "请选择城市！",
            type: "warning"
          });
        } else {
          if (this.inputValue.to == this.inputValue.from) {
            this.isShow1 = !this.isShow1;
            this.$message({
              message: "请选择不同城市！",
              type: "warning"
            });
          } else {
            console.log(this.airId, 'airid')
            setStore({
              name: "HomeAirQuery",
              content: {
                from: this.inputValue.from,
                to: this.inputValue.to,
                toId: this.inputValue.toId,
                // cityId: this.inputValue.cityId,
                departureDate: dateFormat(
                  this.inputValue.startDate,
                  "yyyy-MM-dd"
                ),
                routeType: this.inputValue.routeType
              }
            });
            setStore({
              name: "chineseName",
              content: {
                chineseFrom: this.inputValue.airCityFrom.substring(0, this.inputValue.airCityFrom.length - 5),
                chineseTo: this.inputValue.cityTo.substring(0, this.inputValue.airCityFrom.length - 5)
              }
            });
            setTimeout(() => {
              this.$router.push({
                name: "FlyList"
              });
            }, 100)
          }
        }
      }
    }
  }
}
</script>

<style lang="less">
.tenzont-fly-book {
  font-family: tahoma, arial, 'pingfang sc', 'Hiragino Sans GB', sans-serif;
  position: absolute;
  left: 0;
  bottom: 129px;
  z-index: 2;
  background-color: #fff;
  border-radius: 6px;
  padding: 25px;
  padding-top: 45px;
  color: #58666e;
  width: 428px;
  box-sizing: border-box;
  .fly-line {
    border-top: 0.5px solid #e3eaf2;
    height: 25px;
  }
  h2 {
    font-size: 20px;
    font-weight: normal;
    margin-bottom: 20px;
  }
  .fly-all-adress {
    height: 45px;
    position: relative;
    z-index: 1;
    transform: translateY(-10px);
  }
  .fly-book-div {
    width: 45%;
    height: 45px;
    border-radius: 3px;
    border: 0.5px solid #dfe6f3;
    margin-bottom: 21px;
    padding: 0 16px;
    line-height: 45px;
    box-sizing: border-box;
    font-size: 14px;
    background-color: #f3f6fb;
    &[data-status='true'] {
      background-color: #fff;
      border-color: #adbad0;
    }
    .fly-book-option {
      padding-right: 0px;
      transform: translateY(-1px);
      display: inline-block;
    }
    .fly-input {
      margin-left: -10px;
      padding-left: 0px;
      width: 100px;
      input {
        width: 100px;
        background: #f3f6fb;
        &:focus {
          background-color: #fff;
        }
      }
    }
    input {
      outline: none;
      border: none;
      display: inline-block;
      font-weight: 400;
      font-size: 15px;
      text-indent: 20px;
      font-family: tahoma, arial, 'pingfang sc', 'Hiragino Sans GB', sans-serif;
      &::-webkit-input-placeholder {
        color: #b5c0d1;
      }
      &:ms-input-placeholder {
        color: #b5c0d1;
      }
      &:moz-placeholder {
        color: #b5c0d1;
      }
    }
  }
  .fly-book-iocn {
    width: 37px;
    height: 45px;
    float: left;
    line-height: 45px;
    text-align: center;
    i:hover {
      cursor: pointer;
    }
    .iconDetail {
      font-size: 23px;
      color: #c1c9d5;
      &.active {
        color: #4d545f;
        cursor: pointer;
      }
    }
  }
  .fly-book-address-wrapper {
    z-index: 999;
  }
  .fly-book-address {
    position: relative;
    float: left;
    .city-list-wrapper {
      left: 64px;
      .input-cover {
        background-color: #f3f6fb;
        width: 316px;
        height: 43px;
      }
    }
  }
  .fly-book-time {
    width: 100%;
    top: 500px;
    overflow: hidden;
    background-color: #f3f6fb;
    margin-bottom: 35px;
    &.active {
      background-color: #fff;
      border-color: #adbad0;
    }
    .book-time-div {
      float: left;
      width: 100%;
      box-sizing: border-box;
      .book-time {
        width: 298px;
        // padding-left: 100px;
        background-clip: padding-box;
        &.active {
          input {
            background-color: #fff;
          }
        }
        input {
          background-color: #f3f6fb;
          border: none;
          padding: 0;
          font-size: 16px;
          &::-webkit-input-placeholder {
            color: #b5c0d1;
            text-align: center;
          }
          &:ms-input-placeholder {
            color: #b5c0d1;
            text-align: center;
          }
          &:moz-placeholder {
            color: #b5c0d1;
            text-align: center;
          }
        }
        .time-icon {
          display: none;
        }
      }
    }
    .book-startdate {
      border-right: 0.5px solid #dfe6f3;
    }
  }
  .fly-book-star {
    .book-star-select {
      width: 297px;
      input {
        padding-left: 0;
      }
    }
  }
  .fly-book-selecfill {
    width: 238px;
    position: relative;
    height: 45px;
    // margin-bottom: 6px;
    .icon-wrapper {
      color: #c3cddc;
      height: 44px;
      margin-left: -8px;
      display: inline-block;
      transform: translateY(1px);
      .icon-one {
        height: 20px;
        .icon-content {
          padding-left: 29px;
          padding-right: 29px;
          height: 20px;
          border-right: solid 0.5px #e3eaf2;
          &.icon-scend {
            padding-left: 34px;
            padding-right: 34px;
          }
        }
        .icon-border {
          border-right: none;
        }
      }
      .icon-two {
        height: 22px;
        .icon-text {
          padding: 2px 0;
          text-align: center;
          width: 78px;
          height: 14px;
          float: left;
          font-family: tahoma, arial, 'pingfang sc', 'Hiragino Sans GB',
            sans-serif;
          color: #aab4c4;
          border-right: solid 0.5px #e3eaf2;
          &.icon-scend {
            width: 88px;
          }
        }
        .icon-border {
          border-right: none;
        }
      }
    }
    input {
      width: 173px;
    }
    .book-search-cover {
      overflow: hidden;
      position: absolute;
      left: 248px;
      top: 0;
      border-radius: 3px;
      width: 130px;
      height: 44px;
      font-size: 16px;
      margin-top: -1px;
      line-height: 44px;
      .book-search {
        width: 100%;
        height: 100%;
        font-size: 16px;
        line-height: 44px;
        text-align: center;
        text-indent: 1px;
        background: linear-gradient(to right, #56a1ff, #1a82ff);
        background: -moz-linear-gradient(left, #56a1ff, #1a82ff);
        background: -webkit-gradient(
          linear,
          left,
          right,
          color-stop(#56a1ff),
          color-stop(#1a82ff)
        );
        background: -webkit-linear-gradient(left, #56a1ff, #1a82ff);
        background: -o-linear-gradient(left, #56a1ff, #1a82ff);
        background: -ms-linear-gradient(left, #56a1ff, #1a82ff);
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#56A1FF', endColorstr='#1A82FF',GradientType=1);
        color: #fff;
        font-family: tahoma, arial, 'pingfang sc', 'Hiragino Sans GB',
          sans-serif;
        border: none;
        outline: none;
        &:hover {
          opacity: 0.9;
        }
      }
    }
  }
}
</style>
