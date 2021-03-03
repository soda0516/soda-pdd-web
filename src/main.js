import Vue from 'vue'
// import VueSocketIO from 'vue-socket.io'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Global from '@/global_variable'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import request from './utils/request'
import requestDc from './utils/request-dc'
import utils from './utils/index'
import axios from 'axios'
import VueCookies from 'vue-cookies'
import VueIntro from 'vue-introjs'
import 'intro.js/introjs.css'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}
Vue.use(VueCookies)
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
Vue.use(VueIntro)
// Vue.use(ElementUI, { zhLocale })
// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: 'ws://localhost:7008/websocket/'
// }))
// eslint-disable-next-line no-undef
// Vue.use(VueI18n)
// const i18n = new VueI18n({
//   // eslint-disable-next-line no-undef
//   locale: lang,
//   // locale: sessionStorage.getItem('language')||'en',
//   messages: {
//     // eslint-disable-next-line no-undef
//     'en': Object.assign(require('./lang/en.json'), enLocale), // 将我们项目中的语言包与Element的语言包进行合并
//     'zh': Object.assign(require('./lang/zh.json'), zhLocale),
//     // eslint-disable-next-line no-undef
//     'es': Object.assign(require('./lang/es.json'), esLocale)
//   }
// })
// Vue.use(ElementUI, {
//   i18n: (key, value) => i18n.t(key, value) // 重点！！在注册Element时设置i18n的处理方法（这里有个小坑）
// })
Vue.prototype.$request = request
Vue.prototype.$requestDc = requestDc
Vue.prototype.$axios = axios
Vue.prototype.$utils = utils
Vue.prototype.$global = Global

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
