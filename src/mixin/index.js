import store from '@/store'
export const chexkPermissionMixin = {
  methods: {
    chexkPermissionMixin(pointname) {
      // 退出时候userInfo会被清空 导致roles不存在会报太不存在 所以需要先做判断避免报错误
      if (!store.state.user.userInfo.roles) {
        return false
      } else {
        return store.state.user.userInfo.roles.points.indexOf(pointname) > 0
      }
    }
  }
}
