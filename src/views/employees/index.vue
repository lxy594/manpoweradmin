<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ pageSet.total }}条记录</span>
        <template slot="after">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import?type=empoyess')"
          >导入</el-button>
          <el-button
            size="small"
            type="danger"
            @click="exportDat"
          >导出</el-button>
          <el-button
            size="small"
            type="primary"
            :disabled="chexkPermissionMixin('POINT-USER-ADD')"
            @click="showDialog = true"
          >新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable="">
            <template slot-scope="{ $index }">{{
              $index + 1
            }}</template></el-table-column>
          <el-table-column label="头像" align="center">
            <template slot-scope="{ row }">
              <img
                v-imageerror="require('@/assets/common/login-bgs.jpg')"
                :src="row.staffPhoto"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px;text-overflow:none"
                alt=""
                @click="
                  row.staffPhoto
                    ? popCode(row.staffPhoto)
                    : (showCodeDialog = false)
                "
              >
            </template>
          </el-table-column>
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatEmployment"
          />

          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="">
            <template slot-scope="{ row }">
              <!-- 数据里面的数 -->
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="">
            <template slot-scope="{ row }">
              <!-- 根据状态来看是否打开 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push('/employees/detail/' + row.id)"
              >查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button
                :disabled="chexkPermissionMixin('point-user-delete')"
                type="text"
                size="small"
                @click="delEmploye(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :page-size="pageSet.size"
            :page-sizes="[2, 5, 8, 10, 20, 50]"
            :current-page="pageSet.page"
            :total="pageSet.total"
            @size-change="sizeChange"
            @current-change="currenchange"
          />
        </el-row>
      </el-card>
    </div>
    <!-- showDialog组件里面的 -->
    <Addemployess :show-dialog.sync="showDialog" @addEmployes="getUserList" />
    <!-- 角色的组件 -->
    <AssignRole ref="editRole" :user-id="userId" :show-role-dialog.sync="showRoleDialog" />
    <!-- 二维码: -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog" @opened="showCodeS">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
        <!-- {{ imgUrl }} -->
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 引入二维生成的插件
import QRcode from 'qrcode'
// 这里是引入它的方法
import { formatDate } from '@/filters'
import Addemployess from './components/add-employess'
import { getUserList, delEmploye } from '@/api/employess'
import EmployeeEnum from '@/api/constant/employees'
// 角色组件的引入
import AssignRole from '@/views/employees/components/assign-role'

export default {
  components: {
    Addemployess,
    // 角色的组件
    AssignRole
  },
  data() {
    return {
      userId: '',
      imgUrl: '',
      showCodeDialog: false,
      showDialog: false,
      showRoleDialog: false,
      list: [],
      pageSet: {
        page: 1, // 页码
        size: 10, // 每页的条数
        total: 0 // 总数
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {

    // 把有图片的有图片地址
    popCode(url) {
      // 弹出窗口
      // 记录地址
      this.showCodeDialog = true
      this.imgUrl = url
    },
    // 点击员工的图片时，显示弹层，并将图片地址转化成二维码
    showCodeS() {
      QRcode.toCanvas(this.$refs.myCanvas, this.imgUrl)
    },
    async getUserList() {
      this.loading = true
      const { rows, total } = await getUserList(this.pageSet)
      this.pageSet.total = total
      // 把管理员去掉
      // rows.shift()
      this.list = rows
      this.loading = false
    },
    // 导出功能
    async exportDat() {
      const excel = await import('@/vendor/Export2Excel')
      console.log(excel)
      // 做枚举 表头是英文 拿数据是英文的key
      const headersEnum = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      const header = Object.keys(headersEnum)
      // console.log(header)得到表头的七个数组
      //  获取数据根据他们进行获取
      const pageSet = {
        page: 1,
        size: this.pageSet.total
      }
      const { rows } = await getUserList(pageSet)
      // console.log(rows)// 得到是英文的数组
      // 数据是obj的数组 map成每个中文的表头的数组
      const data = rows.map(item => {
        return this.objArry(item, headersEnum)
      })
      // console.log(data)// 得到数组
      // 点击导出会有一个exce表可以下载
      excel.export_json_to_excel({
        header,
        data
      })
    },
    objArry(item, switchEn) {
      const array = []

      for (const key in switchEn) {
        const enkeys = switchEn[key]
        // 时间的转换
        let value = item[enkeys]
        if (enkeys === 'timeOfEntry' || enkeys === 'correctionTime') {
          value = formatDate(value)
        }
        // 聘用形式
        if (enkeys === 'formOfEmployment') {
          const objs = EmployeeEnum.hireType.find(item => item.id === value)
          value = objs ? objs.value : '临时工'
        }
        // 把它放到数组里面
        array.push(value)
      }
      // console.log(array)// ["小黄", "13456765434", "2020-12-08T16:00:00.000+0000", 1, "2020-12-29T16:00:00.000+0000", "232421", null]
      return array
    },
    currenchange(newpage) {
      this.pageSet.page = newpage
      this.getUserList()
    },
    sizeChange(newsize) {
      this.pageSet.size = newsize
      this.getUserList()
    },

    // 判断正式与非正式
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除功能
    async delEmploye(id) {
      try {
        await this.$confirm('确定删除员工吗')
        await delEmploye(id)
        await this.getUserList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 角色功能:--------------------
    async editRole(userId) {
      this.userId = userId // props传值 是异步的
      await this.$refs.editRole.getUserheadByid(this.userId) // 父组件调用子组件方法
      this.showRoleDialog = true
    }

  }
}
</script>

<style>
</style>
