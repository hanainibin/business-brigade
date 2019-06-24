<template>
  <div class="long-form" v-show="showLongRoom">
    <div class="long-room-form">
      <i class="el-icon-close" v-on:click="closeLongRoom"></i>
      <div class="house-info">
        <div class="house-item">
          <span class="title">住房规模</span>
          <div class="house-item-form">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="form-item">
                  <span class="item-name">城市</span>
                  <CityList :isShow="isShow" v-model="inputForm.city" class="item-input city-list"/>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="form-item">
                  <span class="item-name">人数</span>
                  <el-select v-model="inputForm.number" placeholder="请选择人数" class="item-input form-number" value="">
                    <el-option v-for="item in numberArr" :label="item.label" :value="item.value" :key="item.label"></el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="form-item">
                  <span class="item-name">类型</span>
                  <el-select v-model="inputForm.type" placeholder="请选择类型" class="item-input" value="">
                    <el-option v-for="item in typeArr" :label="item.label" :value="item.value" :key="item.label"></el-option>
                  </el-select>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="house-item">
          <span class="title">住房时间</span>
          <div class="house-item-form">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="form-item">
                  <span class="item-name">开始日期</span>
                  <el-date-picker type="date" v-model="inputForm.startDate" prefix-icon="time-icon"
                                  placeholder="请选择开始日期" @change="changeStartTime" :picker-options="pickerToday"
                                  :editable="false" :clearable="false" class="item-input item-input-long"></el-date-picker>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="form-item">
                  <span class="item-name">租房时长</span>
                  <el-select v-model="inputForm.time" placeholder="请选择租房时长" class="item-input item-input-long" value="">
                    <el-option v-for="item in timeArr" :label="item.label" :value="item.value" :key="item.label"></el-option>
                  </el-select>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="house-item">
          <span class="title">联系方式</span>
          <div class="house-item-form">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="form-item">
                  <span class="item-name">联系人</span>
                  <el-input v-model="inputForm.linkman" placeholder="请输入联系人姓名" :clearable="false" class="item-input item-input-long"/>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="form-item">
                  <span class="item-name">联系方式</span>
                  <el-input v-model="inputForm.linkPhone" placeholder="请输入联系人电话" :clearable="false" class="item-input item-input-long"/>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="form-bottom">
        <el-button type="primary" class="submit-button" @click="saveButton">确认提交</el-button>
        <span class="message">已有1000+企业实现租房需求</span>
      </div>
    </div>
  </div>
</template>

<script>
	import {dateFormat} from '@/util/lobal.js'
	import { mapGetters, mapMutations } from 'vuex'
	import CityList from '@/components/CityList.vue'
	import {savePermanentRoom} from '@/api/wxResign'

	export default {
		components: {
			CityList
    },
		data(){
			return {
				inputForm: {
					city: '',
          number: '',
          type: '',
					startDate: '',
					time: '',
          linkman: '',
          linkPhone: ''
        },
				isShow: false,
				numberArr: [
          {label: '10人以下', value: '10人以下'},
					{label: '10-30人', value: '10-30人'},
					{label: '30-50人', value: '30-50人'},
					{label: '50-100人', value: '50-100人'},
					{label: '100-200人', value: '100-200人'},
					{label: '200-500人', value: '200-500人'},
					{label: '500人以上', value: '500人以上'}
				],
				typeArr: [
					{label: '单间', value: '单间'},
					{label: '一室一厅', value: '一室一厅'},
					{label: '两室一厅', value: '两室一厅'},
					{label: '三室一厅', value: '三室一厅'}
        ],
				timeArr: [
					{label: '5-10天', value: '5-10天'},
					{label: '10-30天', value: '10-30天'},
					{label: '1-3个月', value: '1-3个月'},
					{label: '3-5个月', value: '3-5个月'},
					{label: '半年以上', value: '半年以上'}
        ],
				pickerToday: {
					disabledDate: time => {
						return time.getTime() < Date.now() - 8.64e7
					}
				},
      }
    },
		computed: {
			...mapGetters(['showLongRoom'])
		},
		methods: {
			...mapMutations(['setState']),
			closeLongRoom () {
				this.setState({
					key: 'showLongRoom',
					module: 'common',
					value: false
				});
				this.inputForm.city = '';
				this.inputForm.time = '';
				this.inputForm.linkPhone = '';
				this.inputForm.linkman = '';
				this.inputForm.type = '';
				this.inputForm.number = '';
				this.inputForm.startDate = '';
			},
			changeStartTime(value) {
				this.inputForm.startDate = new Date(value.getTime());
      },
      saveButton({
         cityName = this.inputForm.city,
         days = this.inputForm.time,
         linkMobile = this.inputForm.linkPhone,
         linkPeople = this.inputForm.linkman,
         meetType = this.inputForm.type,
         number = this.inputForm.number,
         startDate = this.inputForm.startDate
      } = {}) {
        if (cityName === '') {
					this.$message({
						message: '请选择城市！',
						type: 'warning'
					})
        } else if (number === '') {
					this.$message({
						message: '请选择人数！',
						type: 'warning'
					})
				}else if (meetType === '') {
					this.$message({
						message: '请选择类型！',
						type: 'warning'
					})
				}else if (startDate === '') {
					this.$message({
						message: '请选择开始日期！',
						type: 'warning'
					})
				}else if (days === '') {
					this.$message({
						message: '请选择租房时长！',
						type: 'warning'
					})
				}else if (linkPeople === '') {
					this.$message({
						message: '请填写联系人！',
						type: 'warning'
					})
				}else if (linkMobile === '') {
					this.$message({
						message: '请填写联系人电话！',
						type: 'warning'
					})
				} else {
					startDate = dateFormat(this.inputForm.startDate, 'yyyy-MM-dd hh:mm:ss');
					savePermanentRoom({
						cityName,
						days,
						linkMobile,
						linkPeople,
						meetType,
						number,
						startDate
					}).then(res => {
            if (res.data.code === 0) {
							this.$message({
								message: '提交成功',
								type: 'success'
							});
							this.closeLongRoom();
            } else {
							if (res.data.msg) {
								this.$message({
									message: res.data.msg,
									type: 'warning'
								})
							}
            }
          })
        }
      }
		}
	}
</script>

<style lang="less">
  .long-form {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1;
    .long-room-form{
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -321px;
      margin-top: -276px;
      width: 642px;
      height: 552px;
      border-radius: 8px;
      overflow: hidden;
      background: white;
      .el-icon-close {
        cursor: pointer;
        float: right;
        margin-top: 33px;
        margin-right: 36px;
      }
      .house-info{
        margin-left: 36px;
        margin-top: 46px;
        width: 575px;
        .house-item{
          .title{
            display: inline-block;
            font-size: 22px;
            font-weight: 400;
            margin-bottom: 18px;
          }
          .house-item-form{
            margin-bottom: 32px;
            .form-item{
              background: #FAFBFF;
              height: 48px;
              box-sizing: border-box;
              border: 0.5px solid #EAEEF4;
              border-radius: 5px;
              z-index: 2;
              .item-name{
                display: inline-block;
                line-height: 48px;
                font-size: 15px;
                padding: 0 0 0 17px;
              }
              .item-input{
                width: 129px;
                .el-input__inner{
                  background: #FAFBFF;
                  height: 42px;
                  border: none;
                }
              }
              .form-number{
                z-index: 3;
              }
              .city-list{
                top:4px;
                left: 64px;
                width: 355px;
                z-index: 1;
                input{
                  width: 120px !important;
                  height: 43px;
                  border: none;
                  outline: none;
                  background: #FAFBFF;
                  margin-bottom: 2px;
                }
              }
              .item-input-long{
                width: 193px;
              }
            }
          }
        }
      }
      .form-bottom{
        text-align: center;
        .submit-button{
          width: 175px;
          height: 55px;
          font-size: 20px;
        }
        .message{
          display: block;
          color: #3093F8;
          font-size: 16px;
          margin-top: 18px;
        }
      }
    }
  }
</style>
