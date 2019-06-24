<template>
  <div class="content-wrapper">
    <el-form ref="form" label-width="82px" :inline="true">
      <el-form-item label="提交人">
        <!--<el-input v-model="formData.commitPeople" placeholder="请输入提交人" class="input-width"></el-input>-->
        <el-select v-model="formData.commitPeople" filterable placeholder="请选择当前审批人" class="input-width">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in commitPeopleList" :key="item.userId" :label="item.userName ? item.userName : '腾住用户'" :value="item.userId"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="开始时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="年/月/日" v-model="formData.startDateBegin" class="input-width"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="年/月/日" v-model="formData.startDateEnd" class="input-width"></el-date-picker>
        </el-col>
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="formData.status" placeholder="请选择状态" class="input-width">
          <el-option label="全部" value=""></el-option>
          <el-option label="待审核" value="0"></el-option>
          <el-option label="已通过" value="1"></el-option>
          <el-option label="已核销" value="2"></el-option>
          <el-option label="已撤回" value="3"></el-option>
          <el-option label="已驳回" value="4"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="当前审批人">
        <!--<el-input v-model="formData.approvalPeople" placeholder="请输入审批人" class="input-width"></el-input>-->
        <el-select v-model="formData.approvalPeople" filterable placeholder="请选择当前审批人" class="input-width">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in approvalPeopleList" :key="item.userId" :label="item.nickname ? item.nickname : '腾住用户'" :value="item.userId"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="结束时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="年/月/日" v-model="formData.endDateBegin" class="input-width"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="年/月/日" v-model="formData.endDateEnd" class="input-width"></el-date-picker>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" class="sub-but" @click="setPageIndex()">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="operations" v-if="userType === 1">
      <el-button type="primary" icon="el-icon-check" @click="checkTravelStateByList(1)" :disabled="multipleSelection.length <= 0">同意</el-button>
      <el-button type="primary" icon="el-icon-close" @click="checkTravelStateByList(4)" :disabled="multipleSelection.length <= 0">驳回</el-button>
      <el-button type="primary" @click="checkTravelStateByList(3)" :disabled="multipleSelection.length <= 0">
        <i class="iconfont">&#xe6dd;</i>撤回
      </el-button>
      <el-button type="primary" icon="el-icon-plus" @click="addTravelOrder()">行程申报</el-button>
    </div>
    <el-table ref="multipleTable" v-loading="loading" :data="tableDate" tooltip-effect="dark" style="width: 100%;" border fit
              @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="39"></el-table-column>
      <el-table-column align="center" label="标题" prop="title" min-width="155" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="提交人" prop="submitter" width="95" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="目的地" prop="destination" width="95" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="开始时间" prop="startDate" width="95" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="结束时间" prop="endDate" width="95" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="申报金额(元)" prop="money" width="105" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="审批模式" prop="mode" width="95" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="审批进度" prop="progress" width="95" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="待审批人" prop="approver" width="95" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="状态" prop="state" width="95"></el-table-column>
      <el-table-column align="center" label="操作" min-width="100" v-if="userType === 1">
        <template slot-scope="scope">
          <!--<i class="el-icon-tickets op-icon" @click="getTravelDetail(scope.row.tripNo)"></i>-->
          <i class="op-icon" v-if="(loginUser === '3' || (loginUser === '2' && scope.row.fromCheckUser)) && scope.row.state === '待审批'"
             @click="checkTravelState(scope.row.tripNo, 3)">
            <i class="iconfont">&#xe6dd;</i>
          </i>
          <i class="el-icon-check op-icon" v-if="loginUser === '2' && !scope.row.checked && scope.row.state === '待审批'"
             @click="checkTravelState(scope.row.tripNo, 1)"></i>
          <i class="el-icon-close op-icon" v-if="loginUser === '2'  && !scope.row.checked && scope.row.state === '待审批'"
             @click="checkTravelState(scope.row.tripNo, 4)"></i>
          <i class="el-icon-success op-icon" v-if="loginUser === '2'  && scope.row.checked && scope.row.state === '已完成'"
             @click="checkTravelState(scope.row.tripNo, 2)"></i>
        </template>
      </el-table-column>
    </el-table>
    <TablePagination :pageIndex="pageIndex" :tableCount="total" :getList="getTravelDateList"/>
    <el-dialog title="行程记录" :visible.sync="travelVisible" width="30%">
      <div class="approval-detail">
        <div class="approval-detail-item">
          <span class="item-label">申请类型：</span>
          <span v-if="this.approvalDetail.applyType === 0">出差申请</span>
          <span v-if="this.approvalDetail.applyType === 1">住宿申请</span>
          <span v-if="this.approvalDetail.applyType === 2">机票申请</span>
          <span class="item-label item-label-line">目的地：</span>
          <span>{{approvalDetail.destination}}</span>
        </div>
        <div class="approval-detail-item" v-if="this.approvalDetail.applyType !== 0">
          <span class="item-label">出差单号：</span>
          <span v-if="approvalDetail.superNo">{{approvalDetail.superNo}}</span>
        </div>
        <div class="approval-detail-item" v-if="this.approvalDetail.applyType !== 0">
          <span class="item-label">订单号：</span>
          <span v-if="approvalDetail.orderNo">{{approvalDetail.orderNo}}</span>
        </div>
        <div class="approval-detail-item">
          <span class="item-label">标题：</span>
          <span>{{approvalDetail.title}}</span>
        </div>
        <div class="approval-detail-item">
          <span class="item-label">审批模式：</span>
          <span v-if="this.approvalDetail.checkType === 0">平行审批</span>
          <span v-if="this.approvalDetail.checkType === 1">逐级审批</span>
        </div>
        <div class="approval-detail-item">
          <span class="item-label">出差人：</span>
          <span v-for="item in this.approvalDetail.tripPeopleList" :key="item.name">{{item.name}}</span>
        </div>
        <div class="approval-detail-item">
          <span class="item-label">审批状态：</span>
          <span v-if="this.approvalDetail.formStatus === 0">待审批</span>
          <span v-if="this.approvalDetail.formStatus === 1">已同意</span>
          <span v-if="this.approvalDetail.formStatus === 2">已驳回</span>
          <span v-if="this.approvalDetail.formStatus === -1">审批中</span>
        </div>
        <div class="approval-detail-item">
          <span class="item-label">审批进度：</span>
          <ul class="item-list">
            <li v-for="item in this.approvalDetail.approvalPeopleList" :key="item.name">
              <span class="item-name">{{item.name}}</span>
              <span class="item-icon" v-if="item.checkStatus === 1"><i class="el-icon-check"></i></span>
              <span class="item-icon" v-if="item.checkStatus === 2"><i class="el-icon-close"></i></span>
              <span class="item-time">{{item.approvalTime}}</span>
            </li>
          </ul>
        </div>
        <span slot="footer" class="footer-btn">
          <el-button @click="travelVisible = false">关 闭</el-button>
        </span>
      </div>
    </el-dialog>
    <!--添加行程申请单-->
    <el-dialog title="行程申报" :visible.sync="addTravelVisible" width="38%" custom-class="add-approval-dialog">
      <div class="trip-content">
        <div class="trip-items">
          <div class="trip-item">
            <span class="trip-item-label">目的地:</span>
            <SelectCity class="trip-destination2"/>
          </div>
        </div>

        <div class="trip-items">
          <div class="trip-item">
            <span class="trip-item-label">标题:</span>
            <el-input class="trip-title" v-model="travelForm.title" placeholder="请输入标题" clearable></el-input>
          </div>
        </div>

        <div class="trip-items">
          <div class="trip-item">
            <span class="trip-item-label">开始时间:</span>
            <el-date-picker class="trip-pattern" v-model="travelForm.startDate" type="date" placeholder="选择日期"> </el-date-picker>
          </div>
        </div>

        <div class="trip-items">
          <div class="trip-item">
            <span class="trip-item-label">结束时间:</span>
            <el-date-picker class="trip-pattern" v-model="travelForm.endDate" type="date" placeholder="选择日期"> </el-date-picker>
          </div>
        </div>

        <div class="trip-items">
          <div class="trip-item">
            <span class="trip-item-label">金额(元):</span>
            <el-input class="trip-title" v-model="travelForm.money" placeholder="请输入金额" clearable></el-input>
          </div>
        </div>

        <div class="trip-items">
          <div class="trip-item">
            <span class="trip-item-label">出差单:</span>
            <el-select v-model="travelForm.travelNo" multiple collapse-tags style="margin-left: 10px;width: 70%;" placeholder="请选择">
              <el-option v-for="item in travelDate" :key="item" :label="item.index" :value="item"></el-option>
            </el-select>
            <!--<span class="trip-user" v-for="(item, index) in travelForm.travelUsers" :key="item.index">{{item}}
              <i class="el-icon-close close-btn" @click="delOutChecker(index)"></i>
            </span>
            <i class="el-icon-circle-plus" @click="addUserDialogVisible = true"></i>-->
          </div>
        </div>

        <div class="trip-foot">
          <div class="trip-foot-btn">
            <el-button type="danger" class="button-reset" @click="reset()">重置</el-button>
            <el-button type="primary" class="button-save" @click="saveTravelForm()" :disabled="!saveTravelFormVisible">保存</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
	import TablePagination from '@/components/TablePagination.vue'
	import { initTravelList, checkTravel, addTravel, getTraves, selectCheckList, selectTravelBy, getEntMembers } from '@/api/travel'
	import { dateFormat, dataFormat2 } from '@/util/lobal.js'
	import { mapGetters } from 'vuex'
	import SelectCity from '@/components/SelectCity.vue'

	export default {
		name: 'TravelList',
		components: {
			TablePagination,
			SelectCity
		},
		props: {
			userType: {
				type: Number,
				required: true
			},
		},
		data () {
			return {
				commitPeopleList: [],
				approvalPeopleList: [],
				saveTravelFormVisible: true,
				travelVisible: false,
				addTravelVisible: false,
				loading: false,
				pageIndex: 1,
				total: 0,
				formData: {
					commitPeople: null,
					startDateBegin: null,
					startDateEnd: null,
					status: null,
					approvalPeople: null,
					endDateBegin: null,
					endDateEnd: null
				},
        travelDate: [],
				tableDate: [],
				approvalDetail: {},
				multipleSelection: [],
				travelForm: {
					title: '',
					startDate: null,
					endDate: null,
					money: null,
					travelUsers: [],
					travelNo: [],
					detination: ''
        },
        loginUser: 0,
			}
		},
		mounted () {
			this.loading = true;
      this.initTravelDate();
		},
		computed: {
			...mapGetters(['nickName', 'userInfo'])
		},
		created() {
			window.globelEvent.$on('destinationId', cityId => {
				this.travelForm.detination = cityId;
			});
			window.globelEvent.$on('destinationName', city => {
				this.travelForm.title = '出差：'+city;
			});
			this.selectCheckList();
			this.getMembers();
		},
		methods: {
			initTravelDate () {
				initTravelList({
					limit: 10,
					page: 1
				}).then(res => {
					this.loading = false;
					this.tableDate = [];
					if (res.data.code === 0) {
						this.loginUser = res.data.data.userType;
						if (res.data.data.count === 0) {
							this.$message('很抱歉，暂无数据，试试其他搜索条件吧。');
						} else {
							this.total = res.data.data.count || 0;
							res.data.data.travelResps.forEach(record => {
								let tableObject = {};
								tableObject.tripNo = record.tripNo;
								tableObject.fromCheckUser = record.fromCheckUser;
								tableObject.checked = record.checked;

								tableObject.title = record.title;
								tableObject.submitter = record.submitter;
								tableObject.destination = record.destination;
								tableObject.startDate = dataFormat2(record.startDate, 'yyyy-MM-dd');
								tableObject.endDate = dataFormat2(record.endDate, 'yyyy-MM-dd');
								tableObject.money = record.money;

								if (record.mode === '0') {
									tableObject.mode = '平行审批';
								} else if(record.mode === '1') {
									tableObject.mode = '逐级审批';
								} else {
									tableObject.mode = '未知';
								}

								tableObject.progress = record.progress;

								if (record.approver) {
									let approverStr = '';
									record.approver.forEach(p => {
										approverStr += (p + " ");
									});
									tableObject.approver = approverStr;
								}

								//0：待审核，1：已通过，2：已核销，3：已撤回，4：已驳回
								if (record.state === '0') {
									tableObject.state = '待审批';
								} else if(record.state === '1') {
									tableObject.state = '已通过';
								} else if(record.state === '2') {
									tableObject.state = '已核销';
								} else if(record.state === '3') {
									tableObject.state = '已撤回';
								} else if(record.state === '4') {
									tableObject.state = '已驳回';
								} else {
									tableObject.state = '未知';
								}
								this.tableDate.push(tableObject);
							});
						}
					} else {
						if (res.data.msg) {
							this.$message({
								message: res.data.msg,
								type: 'warning'
							})
						}
					}
				});
			},
			setPageIndex() {
				this.pageIndex = 1;
				this.getTravelDateList();
      },
      getTravelDateList({
        checkPeople = this.formData.approvalPeople,
        endDateMin = dataFormat2(this.formData.endDateBegin, 'yyyy-MM-dd'),
        endDateMax = dataFormat2(this.formData.endDateEnd, 'yyyy-MM-dd'),
        limit = 10,
        page = this.pageIndex,
        startDateMin = dataFormat2(this.formData.startDateBegin, 'yyyy-MM-dd'),
        startDateMax = dataFormat2(this.formData.startDateEnd, 'yyyy-MM-dd'),
        state = this.formData.status,
        submitPeople = this.formData.commitPeople
      } = {}) {
				selectTravelBy({
					checkPeople,
					endDateMin,
					endDateMax,
					limit,
					page,
					startDateMin,
					startDateMax,
					state,
					submitPeople
        }).then(res => {
					this.tableDate = [];
					if (res.data.code === 0) {
						this.loginUser = res.data.data.userType;
						if (res.data.data.count === 0) {
							this.$message('很抱歉，暂无数据，试试其他搜索条件吧。');
						} else {
							this.total = res.data.data.count || 0;
							res.data.data.travelResps.forEach(record => {
								let tableObject = {};
								tableObject.tripNo = record.tripNo;
								tableObject.fromCheckUser = record.fromCheckUser;
								tableObject.checked = record.checked;

								tableObject.title = record.title;
								tableObject.submitter = record.submitter;
								tableObject.destination = record.destination;
								tableObject.startDate = dataFormat2(record.startDate, 'yyyy-MM-dd');
								tableObject.endDate = dataFormat2(record.endDate, 'yyyy-MM-dd');
								tableObject.money = record.money;

								if (record.mode === '0') {
									tableObject.mode = '平行审批';
								} else if(record.mode === '1') {
									tableObject.mode = '逐级审批';
								} else {
									tableObject.mode = '未知';
								}

								tableObject.progress = record.progress;

								if (record.approver) {
									let approverStr = '';
									record.approver.forEach(p => {
										approverStr += (p + " ");
									});
									tableObject.approver = approverStr;
								}

								//0：待审核，1：已通过，2：已核销，3：已撤回，4：已驳回
								if (record.state === '0') {
									tableObject.state = '待审批';
								} else if(record.state === '1') {
									tableObject.state = '已通过';
								} else if(record.state === '2') {
									tableObject.state = '已核销';
								} else if(record.state === '3') {
									tableObject.state = '已撤回';
								} else if(record.state === '4') {
									tableObject.state = '已驳回';
								} else {
									tableObject.state = '未知';
								}
								this.tableDate.push(tableObject);
							});
						}
						this.pageIndex = page;
					} else {
						if (res.data.msg) {
							this.$message({
								message: res.data.msg,
								type: 'warning'
							})
						}
					}
        });
      },
			checkTravelStateByList(state) {
				if (this.multipleSelection.length === 0) {
					this.$message({
						message: '请选择至少一项数据',
						type: 'warning'
					});
				} else {
					let travelNoList = [];
					let flag = true;
					this.multipleSelection.forEach(form => {
						console.log("!form.checked:"+ !form.checked);
						if (form.state !== '待审批') {
							this.$message({
								message: '只能操作待审批的申请',
								type: 'warning'
							});
							flag = false;
							return;
						} else if(!(this.loginUser === '2' && !form.checked)) {
							this.$message({
								message: '请检查选中的数据，包含您已审核或提交的申请',
								type: 'warning'
							});
							flag = false;
							return;
            }
						travelNoList.push(form.tripNo);
					});
					if (flag) {
						this.checkTravelState(travelNoList, state);
					}
				}
      },
			checkTravelState(travelNo, state) {
				let travelNos = [];
				if (travelNo instanceof(Array)) {
					travelNos = travelNo;
				} else {
					travelNos.push(travelNo);
				}
				checkTravel({
					state: parseInt(state),
					travelNos: travelNos
        }).then(res => {
					if (res.data.code === 0) {
						this.$message('修改成功！');
						this.getTravelDateList();
					} else {
						if (res.data.msg) {
							this.$message({
								message: res.data.msg,
								type: 'warning'
							})
						}
          }
        });
      },
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			saveTravelForm() {
				if(this.travelForm.detination === '') {
					this.$message({
						message: "目的地不能为空",
						type: 'warning'
					})
				} else if(this.travelForm.title === '') {
					this.$message({
						message: "标题不能为空",
						type: 'warning'
					})
				} else if(this.travelForm.startDate === null) {
					this.$message({
						message: "开始时间不能为空",
						type: 'warning'
					})
				} else if(this.travelForm.endDate === null) {
					this.$message({
						message: "结束时间不能为空",
						type: 'warning'
					})
				} else if(this.travelForm.money === null) {
					this.$message({
						message: "金额不能为空",
						type: 'warning'
					})
				} else if(this.travelForm.travelNo.length === 0) {
					this.$message({
						message: "出差单不能为空",
						type: 'warning'
					})
				} else {
					this.saveTravelFormVisible = false;
					addTravel({
						detination: this.travelForm.detination,
						startDate: dateFormat(this.travelForm.startDate, 'yyyy-MM-dd'),
						endDate: dateFormat(this.travelForm.endDate, 'yyyy-MM-dd'),
						money: this.travelForm.money,
						title: this.travelForm.title,
						travelNo: this.travelForm.travelNo
					}).then(res => {
						if (res.data.code === 0) {
							this.$message('添加成功！');
							this.addTravelVisible = false;
							this.reset();
							this.getTravelDateList();
						} else {
							if (res.data.msg) {
								this.$message({
									message: res.data.msg,
									type: 'warning'
								})
							}
						}
						this.saveTravelFormVisible = true;
					});
				}
			},
			reset() {
//				this.travelForm.title = '';
//				this.travelForm.detination = '';
				this.travelForm.startDate = null;
				this.travelForm.endDate = null;
				this.travelForm.money = '';
				this.travelForm.travelUsers = [];
				this.travelForm.travelNo = [];
			},
      addTravelOrder() {
				this.addTravelVisible = true;
				getTraves().then(res => {
					if (res.data.code === 0) {
						this.travelDate = res.data.data;
					} else {
						if (res.data.msg) {
							this.$message({
								message: res.data.msg,
								type: 'warning'
							})
						}
					}
        });
      },
			selectCheckList() {
				selectCheckList().then(res => {
					if (res.data.code === 0) {
						this.approvalPeopleList = res.data.data.list;
					} else {
						if (res.data.msg) {
							this.$message({
								message: res.data.msg,
								type: 'warning'
							})
						}
					}
        });
      },
			getMembers() {
				getEntMembers().then(res => {
					if (res.data.code === 0) {
						this.commitPeopleList = res.data.data;
					} else {
						if (res.data.msg) {
							this.$message({
								message: res.data.msg,
								type: 'warning'
							})
						}
					}
        });
      },
		}
	}
</script>
<style lang="less">
  .content-wrapper {
    .input-width {
      width: 170px;
    }
    .sub-but {
      margin-left: 50px;
    }
    .operations {
      margin-bottom: 10px;
    }
    .approval-detail{
      .approval-detail-item{
        padding: 0 0 8px 10px;
        .item-label-line{
          margin-left: 35px;
        }
        .item-label{
          display: inline-block;
          width: 70px;
          text-align: right;
          font-weight: bold;
        }
        .item-list{
          margin-left: 70px;
          span{
            display: inline-block;
            text-align: left;
            overflow: hidden;
          }
          .item-name{
            width: 56px;
          }
          .item-icon{
            width: 30px;
          }
          .item-time{
            width: 150px;
          }
        }
      }
      .footer-btn{
        text-align: center;
        display: block;
      }
    }
    .op-icon{
      cursor: pointer;
      padding: 0 5px;
    }
    .trip-content{
      .trip-items{
        .trip-item{
          display: inline-block;
          width: 100%;
          margin-bottom: 15px;
          .trip-item-label{
            display: inline-block;
            width: 65px;
            text-align: right;
          }
          .trip-destination2{
            width: 70%;
            margin-left: 10px;
          }
          .trip-title{
            width: 70%;
            margin-left: 10px;
          }
          .trip-reason{
            width: 70%;
            margin-left: 10px;
          }
          .trip-pattern{
            width: 70%;
            margin-left: 10px;
          }
          .trip-type{
            width: 60%;
            margin-left: 10px;
          }
        }
        .trip-item2{
          width: 40%;
        }
      }
      .trip-foot{
        text-align: center;
      }
    }
  }
</style>