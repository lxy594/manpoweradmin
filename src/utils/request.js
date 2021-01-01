// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
// message的弹窗
import { Message } from 'element-ui'
// 注入token
import store from '@/store'
import router from '@/router'
// 时间戳
import { getTime } from './auth'
// 设置时间
const timesout = 7200

// 创建一个axios的实例
const service = axios.create({
  // 这里为什么是process.env nojes的环境变量
  baseURL: process.env.VUE_APP_BASE_API,
  //   5秒后数据没反应就失败
  timeout: 5000
})

// 请求拦截器 统一注入token
service.interceptors.request.use(config => {
  // console.log(config)
  if (store.getters.token) {
    // 时间戳
    if (ischeckTimeout()) {
      // 拿出当前时间戳,cookie 如果超时 直接退出 没有超时继续
      store.dispatch('user/logout')
      // 到登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    } else {
      // 如果token存在 注入token Bearer解析成变量
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
  }
  return config
// }, error => {
//   return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(res => {
  // console.log(res.data)
  const { data, message, success } = res.data
  if (success) {
    return data
  } else {
    // 弹出
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, err => {
// token生效的被动介入处理:
  // console.dir(err)
  // 错误的时候普通情况是弹窗
  if (err.response && err.response.data && err.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  }

  // 前面处理的是200的成功的处理 但是还有一些错误路径的处理
  Message.error(err.message)
  return Promise.reject(err.message)
})
// 导出axios实例
export default service

function ischeckTimeout(params) {
  // 这里封装判断是否过期的函数, 只会返回true/false
  // 当前时间戳
  const now = Date.now()
  const savedTime = getTime()// 缓存时间戳
  // console.log(now)
  // console.log(savedTime)
  return (now - savedTime) / 1000 > timesout
}
