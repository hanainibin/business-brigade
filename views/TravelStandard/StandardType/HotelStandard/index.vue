<template>
  <div class="hotel-standard-wrapper">
    <header>
      <span class="add-btn" @click="addStandardDialogVisible = true">
        <i>&#xe607;</i>
        新增标准
      </span>
      <span class="add-btn" @click="cityTypeDialogVisible = true">
        <i>&#xe626;</i>
        城市分类
      </span>
    </header>
    <div class="standard-content" v-loading="loading">
      <section class="standard-detail" v-for="(item, index) in hotelStandardList" :key="item.standardHotelNo" 
               :class="index%2 === 0 ? 'even-section' : ''">
        <h1>{{item.standardName}}</h1>
        <ul class="detail-list">
          <li class="list-item">
            <span class="title">标准名称：</span>
            <input class="standard-name-input" type="text" placeholder="请输入标准名称" v-model="item.standardName">
          </li>
          <li class="list-item" v-if="!item.isDefault">
            <span class="title">状态：</span>
            <SwitchItem :btnText="btnTextArr[index].status" :switchOn="item.status" @switchBoolean="statusSwitch(index, 'status')"/>
          </li>
          <li class="list-item">
            <span class="title">预订限制：</span>
            <el-popover placement="bottom" width="200" trigger="hover">
              <div>
                <p>
                  <strong>人工审批：</strong>
                  使用该标准的员工出差单需要所有审批人手工审批
                </p>
                <P>
                  <strong>自动审批：</strong>
                  使用该标准的员工出差单自动审批到最终审批人手中
                </P>
              </div>
              <SwitchItem slot="reference" :btnText="btnTextArr[index].manualStatus" :switchOn="item.manualStatus"
                          @switchBoolean="statusSwitch(index, 'manualStatus')"/>
            </el-popover>
            <el-popover placement="bottom" width="200" trigger="hover">
              <div>
                <p>
                  <strong>出差申请：</strong>
                  使用该标准的员工出差单需要手工填报出差申请单
                </p>
                <P>
                  <strong>无限制：</strong>
                  使用该标准的员工出差单会自动生成
                </P>
              </div>
              <SwitchItem slot="reference" :btnText="btnTextArr[index].travelApplyStatus" :switchOn="item.travelApplyStatus"
                          @switchBoolean="statusSwitch(index, 'travelApplyStatus')"/>
            </el-popover>
          </li>
          <!-- 暂时不需要这个开关 -->
          <!-- <li class="list-item">
            <span class="title">必须协议酒店：</span>
            <SwitchItem :btnText="btnTextArr[index].agreementHotelStatus" :switchOn="item.agreementHotelStatus"
                        @switchBoolean="statusSwitch(index, 'agreementHotelStatus')"/>
          </li> -->
          <li class="list-item">
            <span class="title">出差预警：</span>
            <el-popover placement="bottom" width="200" trigger="hover">
              <div>
                <p>
                  <strong>启用：</strong>
                  使用该标准的员工超标时需要最终审批人手工审批
                </p>
                <P>
                  <strong>停用：</strong>
                  使用该标准的员工超标不强制最终审批人手工审批
                </P>
              </div>
              <SwitchItem slot="reference" :btnText="btnTextArr[index].surpassWarnStatus" :switchOn="item.surpassWarnStatus"
                          @switchBoolean="statusSwitch(index, 'surpassWarnStatus')"/>
            </el-popover>
          </li>
          <li class="list-item">
            <span class="title">住宿标准：</span>
            <ul class="city-standard-list">
              <li class="list-item">
                <span class="city-title">所有城市</span>
                <i class="single-person">&#xe615;</i>：
                <input class="price-input" v-model="item.aone" type="tel" onKeypress="if(event.key === 'Backspace') return; return (/[\d]/.test(String.fromCharCode(event.keyCode || event.charCode)))" placeholder="价格"
                       oninput="if(value.length>6)value=value.slice(0,6)"> 
                <i class="double-people">&#xe633;</i>：
                <input class="price-input" type="tel" v-model="item.atwo" onKeypress="if(event.key === 'Backspace') return; return (/[\d]/.test(String.fromCharCode(event.keyCode || event.charCode)))" placeholder="价格"
                       oninput="if(value.length>6)value=value.slice(0,6)">
                <span class="price-per">￥/间夜</span>
                <el-popover
                  placement="bottom"
                  width="200"
                  trigger="hover">
                  <div>
                    <h4>住宿标准示例：</h4>
                    <p>一类：300-500￥/间夜</p>
                    <p>表示划分为一类的城市单人出差标准为300￥/间夜，双人出差拼房的标准为500￥/间夜</p>
                  </div>
                  <span class="question-icon" slot="reference">&#xe612;</span>
                </el-popover>
              </li>
              <li class="list-item" v-if="cityNameObj[1]">
                <span class="city-title">一类</span>
                <i class="single-person">&#xe615;</i>：
                <input class="price-input" type="tel" v-model="item.bone" onKeypress="if(event.key === 'Backspace') return; return (/[\d]/.test(String.fromCharCode(event.keyCode || event.charCode)))" placeholder="价格"
                       oninput="if(value.length>6)value=value.slice(0,6)">
                <i class="double-people">&#xe633;</i>：
                <input class="price-input" type="tel" v-model="item.btwo" onKeypress="if(event.key === 'Backspace') return; return (/[\d]/.test(String.fromCharCode(event.keyCode || event.charCode)))" placeholder="价格"
                       oninput="if(value.length>6)value=value.slice(0,6)">
                <span class="price-per">￥/间夜</span>
              </li>
              <li class="list-item" v-if="cityNameObj[2]">
                <span class="city-title">二类</span>
                <i class="single-person">&#xe615;</i>：
                <input class="price-input" type="tel" v-model="item.cone" onKeypress="if(event.key === 'Backspace') return; return (/[\d]/.test(String.fromCharCode(event.keyCode || event.charCode)))" placeholder="价格"
                       oninput="if(value.length>6)value=value.slice(0,6)"> 
                <i class="double-people">&#xe633;</i>：
                <input class="price-input" type="tel" v-model="item.ctwo" onKeypress="if(event.key === 'Backspace') return; return (/[\d]/.test(String.fromCharCode(event.keyCode || event.charCode)))" placeholder="价格"
                       oninput="if(value.length>6)value=value.slice(0,6)">
                <span class="price-per">￥/间夜</span>
              </li>
              <li class="list-item" v-if="cityNameObj[3]">
                <span class="city-title">三类</span>
                <i class="single-person">&#xe615;</i>：
                <input class="price-input" type="tel" v-model="item.done" onKeypress="if(event.key === 'Backspace') return; return (/[\d]/.test(String.fromCharCode(event.keyCode || event.charCode)))" placeholder="价格"
                       oninput="if(value.length>6)value=value.slice(0,6)"> 
                <i class="double-people">&#xe633;</i>：
                <input class="price-input" type="tel" v-model="item.dtwo" onKeypress="if(event.key === 'Backspace') return; return (/[\d]/.test(String.fromCharCode(event.keyCode || event.charCode)))" placeholder="价格"
                       oninput="if(value.length>6)value=value.slice(0,6)">
                <span class="price-per">￥/间夜</span>
              </li>
              <li class="list-item" v-if="cityNameObj[4]">
                <span class="city-title">四类</span>
                <i class="single-person">&#xe615;</i>：
                <input class="price-input" type="tel" v-model="item.eone" onKeypress="if(event.key === 'Backspace') return; return (/[\d]/.test(String.fromCharCode(event.keyCode || event.charCode)))" placeholder="价格"
                       oninput="if(value.length>6)value=value.slice(0,6)">
                <i class="double-people">&#xe633;</i>：
                <input class="price-input" type="tel" v-model="item.etwo" onKeypress="if(event.key === 'Backspace') return; return (/[\d]/.test(String.fromCharCode(event.keyCode || event.charCode)))" placeholder="价格"
                       oninput="if(value.length>6)value=value.slice(0,6)">
                <span class="price-per">￥/间夜</span>
              </li>
              <li class="list-item" v-if="cityNameObj[5]">
                <span class="city-title">五类</span>
                <i class="single-person">&#xe615;</i>：
                <input class="price-input" type="tel" v-model="item.fone" onKeypress="if(event.key === 'Backspace') return; return (/[\d]/.test(String.fromCharCode(event.keyCode || event.charCode)))" placeholder="价格"
                       oninput="if(value.length>6)value=value.slice(0,6)">
                <i class="double-people">&#xe633;</i>：
                <input class="price-input" type="tel" v-model="item.ftwo" onKeypress="if(event.key === 'Backspace') return; return (/[\d]/.test(String.fromCharCode(event.keyCode || event.charCode)))" placeholder="价格"
                       oninput="if(value.length>6)value=value.slice(0,6)">
                <span class="price-per">￥/间夜</span>
              </li>
            </ul>
          </li>
          <li class="save-btn-cover">
            <el-button class="save-btn" size="medium" @click="saveStandardModify(item)">保存</el-button>
          </li>
        </ul>
      </section>
    </div>
    <el-dialog
      title="新增标准"
      :visible.sync="addStandardDialogVisible"
      width="450px">
      <div class="add-standard-dialog">
        <span>标准名称：</span>
        <input type="text" placeholder="请输入标准名称" v-model="addStandardName">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addStandardDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStandard">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="城市分类"
      :visible.sync="cityTypeDialogVisible"
      width="450px">
      <div class="city-type-dialog">
        <div>
          <span>分类标签：</span>
          <!-- 分类选择 -->
          <el-select class="type-select" v-model="cityTypeValue" placeholder="请选择">
            <el-option
              v-for="item in cityTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <!-- 城市选择 -->
          <el-select class="city-select" v-model="cityName" filterable placeholder="请输入拼音或汉字"
                     :filter-method="cityFilterMethod">
            <el-option
              v-for="item in cityList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span class="add-icon" @click="addCityToType">&#xe607;</span>
        </div>
        <ul class="city-name-list">
          <li class="list-item" v-for="(item, index) in cityNameObj[cityTypeValue]" :key="index">
            {{item.label}}
            <span class="delete-icon" @click="deleteCityName(index)">&#xe618;</span>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cityTypeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCityModify">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SwitchItem from '@/components/SwitchItem.vue'
import { hotelListQuery, hotelModify, hotelNew, cityTagList, cityModify } from '@/api/travelStandard.js'
import { getStore } from '@/util/store'

export default {
  components: {
    SwitchItem
  },
  data() {
    return {
      statusText: '启用',
      hotelStandardList: [],
      loading: false,
      addStandardName: '',
      addStandardDialogVisible: false,
      cityTypeDialogVisible: false,
      cityTypeList: [
        {
          label: '一类',
          value: 1
        },
        {
          label: '二类',
          value: 2
        },
        {
          label: '三类',
          value: 3
        },
        {
          label: '四类',
          value: 4
        },
        {
          label: '五类',
          value: 5
        }
      ],
      cityTypeValue: 1,
      cityName: '',
      cityList: [],
      cityNameObj: {},
      btnTextArr: [],
      text1: ['停用', '启用'], 
      text2: ['自动审批', '人工审批'],
      text3: ['无限制', '出差申请'],
      text4: ['否', '是']
    }
  },
  watch: {
    cityTypeValue(value, oldValue) {
      // 将用户上一次选择的分类城市提交给后端，调城市分类修改接口
      if (this.cityNameObj[oldValue]) {
        let arr = []
        for (let i=0; i<this.cityNameObj[oldValue].length; i++) {
          arr.push(this.cityNameObj[oldValue][i].value)
        }
        cityModify({
          citys: arr,
          tags: oldValue
        })
      }
    }
  },
  created() {
    this.getCityTagList()
    this.cityTypeValue = this.cityTypeList[0].value
  },
  mounted() {
    this.getHotelStandardList()
    this.getCityList()
  },
  methods: {
    getCityTagList() {
      this.loading = true
      cityTagList().then(res => {
        if (res.data.code === 0) {
          this.loading = false
          if (res.data.data.length > 0) {
            res.data.data.forEach(val => {
              if (val.citys.length > 2) {
                val.citys = val.citys.substr(0, val.citys.length - 1)
                val.citys = val.citys.substr(1, val.citys.length - 1)
                val.citys = val.citys.split(',')
                // 根据返回Id组出城市列表
                let arr = []
                for (let i=0; i<this.cityList.length; i++) {
                  for (let j=0; j<val.citys.length; j++) {
                    if (val.citys[j] === this.cityList[i].value) {
                      arr.push(this.cityList[i])
                    }
                  }
                }
                this.cityNameObj[val.tags] = arr
              }
            })
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    getCityList() {
      let cityListStore = getStore({ name: 'cityList1' }).list.citys
      this.cityList.length = 0
      for (let i=0; i<cityListStore.length; i++) {
        let [ city, spell, ] = cityListStore[i].split('|')
        let id = city.substring(0, 6)
        city = city.substring(city.lastIndexOf(',') + 1,)
        this.cityList.push({
          value: id,
          label: city,
          spell
        })
      }
    },
    getHotelStandardList() {
      this.loading = true
      // 住宿标准列表
      hotelListQuery().then(res => {
        this.loading = false
        if (res.data.code === 0) {
          if (res.data.data.length > 0) {
            this.hotelStandardList = [...res.data.data]
            this.btnTextArr.length = 0
            for (let i=0; i<this.hotelStandardList.length; i++) {
              this.hotelStandardList[i].aone = this.hotelStandardList[i].aone / 100
              this.hotelStandardList[i].bone = this.hotelStandardList[i].bone / 100
              this.hotelStandardList[i].cone = this.hotelStandardList[i].cone / 100
              this.hotelStandardList[i].done = this.hotelStandardList[i].done / 100
              this.hotelStandardList[i].eone = this.hotelStandardList[i].eone / 100
              this.hotelStandardList[i].fone = this.hotelStandardList[i].fone / 100
              this.hotelStandardList[i].atwo = this.hotelStandardList[i].atwo / 100
              this.hotelStandardList[i].btwo = this.hotelStandardList[i].btwo / 100
              this.hotelStandardList[i].ctwo = this.hotelStandardList[i].ctwo / 100
              this.hotelStandardList[i].dtwo = this.hotelStandardList[i].dtwo / 100
              this.hotelStandardList[i].etwo = this.hotelStandardList[i].etwo / 100
              this.hotelStandardList[i].ftwo = this.hotelStandardList[i].ftwo / 100
              this.btnTextArr.push({
                status: this.text1[this.hotelStandardList[i].status],
                manualStatus: this.text2[this.hotelStandardList[i].manualStatus],
                travelApplyStatus: this.text3[this.hotelStandardList[i].travelApplyStatus],
                agreementHotelStatus: this.text4[this.hotelStandardList[i].agreementHotelStatus],
                surpassWarnStatus: this.text1[this.hotelStandardList[i].surpassWarnStatus],
                standardFlightNo: this.hotelStandardList[i].standardHotelNo,
                standardName: this.hotelStandardList[i].standardName
              })
            }
          }
        } else this.$message.error(res.data.msg)
      }) 
    },
    statusSwitch(index, str) {
      Object.keys(this.hotelStandardList[index]).forEach(val => {
        if (val === str) {
          if (this.hotelStandardList[index][val]) {
            this.hotelStandardList[index][val] = 0
          } else this.hotelStandardList[index][val] = 1
        }
      })
      if (str === 'manualStatus') {
        this.btnTextArr[index][str] = this.text2[this.hotelStandardList[index][str]]
      } else if (str === 'travelApplyStatus') {
        this.btnTextArr[index][str] = this.text3[this.hotelStandardList[index][str]]
      } else if (str === 'agreementHotelStatus') {
        this.btnTextArr[index][str] = this.text4[this.hotelStandardList[index][str]]
      } else {
        this.btnTextArr[index][str] = this.text1[this.hotelStandardList[index][str]]
      }
    },
    saveStandardModify(item) {
      hotelModify({
        agreementHotelStatus: item.agreementHotelStatus,
        aone: item.aone * 100,
        atwo: item.atwo * 100,
        bone: item.bone * 100,
        btwo: item.btwo * 100,
        cone: item.cone * 100,
        ctwo: item.ctwo * 100,
        done: item.done * 100,
        dtwo: item.dtwo * 100,
        eone: item.eone * 100,
        etwo: item.etwo * 100,
        fone: item.fone * 100,
        ftwo: item.ftwo * 100,
        manualStatus: item.manualStatus,
        standardHotelNo: item.standardHotelNo,
        standardName: item.standardName,
        status: item.status,
        surpassWarnStatus: item.surpassWarnStatus,
        travelApplyStatus: item.travelApplyStatus
      }).then(res => {
        if (res.data.code === 0 && res.data.data) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getHotelStandardList()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    addStandard() {
      if (!this.addStandardName) {
        this.$message({
          message: '请输入标准名称！',
          type: 'warning'
        })
        return
      }
      hotelNew({
        standardName: this.addStandardName
      }).then(res => {
        if (res.data.code === 0 && res.data.data) {
          this.addStandardDialogVisible = false
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.getHotelStandardList()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    addCityToType() {
      for (let i=0; i<this.cityList.length; i++) {
        if (this.cityName === this.cityList[i].value) {
          if (!this.cityNameObj[this.cityTypeValue]) {
            this.cityNameObj[this.cityTypeValue] = []
          }
          this.cityNameObj[this.cityTypeValue] = [...this.cityNameObj[this.cityTypeValue], this.cityList[i]]
          // 层级太深，触发DOM的更新
          this.cityNameObj = {...this.cityNameObj}
          // cityNameObj去重
          let obj = {}, result = []
          for (let i=0; i<this.cityNameObj[this.cityTypeValue].length; i++) {
            if (!obj[this.cityNameObj[this.cityTypeValue][i].value]) {
              result.push(this.cityNameObj[this.cityTypeValue][i])
              obj[this.cityNameObj[this.cityTypeValue][i].value] = true
            }
          }
          this.cityNameObj[this.cityTypeValue] = result
        }
      }
    },
    deleteCityName(index) {
      this.cityNameObj[this.cityTypeValue].splice(index, 1)
      // 层级太深，触发DOM的更新
      this.cityNameObj = {...this.cityNameObj}
    },
    cityFilterMethod(item) {
      this.getCityList()
      let arr = []
      for (let i=0; i<this.cityList.length; i++) {
        if (item && this.cityList[i].label.indexOf(item.toLocaleLowerCase()) > -1 || this.cityList[i].spell.indexOf(item.toLocaleLowerCase()) > -1) {
          arr.push(this.cityList[i])
        }
      }
      this.cityList = arr
    },
    handleCityModify() {
      // 处理传给后端的数据
      let arr = []
      for (let i=0; i<this.cityNameObj[this.cityTypeValue].length; i++) {
        arr.push(this.cityNameObj[this.cityTypeValue][i].value)
      }
      cityModify({
        citys: arr,
        tags: this.cityTypeValue
      }).then(res => {
        if (res.data.code === 0 && res.data.data) {
          this.cityTypeDialogVisible = false
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.getCityTagList()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less">
@import './style.less';
</style>

