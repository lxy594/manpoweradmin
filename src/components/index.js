import PageTools from './PageTools'
import UPloadExcel from './UPloadExcel'
import ImageUpload from './ImgeUpload'
// 全屏
import ScreenFull from './FullScreen'
// tab视图
import TagsView from './TagsView'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UPloadExcel', UPloadExcel)// 导入的Excel组件
    Vue.component('ImageUpload', ImageUpload)// 照片的组件
    Vue.component('FullScreen', ScreenFull) // 注册全屏组件
    Vue.component('TagsView', TagsView)
  }
}
