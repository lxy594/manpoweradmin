import { getToken, setTime, setToken, removeToken } from '@/utils/auth'
import { login as loginRequest, getUserInfo as getuserRequest, getUserheadByid } from '@/api/user'
import { Message } from 'element-ui'
import { resetRouter } from '@/router'

export default {
  namespaced: true,
  state: {
    token: getToken(), // 设置token初始状态   token持久化 => 放到缓存中
    userInfo: {}
  },
  mutations: {
    // 修改token在mutation
    setToken(state, data) {
      // 由于token在api是data所以这里的用data赋值
      state.token = data
      // 2. 引入了 utils 里面工具用来将token同时存放到cookie可以持久化
      setToken(data)
    },
    removeToken(state) {
      state.token = ''
      removeToken()
    },
    removeuser(state) {
      state.userInfo = {}
    },
    setUserInfo(state, data) {
      state.userInfo = data
    }
  },
  actions: {
    login(context, data) {
      return loginRequest(data).then(data => {
        // console.log(res.data)
        // const { data, message, success } = res.data
        // if (success) {
        Message.success('登录成功')
        context.commit('setToken', data)
        setTime()
        // }
      })
    },
    logout(context) {
      const { commit } = context
      commit('removeToken')
      commit('removeuser')
      // 重置路由
      resetRouter()
      commit('permission/SetRoutes', [], {
        root: true
      })
    },
    // getUserInfo(context) {
    //   return getuserRequest().then(data => {
    //     context.commit('setUserInfo', data)
    //   })
    // }
    'getUserInfo': async(context) => {
      const dataUserInfo = await getuserRequest()
      // 利用id进行发送详情的请求
      const dataUserhead = await getUserheadByid(dataUserInfo.userId)
      // 把两个数据结合起来
      const userInfo = {
        ...dataUserInfo,
        ...dataUserhead
      }
      context.commit('setUserInfo', userInfo)
      // 路由守卫的拦截
      return userInfo
    }
  }
}
