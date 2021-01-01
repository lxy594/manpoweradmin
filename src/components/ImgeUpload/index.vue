<template>
  <div>
    <!-- 点击图片进行预览 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :file-list="fileList"
      :http-request="comsove"
      :on-change="onchange"
      :on-preview="preview"
      :on-remove="handleRmove"
      :class="{disabled: fileComputed }"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percent" />
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="">
    </el-dialog>

  </div>
</template>

<script>
// 引入腾讯云
import COS from 'cos-js-sdk-v5' // 引入腾讯云的包
import { cloundconfig } from '@/Serverimg'
const cos = new COS({
  ...cloundconfig
})
console.log(cos)
export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: '',
      percent: 0,
      showPercent: false // 默认不显示进度条
    }
  },
  computed: {
    // 控制上传显示
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 上传动作调用上传腾讯云
    comsove(params) {
      // 1.这里会404 所以进行拦截
      console.log(params.file)
      // 这里是腾讯云的存储桶
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'rzxtimg-1304560110', // 存储桶
          Region: 'ap-guangzhou', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
          onProgress: (params) => {
            this.percent = Math.ceil(params.percent * 100)
          }
        }, (err, data) => {
          // data返回数据之后 应该如何处理
          console.log(err || data)
          // 判断上传成功 data中有一个statusCode === 200 的时候说明上传成功
          if (!err && data.statusCode === 200) {
            // 将fileList中的数据的url地址变成 现在上传成功的地址 fileList是一个数组要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性 upload 为true 表示这张图片已经上传完毕
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
            this.showPercent = false// 隐藏进度条
          }
        })
      }
    },
    // 2.添加图片
    onchange(file, newFileList) {
      // 这里数组没东西这样子里面有东西
      this.fileList = [...newFileList]
    },
    // 3.放大镜
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 4.删除图片:
    handleRmove(file, NewFilehand) {
      // 覆盖当前的数组
      this.fileList = [...NewFilehand]
    },
    // 控制上传图片的类型和上传大小， 如果不满足条件 返回false上传就会停止
    beforeUpload(file) {
      // 文件的大小 以及类型
      const type = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!type.includes(file.type)) {
        this.$message.error('上传图片的格式只能是JPEG,GIF,bmp,png')
        return false
      }
      // 文件的大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片的大小不能超过5m')
        return false
      }
      //  上传的时候是带uid的本地上传后替换url
      this.currentFileUid = file.uid
      this.showPercent = true// 显示滚动条
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.disabled{
  ::v-deep .el-upload--picture-card {
    display: none;
}
}
</style>
