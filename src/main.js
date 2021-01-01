import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 注册自己的组件 components下面的组件
import Components from '@/components'
Vue.use(Components)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明

// 注册自定义指令:
import { imageerror } from '@/directives'
// 声明单个不用is
Vue.directive('imageerror', imageerror)

// // 时间过滤器:全局过滤器的创建方法是 Vue.filter(名称, 函数体)
// import { formatDate } from '@/filters'
// Vue.filter('formatDate', formatDate)

// 注册插件
import Print from 'vue-print-nb'
Vue.use(Print)

// 全局的引入:注册所有过滤器
import * as filters from '@/filters'
console.log(filters)
for (var key in filters) {
  const filterName = key
  const filterFunction = filters[key]
  // console.log(filterName)
  // console.log(filterFunction)
  Vue.filter(filterName, filterFunction)
}
// 全局引入mixin
import { chexkPermissionMixin } from '@/mixin'
// import i18n from '@/i18n'
Vue.mixin(chexkPermissionMixin)

Vue.config.productionTip = false
import i18n from '@/i18n'
Vue.use(ElementUI, {
  i18n: (key) => i18n.t(key)
})
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
