import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, setToken, setUsername, getUsername } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import utils from './utils/index'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/callback', 'https://fuwu.pinduoduo.com/'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  console.log('进入beforeEach')
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  // eslint-disable-next-line no-unused-vars
  if (to.path === '/callback') {
    // if is logged in, redirect to the home page
    console.log('能进入到beforeEach/callback')
    console.log(to.path)
    next()
  }
  console.log(hasToken)
  // NProgress.done()
  if (hasToken) {
    if (to.path === '/login') {
      console.log('hasToken' + to.path)
      next({ path: '/' })
      // if is logged in, redirect to the home page
      NProgress.done()
    } else {
      console.log(to.path)
      next()
      // const hasRoles = store.getters.name && store.getters.name.length > 0
      // console.log(store.getters.name)
      // const hasGetUserInfo = getToken()
      // if (getUsername()) {
      //   console.log('getUsername')
      //   next()
      // } else {
      //   try {
      //     console.log('try')
      //     // get user info
      //     // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
      //     await store.dispatch('user/clearInfo')
      //     // generate accessible routes map based on roles
      //     const roles = []
      //     console.log(roles)
      //     // const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
      //     // console.log('accessRoutes')
      //     // console.log(store.getters.permission_routes)
      //     // router.options.routes = store.getters.permission_routes
      //     // // dynamically add accessible routes
      //     // router.addRoutes(accessRoutes)
      //     // hack method to ensure that addRoutes is complete
      //     // set the replace: true, so the navigation will not leave a history record
      //     // ...to
      //     // path: '/'
      //     //   , replace: true
      //     next({ path: '/login' , replace: true})
      //   } catch (error) {
      //     // remove token and go to login page to re-login
      //     await store.dispatch('user/resetToken')
      //     Message.error(error || 'Has Error')
      //     // next(`/login?redirect=${to.path}`)
      //     NProgress.done()
      //   }
      // }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      console.log('/login?redirect=${to.path}')
      if (utils.getUrlKey('token') && utils.getUrlKey('username')) {
        setToken(utils.getUrlKey('token'))
        setUsername(utils.getUrlKey('username'))
        console.log(utils.getUrlKey('username'))
        next({ path: '/', replace: true })
      } else {
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
      // other pages that do not have permission to access are redirected to the login page.
    }
  }
})
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
