<template>
  <div class="aircity-list-wrapper" v-clickOutside="contentHide">
    <input type="text" placeholder="选择城市" v-model="airCityName" @keyup="monitorInput($event)" @click.prevent="contentShow" @blur="blur" @focus="focus" class="input-cover inputCover">
    <transition name="air-fade">
      <!-- <div class="aircity-list-content" :class="isContentDisplay ? 'content-show' : ''"> -->
      <div class="aircity-list-content" v-show="isContentDisplay">
        <div class="aircity-list" v-if="!searchAirCityList.length">
          <div class="aircity-list-tip">
            热门城市(支持汉字/拼音)
          </div>
          <!-- 分类头 -->
          <ul class="classify-list-top">
            <li v-for="airCityClassifyList in airCityClassifyList" :key="airCityClassifyList.id"
                @click.prevent="currentClassifyId = airCityClassifyList.id" :class="currentClassifyId === airCityClassifyList.id ? 'on' : ''">
              {{airCityClassifyList.name}}
            </li>
          </ul>
          <!-- 当前城市列表 -->
          <ul class="classify-list-bottom">
            <li v-for="(airCityListItem, initial) in currentCityList" :key="initial">
              <span class="initial-title">{{initial}}</span>
              <div class="aircity-name-list">
                <span style="width: 100px" v-for="airCity in airCityListItem" :key="airCity.index" @click.prevent="handleAirCity(airCity)">{{airCity.name}}</span>
              </div>
            </li>
          </ul>
        </div>
        <!-- 搜索城市 -->
        <ul class="search-list" v-if="searchAirCityList.length" ref="searchListBox">
          <li v-for="airCity in searchAirCityList" :key="airCity.index" :class="{ current: airCity.checked }" @click.prevent="handleSearch(airCity)" style="padding-right: 0px">
            <span class="search-list-name">{{airCity.name}}</span>
            <!-- <span class="search-list-spell">{{airCity.spell}}</span> -->
            <span class="search-list-iata" style="position: absolute;right: -15px">{{airCity.iata}}</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import clickOutside from "@/directives/clickOutside";
import { mapGetters } from "vuex";
import { getStore, setStore } from '@/util/store'

let airCityClassifyList = [
  {
    id: 0,
    name: "热门城市"
  },
  {
    id: 1,
    name: "ABCD"
  },
  {
    id: 2,
    name: "EFGH"
  },
  {
    id: 3,
    name: "JKLM"
  },
  {
    id: 4,
    name: "NOPQRS"
  },
  {
    id: 5,
    name: "TUVWX"
  },
  {
    id: 6,
    name: "YZ"
  }
];

export default {
  name: "AirCityList",
  props: {
    value: String,
    isShow: Boolean,
    fromName: String,
    toName: String
  },
  directives: {
    clickOutside
  },
  mounted () {
    this.initCity()
  },
  data () {
    return {
      airCityName: '',
      childFromName: '',
      airFrom: "",
      toId: "",
      airCityClassifyList,
      currentClassifyId: 0,
      isSearch: true,
      isContentDisplay: false,
      searchAirCityList: [],
      airCityArr: [],
      cityCheck1: '',
      cityCheck2: ''
    };
  },
  computed: {
    ...mapGetters(["airCityList"]),
    currentCityList () {
      if (this.isSearch) {
        if (this.currentClassifyId === 0) {
          return {
            "": this.airCityList.hotAirCityList
          };
        }
        let airCityListMap = {};
        airCityClassifyList.forEach(airCityClassifyList => {
          if (airCityClassifyList.id === this.currentClassifyId) {
            airCityClassifyList.name.split("").forEach(initial => {
              if (this.airCityList.spellMap[initial]) {
                airCityListMap[initial] = this.airCityList.spellMap[initial];
              }
            });
          }
        });
        return airCityListMap;
      } else {
        // eslint-disable-next-line
        this.isSearch = true;
        return {
          "": this.airCityList.hotAirCityList
        };
      }
    }
  },
  watch: {
    airCityName (name) {
      // this.airCityName = this.fromName
      this.$emit("input", name);
      this.$emit("airFrom", this.airFrom);
      this.$emit("airTo", this.airFrom);
      this.$emit("toId", this.toId);
      let searchAirCityList = this.getSearchList(name);
      if (searchAirCityList.length) {
        const [firstAirCity] = searchAirCityList;
        firstAirCity.checked = true;
      }
      this.searchAirCityList = searchAirCityList;
      let offsetTop = document.getElementsByClassName("inputCover")[0]
        .offsetTop;
      window.scrollTo(0, offsetTop);
    },
    isShow () {
      this.contentShow();
    }
  },
  methods: {
    initCity () {
      if (this.fromName) {
        this.airCityName = this.fromName
      } else {
        this.airCityName = this.toName
        if (typeof (this.airCityName) == 'undefined') {
          this.airCityName = ''
        }
      }
    },
    focus (el) {
      el.target.parentNode.parentNode.setAttribute('data-status', true)
    },
    blur (el) {
      el.target.parentNode.parentNode.setAttribute('data-status', false)
    },
    chooseChildCity1 () {
      this.childType = 1
    },
    chooseChildCity2 () {
      this.childType = 2
    },
    switchChildCity1 (val) {
      this.airCityName = val
      console.log(this.fromName, 'this.fromName')
    },
    switchChildCity2 (val) {
      this.airCityName = val
      console.log(this.toName, 'this.toName')
    },
    handleAirCity (airCity) {
      this.airCityName = airCity.name + '(' + airCity.airCityInfo[3] + ')';
      console.log(this.childType, '22222')
      if (this.childType == 1) {
        this.cityCheck1 = airCity.airCityInfo[3]
        console.log(this.cityCheck1, '22')
        setStore({
          name: 'cityCheck1',
          content: {
            cityCheck1: this.cityCheck1,
            type: false
          }
        })
        this.isContentDisplay = false;
        if (getStore({ name: 'cityCheck2' })) {
          this.cityCheck2 = getStore({ name: 'cityCheck2' }).cityCheck2
        }
      }
      if (this.childType == 2) {
        this.cityCheck2 = airCity.airCityInfo[3]
        console.log(this.cityCheck2, '33')
        setStore({
          name: 'cityCheck2',
          content: {
            cityCheck2: this.cityCheck2,
            type: false
          }
        })
        this.isContentDisplay = false;
        if (getStore({ name: 'cityCheck1' })) {
          this.cityCheck1 = getStore({ name: 'cityCheck1' }).cityCheck1
        }
      }
      if (this.cityCheck1.length > 0 && this.cityCheck2.length > 0 && this.cityCheck1 == this.cityCheck2) {
        this.$message({
          type: "warning",
          message: "请选择不同城市"
        })
        this.isContentDisplay = true;
      } else {
        this.isContentDisplay = false;
      }
      this.airFrom = airCity.airCityInfo[3];
      this.toId = airCity.airCityInfo[4];
      this.isSearch = false;
    },
    handleSearch (airCity) {
      console.log(airCity, "aircity");
      this.airCityName = airCity.name + '(' + airCity.iata + ')';
      this.airFrom = airCity.iata;
      this.toId = airCity.id;
      this.isSearch = false;
      this.isContentDisplay = false;
    },
    contentShow () {
      this.isContentDisplay = true;
      this.isSearch = true;
    },
    contentHide () {
      this.isContentDisplay = false;
    },
    // 输入搜索到的城市列表
    getSearchList (airCityName) {
      if (!this.isSearch) {
        this.isSearch = true;
        return [];
      }
      let searchAirCity = this.airCityList.list
        .filter(
          airCity =>
            airCityName &&
            airCityName !== "|" &&
            airCity.indexOf(airCityName.toLocaleLowerCase()) > -1
        )
        .map(airCity => {
          let [name, spell, easy, iata, id] = airCity.split("|");
          let data = {
            name,
            spell,
            easy,
            iata,
            id,
            checked: false
          };
          return data;
        });
      return searchAirCity;
    },
    // 监听城市输入框
    monitorInput (e) {
      if (this.isContentDisplay) {
        e.stopPropagation();
      }
      this.contentShow();
      const { searchAirCityList } = this;
      if (!searchAirCityList.length) return;
      let prevAirCityIndex = 0;
      searchAirCityList.forEach((airCity, index) => {
        if (airCity.checked) {
          prevAirCityIndex = index;
        }
      });
      let currentCity = searchAirCityList[prevAirCityIndex];

      if (e.keyCode === 13) {
        this.airCityName = currentCity.name + currentCity.iata;
        this.contentHide();
      }
      // 上键
      if (e.keyCode === 38) {
        if (prevAirCityIndex > 0) {
          searchAirCityList[prevAirCityIndex].checked = false;
          searchAirCityList[prevAirCityIndex - 1].checked = true;
        }
      }
      // 下键
      if (e.keyCode === 40) {
        if (prevAirCityIndex < searchAirCityList.length - 1) {
          searchAirCityList[prevAirCityIndex].checked = false;
          searchAirCityList[prevAirCityIndex + 1].checked = true;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.aircity-list-wrapper {
  position: absolute;
  top: 0;
  left: 60px;
  z-index: 2;
  width: 210px;
  font-size: 12px;
  .input-cover {
    // background: #ebeff4;
    width: 80px;
    height: 41px;
    margin-top: 1px;
    border: none;
    font-size: 16px;
    z-index: 3;
  }
  .air-fade-enter-active {
    animation: air-fade-in 0.2s;
  }
  .air-fade-leave-active {
    animation: air-fade-in 0.2s reverse;
  }
  @keyframes air-fade-in {
    0% {
      transform: scale(0.1);
    }
    20% {
      transform: scale(0.5);
    }
    50% {
      transform: scale(0.8);
    }
    100% {
      transform: scale(1);
    }
  }
  .aircity-list-content {
    width: 380px;
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
    border: 0.5px solid #85bee5;
    margin-top: -1px;
    display: block;
    background-color: #fff;
    z-index: 4;
    .aircity-list {
      .aircity-list-tip {
        padding: 5px;
        color: #666;
        line-height: 20px;
        margin: 0;
        text-indent: 3px;
      }
      .classify-list-top {
        line-height: 1;
        font-size: 12px;
        position: relative;
        li {
          display: inline-block;
          padding: 2px 4px;
          cursor: pointer;
          border: 0.5px solid #85bee5;
          margin-left: 4px;
          line-height: 1;
        }
        .on {
          border-bottom-color: #fff;
        }
      }
      .classify-list-bottom {
        border-top: 0.5px solid #85bee5;
        margin-top: -1px;
        padding: 5px;
        box-sizing: border-box;
        font-size: 12px;
        li {
          width: 100%;
          overflow: hidden;
          line-height: 1;
          padding-bottom: 5px;
          .initial-title {
            width: 19px;
            font-size: 14px;
            color: #f30;
            float: left;
            margin-top: 4px;
          }
          .aircity-name-list {
            float: left;
            width: 449px;
            span {
              display: inline-block;
              width: 16%;
              line-height: 22px;
              text-align: left;
              cursor: pointer;
              box-sizing: border-box;
              &:hover {
                color: #f30;
              }
            }
          }
        }
      }
    }
    .search-list {
      line-height: 1;
      max-height: 300px;
      overflow: auto;
      li {
        padding: 5px;
        overflow: hidden;
        cursor: pointer;
        &:hover,
        &.current {
          background-color: #9cd9ff;
          color: #fff;
        }
        .search-list-name {
          float: left;
        }
        .search-list-spell {
          float: right;
        }
      }
    }
  }
  .content-show {
    display: block;
  }
}
</style>
