import { login, logout } from '@/api/user'
// eslint-disable-next-line no-unused-vars
import { getToken, setToken, removeToken,setUsername } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  userInfo: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  test({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      commit('SET_NAME', userInfo)
    })
  },
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username, password: password }).then(response => {
        // const { data } = response
        commit('SET_TOKEN', response)
        setToken(response)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  clearInfo({ commit }) {
    return new Promise((resolve, reject) => {
      console.log('clearInfo')
      setToken('')
      setUsername('')
      removeToken()
      resetRouter()
      resolve()
    })
  },
  // get user info
  getInfo({ commit }, username) {
    return new Promise((resolve, reject) => {
      console.log('getInfo' + username)
      commit('SET_NAME', username)
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_NAME', '')
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_ROLES', [])
        commit('SET_INFO', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  name,
  state,
  mutations,
  actions
}

