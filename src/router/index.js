import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/hello',
    name: 'Hello',
    component: () => import('@/views/hello'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '辽宁虹天', icon: 'dashboard' }
    },
    {
      path: '/callback',
      name: 'Callback',
      component: () => import('@/views/callback.vue'),
      hidden: true,
      meta: { title: '授权回调', icon: 'form' }
    }
    ]
  },
  {
    path: '/mall',
    component: Layout,
    children: [
      {
        path: '/mall-operation',
        name: 'MallOperation',
        component: () => import('@/views/goods/mall-operation.vue'),
        meta: { title: '店铺登陆', icon: 'form' }
      }]
  },
  {
    path: '/on-off-sale',
    component: Layout,
    // redirect: '/goods/mall-operation',
    name: 'Data',
    meta: { title: '商品管理', icon: 'example' },
    children: [
      {
        path: '/fast-on-off-sale',
        name: 'FastOnOffSale',
        component: () => import('@/views/goods/fast/fast-on-off-sale.vue'),
        meta: { title: '急速操作', icon: 'form' }
      },
      {
        path: '/scheduler-on-off-sale',
        name: 'SchedulerOnOffSale',
        component: () => import('@/views/goods/scheduler/scheduler-on-off-sale.vue'),
        meta: { title: '定时操作', icon: 'form' }
      },
      {
        path: '/noflow-off-shelve',
        name: 'NoflowOffShelve',
        component: () => import('@/views/goods/noflow/noflow-off-shelve.vue'),
        meta: { title: '流量操作', icon: 'form' }
      }
      // {
      //   path: '/circle-on-off-sale',
      //   name: 'CircleOnOffSale',
      //   component: () => import('@/views/goods/circle/circle-on-off-sale.vue'),
      //   meta: { title: '循环操作', icon: 'form' }
      // }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    meta: { title: '商品管理', icon: 'example' },
    children: [
      {
        path: '/delete-goods',
        name: 'DeleteGoods',
        component: () => import('@/views/goods/task/delete-goods.vue'),
        meta: { title: '商品删除', icon: 'form' }
      }
    ]
  },
  {
    path: '/copy',
    component: Layout,
    meta: { title: '商品复制', icon: 'example' },
    children: [
      {
        path: '/taobao-pinduoduo-goods-copy',
        name: 'TaobaoPinduoduoGoodsCopy',
        component: () => import('@/views/copy/taobao-pinduoduo-goods-copy.vue'),
        meta: { title: '商品上传', icon: 'form' }
      },
      {
        path: '/forbidden-word-manage',
        name: 'ForbiddenWordManage',
        component: () => import('@/views/copy/forbidden-word-manage.vue'),
        meta: { title: '禁词管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: '系统管理', icon: 'example' },
    children: [
      {
        path: '/account-modify',
        name: 'AccountModify',
        component: () => import('@/views/system/account-modify.vue'),
        meta: { title: '账户修改', icon: 'form' }
      },
      {
        path: '/mall-delete',
        name: 'MallDelete',
        component: () => import('@/views/system/mall-delete.vue'),
        meta: { title: '店铺删除', icon: 'form' }
      }
    ]
  },
  {
    path: '/contact',
    component: Layout,
    meta: { title: '联系我们', icon: 'example' },
    children: [
      {
        path: '/contact-us',
        name: 'ContactUs',
        component: () => import('@/views/contact/contact-us.vue'),
        meta: { title: '客服信息', icon: 'form' }
      }
    ]
  }
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]
export const asyncRoutes = [
  {
    path: '/crawler',
    component: Layout,
    // redirect: '/crawler/cookie-setting',
    alwaysShow: true, // will always show the root menu
    name: 'Crawler',
    meta: {
      title: '采集设置',
      icon: 'nested',
      roles: ['ROLE_ADMIN'],
      noCache: true
    },
    children: [
      {
        path: '/cookie-setting',
        name: 'CookieSetting',
        component: () => import('@/views/system/crawler/cookie_setting.vue'), // Parent router-view
        meta: { title: 'COOKIE', roles: ['ROLE_ADMIN'], icon: 'form', noCache: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  base: './',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes, asyncRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
