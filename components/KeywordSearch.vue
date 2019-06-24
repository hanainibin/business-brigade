<template>
  <div v-clickOutside="contentHide" class="keyword-bg">
    <input v-model="keywordName" @keyup="monitorInput" @blur="blur" @focus="focus" class="inputKeyword" @click="keywordInput" placeholder="(选填)酒店名/商圈/区县">
    <ul class="keyword-box" v-show="isShow">
      <div class="keyword-title">热门商圈和行政区</div>
      <li @click="zoneClick(item.name.split('|')[0], item)" v-if="index < 20" v-for="(item, index) in keywordList" :key="item.id">
        {{item.name.split('|')[0]}}
      </li>
    </ul>
    <ul class="keyword-box keyword-list" v-show="showKeyList">
      <li v-for="city in searchZoneList" :key="city.id" :class="{ current: city.checked }" @click.prevent="zoneSearch(city)">
        <span class="search-list-name" v-if="city.cityName !== city.prov">{{city.name}}，{{city.cityName}}，{{city.prov}}</span>
        <span class="search-list-name" v-if="city.cityName === city.prov">{{city.name}}，{{city.cityName}}</span>
        <span class="search-list-spell">商圈</span>
      </li>
      <li v-for="city in searchHotelList" :key="city.id" :class="{ current: city.checked }" @click.prevent="hotelSearch(city)">
        <span class="search-list-name" v-if="city.cityName !== city.provName">{{city.hotelName}}，{{city.areaName}}，{{city.cityName}}，{{city.provName}}</span>
        <span class="search-list-name" v-if="city.cityName === city.provName">{{city.hotelName}}，{{city.areaName}}，{{city.cityName}}</span>
        <span class="search-list-spell">酒店</span>
        <br>
        <span class="search-list-score">{{(city.score / 10).toFixed(1)}}分</span>
        <span class="search-list-address">|{{city.addr}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import clickOutside from '@/directives/clickOutside'
import { getBusiZoneList } from '@/api/city'
import { unionSearch } from '@/api/keyword'
import { mapGetters } from 'vuex'
export default {
  name: 'KeywordSearch',
  data () {
    return {
      keywordList: [],
      isShow: false,
      currCityId: this.cityId,
      keywordName: this.value,
      showKeyList: false,
      searchZoneList: [],
      searchHotelList: []
    }
  },
  props: {
    value: String,
    cityId: String
  },computed: {
    ...mapGetters(['accountId'])
  },
  watch: {
    keywordName (name) {
      this.$emit('input', name)
    }
  },
  directives: {
    clickOutside
  },
  methods: {
    focus (el) {
      el.target.parentNode.parentNode.setAttribute('data-status', true)
    },
    blur (el) {
      el.target.parentNode.parentNode.setAttribute('data-status', false)
    },
    zoneSearch (key) {
      this.keywordName = key.name
      this.showKeyList = false
    },
    hotelSearch (key) {
      if (this.accountId.length > 0) {
        window.globelEvent.$emit('hotel', key.id)
      } else {
        console.log(key)
        this.keywordName = key.hotelName
        this.showKeyList = false
      }
    },
    zoneClick (value, item) {
      if (item.type === 3) {
        console.log('area', item)
        window.globelEvent.$emit('area', item)
        this.keywordName = ''
      } else {
        this.keywordName = value
      }
      this.isShow = false
    },
    contentHide () {
      this.isShow = false
      this.showKeyList = false
    },
    monitorInput () {
      if (this.keywordName.length > 0) {
        if (this.timeOut) {
          clearTimeout(this.timeOut)
        }
        this.timeOut = setTimeout(() => {
          unionSearch({
            keyWord: this.keywordName,
            totolSize: 10,
            cityId: this.currCityId
          }).then(res => {
            console.log(res)
            if (res.data.code === 0) {
              if (res.data.request.keyWord === this.keywordName && res.data.request.cityId === this.cityId) {
                this.searchZoneList = res.data.data.zone
                this.searchHotelList = res.data.data.hotel
                this.isShow = false
                if (this.searchZoneList.length > 0 || this.searchHotelList.length > 0) {
                  this.showKeyList = true
                } else {
                  this.showKeyList = false
                }
              }
            } else {
              this.showKeyList = false
            }
          })
        })
      } else {
        if (this.keywordList.length > 0) {
          this.isShow = true
        }
        this.showKeyList = false
      }
    },
    //点击关键词输入框，展现商圈列表
    keywordInput () {
      if (this.currCityId > 0) {
        if (!this.showKeyList) {
          getBusiZoneList({
            areaId: this.cityId
          }).then(res => {
            if (res.data.code === 0) {
              this.isShow = true
              console.log(res)
              this.keywordList = res.data.data
            }
          })
        }
      } else {
        this.$message({
          message: '请选择城市！',
          type: 'warning'
        })
      }
    }
  },
  created () {
    window.globelEvent.$on('cityId', cityId => {
      console.log(cityId)
      this.currCityId = cityId
    })
    window.globelEvent.$on('keyword', areaName => {
      console.log('keyword')
      this.keywordName = areaName
    })
  }
}
</script>

<style lang="less" scoped>
.keyword-bg {
  position: relative;
  z-index: 1;
}
.keyword-box {
  width: 380px;
  background-color: #fff;
  border: 0.5px solid #85bee5;
  overflow: hidden;
  .keyword-title {
    font-weight: bold;
    font-size: 14px;
    margin-left: 8px;
    line-height: 30px;
  }
  li {
    float: left;
    margin-left: 16px;
    line-height: 25px;
    font-size: 13px;
    margin-right: 16px;
    cursor: pointer;
  }
}
.keyword-list {
  li {
    width: 348px;
    .search-list-name {
      float: left;
      width: 250px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .search-list-spell {
      float: right;
    }
    .search-list-score {
      color: #009ced;
      float: left;
    }
    .search-list-address {
      width: 220px;
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
.inputKeyword{
  width: 215px;
  height: 41px;
  margin-left: 10px;
  line-height: 41px;
  font-size: 14px;
  text-indent: 10px;
}
</style>

