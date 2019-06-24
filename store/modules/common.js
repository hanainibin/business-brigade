import { setStore, getStore } from '@/util/store'
import { getCityList, getAirCityList } from '@/api/wxResign'

const common = {
  state: {
    showMap: false,
    showForm: false,
    showLongRoom: false,
    cityList:  getStore({
      name: 'cityList1'
    }) || {},
    airCityList:  getStore({
      name: 'flyCityList'
    }) || {},
    timeOffset: getStore({
      name: 'timeOffset'
    }) || 0
  },
  mutations: {
    SET_CITY_LIST: (state, data) => {
      let list = data
      let hotCityList = []
      let spellMap = {
        initialList: []
      }
      hotCityList = []
      list.citys.forEach((city, i) => {
        let cityDetail = city.split(',')[3]
        let cityInfo = cityDetail.split('|')
        let initial = cityInfo[1].substr(0,1).toLocaleUpperCase()
        if( !spellMap[initial] ){
          spellMap[initial] = []
          spellMap.initialList.push(initial)
        }
        let [name] = cityInfo
        let cityData = {
          cityId: city.split(',')[0],
          name,
          cityInfo
        }
        if(i < 16){
          hotCityList.push(cityData)
        }
        spellMap[initial].push(cityData)
      })

      state.cityList = {list, spellMap, hotCityList}
      setStore({
        name: 'cityList1',
        content: state.cityList
      })
    },
    SET_AIRCITY_LIST: (state, data) => {
      let list = data
      let hotAirCityList = []
      let spellMap = {
        initialList: []
      }
      hotAirCityList = []
      list.forEach((city, i) => {
        let airCityInfo = city.split('|')
        airCityInfo[1] = airCityInfo[2].substr(1).slice(0,airCityInfo[1].length-1)
        console.log(airCityInfo)
        let initial = airCityInfo[2].substr(0,1).toLocaleUpperCase()
        if( !spellMap[initial] ){
          spellMap[initial] = []
          spellMap.initialList.push(initial)
          
        }
        let [name] = airCityInfo
        let airCityData = {
          name,
          airCityInfo
        }
        // console.log(11)
        if(i < 13){
          hotAirCityList.push(airCityData)
        }
        spellMap[initial].push(airCityData)
      })

      state.airCityList = {list, spellMap, hotAirCityList}
      setStore({
        name: 'flyCityList',
        content: state.airCityList
      })
    }
  },
  actions: {
    GetCityList({ commit }) {
      return new Promise((resolve, reject) => {
        getCityList().then(res => {
          commit('SET_CITY_LIST',res.data.data)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    GetAirCityList({ commit }) {
      return new Promise((resolve, reject) => {
        getAirCityList().then(res => {
          // console.log(res.data.citys)
          commit('SET_AIRCITY_LIST',res.data)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default common
