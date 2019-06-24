<template>
  <div class="content-wrapper">
    <el-form ref="form" label-width="82px" :inline="true">
      <el-form-item label="申请类型">
        <el-select v-model="formData.applyType" placeholder="请选择申请类型" class="input-width">
          <el-option label="出差申请" value="0"></el-option>
          <el-option label="住宿申请" value="1"></el-option>
          <el-option label="机票申请" value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="申请时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="年/月/日" v-model="formData.createStartDate" class="input-width"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="年/月/日" v-model="formData.createEndDate" class="input-width"></el-date-picker>
        </el-col>
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="formData.formStatus" placeholder="请选择状态" class="input-width">
          <el-option label="全部" value=""></el-option>
          <el-option label="审批中" value="-1"></el-option>
          <el-option label="待审批" value="0"></el-option>
          <el-option label="已同意" value="1"></el-option>
          <el-option label="已驳回" value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="提交人">
        <!--<el-input v-model="formData.commitPeople" placeholder="请输入提交人" class="input-width"></el-input>-->
        <el-select v-model="formData.commitPeople" filterable placeholder="请选择提交人" class="input-width">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in entMembers" :key="item.userId" :label="item.userName ? item.userName : '腾住用户'" :value="item.userId"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="审批时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="年/月/日" v-model="formData.finishStartDate" class="input-width"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="年/月/日" v-model="formData.finishEndDate" class="input-width"></el-date-picker>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" class="sub-but" @click="setPageIndex()">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="operations">
      <el-button type="primary" icon="el-icon-check" @click="changeStatusByList(1)" :disabled="multipleSelection.length <= 0">同意</el-button>
      <el-button type="primary" icon="el-icon-close" @click="changeStatusByList(2)" :disabled="multipleSelection.length <= 0">拒绝</el-button>
    </div>
    <el-table ref="multipleTable" v-loading="loading" :data="tableDate" tooltip-effect="dark" style="width: 100%;" border fit
              @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="39"></el-table-column>
      <el-table-column align="center" label="申请类型" prop="type" width="95" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="申请理由" prop="reason" width="352" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="标题" prop="title" min-width="103" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="提交人" prop="commitPeople" width="95" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="出差人" prop="processPeople" width="90" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="申请时间" prop="createTime" width="95" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="审批时间" prop="finishTime" width="95" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="状态" prop="status" width="95"></el-table-column>
      <el-table-column align="center" label="操作" min-width="120">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="超标" placement="top">
            <i class="el-icon-warning op-icon" style="color: red"
               v-if="scope.row.type !== '出差申请' && scope.row.surpass"></i>
          </el-tooltip>
          <i class="el-icon-tickets op-icon" @click="getApprovalDetail(scope.row.formNo)"></i>
          <i class="el-icon-check op-icon" v-if="scope.row.status === '待审批'"
             @click="changeApprovalStatus(scope.row.formNo, 1)"></i>
          <i class="el-icon-close op-icon" v-if="scope.row.status === '待审批'"
             @click="changeApprovalStatus(scope.row.formNo, 2)"></i>
        </template>
      </el-table-column>
    </el-table>
    <TablePagination :pageIndex="pageIndex" :tableCount="total" :getList="getApproveList"/>
    <el-dialog title="审批记录" :visible.sync="approvalVisible" width="30%">
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
          <el-button @click="approvalVisible = false">关 闭</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
	import TablePagination from '@/components/TablePagination.vue'
	import { approveList, getRecorde, changeStatus, getModel } from '@/api/approval'
	import ApprovalList from './ApprovalList'
	import { dateFormat, dataFormat2 } from '@/util/lobal.js'
	import { mapGetters } from 'vuex'
	import ChooseUser from '@/components/ChooseUser.vue'
	import CityList from '@/components/CityList.vue'
  import SelectCity from '@/components/SelectCity.vue'

	export default {
		name: 'ApprovalList',
		components: {
			TablePagination,
			ApprovalList,
			ChooseUser,
			CityList,
			SelectCity
		},
		props: {
			userType: {
				type: Number,
				required: true
			},
			entMembers: {
				type: Array,
				required: true
			}
		},
		data () {
			return {
				isShow: false,
				approvalVisible: false,
				addApprovalDialogVisible: false,
				addCheckerDialogVisible: false,
				addUserDialogVisible: false,
				loading: false,
				pageIndex: 1,
				total: 0,
				formData: {
					applyType: null,
					createStartDate: null,
					createEndDate: null,
					finishStartDate: null,
					finishEndDate: null,
					formStatus: null,
					commitPeople: null
				},
				tableDate: [],
        approvalDetail: {},
				multipleSelection: [],
			}
		},
		mounted () {
			this.loading = true;
			if(this.userType === 1) {
				this.initApproveDate();
      }
		},
		computed: {
			...mapGetters(['nickName', 'userInfo'])
		},
		created() {
			window.globelEvent.$on('cityId', cityId => {
				this.tripForm.destinationId = cityId;
			});
		},
		methods: {
			initApproveDate () {
				approveList({
					applyType: this.formData.applyType === null ? 0 : parseInt(this.formData.applyType),
					applicationDateStart: dateFormat(this.formData.createStartDate, 'yyyy-MM-dd'),
					applicationDateEnd: dateFormat(this.formData.createEndDate, 'yyyy-MM-dd'),
					approveDateStart: dateFormat(this.formData.finishStartDate, 'yyyy-MM-dd'),
					approveDateEnd: dateFormat(this.formData.finishEndDate, 'yyyy-MM-dd'),
					checkStatus: parseInt(this.formData.formStatus),
					submitter: this.formData.commitPeople,
					limit: 10,
					page: 1
				}).then(res => {
					this.loading = false;
					this.tableDate = [];
					if (res.data.code === 0) {
						if (res.data.data.totalCount === 0) {
							this.$message('很抱歉，暂无数据，试试其他搜索条件吧。');
						} else {
							this.total = res.data.data.total;
							res.data.data.records.forEach(record => {
								let tableObject = {};
								tableObject.formNo = record.formNo;
								tableObject.surpass = record.surpass;

								if (record.applyType === 0) {
									tableObject.type = '出差申请';
								} else if(record.applyType === 1) {
									tableObject.type = '住宿申请';
								} else if(record.applyType === 2) {
									tableObject.type = '机票申请';
								} else {
									tableObject.type = '未知申请';
								}

								tableObject.reason = record.content;
								tableObject.title = record.title;
								tableObject.commitPeople = record.applicant;

								if (record.tripPeopleList) {
									let tripStr = '';
									record.tripPeopleList.forEach(p => {
										tripStr += (p + " ");
									});
									tableObject.processPeople = tripStr;
                }

								tableObject.createTime = dataFormat2(record.createDate, 'yyyy-MM-dd');
								tableObject.finishTime = dataFormat2(record.updateDate, 'yyyy-MM-dd');

								if (record.checkStatus === 0) {
									tableObject.status = '待审批';
								} else if(record.checkStatus === 1) {
									tableObject.status = '已同意';
								} else if(record.checkStatus === 2) {
									tableObject.status = '已驳回';
								} else if(record.checkStatus === -1) {
									tableObject.status = '审批中';
                } else {
									tableObject.status = '未知';
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
				this.getApproveList();
      },
			getApproveList ({
        applyType = this.formData.applyType === null ? 0 : parseInt(this.formData.applyType),
        applicationDateStart = dateFormat(this.formData.createStartDate, 'yyyy-MM-dd'),
        applicationDateEnd = dateFormat(this.formData.createEndDate, 'yyyy-MM-dd'),
        approveDateStart = dateFormat(this.formData.finishStartDate, 'yyyy-MM-dd'),
        approveDateEnd = dateFormat(this.formData.finishEndDate, 'yyyy-MM-dd'),
        checkStatus = parseInt(this.formData.formStatus),
        submitter = this.formData.commitPeople,
        limit = 10,
        page = this.pageIndex
      } = {}) {
				if(applicationDateStart > applicationDateEnd) {
					this.$message({
						message: '申请开始时间不能大于结束时间',
						type: 'warning'
					})
        } else if(approveDateStart > approveDateEnd) {
					this.$message({
						message: '审批开始时间不能大于结束时间',
						type: 'warning'
					})
        } else {
					this.loading = true;
					approveList({
						applyType,
						applicationDateStart,
						applicationDateEnd,
						approveDateStart,
						approveDateEnd,
						checkStatus,
						submitter,
						limit,
						page
					}).then(res => {
						this.loading = false;
						this.tableDate = [];
						if (res.data.code === 0) {
							if (res.data.data.total === 0) {
								this.$message('很抱歉，暂无数据，试试其他搜索条件吧。');
							} else {
								this.total = res.data.data.total;
								res.data.data.records.forEach(record => {
									let tableObject = {};
									tableObject.tableChildDate = [];
									tableObject.formNo = record.formNo;
									tableObject.surpass = record.surpass;

									if (record.applyType === 0) {
										tableObject.type = '出差申请';
									} else if (record.applyType === 1) {
										tableObject.type = '住宿申请';
									} else if (record.applyType === 2) {
										tableObject.type = '机票申请';
									} else {
										tableObject.type = '未知申请';
									}

									tableObject.reason = record.content;
									tableObject.title = record.title;
									tableObject.commitPeople = record.applicant;

									if (record.tripPeopleList) {
										let tripStr = '';
										record.tripPeopleList.forEach(p => {
											tripStr += (p + "  ");
										});
										tableObject.processPeople = tripStr;
									}

									tableObject.createTime = dataFormat2(record.createDate, 'yyyy-MM-dd');
									tableObject.finishTime = dataFormat2(record.updateDate, 'yyyy-MM-dd');

									if (record.checkStatus === 0) {
										tableObject.status = '待审批';
									} else if (record.checkStatus === 1) {
										tableObject.status = '已同意';
									} else if (record.checkStatus === 2) {
										tableObject.status = '已驳回';
									} else if (record.checkStatus === -1) {
										tableObject.status = '审批中';
									} else {
										tableObject.status = '未知';
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
				}
			},
			getApprovalDetail(formNo) {
				getRecorde({
					formNo: formNo
        }).then(res => {
					if (res.data.code === 0) {
            this.approvalDetail = {...res.data.data};
					} else {
						if (res.data.msg) {
							this.$message({
								message: res.data.msg,
								type: 'warning'
							})
						}
					}
        });
				this.approvalVisible = true;
      },
      changeStatusByList(status) {
        if (this.multipleSelection.length === 0) {
					this.$message({
						message: '请选择至少一项数据',
						type: 'warning'
					});
        } else {
					let formNoList = [];
					let flag = true;
					this.multipleSelection.forEach(form => {
						if (form.status !== '待审批') {
							this.$message({
								message: '只可审批未审批的申请单',
								type: 'warning'
							});
							flag = false;
							return;
						}
						formNoList.push(form.formNo);
          });
					if (flag) {
						this.changeApprovalStatus(formNoList, status);
          }
        }
      },
      changeApprovalStatus(formNo, status) {
				let formNoList = [];
				if (formNo instanceof(Array)) {
					formNoList = formNo;
        } else {
					formNoList.push(formNo);
        }
        changeStatus({
					checkStatus: parseInt(status),
					formNoList: formNoList
        }).then(res => {
					if (res.data.code === 0) {
						this.$message('修改成功！');
						this.getApproveList();
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
			approvalValue (val, val2) {
				this.tripForm.tripUsers.push(val.userName+"  ");
				this.tripForm.tripUsersId.push(val.realUserId);
				this.addCheckerDialogVisible = val2;
			},
			childByValue (val, val2) {
        this.tripForm.approvalUsers.push(val.userName+"  ");
				this.tripForm.approvalUsersId.push(val.realUserId);
				this.addUserDialogVisible = val2;
			},
			getLastPeople() {
				this.addApprovalDialogVisible = true;
				getModel().then(res => {
					if (res.data.code === 0) {
            this.tripForm.lastPeople = res.data.data.approvalPeople.name;
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
      .trip-item3{
        width: 50%;
      }
    }
    .trip-foot{
      text-align: center;
    }
  }
}
</style>