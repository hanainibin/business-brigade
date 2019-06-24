<template>
  <div class="reserve-form" v-show="showForm">
    <div class="company-fair-form">
      <i class="el-icon-close" v-on:click="closeForm"></i>
      <div class="house-info">
        <div class="house-item">
          <span class="title">会议规模</span>
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
                  <span class="item-name">预算</span>
                  <el-select v-model="inputForm.money" placeholder="请选择预算" class="item-input" value="">
                    <el-option v-for="item in moneyArr" :label="item.label" :value="item.value" :key="item.label"></el-option>
                  </el-select>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="house-item">
          <span class="title">会议时间</span>
          <div class="house-item-form">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="form-item">
                  <span class="item-name">会议时间</span>
                  <el-date-picker type="datetime" v-model="inputForm.startTime" prefix-icon="time-icon"
                                  placeholder="请选择开始日期" @change="changeStartTime" :picker-options="pickerToday"
                                  :editable="false" :clearable="false" class="item-input item-input-long"></el-date-picker>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="form-item">
                  <span class="item-name">会议时长</span>
                  <el-select v-model="inputForm.time" placeholder="请选择会议时长" class="item-input item-input-long" value="">
                    <el-option v-for="item in timeArr" :label="item.label" :value="item.value" :key="item.label"></el-option>
                  </el-select>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="house-item">
          <span class="title">会议类型</span>
          <div class="house-item-form">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="form-item">
                  <span class="item-name">会议类型</span>
                  <el-select v-model="inputForm.type" placeholder="请选择会议类型" class="item-input item-input-long" value="">
                    <el-option v-for="item in typeArr" :label="item.label" :value="item.value" :key="item.label"></el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="form-item">
                  <span class="item-name">会议需求</span>
                  <el-select class="item-input item-input-long" value="" :disabled="true" placeholder="">
                  </el-select>
                </div>
                <el-popover width="454" style="left: 487px" v-model="needVisible" class="search-select">
                  <div class="search-select-options">
                    <span class="options-close" @click="needVisible = false">
                      <i class="el-icon-close"></i>
                    </span>
                    <span class="options-title">会场需求</span>
                    <el-checkbox-group v-model="selectNeed" size="mini">
                      <el-checkbox-button v-for="item in needArr" :label="item.label" :key="item.label" @click.native.prevent="needGroupCheck(item)">
                        {{item.label}}
                      </el-checkbox-button>
                    </el-checkbox-group>
                    <span class="options-title">额外需求</span>
                    <el-checkbox-group v-model="selectOtherNeed" size="mini">
                      <el-checkbox-button v-for="item in otherNeedArr" :label="item.label" :key="item.label" @click.native.prevent="otherNeedGroupCheck(item)">
                        {{item.label}}
                      </el-checkbox-button>
                    </el-checkbox-group>
                  </div>
                  <span slot="reference" class="options-text">{{inputForm.need}}</span>
                </el-popover>
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
                  <el-input v-model="inputForm.linkman" placeholder="请输入联系人姓名" :clearable="false" class="item-input item-input-long"></el-input>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="form-item">
                  <span class="item-name">联系方式</span>
                  <el-input v-model="inputForm.linkPhone" placeholder="请输入联系人电话" :clearable="false" class="item-input item-input-long"></el-input>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="form-bottom">
        <el-button type="primary" class="submit-button" @click="saveReserveForm">确认提交</el-button>
        <span class="message">金牌会议顾问实时在线为你服务</span>
      </div>
    </div>
  </div>
</template>

<script>
	import {dateFormat} from '@/util/lobal.js'
	import { mapGetters, mapMutations } from 'vuex'
	import CityList from '@/components/CityList.vue'
	import {saveReserve} from '@/api/wxResign'

	export default {
		components: {
			CityList
    },
		data(){
			return {
				inputForm: {
					city: '',
          number: '',
          money: '',
					startTime: '',
					time: '',
					type: '',
          need: '请选择会议需求',
          linkman: '',
          linkPhone: ''
        },
				isShow: false,
				needVisible: false,
				numberArr: [
          {label: '10人以下', value: '10人以下'},
					{label: '10-30人', value: '10-30人'},
					{label: '30-50人', value: '30-50人'},
					{label: '50-100人', value: '50-100人'},
					{label: '100-200人', value: '100-200人'},
					{label: '200-500人', value: '200-500人'},
					{label: '500人以上', value: '500人以上'}
				],
				moneyArr: [
					{label: '3000以下', value: '3000以下'},
					{label: '3000-5000', value: '3000-5000'},
					{label: '5000-10000', value: '5000-10000'},
					{label: '10000-20000', value: '10000-20000'},
					{label: '20000-30000', value: '20000-30000'},
					{label: '30000-50000', value: '30000-50000'},
					{label: '50000-80000', value: '50000-80000'},
					{label: '80000-100000', value: '80000-100000'},
					{label: '100000+', value: '100000+'}
        ],
				typeArr: [
					{label: '公司年会', value: '公司年会'},
					{label: '培训会/讲座', value: '培训会/讲座'},
					{label: '工作会/总结会', value: '工作会/总结会'},
					{label: '发布会', value: '发布会'},
					{label: '研讨/论坛', value: '研讨/论坛'},
					{label: '经销招商会/推介会', value: '经销招商会/推介会'},
					{label: '同学/好友聚会', value: '同学/好友聚会'},
					{label: '团设/拓展会', value: '团设/拓展会'},
					{label: '沙龙/其它会', value: '沙龙/其它会'}
        ],
        needArr: [
					{label: '会场', value: '会场'},
					{label: '会场+用餐', value: '会场+用餐'},
					{label: '会场+住宿', value: '会场+住宿'},
					{label: '会场+用餐+住宿', value: '会场+用餐+住宿'}
        ],
        otherNeedArr: [
					{label: '同时需要搭建、用车、等其他会议服务', value: '同时需要搭建、用车、等其他会议服务'},
					{label: '同时需要会议主持、礼服服务', value: '同时需要会议主持、礼服服务'}
        ],
        selectNeed: [],
				selectOtherNeed: [],
				timeArr: [
					{label: '一晚', value: '一晚'},
					{label: '半天', value: '半天'},
					{label: '1天', value: '1天'},
					{label: '2天', value: '2天'},
					{label: '3天', value: '3天'},
					{label: '4天', value: '4天'},
					{label: '5天', value: '5天'},
					{label: '5天以上', value: '5天以上'}
        ],
				pickerToday: {
					disabledDate: time => {
						return time.getTime() < Date.now() - 8.64e7
					}
				},
      }
    },
		computed: {
			...mapGetters(['showForm'])
		},
		methods: {
			...mapMutations(['setState']),
			closeForm () {
				this.setState({
					key: 'showForm',
					module: 'common',
					value: false
				});
				this.inputForm.city = '';
				this.inputForm.time = '';
				this.inputForm.money = '';
				this.inputForm.linkPhone = '';
				this.inputForm.linkman = '';
				this.inputForm.type = '';
				this.inputForm.need = '请选择会议需求';
				this.selectNeed = [];
				this.selectOtherNeed = [];
				this.inputForm.number = '';
				this.inputForm.startTime = '';
			},
			changeStartTime(value) {
				this.inputForm.startTime = new Date(value.getTime());
      },
			needGroupCheck(item) {
				if (this.selectNeed[0] === item.label) {
					this.selectNeed = [];
				} else {
					this.selectNeed = [item.label];
				}
				let num = this.selectNeed.length + this.selectOtherNeed.length;
				if (num === 0) {
					this.inputForm.need = "请选择会议需求";
				} else {
					this.inputForm.need = "已选" + num + "项";
				}
      },
      otherNeedGroupCheck(item) {
				let flag = true;
				let index = 0;
				for (let i = 0; i < this.selectOtherNeed.length; i++) {
					if (this.selectOtherNeed[i] === item.label) {
						flag = false;
						index = i;
						break;
					}
				}
				if (flag && this.selectOtherNeed.length < 3) {
					this.selectOtherNeed.push(item.label);
				} else if (!flag) {
					this.selectOtherNeed.splice(index, 1);
				} else {
					this.$message('最多只能选择三项');
				}
				let num = this.selectNeed.length + this.selectOtherNeed.length;
				if (num === 0) {
					this.inputForm.need = "请选择会议需求";
				} else {
					this.inputForm.need = "已选" + num + "项";
        }
      },
			saveReserveForm({
         budget = this.inputForm.money,
         cityName = this.inputForm.city,
         hours = this.inputForm.time,
         linkMobile = this.inputForm.linkPhone,
         linkPeople = this.inputForm.linkman,
         meetNeeds = this.selectNeed,
         meetType = this.inputForm.type,
         number = this.inputForm.number,
         remarks = this.selectOtherNeed,
         startDate = this.inputForm.startTime
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
				}else if (budget === '') {
					this.$message({
						message: '请选择预算！',
						type: 'warning'
					})
				}else if (startDate === '') {
					this.$message({
						message: '请选择会议时间！',
						type: 'warning'
					})
				}else if (hours === '') {
					this.$message({
						message: '请选择会议时长！',
						type: 'warning'
					})
				}else if (meetType === '') {
					this.$message({
						message: '请选择会议类型！',
						type: 'warning'
					})
				}else if (meetNeeds.length === 0) {
					this.$message({
						message: '请选择会场需求！',
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
				}else {
					startDate = dateFormat(this.inputForm.startTime, 'yyyy-MM-dd hh:mm:ss')
					saveReserve({
						budget,
						cityName,
						hours,
						linkMobile,
						linkPeople,
						meetNeeds,
						meetType,
						number,
						remarks,
						startDate
					}).then(res => {
            if (res.data.code === 0) {
							this.$message({
								message: '提交成功',
								type: 'success'
							});
							this.closeForm();
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
  .reserve-form {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1;
    .company-fair-form{
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
            font-size: 20px;
            font-weight: 400;
            margin-bottom: 10px;
          }
          .house-item-form{
            margin-bottom: 14px;
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
  .search-select-options {
    .options-title {
      display: inline-block;
      font-size: 16px;
      font-weight: 600;
      padding-bottom: 10px;
    }
    .el-checkbox-button__inner {
      box-sizing: border-box;
      border-left: 0.5px solid #E2E8F4;
      height: 28px;
      margin: 0 10px 10px 0;
      font-size: 15px;
      border-radius: 5px;
      color: #7588a7;
      &:hover {
        cursor: pointer;
        background-color: #2487FF;
        color: white;
      }
    }
    .options-close {
      box-sizing: border-box;
      display: inline-block;
      position: absolute;
      right: 23px;
      top: 12px;
      border: 0.5px solid transparent;
      &:hover {
        cursor: pointer;
        border: 0.5px solid #E2E8F4;
      }
    }
  }
  .options-text {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    width: 205px;
    height: 47px;
    z-index: 99;
    border: none;
    outline: none;
    line-height: 47px;
    text-indent: 8px;
  }
  .el-checkbox-button.is-checked .el-checkbox-button__inner{
    border-left: 0.5px solid transparent;
  }
  .el-checkbox-button:first-child .el-checkbox-button__inner{
    border-radius: 5px;
  }
  .el-checkbox-button:last-child .el-checkbox-button__inner{
    border-radius: 5px;
  }
  /*.el-popover{
    left: 497px;
  }
  .el-popper[x-placement^=bottom]{
    .popper__arrow{
      left: 364.5px;
    }
  }*/
</style>
