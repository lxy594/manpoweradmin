export const imageerror = {
  inserted(dom, options) {
    // // options是 指令中的变量的解释  其中有一个属性叫做 value
    // // dom 表示当前指令作用的dom对象
    // 默认的照片的回显 点进去有的图片
    dom.src = dom.src || options.value
    // console.log('指令开始')
    // console.log(dom)
    // console.log(options)
    // console.log('指令结束')
    dom.onerror = function() {
      // 图片失败默认为赋值的图片
      dom.src = options.value
    }
  },
  // 给没有图片给图片看 点进去里面是空的 触发这个函数
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}
