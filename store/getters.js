const getters = {
  dialogLoginVisible: state => state.user.dialogLoginVisible,
  nickName: state => state.user.nickName,
  userInfo: state => state.user.userInfo,
  showMap: state => state.common.showMap,
  showForm: state => state.common.showForm,
	showLongRoom: state => state.common.showLongRoom,
  accountId: state => state.user.accountId,
  accountType: state => state.user.accountType,
  cityList: state => state.common.cityList,
  airCityList: state => state.common.airCityList,
  timeOffset: state => state.common.timeOffset,
  bindMobileDialogVisible: state => state.user.bindMobileDialogVisible,
  wechatId: state => state.user.wechatId
}
export default getters
