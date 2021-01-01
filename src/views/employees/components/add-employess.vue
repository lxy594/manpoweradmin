<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="form" label-width="120px" :rules="rules" :model="formData">
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width:50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width:50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width:50%"
          placeholder="请选择入职时间"
          @change="timeTworule"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width:50%"
          placeholder="请选择"
        >
          <!-- 聘用形式的选择 -->
          <el-option
            v-for="item in employesszs.hireType"
            :key="item.id"
            :value="item.id"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width:50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width:50%"
          placeholder="请选择部门"
          @focus="getDepartments"
        />
        <div v-if="showTree" class="treeWrapper">
          <el-tree
            v-loading="loading"
            class="treeDeparment"
            :data="treeData"
            :props="{ label: 'name' }"
            :default-expand-all="true"
            @node-click="selectNode"
          />
        </div>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width:50%"
          placeholder="请选择转正时间"
          @change="timeTworule"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartmentds } from '@/api/department'
// 递归组件
import { convertTreeData } from '@/utils'
// 聘用形式下面的正式与非正式
import employesszs from '@/api/constant/employees'
// 添加:
import { addEmployes } from '@/api/employess'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const checkTime = (rule, value, callback) => {
      if (!this.formData.timeOfEntry || !this.formData.correctionTime) {
        callback()
      } else {
        const timeOfEntry = this.formData.timeOfEntry.getTime()
        console.log(timeOfEntry)
        const correctionTime = this.formData.correctionTime.getTime()
        console.log(correctionTime)
        timeOfEntry < correctionTime ? callback() : callback(new Error('转正时间大于入职的时间'))
      }
    }
    return {
      employesszs,
      treeData: [], // 定义数组接收树形数据
      showTree: false, // 控制树形的显示或者隐藏,
      loading: false,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },

      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 6,
            message: '用户名1-6位'
          }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号为11位',
            trigger: 'blur'
          }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'blur' }
        ],
        timeOfEntry: [
          { required: true, message: '入职时间', trigger: 'blur' },
          { trigger: 'change', validator: checkTime },
          { trigger: 'blur', validator: checkTime }
        ],
        correctionTime: [
          { trigger: 'change', validator: checkTime },
          { trigger: 'blur', validator: checkTime }

        ]
      }
    }
  },
  methods: {
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartmentds()
      // 递归组件进行处理
      this.treeData = convertTreeData(depts, '')
      console.log(this.treeData)
      this.loading = false
    },
    selectNode(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    async btnOk() {
      try {
        console.log(this.formData)
        const data = await addEmployes(this.formData)
        this.$emit('update:showDialog', false)
        // 通知父组件更新
        this.$emit('addEmployes')
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    },
    // 关闭按钮
    btnCancel() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.form.resetFields() // 重置校验结果
      this.$emit('update:showDialog', false)
    },
    // 两个时间的校验
    timeTworule() {
      // 拿到表单
      this.$refs.form.validateField(['timeOfEntry', 'correctionTime'])
    }
  }
}
</script>

<style lang="scss" scope>
.treeWrapper {
  width: 300px;
  height: 300px;
  border: 1px solid #888;
  overflow: hidden;
  position: absolute;
  left: 0;
  z-index: 999;
  .treeDeparment {
    width: 317px;
    height: 100%;
    overflow-y: scroll;
  }
}
</style>
