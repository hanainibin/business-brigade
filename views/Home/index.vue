<template>
  <div class="home">
    <el-carousel class="tenzont-carousel-bg">
      <el-carousel-item v-for="(item,index) in imgSrcs" :key="item.index"
                        :class="`item-img-cover${index}`">
        <img :src="item.src" alt="" style="height:417px">
      </el-carousel-item>

    </el-carousel>
    <div class="tenzont-ads-bg">
      <div class="tenzont-ads">
        <ul>
          <li v-for="(ad,index) in tenzontAds" :key="ad.index"
              :class="`ads-item ads-item${[index]}`">
            <img class="ads-item-left" :src="ad.src" alt="">
            <div class="ads-item-right">
              <strong>{{ad.title}}</strong>
              <p>{{ad.desc}}</p>
            </div>
          </li>
        </ul>

        <div class="tenzont-tap">
          <ul class="tenzont-tap-items">
            <li
              @click="toggleTab('HotelBook')"
              :class="`tap-item tap-item0 ${currentTab === 'HotelBook'}`"
            >
              <img src="@/assets/indexTab1.png" v-if="currentTab === 'HotelBook'">
              <img src="@/assets/indexTab3.png" v-if="currentTab !== 'HotelBook'">
            </li>
            <li
              @click="toggleTab('FlyBook')"
              :class="`tap-item tap-item1 ${currentTab === 'FlyBook'}`"
            >
              <img src="@/assets/indexTab4.png" v-if="currentTab === 'FlyBook'">
              <img src="@/assets/indexTab2.png" v-if="currentTab !== 'FlyBook'">
            </li>
          </ul>
        </div>
        <keep-alive>
          <HotelBooK v-bind:is="currentTab"></HotelBooK>
        </keep-alive>
      </div>
    </div>
    <div class="tenzont-hotel-show-bg">
      <div class="tenzont-hotel-show">
        <div class="hotel-show-content" v-for="(hotelInfo,index) in hotelArr" :key="hotelInfo.index"
             :id="`content${index}`">
          <HotelHead v-for="hotelHead in hotelInfo.head" :key="hotelHead.index"
                     :hotel-head="hotelHead"/>
          <ul class="hotel-show-items">
            <HotelItem v-for="item in hotelInfo.list" :key="item.index"
                       :item="item"
                       :hotel-tag="hotelInfo.hotelTag"
            />
          </ul>
        </div>
      </div>
    </div>

    <!-- 禁删 新 推荐酒店部分 -->
    <!-- <div class="tenzont-hotel-wrapper" v-loading="hotelContentLoading">
      <header>
        <div class="left">
          <img src="@/assets/home_hotel_sale.png" alt="">
          <span>精品酒店促销</span>
        </div>
        <div class="right">
          <ul class="right-citys">
            <li class="citys-item" v-for="(item, index) in citySearchArr" :key="index" @click="searchByCity(item, index)">
              {{item.shortname}}
            </li>
          </ul>
          <span class="input-cover">
            <img src="@/assets/home_search_icon.png" alt="">
            <input type="text" placeholder="输入目的地" v-model="searchCity" @click="isSearchResultShow = true"
                   @keyup="monitorInput($event)">
          </span>
          <div v-if="isSearchResultShow">
            <ul class="search-result-list" v-if="searchCity.length">
              <li class="result-list-item" v-for="city in searchCityListCount" :key="city.id" 
                  :class="{ current: city.checked }" @click.prevent="handleCitySearch(city)">
                <span class="search-list-name" v-if="city.name !== city.prov">
                  {{city.name}}，{{city.prov}}
                  <span v-if="city.parent">，{{city.parent}}</span>
                </span>
                <span class="search-list-name" v-if="city.name === city.prov">
                  {{city.name}}<span v-if="city.parent">，{{city.parent}}</span>
                </span>
                <span class="search-list-number" v-if="city.number">
                  <span class="number">{{city.number}} </span>家酒店
                </span>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <div class="hotel-content" v-if="hotelDataArr.length > 0">
        <hotelItem1 v-for="item in hotelDataArr" :key="item.index"
                    :item="item" :hotelTag="hotelTag"></hotelItem1>
      </div>
      <div class="no-data" v-if="hotelDataArr.length <= 0">{{noDataStr}}</div>
    </div> -->
  </div>
</template>

<script>
import { imgSrcs, starOptions, tenzontAds, hotelShowHead } from "./data.js"
import HotelHead from "./HotelHead"
import HotelItem from "./HotelItem"
import HotelBook from "./HotelBook"
import FlyBook from "./FlyBook"
import { tzHotels } from "@/api/wxResign"
import CityList from "@/components/CityList.vue"
import { removeStore, setStore, getStore } from "@/util/store"
import { mapGetters, mapMutations } from "vuex"
import { increaseMonth } from "@/util/util.js"
import { wxlogin } from "@/api/user"
import { login } from "@/api/three"
import { selectSupremeHotel } from "@/api/hotel.js"
// 禁删 使用新接口
// import { selectSupremeHotel, getLocalCity } from '@/api/hotel.js'
import hotelItem1 from "./HotelItem1"

export default {
  name: "home",
  components: {
    HotelHead,
    HotelItem,
    HotelBook,
    FlyBook,
    CityList,
    hotelItem1
  },
  data () {
    return {
      isShow: false,
      imgSrcs,
      tenzontAds,
      hotelShowHead,
      currentTab: "HotelBook",
      hotelArr: [],
      hotelTag: "限时底价",
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
      },
      hotelDataArr: [], // 新推荐酒店接口数组
      hotelContentLoading: false,
      citySearchArr: [],
      noDataStr: "",
      searchCity: "",
      areaFormat: getStore({ name: "getCitiesData" })
        ? getStore({ name: "getCitiesData" })
        : { name: "" },
      searchCityList: [],
      isSearchResultShow: false
    };
  },
  computed: {
    ...mapGetters([
      "accountId",
      "timeOffset",
      "cityList",
      "userInfo",
      "wechatId"
    ]),
    searchCityListCount () {
      let arr = [];
      for (let i = 0; i < this.searchCityList.length; i++) {
        if (this.searchCityList[i].number) {
          arr.push(this.searchCityList[i]);
        }
      }
      if (arr.length > 0) {
        arr[0].checked = true;
      }
      return arr.slice(0, 6);
    }
  },
  watch: {
    timeOffset (value) {
      this.cankaoDate = Date.now() + value;
    },
    searchCity (val) {
      this.searchResult = {
        1: [],
        2: [],
        3: []
      };
      this.searchCityList = [];
      if (val && val !== "|") {
        this.newSearchList(this.areaFormat, val);
        let cityArr = document.getElementsByClassName("citys-item");
        for (let i = 0; i < cityArr.length; i++) {
          cityArr[i].classList.remove("is-search");
        }
      }
      for (let i = this.searchResult[1].length - 1; i >= 0; i--) {
        if (
          this.searchResult[2].find(n => n.id === this.searchResult[1][i].id)
        ) {
          this.searchResult[1].splice(i, 1);
        }
      }
      this.searchCityList = [
        ...this.searchResult[2],
        ...this.searchResult[1],
        ...this.searchResult[3]
      ];
    }
  },
  created () {
    if (!this.userInfo.status) {
      let pathname = window.location.pathname;
      if (pathname.includes("/wxlogin")) {
        let searchObj = this.getSearch();
        if (searchObj.code && searchObj.code.length > 0) {
          wxlogin(searchObj).then(res => {
            if (res.data.code === 0) {
              let resDate = res.data;
              this.$store.dispatch("LoginSuccess", {
                data: resDate.data,
                router: this.$router
              });
            } else if (res.data.code === 2) {
              this.$store.state.user.nickName = "腾住会员";
              this.$store.state.user.bindMobileDialogVisible = true;
              this.$store.state.user.wechatId = res.data.data;
              setStore({
                name: "wechatId",
                content: res.data.data,
                type: "session"
              });
            } else if (res.data.code === 3) {
              if (res.data.msg.length > 0) {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            } else {
              if (this.wechatId && this.wechatId.length > 0) {
                this.$store.state.user.nickName = "腾住会员";
                this.$store.state.user.bindMobileDialogVisible = true;
              } else {
                removeStore({
                  name: "wechatId"
                });
              }
            }
          });
        }
      } else if (pathname.includes("/thridLogin")) {
        let searchObj = this.getSearch();
        if (searchObj.accessKey && searchObj.accessKey.length > 0) {
          login(searchObj).then(res => {
            if (res.data.code === 0) {
              let resDate = res.data;
              this.$store.dispatch("LoginSuccess", {
                data: resDate.data,
                router: this.$router
              });
            } else {
              console.log("登录失效");
            }
          });
        }
      }
    }
    tzHotels().then(res => {
      if (res.data.data) {
        this.hotelArr = [
          {
            hotelTag: "快捷连锁",
            head: this.hotelShowHead.slice(0, 1),
            list: res.data.data.slice(0, 6)
          },
          {
            hotelTag: "高星精品",
            head: this.hotelShowHead.slice(-1),
            list: res.data.data.slice(-6)
          }
        ];
      } else {
        this.hotelArr = [];
      }
      setTimeout(() => {
        let id = this.$route.path.substr(1);
        if (id === "") return;
        let offsetTop = document.getElementById(id).offsetTop;
        window.scrollTo(0, offsetTop);
      }, 100);
    });
    let cityListStore = getStore({ name: "cityList1" });
    if (!cityListStore) {
      this.$store.dispatch("GetCityList");
    }
  },
  mounted () {
    document.onkeyup = e => {
      var ev = document.all ? window.event : e;
      if (ev.keyCode === 13) {
        console.log(this.$route.name)
        if (this.$route.name === 'home') {
          window.globelEvent.$emit("enter");
        }
      }
    };
    // 禁删 使用新接口
    // getLocalCity().then(res => {
    //   if (res.data.code === 0) {
    //     this.citySearchArr = [...res.data.data] // 第一项为用户当前所在城市
    //     this.getSelectSupremeHotel({ cityId: this.citySearchArr[0].id})
    //     setTimeout(() => {
    //       document.getElementsByClassName('citys-item')[0].classList.add('is-search')
    //     }, 100)
    //   } else this.$message.error(res.data.msg)
    // })
  },
  methods: {
    newSearchList (node, cityName, p1, p2) {
      let name, prov;
      if (node.name.split("|").find(n => n.startsWith(cityName))) {
        switch (node.type) {
          case 0:
            break;
          case 1:
            [name] = node.subNodes[0].name.split("|");
            [prov] = node.name.split("|");
            this.searchResult[node.type].push({
              name,
              prov,
              number: node.subNodes[0].hotelCount,
              cityId: node.subNodes[0].id,
              checked: false
            });
            break;
          case 2:
            [name] = node.name.split("|");
            this.searchResult[node.type].push({
              name,
              prov: p1,
              number: node.hotelCount,
              cityId: node.id,
              checked: false
            });
            break;
          case 3:
            [name] = node.name.split("|");
            this.searchResult[node.type].push({
              name,
              prov: p2,
              cityId: node.id,
              parent: p1,
              checked: false,
              type: 3
            });
            break;
        }
      }

      if (node.subNodes && node.subNodes.length > 0) {
        for (let i = 0; i < node.subNodes.length; i++) {
          switch (node.type) {
            case 0:
              this.newSearchList(node.subNodes[i], cityName);
              break;
            case 1:
              this.newSearchList(
                node.subNodes[i],
                cityName,
                node.name.split("|")[0]
              );
              break;
            case 2:
              this.newSearchList(
                node.subNodes[i],
                cityName,
                p1,
                node.name.split("|")[0]
              );
              break;
          }
        }
      }
    },
    toggleTab (tab) {
      this.currentTab = tab; // tab 为当前触发标签页的组件名
    },
    getSearch () {
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
    changeEndDate (value) {
      if (value.getTime() >= this.inputValue.endDate.getTime()) {
        this.inputValue.endDate = new Date(value.getTime() + 86400000);
      }
    },
    ...mapMutations(["setState"]),
    getTomorrowDay (today) {
      return new Date(today.getTime() + 24 * 60 * 60 * 1000);
    },
    getToDay () {
      let now = new Date(Date.now() + (this.timeOffset || 0));
      // if (now.getHours() >= 17) {
      //   now = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      // }
      return new Date(now.toDateString());
    },
    mapCity () {
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
    // 新 推荐酒店接口
    getSelectSupremeHotel ({ cityId = "330100" } = {}) {
      this.hotelContentLoading = true;
      selectSupremeHotel({ cityId }).then(res => {
        this.hotelContentLoading = false;
        if (res.data.code === 0 && res.data.data) {
          this.hotelDataArr = [...res.data.data];
        } else if (res.data.code === 0 && !res.data.data) {
          this.hotelDataArr = [];
          this.noDataStr =
            "很抱歉，该搜索条件下没找到符合您要求的酒店，试试其他搜索条件吧。";
        } else this.$message.error(res.data.msg);
      });
    },
    searchByCity (city, index) {
      this.searchCity = "";
      this.getSelectSupremeHotel({ cityId: city.id });
      let cityArr = document.getElementsByClassName("citys-item");
      for (let i = 0; i < cityArr.length; i++) {
        if (i !== index) {
          cityArr[i].classList.remove("is-search");
        }
      }
      cityArr[index].classList.add("is-search");
    },
    handleCitySearch (city) {
      console.log(city);
      this.searchCity = city.name;
      this.isSearchResultShow = false;
      this.getSelectSupremeHotel({ cityId: city.cityId });
    },
    // 监听城市输入框
    monitorInput (e) {
      if (this.isSearchResultShow) {
        e.stopPropagation();
      }
      const { searchCityListCount } = this;
      if (!searchCityListCount.length) return;
      let prevCityIndex = 0;
      searchCityListCount.forEach((city, index) => {
        if (city.checked) {
          prevCityIndex = index;
        }
      });
      let currentCity = searchCityListCount[prevCityIndex];
      if (e.keyCode === 13) {
        // enter
        this.searchCity = currentCity.name;
        this.isSearchResultShow = false;
        this.getSelectSupremeHotel({ cityId: currentCity.cityId });
      } else if (e.keyCode === 38) {
        // up
        if (prevCityIndex > 0) {
          searchCityListCount[prevCityIndex].checked = false;
          searchCityListCount[prevCityIndex - 1].checked = true;
        }
      } else if (e.keyCode === 40) {
        // down
        if (prevCityIndex < searchCityListCount.length - 1) {
          searchCityListCount[prevCityIndex].checked = false;
          searchCityListCount[prevCityIndex + 1].checked = true;
        }
      }
    }
  }
};
</script>

<style lang="less">
@import './style.less';
</style>
