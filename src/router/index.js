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
    hidden: false
  },
  {
    path: '/',
    component: Layout,
    redirect: function() {
      return '/mall'
    },
    children: [
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
    redirect: '/mall-operation',
    children: [
      {
        path: '/mall-operation',
        name: 'MallOperation',
        component: () => import('@/views/goods/mall-operation.vue'),
        meta: { title: '绑定店铺信息', icon: 'form' }
      }]
  },
  {
    path: '/goods-item',
    component: Layout,
    // redirect: '/goods/mall-operation',
    name: 'Data',
    meta: { title: '商品管理', icon: 'example' },
    children: [
      {
        path: '/detail-fast-on-off-sale',
        name: 'DetailFastOnOffSale',
        component: () => import('@/views/goods/fast/detail-fast-on-off-sale.vue'),
        meta: { title: '上下架及删除', icon: 'form' }
      }
    ]
  },
  {
    path: '/copy',
    component: Layout,
    meta: { title: '搬家上货', icon: 'example' },
    children: [
      {
        path: '/taobao-upload',
        name: 'TaobaoUpload',
        component: () => import('@/views/copy/taobao-upload.vue'),
        meta: { title: '商品搬家上货', icon: 'form' }
      }
    ]
  },
  {
    path: '/record',
    component: Layout,
    meta: { title: '搬家上货', icon: 'example' },
    children: [
      {
        path: '/taobao-collect',
        name: 'TaobaoCollectVue',
        component: () => import('@/views/copy/taobao-collect.vue'),
        meta: { title: '商品搬家记录', icon: 'form' }
      }
    ]
  },
  {
    path: '/on-off-sale',
    component: Layout,
    // redirect: '/goods/mall-operation',
    name: 'Data',
    meta: { title: '草稿管理', icon: 'example' },
    children: [
      {
        path: '/draft-clean',
        name: 'DraftClean',
        component: () => import('@/views/goods/draft-clean/draft-clean.vue'),
        meta: { title: '草稿查询清理', icon: 'form' }
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
        meta: { title: '登录信息修改', icon: 'form' }
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
        meta: { title: '技术客服信息', icon: 'form' }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  base: '/',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
