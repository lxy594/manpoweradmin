<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">

            <!-- 放置表单 -->
            <el-form ref="userForm" :model="formData" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="formData.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="新密码:" prop="newPassword">
                <el-input v-model="formData.newPassword" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="upData">更新</el-button>
                <el-button @click="$router.back()">取消</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 个人信息的组件 -->
            <component :is="userInfo" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- 用component的方法进行 -->
            <component :is="jobInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>

</template>

<script>
import { getUserheadByid } from '@/api/user'
import { saveUserByid } from '@/api/employess'
// 引入
import userInfo from '@/views/employees/components/user-info'
import jobInfo from '@/views/employees/components/job-info'
export default {
  // 注册
  components: {
    userInfo,
    jobInfo
  },
  data() {
    return {
      userInfo,
      jobInfo,
      userId: this.$route.params.id,
      //   绑定这个的话下面的东西要自己点没有默认的第一个
      // activeName: 'loginaccount',
      formData: {
        username: '',
        newPassword: ''
      },
      // 校验
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        newPassword: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserheadByid()
  },
  methods: {
    async getUserheadByid() {
      const data = await getUserheadByid(this.userId)
      console.log(data)
      this.formData = data
    },
    async upData() {
      try {
        await this.$refs.userForm.validate()
        await saveUserByid({ ...this.formData, password: this.formData.newPassword })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>
