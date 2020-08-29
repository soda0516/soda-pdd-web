import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import router from '../router'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: 'https://www.dckeji.tech/api/',
  // baseURL: 'http://127.0.0.1:7008/',
  // baseURL: 'http://47.94.253.233/',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-Token'] = getToken()
    //   console.log('X-Token' + getToken())
    //   // const token = getToken()
    //   // console.log(token)
    //   // config.headers['Authorization'] = getToken()
    // }
    if (getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
      // console.log('X-Token' + getToken())
      // const token = getToken()
      // console.log(token)
      // config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log('请求出现错误' + error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (response.headers['content-type'] === 'application/octet-stream') {
      return res
    }
    if (res.code !== 20000) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else if (res.code === 60000 || res.code === 60001) {
        Message({
          message: res.data || '未知警告',
          type: 'warning',
          duration: 5 * 1000
        })
      } else if (res.code === 40003) {
        /*
        这块是未授权错误，需要弹回到登录界面
         */
        Message({
          message: res.message || '未知错误',
          type: 'error',
          duration: 5 * 1000
        })
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
        // router.push({ path: '/login' })
        // 40003
      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res.data
    }
  },
  error => {
    // console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
