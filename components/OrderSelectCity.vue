<template>
  <el-select v-model="LocalCityId" placeholder="请选择城市" filterable :filter-method="cityFilterMethod">
    <el-option v-for="item in cityList" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>
</template>

<script>
import { getStore } from '@/util/store'

export default {
  props: {
    cityId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      cityName: '',
      LocalCityId: this.cityId,
      cityList: []
    }
  },
  mounted () {
    this.getCityList();
  },
  watch: {
    cityId (value) {
      this.LocalCityId = value
    },
    LocalCityId (id) {
      window.globelEvent.$emit("destinationId", id);
      console.log(id)
      let city = this.cityList.find(item => {
        return item.value === id;
      });
      window.globelEvent.$emit("destinationName", city.label);
      console.log(city.label)
    }
  },
  methods: {
    getCityList () {
      let cityListStore = getStore({ name: 'cityList1' }).list.citys;
      this.cityList.length = 0;
      cityListStore.forEach(item => {
        let [city, spell] = item.split('|');
        let id = city.substring(0, 6);
        city = city.substring(city.lastIndexOf(',') + 1, );
        this.cityList.push({
          value: id,
          label: city,
          spell
        })
      });
    },
    cityFilterMethod (item) {
      this.getCityList();
      let arr = [];
      for (let i = 0; i < this.cityList.length; i++) {
        if (item && this.cityList[i].label.indexOf(item.toLocaleLowerCase()) > -1 || this.cityList[i].spell.indexOf(item.toLocaleLowerCase()) > -1) {
          arr.push(this.cityList[i]);
        }
      }
      this.cityList = arr
    },
  }
}
</script>