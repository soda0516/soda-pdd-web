import { login, logout, getInfo } from '@/api/user'
// eslint-disable-next-line no-unused-vars
import { getToken, setToken, removeToken } from '@/utils/auth'
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

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(getToken()).then(response => {
        // console.log(response)
        // const { data } = response.data
        // const { data } = response
        // console.log('getInfo')
        // console.log(data)

        if (!response) {
          reject('Verification failed, please Login again.')
        }

        const { username } = response
        const { userRole } = response
        const roles = []
        roles.push(userRole.roleName)
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        // console.log('userRole')
        // console.log(roles)
        commit('SET_ROLES', roles)
        commit('SET_NAME', username)
        commit('SET_AVATAR', userRole.roleNote)
        commit('SET_INFO', JSON.stringify(response))
        resolve(response)
      }).catch(error => {
        reject(error)
      })
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
  state,
  mutations,
  actions
}

