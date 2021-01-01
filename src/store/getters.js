const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 加登录页带token的修改加user从模块哪里请求到东西
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.userInfo.staffPhoto,
  companyId: state => state.user.userInfo.companyId
}
export default getters
