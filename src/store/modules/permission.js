import { asyncRoutes, constantRoutes } from '@/router'
const state = {
  roles: []
}

const mutations = {
  SetRoutes(state, data) {
    // state.routes = ({ ...constantRoutes, ...data })
    state.routes = [...constantRoutes, ...data]
  }
}

const actions = {
  filterRoutes(context, roles) {
    console.log(roles)
    const RouterName = asyncRoutes.filter(item => roles.menus.indexOf(item.name) > -1)
    // 解决刷新页面404
    console.log(RouterName)
    RouterName.push({ path: '*', redirect: '/404', hidden: true })
    // 添加动态路由
    context.commit('SetRoutes', RouterName)
    return RouterName
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

