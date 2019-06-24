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
          <el-option label="待审批" value="0"></el-option>
          <el-option label="已同意" value="1"></el-option>
          <el-option label="已完成" value="2"></el-option>
          <el-option label="已撤销" value="3"></el-option>
          <el-option label="已驳回" value="4"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="当前审批人">
        <!--<el-input v-model="formData.processPeople" placeholder="请输入当前审批人" class="input-width"></el-input>-->
        <el-select v-model="formData.processPeople" filterable placeholder="请选择当前审批人" class="input-width">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in entMembers" :key="item.userId" :label="item.userName ? item.userName : '腾住用户'" :value="item.userId"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="完成时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="年/月/日" v-model="formData.finishStartDate" class="input-width"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="年/月/日" v-model="formData.finishEndDate" class="input-width"></el-date-picker>
        </el-col>
      </el-form-item>

      <el-form-item label="提交人" v-if="userType === 0">
        <!--<el-input v-model="formData.commitPeople" placeholder="请输入提交人" class="input-width"></el-input>-->
        <el-select v-model="formData.commitPeople" filterable placeholder="请选择提交人" class="input-width">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in entMembers" :key="item.userId" :label="item.userName ? item.userName : '腾住用户'" :value="item.userId"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" class="sub-but" @click="setPageIndex()">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="operations" v-if="userType === 1">
      <el-button type="primary" @click="updateStatusByList(3)" :disabled="multipleSelection.length <= 0">
        <i class="iconfont">&#xe6dd;</i>撤销
      </el-button>
      <el-button type="primary" icon="el-icon-plus" @click="getLastPeople()">出差申请</el-button>
    </div>
    <el-table ref="multipleTable" v-loading="loading" :data="tableDate" tooltip-effect="dark" style="width: 100%;" border fit
              @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="39"></el-table-column>
      <el-table-column align="center" type="expand" width="30" v-if="showExpand">
        <template slot-scope="props">
          <el-table ref="multipleTable"  :data="props.row.tableChildDate" tooltip-effect="dark" style="width: 100%;" border fit
                    @selection-change="handleSelectionChange" :show-header="false">
            <el-table-column align="center" label="申请类型" prop="type" width="85" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" label="申请理由" prop="reason"  width="90" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" label="标题" prop="title" min-width="90" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" label="提交人" prop="commitPeople" width="85" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" label="出差人" prop="processPeople" width="85" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" label="申请时间" prop="createTime" width="95" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" label="完成时间" prop="finishTime" width="95" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" label="审批模式" prop="pattern" width="92" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" label="审批进度" prop="progress" width="85" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" label="待审批人" prop="people" width="90" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" label="状态" prop="status" width="65"></el-table-column>
            <el-table-column align="center" label="操作" min-width="120" v-if="userType === 1">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="超标" placement="top">
                  <i class="el-icon-warning op-icon" style="color: red"
                     v-if="scope.row.type !== '出差申请' && scope.row.surpass"></i>
                </el-tooltip>
                <i class="el-icon-tickets op-icon" @click="getApprovalDetail(scope.row.formNo)"></i>
                <i class="op-icon" v-if="nickName === scope.row.commitPeople && scope.row.status === '待审批'" @click="updateApproval(scope.row.formNo, 3)">
                  <i class="iconfont">&#xe6dd;</i>
                </i>
                <i class="el-icon-success op-icon" v-if="nickName === scope.row.commitPeople && scope.row.status === '已同意'" @click="updateApproval(scope.row.formNo, 2)"></i>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请类型" prop="type" width="90" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="申请理由" prop="reason"  width="95" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="标题" prop="title" min-width="95" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="提交人" prop="commitPeople" width="90" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="出差人" prop="processPeople" width="90" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="申请时间" prop="createTime" width="95" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="完成时间" prop="finishTime" width="95" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="审批模式" prop="pattern" width="90" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="审批进度" prop="progress" width="90" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="待审批人" prop="people" width="95" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="状态" prop="status" :width="showExpand ? 65 : 95"></el-table-column>
      <el-table-column align="center" label="操作" min-width="120" v-if="userType === 1">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="超标" placement="top">
            <i class="el-icon-warning op-icon" style="color: red"
               v-if="scope.row.type !== '出差申请' && scope.row.surpass"></i>
          </el-tooltip>
          <i class="el-icon-tickets op-icon" @click="getApprovalDetail(scope.row.formNo)"></i>
          <i class="op-icon" v-if="nickName === scope.row.commitPeople && scope.row.status === '待审批'" @click="updateApproval(scope.row.formNo, 3)">
            <i class="iconfont">&#xe6dd;</i>
          </i>
          <i class="el-icon-success op-icon" v-if="nickName === scope.row.commitPeople && scope.row.status === '已同意'" @click="updateApproval(scope.row.formNo, 2)"></i>
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
          <span>{{approvalDetail.superNo}}</span>
        </div>
        <div class="approval-detail-item" v-if="this.approvalDetail.applyType !== 0">
          <span class="item-label">订单号：</span>
          <span>{{approvalDetail.orderNo}}</span>
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
          <span v-if="this.approvalDetail.formStatus === 2">已完成</span>
          <span v-if="this.approvalDetail.formStatus === 3">已撤销</span>
          <span v-if="this.approvalDetail.formStatus === 4">已驳回</span>
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
    <!--申请单-->
    <el-dialog title="出差申请" :visible.sync="addApprovalDialogVisible" width="38%" custom-class="add-approval-dialog">
      <el-dialog title="添加出差人" :visible.sync="addUserDialogVisible" append-to-body custom-class="add-user-dialog" width="38%">
        <choose-user :userInfo= "userInfo" @childByValue= 'childByValue'></choose-user>
      </el-dialog>
      <el-dialog title="添加审批人" :visible.sync="addCheckerDialogVisible" append-to-body custom-class="add-user-dialog" width="38%">
        <choose-user :userInfo= "userInfo" @approvalValue= 'approvalValue'></choose-user>
      </el-dialog>
      <div class="trip-content">
        <div class="trip-items">
          <div class="trip-item trip-item2">
            <span class="trip-item-label">申请类型:</span>
            <span style="margin-left: 10px">出差申请</span>
          </div>
          <div class="trip-item trip-item3">
            <span class="trip-item-label">目的地:</span>
            <SelectCity class="trip-destination"/>
          </div>
        </div>
        <div class="trip-items">
          <div class="trip-item">
            <span class="trip-item-label">标题:</span>
            <el-input class="trip-title" v-model="tripForm.title" placeholder="请输入内容" clearable></el-input>
          </div>
        </div>
        <div class="trip-items">
          <div class="trip-item">
            <span class="trip-item-label">出差时间:</span>
            <el-date-picker class="trip-pattern" v-model="tripForm.leaveDate" type="date" placeholder="选择日期"> </el-date-picker>
          </div>
        </div>
        <div class="trip-items">
          <div class="trip-item">
            <span class="trip-item-label" style="float: left;">申请理由:</span>
            <el-input class="trip-reason" type="textarea" maxlength="400" :autosize="{ minRows: 2, maxRows: 3}"
                      placeholder="请输入申请理由" v-model="tripForm.content" clearable>
            </el-input>
          </div>
        </div>
        <div class="trip-items">
          <div class="trip-item">
            <span class="trip-item-label">出差人:</span>
            <span class="trip-user" v-for="(item, index) in tripForm.approvalUsers" :key="item.index">{{item}}
              <i class="el-icon-close close-btn" @click="delOutChecker(index)"></i>
            </span>
            <i class="el-icon-circle-plus" @click="addUserDialogVisible = true"></i>
          </div>
        </div>
        <div class="trip-items">
          <div class="trip-item">
            <span class="trip-item-label">审批人:</span>
            <span class="checked-user" v-for="(item, index) in tripForm.tripUsers" :key="item.index">{{item}}
              <i class="el-icon-close close-btn" @click="delOutChecker2(index)"></i>
            </span>
            <i class="el-icon-circle-plus" @click="addCheckerDialogVisible = true"></i>
            <span class="final-checked-user">{{tripForm.lastPeople}}</span>
          </div>
        </div>
        <div class="trip-foot">
          <div class="trip-foot-btn">
            <el-button type="danger" class="button-reset" @click="reset()">重置</el-button>
            <el-button type="primary" class="button-save" @click="saveTripForm()" :disabled="!saveTripFormVisible">保存</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
	import TablePagination from '@/components/TablePagination.vue'
	import { approvePersonList, getRecorde, getSubList, updateStatus, newTripForm, getModel } from '@/api/approval'
	import ApprovalList from './ApprovalList'
	import { dateFormat, dataFormat2 } from '@/util/lobal.js'
	import { mapGetters } from 'vuex'
	import ChooseUser from '@/components/ChooseUser.vue'
	import CityList from '@/components/CityList.vue'
	import SelectCity from '@/components/SelectCity.vue'

	export default {
		name: 'MyApproval',
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
				saveTripFormVisible: true,
				isShow: false,
				showExpand: false,
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
					processPeople: null,
					commitPeople: null
				},
				tripForm: {
					content: '',
					destination: '',
					destinationId: '',
					destinationName: '',
					title: '',
					approvalUsers: [],//出差人
					approvalUsersId: [],
					tripUsers: [], //审批人
					tripUsersId: [],
					leaveDate: null,
					lastPeople: '',
					lastPeopleId: ''
				},
				tableDate: [],
				approvalDetail: {},
				multipleSelection: [],
			}
		},
		mounted () {
			this.loading = true;
      this.initApproveDate();
		},
		computed: {
			...mapGetters(['nickName','accountId', 'userInfo'])
		},
		created() {
			window.globelEvent.$on('destinationId', cityId => {
				this.tripForm.destinationId = cityId;
			});
			window.globelEvent.$on('destinationName', name => {
				this.tripForm.destinationName = "出差："+name;
				this.tripForm.content = "出差：" + name;
				this.tripForm.title = "出差：" + name;
			});
		},
		methods: {
			checkRole(approvalList, name) {
				if (!approvalList) {
					return false;
				}
				if (name === this.nickName) {
					return false;
				}
				approvalList.forEach(item => {
					if (item.name === this.nickName && item.checkStatus === 0) {
						return true;
					}
				});
				return false;
			},
			initApproveDate () {
				approvePersonList({
					applyType: this.formData.applyType === null ? 0 : parseInt(this.formData.applyType),
					applicationDateStart: dateFormat(this.formData.createStartDate, 'yyyy-MM-dd'),
					applicationDateEnd: dateFormat(this.formData.createEndDate, 'yyyy-MM-dd'),
					finishDateStart: dateFormat(this.formData.finishStartDate, 'yyyy-MM-dd'),
					finishDateEnd: dateFormat(this.formData.finishEndDate, 'yyyy-MM-dd'),
					formStatus: parseInt(this.formData.formStatus),
					currentApprovalPepole: this.formData.processPeople,
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
								tableObject.tableChildDate = [];
								tableObject.formNo = record.formNo;
								tableObject.surpass = record.surpass;
								if (record.applyType === 0) {
									tableObject.type = '出差申请';
									this.showExpand = true;
									// 查询子列表
									getSubList({
										formNo: record.formNo
									}).then(res => {
										if (res.data.code === 0) {
											res.data.data.forEach(child => {
												let tableChildObject = {};
												tableChildObject.formNo = child.formNo;
												tableChildObject.surpass = child.surpass;
												if (child.applyType === 1) {
													tableChildObject.type = '住宿申请';
												} else if(child.applyType === 2) {
													tableChildObject.type = '机票申请';
												} else {
													tableChildObject.type = '未知申请';
												}
												tableChildObject.reason = child.content;
												tableChildObject.title = child.title;
												tableChildObject.commitPeople = child.user.name;

												if (child.tripPeopleList) {
													let tripchildStr = '';
													child.tripPeopleList.forEach(p => {
														tripchildStr += (p.name + " ");
													});
													tableChildObject.processPeople = tripchildStr;
												}

                        tableChildObject.createTime = dataFormat2(child.createDate, 'yyyy-MM-dd');
                        tableChildObject.finishTime = dataFormat2(child.finishTime, 'yyyy-MM-dd');

                        if (child.checkType === 0) {
                          tableChildObject.pattern = '平行';
                        } else if(child.checkType === 1) {
                          tableChildObject.pattern = '逐级';
                        } else {
                          tableChildObject.pattern = '未知';
                        }

                        if (child.approvalPeopleList) {
                          let num = 0;
                          let approvalStr = '';
                          child.approvalPeopleList.forEach(p => {
                            approvalStr += (p.name + " ");
                            if (p.checkStatus === 1) {
                              num++;
                            }
                          });
                          tableChildObject.people = approvalStr;
                          tableChildObject.approvalPeopleList = child.approvalPeopleList;
                          tableChildObject.progress = num + "/" + child.approvalPeopleList.length;
                        }
                        if (child.formStatus === 0) {
                          tableChildObject.status = '待审批';
                        } else if(child.formStatus === 1) {
                          tableChildObject.status = '已同意';
                        } else if(child.formStatus === 2) {
                          tableChildObject.status = '已完成';
                        } else if(child.formStatus === 3) {
                          tableChildObject.status = '已撤销';
                        } else if(child.formStatus === 4) {
                          tableChildObject.status = '已驳回';
                        } else {
                          tableChildObject.status = '未知';
                        }
                        tableObject.tableChildDate.push(tableChildObject);
                      });
                    } else {
                      if (res.data.msg) {
                        this.$message({
                          message: res.data.msg,
                          type: 'warning'
                        })
                      }
                      tableObject.tableChildDate = [];
                    }
                  });
                } else if(record.applyType === 1) {
                  tableObject.type = '住宿申请';
                  this.showExpand = false;
                } else if(record.applyType === 2) {
                  tableObject.type = '机票申请';
                  this.showExpand = false;
                } else {
                  tableObject.type = '未知申请';
                  this.showExpand = false;
                }

                tableObject.reason = record.content;
                tableObject.title = record.title;
                tableObject.commitPeople = record.user.name;

                if (record.tripPeopleList) {
                  let tripStr = '';
                  record.tripPeopleList.forEach(p => {
                    tripStr += (p.name + " ");
                  });
                  tableObject.processPeople = tripStr;
                }

                tableObject.createTime = dataFormat2(record.createDate, 'yyyy-MM-dd');
                tableObject.finishTime = dataFormat2(record.finishTime, 'yyyy-MM-dd');

                if (record.checkType === 0) {
                  tableObject.pattern = '平行';
                } else if(record.checkType === 1) {
                  tableObject.pattern = '逐级';
                } else {
                  tableObject.pattern = '未知';
                }

                if (record.approvalPeopleList) {
                  let num = 0;
                  let approvalStr = '';
                  record.approvalPeopleList.forEach(p => {
                    approvalStr += (p.name + " ");
                    if (p.checkStatus === 1) {
                      num++;
                    }
                  });
                  tableObject.people = approvalStr;
                  tableObject.approvalPeopleList = record.approvalPeopleList;
                  tableObject.progress = num + "/" + record.approvalPeopleList.length;
                }

                if (record.formStatus === 0) {
                  tableObject.status = '待审批';
                } else if(record.formStatus === 1) {
                  tableObject.status = '已同意';
                } else if(record.formStatus === 2) {
                  tableObject.status = '已完成';
                } else if(record.formStatus === 3) {
                  tableObject.status = '已撤销';
                } else if(record.formStatus === 4) {
                  tableObject.status = '已驳回';
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
        finishDateStart = dateFormat(this.formData.finishStartDate, 'yyyy-MM-dd'),
        finishDateEnd = dateFormat(this.formData.finishEndDate, 'yyyy-MM-dd'),
        formStatus = parseInt(this.formData.formStatus),
        currentApprovalPepole = this.formData.processPeople,
        submitter = this.formData.commitPeople,
        limit = 10,
        page = this.pageIndex
      } = {}) {
				if(applicationDateStart > applicationDateEnd) {
					this.$message({
						message: '申请开始时间不能大于结束时间',
						type: 'warning'
					})
				} else if(finishDateStart > finishDateEnd) {
					this.$message({
						message: '完成开始时间不能大于结束时间',
						type: 'warning'
					})
				} else {
					this.loading = true;
					approvePersonList({
						applyType,
						applicationDateStart,
						applicationDateEnd,
						finishDateStart,
						finishDateEnd,
						formStatus,
						currentApprovalPepole,
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
										this.showExpand = true;
										// 查询子列表
										getSubList({
											formNo: record.formNo
										}).then(res => {
											if (res.data.code === 0) {
												res.data.data.forEach(child => {
													let tableChildObject = {};
													tableChildObject.formNo = child.formNo;
													tableChildObject.surpass = child.surpass;
													if (child.applyType === 1) {
														tableChildObject.type = '住宿申请';
													} else if (child.applyType === 2) {
														tableChildObject.type = '机票申请';
													} else {
														tableChildObject.type = '未知申请';
													}
													tableChildObject.reason = child.content;
													tableChildObject.title = child.title;
													tableChildObject.commitPeople = child.user.name;

													if (child.tripPeopleList) {
														let tripchildStr = '';
														child.tripPeopleList.forEach(p => {
															tripchildStr += (p.name + "  ");
														});
														tableChildObject.processPeople = tripchildStr;
													}

													tableChildObject.createTime = dataFormat2(child.createDate, 'yyyy-MM-dd');
													tableChildObject.finishTime = dataFormat2(child.finishTime, 'yyyy-MM-dd');

													if (child.checkType === 0) {
														tableChildObject.pattern = '平行';
													} else if (child.checkType === 1) {
														tableChildObject.pattern = '逐级';
													} else {
														tableChildObject.pattern = '未知';
													}

													if (child.approvalPeopleList) {
														let num = 0;
														let approvalStr = '';
														child.approvalPeopleList.forEach(p => {
															approvalStr += p.name;
															if (p.checkStatus === 1) {
																num++;
															}
														});
														tableChildObject.people = approvalStr;
														tableChildObject.approvalPeopleList = child.approvalPeopleList;
														tableChildObject.progress = num + "/" + child.approvalPeopleList.length;
													}

													if (child.formStatus === 0) {
														tableChildObject.status = '待审批';
													} else if (child.formStatus === 1) {
														tableChildObject.status = '已同意';
													} else if (child.formStatus === 2) {
														tableChildObject.status = '已完成';
													} else if (child.formStatus === 3) {
														tableChildObject.status = '已撤销';
													} else if (child.formStatus === 4) {
														tableChildObject.status = '已驳回';
													} else {
														tableChildObject.status = '未知';
													}
													tableObject.tableChildDate.push(tableChildObject);
												});
											} else {
												if (res.data.msg) {
													this.$message({
														message: res.data.msg,
														type: 'warning'
													})
												}
												tableObject.tableChildDate = [];
											}
										});
									} else if (record.applyType === 1) {
										tableObject.type = '住宿申请';
										this.showExpand = false;
									} else if (record.applyType === 2) {
										tableObject.type = '机票申请';
										this.showExpand = false;
									} else {
										tableObject.type = '未知申请';
										this.showExpand = false;
									}

									tableObject.reason = record.content;
									tableObject.title = record.title;
									tableObject.commitPeople = record.user.name;

									if (record.tripPeopleList) {
										let tripStr = '';
										record.tripPeopleList.forEach(p => {
											tripStr += (p.name + "  ");
										});
										tableObject.processPeople = tripStr;
									}

									tableObject.createTime = dataFormat2(record.createDate, 'yyyy-MM-dd');
									tableObject.finishTime = dataFormat2(record.finishTime, 'yyyy-MM-dd');

									if (record.checkType === 0) {
										tableObject.pattern = '平行';
									} else if (record.checkType === 1) {
										tableObject.pattern = '逐级';
									} else {
										tableObject.pattern = '未知';
									}

									if (record.approvalPeopleList) {
										let num = 0;
										let approvalStr = '';
										record.approvalPeopleList.forEach(p => {
											approvalStr += p.name;
											if (p.checkStatus === 1) {
												num++;
											}
										});
										tableObject.people = approvalStr;
										tableObject.approvalPeopleList = record.approvalPeopleList;
										tableObject.progress = num + "/" + record.approvalPeopleList.length;
									}

									if (record.formStatus === 0) {
										tableObject.status = '待审批';
									} else if (record.formStatus === 1) {
										tableObject.status = '已同意';
									} else if (record.formStatus === 2) {
										tableObject.status = '已完成';
									} else if (record.formStatus === 3) {
										tableObject.status = '已撤销';
									} else if (record.formStatus === 4) {
										tableObject.status = '已驳回';
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
			updateStatusByList(status) {
				if (this.multipleSelection.length === 0) {
					this.$message({
						message: '请选择至少一项数据',
						type: 'warning'
					});
				} else {
					let formNoList = [];
					let flag = true;
					this.multipleSelection.forEach(form => {
						if (form.commitPeople !== this.nickName) {
							this.$message({
								message: '只可撤销自己的申请单',
								type: 'warning'
							});
							flag = false;
							return;
						} else if(form.status !== '待审批') {
							this.$message({
								message: '只可撤销未审批的申请单',
								type: 'warning'
							});
							flag = false;
							return;
						}
						formNoList.push(form.formNo);
					});
					if (flag) {
						this.updateApproval(formNoList, status);
					}
				}
			},
			updateApproval(formNo, status) {
				let formNoList = [];
				if (formNo instanceof(Array)) {
					formNoList = formNo;
				} else {
					formNoList.push(formNo);
				}
				updateStatus({
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
			saveTripForm() {
				if(this.tripForm.destinationId === '') {
					this.$message({
						message: "目的地不能为空",
						type: 'warning'
					})
				} else if(this.tripForm.title === '') {
					this.$message({
						message: "申请标题不能为空",
						type: 'warning'
					})
				} else if(this.tripForm.leaveDate === null) {
          this.$message({
            message: "出差时间不能为空",
            type: 'warning'
          })
        } else if(this.tripForm.content === '') {
          this.$message({
            message: "申请理由不能为空",
            type: 'warning'
          })
        } else if(this.tripForm.approvalUsersId.length === 0) {
          this.$message({
            message: "出差人不能为空",
            type: 'warning'
          })
        } else {
					this.saveTripFormVisible = false;
					newTripForm({
						checkUser: this.tripForm.tripUsersId,
						travelUser: this.tripForm.approvalUsersId,
						content: this.tripForm.content,
						destination: this.tripForm.destinationId,
						title: this.tripForm.title,
						leaveDate: dateFormat(this.tripForm.leaveDate, 'yyyy-MM-dd'),
					}).then(res => {
						if (res.data.code === 0) {
							this.$message('添加成功！');
							this.addApprovalDialogVisible = false;
							this.reset();
							this.getApproveList();
						} else {
							if (res.data.msg) {
								this.$message({
									message: res.data.msg,
									type: 'warning'
								})
							}
						}
						this.saveTripFormVisible = true;
					});
				}
			},
			reset() {
				this.tripForm.content = '';
				this.tripForm.title = '';
				this.tripForm.approvalUsers = [];
				this.tripForm.approvalUsersId = [];
				this.tripForm.tripUsers = [];
				this.tripForm.tripUsersId = [];
				this.tripForm.leaveDate = null;
			},
			approvalValue (val, val2) {
				if (val.realUserId === this.tripForm.lastPeopleId) {
					this.$message({
						message: '最终审批人已存在',
						type: 'warning'
					})
        } else if(this.tripForm.tripUsersId.indexOf(val.realUserId) === -1) {
					this.tripForm.tripUsers.push(val.userName);
					this.tripForm.tripUsersId.push(val.realUserId);
					this.addCheckerDialogVisible = val2;
				} else {
					this.$message({
						message: '已选择该用户',
						type: 'warning'
					})
				}
			},
			childByValue (val, val2) {
				if(this.tripForm.approvalUsersId.indexOf(val.realUserId) === -1) {
					this.tripForm.approvalUsers.push(val.userName);
					this.tripForm.approvalUsersId.push(val.realUserId);
					this.addUserDialogVisible = val2;
        } else {
					this.$message({
						message: '已选择该用户',
						type: 'warning'
					})
        }
			},
			getLastPeople() {
				this.addApprovalDialogVisible = true;
				if(this.tripForm.approvalUsers.length === 0 && this.tripForm.approvalUsersId.length === 0) {
					this.tripForm.approvalUsers.push(this.nickName);
					this.tripForm.approvalUsersId.push(this.accountId);
        }
				getModel().then(res => {
					if (res.data.code === 0) {
						this.tripForm.lastPeople = res.data.data.approvalPeople.name;
						this.tripForm.lastPeopleId = res.data.data.approvalPeople.userId;
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
			delOutChecker (index) {
				this.tripForm.approvalUsers.splice(index, 1);
				this.tripForm.approvalUsersId.splice(index, 1);
			},
			delOutChecker2 (index) {
				this.tripForm.tripUsers.splice(index, 1);
				this.tripForm.tripUsersId.splice(index, 1);
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
      font-family: 'iconfont';  /* project id 780922 */
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
          .close-btn{
            cursor: pointer;
            color: red;
          }
          .trip-item-label{
            display: inline-block;
            width: 65px;
            text-align: right;
          }
          .trip-destination{
            input{
              width: 153px !important;
              height: 38px;
              border: 1px solid #C2C7CE;
              background: white;
              border-radius: 4px;
              margin-bottom: 2px;
              text-indent: 10px;
            }
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