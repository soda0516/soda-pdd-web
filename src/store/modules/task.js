// eslint-disable-next-line no-unused-vars
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  status: '',
  process: 0,
  logs: [],
  onOffSaleTask: {
    mallName: '',
    operateType: '',
    successRequestCount: 0,
    totalRequestCount: 0,
    logModelList: [],
    currentStatus: 0,
    process: 0
  },
  circleOnOffSaleTask: {
    mallName: '',
    operateType: '',
    successRequestCount: 0,
    totalRequestCount: 0,
    logModelList: [],
    currentStatus: 0,
    process: 0
  },
  deleteGoodsTask: {
    currentStatus: 0,
    totalRequestCount: 0,
    successRequestCount: 0,
    logModelList: [
      {
        id: 0,
        mallId: 0,
        mallName: '',
        errorText: '',
        remark: '',
        goodsId: 0,
        goodsName: '',
        operateType: ''
      }
    ]
  },
  noflowGoodsListAll: [],
  currentNoflowGoodsListPage: []
  // token: getToken(),
  // name: '',
  // avatar: '',
  // roles: []
}
const mutations = {
  SET_STATUS: (state, status) => {
    state.status = status
  },
  SET_PROCESS: (state, process) => {
    state.process = process
  },
  SET_ERRORLOGS: (state, logs) => {
    state.logs = logs
  },
  SET_ONOFFSALETASK: (state, onOffSaleTask) => {
    state.onOffSaleTask = onOffSaleTask
  },
  SET_CIRCLEONOFFSALETASK: (state, circleOnOffSaleTask) => {
    state.circleOnOffSaleTask = circleOnOffSaleTask
  },
  SET_noflowGoodsListAll: (state, noflowGoodsListAll) => {
    state.noflowGoodsListAll = state.noflowGoodsListAll.concat(noflowGoodsListAll)
  },
  SET_currentNoflowGoodsListPage: (state, currentNoflowGoodsListPage) => {
    state.currentNoflowGoodsListPage = currentNoflowGoodsListPage
  },
  SET_DELETEGOODS: (state, deleteGoodsTask) => {
    state.deleteGoodsTask = deleteGoodsTask
  }
  // SET_ERRORLOGS: (state, logs) = {
  //   state.logs = logs
  // }
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },
  // SET_ROLES: (state, roles) => {
  //   state.roles = roles
  // }
}

const actions = {
  setProcess({ commit }, process) {
    return new Promise((resolve, reject) => {
      commit('SET_PROCESS', process)
    })
  },
  setStatus({ commit }, status) {
    return new Promise((resolve, reject) => {
      commit('SET_STATUS', status)
    })
  },
  setErrorLogs({ commit }, status) {
    return new Promise((resolve, reject) => {
      commit('SET_ERRORLOGS', status)
    })
  },
  setOnOffSaleTask({ commit }, status) {
    return new Promise((resolve, reject) => {
      commit('SET_ONOFFSALETASK', status)
    })
  },
  setCircleOnOffSaleTask({ commit }, status) {
    return new Promise((resolve, reject) => {
      commit('SET_CIRCLEONOFFSALETASK', status)
    })
  },
  setNoflowGoodsListAll({ commit }, status) {
    return new Promise((resolve, reject) => {
      commit('SET_noflowGoodsListAll', status)
    })
  },
  setTCurrentNoflowGoodsListPage({ commit }, status) {
    return new Promise((resolve, reject) => {
      commit('SET_currentNoflowGoodsListPage', status)
    })
  },
  setDeleteGoods({ commit }, status) {
    return new Promise((resolve, reject) => {
      commit('SET_DELETEGOODS', status)
    })
  }
  // SET_CIRCLEONOFFSALETASK
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

