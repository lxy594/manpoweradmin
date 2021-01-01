<template>
  <div>
    <UPloadExcel
      :on-success="onSuccess"
    />
  </div>
</template>

<script>
import { importEmployess } from '@/api/employess'
export default {
  // 转换英文
  methods: {
    async onSuccess({ header, results }) {
      const switchEn = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const data = results.map(item => {
        return this.cnSwitchEn(item, switchEn)
      })
      // 成功回退到页面

      // 如果员工带上导入的点击type类型进行  发送员工导入的请求
      if (this.$route.query.type === 'empoyess') {
        this.$message.success('导入成功')
        await importEmployess(data)
        setTimeout(() => {
          // 导入成功后返回到上一页 通过延时器的效果更好
          this.$router.back()
        }, 800)
      } else {
        this.$message.error('其他的导入类型')
      }

      console.log(data)
    },
    // 转换英文
    cnSwitchEn(item, switchEn) {
      const newItem = {}
      console.log(item)

      for (const key in item) {
        const newKey = switchEn[key]
        let value = item[key]
        // 拿到下面的 formDataStr
        if (newKey === 'timeOfEntry' || newKey === 'correctionTime') {
          // const formDataSt = this.formDataStr(value, '/')
          value = new Date(this.formDataStr(value, '/'))
        }
        newItem[newKey] = value
        console.log(newItem)
      }
      return newItem
    },
    // 专用于导入excel后时间处理
    formDataStr(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
