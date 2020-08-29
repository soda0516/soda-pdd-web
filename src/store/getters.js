const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  userInfo: state => state.user.userInfo,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  currentOnOffSaleTask: state => state.task.onOffSaleTask,
  currentCircleOnOffSaleTask: state => state.task.circleOnOffSaleTask,
  currentDeleteGoodsTask: state => state.task.deleteGoodsTask,
  noflowGoodsList: state => state.task.noflowGoodsListAll,
  currentNoflowGoodsList: state => state.task.currentNoflowGoodsListPage
}
export default getters
// status: '',
//   process: 0
