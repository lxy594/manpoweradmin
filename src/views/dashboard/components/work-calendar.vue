<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="small" style="width:120px" @change="changeData">
        <el-option v-for="item in yearList" :key="item" :value="item">{{ item }}</el-option>
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width:120px" @change="changeData">
        <el-option v-for="item in 12" :key="item" :value="item"> {{ item }}</el-option>
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
      <template slot="dateCell" slot-scope="scope">
        {{ scope.data.day | getDay }}
        <span v-if="isRest(scope.date)" class="rest">休</span>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(val) {
      const day = val.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      yearList: [],
      currentDate: null,
      currentYear: null,
      currentMonth: null
    }
  },
  created() {
    // 获取当前的年份和当前的月份
    this.currentYear = this.startDate.getFullYear()
    this.currentMonth = this.startDate.getMonth() + 1
    console.log('当前的年', this.currentYear)
    console.log('当前的月', this.currentMonth)

    // 前后五年 2015-2025 11个
    this.yearList = Array.from(Array(11), (val, index) => {
      const now = new Date()
      return index + now.getFullYear() - 5
    })
    this.changeData()
    console.log(this.yearList, '获取前后五年')
  },
  methods: {
    // 年月份改变之后
    changeData() {
      const year = this.currentYear
      console.log('年份', year)
      const month = this.currentMonth
      console.log('月份', month)
      this.currentDate = new Date(`${year}-${month}-1`)
    },

    isRest(date) {
      // 休息是6和0 固定星期六日
      return date.getDay() === 6 || date.getDay() === 0
    }
  }
}
</script>

<style lang="scss" scoped>

.rest{
text-align: center;
    border-radius: 50%;
    background-color: #d3f735;
    width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left:25px;
  font-weight: 550;
}
</style>
