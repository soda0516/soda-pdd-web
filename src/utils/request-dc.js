import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import router from '../router'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: 'http://pddapi.nihaoapp.cn/',
  // baseURL: 'http://47.94.253.233/api',
  baseURL: 'http://jpsh.nihaoapp.cn/0516/api',
  // baseURL: 'http://127.0.0.1:10351/',
  // baseURL: 'http://100.65.130.57:10351/',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 280000 // request timeout
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
    // if (getToken()) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['authorization'] = getToken()
    //   // console.log('X-Token' + getToken())
    //   // const token = getToken()
    //   // console.log(token)
    //   // config.headers['Authorization'] = getToken()
    // }
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
    console.log(response)
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (response.headers['content-type'] === 'application/octet-stream') {
      return res
    }
    console.log(res)
    if (res.code !== 20000) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === -2) {
        Message({
          message: res.desc || '接口调用错误',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: res.desc || '接口调用错误',
          type: 'error',
          duration: 1000
        })
      }
      return res
    } else {
      return res
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
