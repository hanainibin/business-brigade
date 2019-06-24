<template>
  <div class="city-list-wrapper" v-clickOutside="contentHide">
    <input style="width: 316px;" type="text" placeholder="请选择目的地城市" v-model="cityName" @keyup="monitorInput($event)" @click.prevent="contentClick" @blur="blur" @focus="focus" class="input-cover inputCover">
    <div class="city-list-content" :class="isContentDisplay ? 'content-show' : ''">
      <div class="city-list" v-if="!searchAllList.length || !cityName.length || !showSearch">
        <div class="city-list-tip">
          热门城市(支持汉字/拼音)
        </div>
        <!-- 分类头 -->
        <ul class="classify-list-top">
          <li v-for="cityClassify in cityClassifyList" :key="cityClassify.id"
              @click.prevent="currentClassifyId = cityClassify.id" :class="currentClassifyId === cityClassify.id ? 'on' : ''">
            {{cityClassify.name}}
          </li>
        </ul>
        <!-- 当前城市列表 -->
        <ul class="classify-list-bottom">
          <li v-for="(cityListItem, initial) in currentCityList" :key="initial">
            <span class="initial-title">{{initial}}</span>
            <div class="city-name-list">
              <span v-for="city in cityListItem" :key="city.name" @click.prevent="handleCity(city)">{{city.name}}</span>
            </div>
          </li>
        </ul>
      </div>
      <!-- 搜索城市 -->
      <ul class="search-list" v-if="cityName.length && showSearch" ref="searchListBox">
        <li v-for="(city, index) in searchCityList" :key="city.id" v-if="index < 4" :class="{ current: city.checked }" @click.prevent="handleSearch(city)">
          <span class="search-list-name" v-if="city.name !== city.prov">{{city.name}}，{{city.prov}}<span v-if="city.parent">，{{city.parent}}</span></span>
          <span class="search-list-name" v-if="city.name === city.prov">{{city.name}}<span v-if="city.parent">，{{city.parent}}</span></span>

          <span class="search-list-spell">城市</span>
          <span class="search-list-number" v-if="city.number">{{city.number}}家酒店</span>
        </li>
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
  </div>
</template>

<script>
import clickOutside from '@/directives/clickOutside'
import { mapGetters } from 'vuex'
import { unionSearch } from '@/api/keyword'
import { getCities } from '@/api/city'
import { setStore, getStore } from '@/util/store'

let cityClassifyList = [
  {
    id: 0,
    name: '热门城市'
  },
  {
    id: 1,
    name: 'ABCD'
  },
  {
    id: 2,
    name: 'EFGH'
  },
  {
    id: 3,
    name: 'JKLM'
    
  },
  {
    id: 4,
    name: 'NOPQRS'
  },
  {
    id: 5,
    name: 'TUVWX'
    
  },
  {
    id: 6,
    name: 'YZ'
    
  },
]

export default {
  name: 'CityList',
  props: {
    value: String,
    isShow: Boolean
  },
  directives: {
    clickOutside
  },
  data() {
    return {
      cityName: this.value,
      cityClassifyList,
      currentClassifyId: 0,
      isSearch: true,
      isContentDisplay: false,
      searchCityList: [],
      searchAllList: [],
      searchZoneList: [],
      searchHotelList: [],
      areaFormat: getStore({ name: 'getCitiesData' }) ? getStore({ name: 'getCitiesData' }) : { name: ''},
      showSearch: false
    }
  },
  computed: {
    ...mapGetters(['cityList', 'accountId']),
    currentCityList() {
      if(this.isSearch){
        if(this.currentClassifyId === 0){
          return {
            '': this.cityList.hotCityList
          }
        }
        let cityListMap = {}
        cityClassifyList.forEach(cityClassify => {
          if(cityClassify.id === this.currentClassifyId){
            cityClassify.name.split('').forEach(initial => {
              if(this.cityList.spellMap[initial]){
                cityListMap[initial] = this.cityList.spellMap[initial]
              }
            })
          }
        })
        return cityListMap
      } else {
        // eslint-disable-next-line
        this.isSearch = true
        return {
          '': this.cityList.hotCityList
        }
      }
    }
  },
  watch: {
    cityName(name) {
      this.$emit('input', name)
      let searchCityList = this.getSearchList(name)
      if (name && name.length > 0) {
        if (this.timeOut) {
          clearTimeout(this.timeOut)
        }
        this.timeOut = setTimeout(() => {
          unionSearch({
            keyWord: name,
            totolSize: searchCityList.length > 4 ? 6 : 10 - searchCityList.length
          }).then(res => {
            if (res.data.code === 0) {
              if (res.data.request.keyWord === this.cityName) {
                this.searchCityList = searchCityList
                console.log(res)
                res.data.data.zone.forEach((city) => {
                  city.checked = false
                  city.type = 'zone'
                })
                this.searchZoneList = res.data.data.zone
                res.data.data.hotel.forEach((city) => {
                  city.checked = false
                  city.type = 'hotel'
                })
                this.searchHotelList = res.data.data.hotel
                this.searchAllList = [...this.searchCityList, ...this.searchZoneList, ...this.searchHotelList]
                if(this.searchAllList.length){
                  const [firstCity] = this.searchAllList
                  firstCity.checked = true
                }
              }
            } else {
              this.searchAllList = this.searchCityList
            }
          })
        }, 500)
      } else {
        this.searchCityList = []
        this.searchZoneList = []
        this.searchHotelList = []
        this.contentShow()
      }
      let offsetTop = document.getElementsByClassName('inputCover')[0].offsetTop
      window.scrollTo(0, offsetTop)
    },
    isShow() {
      this.contentShow()
    }
  },
  created () {
    if (!getStore({ name: 'getCitiesData' })) {
      getCities().then(res => {
        if (res.data.code === 0 && res.data.data) {
          setStore({
            name: 'getCitiesData',
            content: JSON.parse(res.data.data)
          })
          this.areaFormat = getStore({ name: 'getCitiesData' })
        }
      })
    }
    window.globelEvent.$on('area', city => {
      console.log(111)
      this.cityName = city.name.split('|')[0] + '(' + this.cityName + ')'
      console.log(city)
      window.globelEvent.$emit('cityId', city.id.toString())
    })
  },
  methods: {
    focus (el) {
      el.target.parentNode.parentNode.setAttribute('data-status', true)
    },
    blur (el) {
      el.target.parentNode.parentNode.setAttribute('data-status', false)
    },
    contentClick () {
      if (!this.isContentDisplay) {
        this.showSearch = false
        this.contentShow()
      }
    },
    handleCity(city) {
      this.cityName = city.name
      this.isSearch = false
      this.isContentDisplay = false
      this.cityId = city.cityId
      window.globelEvent.$emit('cityId', city.cityId.toString())
    },
    handleSearch(city) {
      if (city.type === 3) {
        this.cityName = city.name + '(' + city.prov + ')'
      } else {
        this.cityName = city.name
      }
      this.cityId = city.cityId
      this.isSearch = false
      this.isContentDisplay = false
      window.globelEvent.$emit('cityId', city.cityId.toString())
    },
    zoneSearch (city) {
      this.cityName = city.cityName
      this.cityId = city.cityId
      window.globelEvent.$emit('keyword', city.name)
      window.globelEvent.$emit('cityId', city.cityId.toString())
      this.isSearch = false
      this.isContentDisplay = false
    },
    hotelSearch (city, bool) {
      if (this.accountId.length > 0 && !bool) {
        window.globelEvent.$emit('hotel', city.id)
      } else {
        this.cityName = city.cityName
        this.cityId = city.cityId
        window.globelEvent.$emit('keyword', city.hotelName)
        window.globelEvent.$emit('cityId', city.cityId.toString())
        this.isSearch = false
        this.isContentDisplay = false
      }
    },
    contentShow() {
      this.isContentDisplay = true
      this.isSearch = true
    },
    contentHide() {
      if (this.searchAllList.length > 0 && this.isContentDisplay && this.cityName.length > 0 && this.showSearch) {
        switch (this.searchAllList[0].type) {
          case 'zone':
            this.zoneSearch(this.searchAllList[0])
            break
          case 'hotel':
            this.hotelSearch(this.searchAllList[0], true)
            break
          default: 
            this.handleSearch(this.searchAllList[0])
        }
      }
      this.isContentDisplay = false
    },
    //新的城市搜索
    newSearchList (node, cityName, p1, p2) {
      let name, prov
      if (node.name.split('|').find((n) => n.startsWith(cityName))) {
        switch (node.type) {
          case 0:
            break
          case 1:
            [name] = node.subNodes[0].name.split('|');
            [prov] = node.name.split('|')
            this.searchResult[node.type].push({
              name,
              prov,
              number: node.subNodes[0].hotelCount,
              cityId: node.subNodes[0].id,
              checked: false
            })
            break
          case 2:
            [name] = node.name.split('|')
            this.searchResult[node.type].push({
              name,
              prov: p1,
              number: node.hotelCount,
              cityId: node.id,
              checked: false
            })
            break
          case 3:
            [name] = node.name.split('|')
            this.searchResult[node.type].push({
              name,
              prov: p2,
              cityId: node.id,
              parent: p1,
              checked: false,
              type: 3
            })
            break
        }
      }

      if (node.subNodes && node.subNodes.length > 0) {
        for (let i = 0; i < node.subNodes.length; i++) {
          switch (node.type) {
            case 0: 
              this.newSearchList(node.subNodes[i], cityName)
              break
            case 1: 
              this.newSearchList(node.subNodes[i], cityName, node.name.split('|')[0])
              break
            case 2: 
              this.newSearchList(node.subNodes[i], cityName, p1, node.name.split('|')[0])
              break
          }
        }
      }
    },
    // 输入搜索到的城市列表
    getSearchList(cityName) {
      if(!this.isSearch) {
        this.isSearch = true
        return []
      }

      this.searchResult = {
        1: [],
        2: [],
        3: []
      }
      if (cityName && cityName !== '|') {
        this.newSearchList(this.areaFormat, cityName)
      }
      for (let i = this.searchResult[1].length - 1; i >= 0; i--) {
        if (this.searchResult[2].find((n) => n.id === this.searchResult[1][i].id)) {
          this.searchResult[1].splice(i, 1)
        }
      }
      let searchCity = [...this.searchResult[2], ...this.searchResult[1], ...this.searchResult[3]]
      return searchCity
    },
    // 监听城市输入框
    monitorInput(e){
      if (this.isContentDisplay) {
        e.stopPropagation()
      }
      this.showSearch = true
      this.contentShow()
      const { searchAllList } = this
      if(!searchAllList.length) return
      let prevCityIndex = 0
      searchAllList.forEach((city, index) => {
        if(city.checked){
            prevCityIndex = index
        }
      })
      let currentCity = searchAllList[prevCityIndex]
      if(e.keyCode === 13){
        this.cityName = currentCity.name
        this.cityId = this.searchAllList[0].cityId
        window.globelEvent.$emit('cityId', this.cityId.toString())
        this.isContentDisplay = false
      } else if(e.keyCode === 38){
        if(prevCityIndex > 0){
          searchAllList[prevCityIndex].checked = false
          searchAllList[prevCityIndex - 1].checked = true
        }
      } else if(e.keyCode === 40){
        if(prevCityIndex < searchAllList.length - 1){
          searchAllList[prevCityIndex].checked = false
          searchAllList[prevCityIndex + 1].checked = true
        }
      } else {
        window.globelEvent.$emit('cityId', '')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.city-list-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  // width: 320px;
  width: 288px;
  font-size: 12px;
  .city-list-content {
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
    border: 0.5px solid #85bee5;
    margin-top: -1px;
    display: none;
    background-color: #fff;
    width: 400px;
    .city-list {
      .city-list-tip {
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
          .city-name-list {
            float: left;
            width: 432px;
            span {
              display: inline-block;
              width: 72px;
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
      // max-height: 500px;
      overflow: auto;
      li {
        padding: 5px;
        overflow: hidden;
        cursor: pointer;
        &:hover, &.current {
          background-color: #9cd9ff;
          color: #fff;
        }
        .search-list-name {
          width: 300px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .search-list-spell {
          float: right;
        }
        .search-list-number {
          float: right;
          margin-right: 50px;
        }
        .search-list-score {
          color: #009ced;
        }
        .search-list-address {
          width: 270px;
          display: inline-block;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
  .content-show {
    display: block;
  }
}
</style>
