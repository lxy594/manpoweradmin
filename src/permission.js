// 引入router
import router from '@/router'
// 引入store用于存token
import store from '@/store'
// 引入进度条的插件
import NProgress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'

const orderErr = ['/login', '/404']

router.beforeEach(async(to, from, next) => {
  NProgress.start()// 开启进度条
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/') // 跳到主页
    } else {
      // 如果发现当前有 token 又不是进入登录页
      // 判断一下 vuex 里面有没有用户信息,
      // 如果没有, 不用等到页面内部,直接在这里调用 vuex action 获取数据即可
      if (!store.getters.userId) {
        // 有数据就不管, 如果没数据就调用一下 action 获取数据
        const { roles } = await store.dispatch('user/getUserInfo')
        // 通过过滤的方法康roles里面有没有这个name
        // 转移到我新建的permission通过共享的方式有菜单栏
        const RouterName = await store.dispatch('permission/filterRoutes', roles)
        // 添加动态路由
        router.addRoutes(RouterName)
        next(to.path)
      } else {
        // 这里不用else的话会形成死循环
        next()// 直接放行
      }
    }
  } else {
    // 如果没有token

    if (orderErr.indexOf(to.path) > -1) {
      // 如果找到了 表示在在名单里面
      next()
    } else {
      next('/login')
    }
  }
  // 为了解决 手动切换地址时  进度条的不关闭的问题刷新或者手动的时候也一闪
  // return后无法执行代码所以把return去掉
  NProgress.done()
})
// 后置的守卫
router.afterEach((to, from, next) => {
  NProgress.done()// 关闭进度条
})
