<template>
  <div>
    <!-- 新增部门的弹层 -->
    <el-dialog :title="title" :visible="showDialog" @close="btnCancel">
      <!-- 表单组件  el-form   label-width设置label的宽度   -->
      <!-- 匿名插槽 -->
      <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="formData.name"
            style="width:80%"
            placeholder="1-50个字符"
          />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input
            v-model="formData.code"
            style="width:80%"
            placeholder="1-50个字符"
          />
        </el-form-item>
        <!-- 先注释掉否则会报错 -->
        <el-form-item label="部门负责人" prop="manager">
          <el-select
            v-model="formData.manager"
            style="width:80%"
            placeholder="请选择"
            @focus="getEmployeeSimple"
          >
            <el-option
              v-for="item in people"
              :key="item.id"
              :lable="item.username"
              :value="item.username"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="formData.introduce"
            style="width:80%"
            placeholder="1-300个字符"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
      <el-row slot="footer" type="flex" justify="center">
        <!-- 列被分为24 -->
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnok">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDepartmentds,
  addDepartments,
  getDepartmentDeta,
  editDepartment
} from '@/api/department'
import { getEmployeeSimple } from '@/api/employess'
export default {
  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    const validatorDep = (rule, value, callback) => {
      getDepartmentds().then((data) => {
        // debugger
        // 编辑不能同名
        const { depts } = data
        if (this.formData.id) {
          depts.some((item) => item.id !== this.formData.id && item.name === value &&
          item.pid === this.data.pid) ? callback(new Error('不能重名')) : callback()
        } else {
          console.log(this.data.id)
          console.log(value)
          depts.some((item) => item.name === value && item.pid === this.data.id)
            ? callback(new Error(`同级部门下已经有${value}的部门了`))
            : callback()
        }
      })
    }
    // 校验部门代码合法性
    const validateDepcode = (rule, value, callback) => {
      getDepartmentds().then((data) => {
        const { depts } = data
        if (this.formData.id) {
          depts.some((item) => item.id !== item.formData.id && item.code === value && value)
            ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
        } else {
          depts.some((item) => item.code === value && value)
            ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
        }
      })
    }
    return {
      // 定义表单数据
      people: [], // 员工
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },

      // 定义校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            trigger: 'blur',
            validator: validatorDep
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1-50个字符',
            trigger: 'blur',
            validator: validateDepcode
          }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            trigger: 'blur',
            min: 1,
            max: 300,
            message: '部门介绍要求1-50个字符'
          }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.people = await getEmployeeSimple()
      console.log(this.people)
    },
    async btnok() {
      try {
        const isvalid = await this.$refs.form.validate()
        if (isvalid) {
          if (this.formData.id) {
            // 这里是编辑逻辑 这里没加await 会白板:
            await editDepartment(this.formData)
            // console.log(this.formData)
          } else {
            // 这里是新增逻辑
            // 添加上谁是 父部门的pid 数据,
            // 在外面树形结构点击的时候就有传进来 this.data.id
            const data = { ...this.formData, pid: this.data.id }
            await addDepartments(data)
          }
          // 修改关闭
          this.$emit('update:showDialog', false)
          // 关闭窗口的时候 提醒父组件进行数据的更新
          this.$emit('AddDepts')
        }
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      // 强制重置数组, 即使是回显的其他如 id 之类的数据都应该取消 解决部门的编码问题
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      // 只是隐藏了弹窗, 但是其实应该在隐藏之前 将整个表单重置, 饿了么组件库已经封装好了一个函数
      this.$refs.form.resetFields()
      this.$emit('update:showDialog', false)
    },
    // 编辑回显接将外面传进来的回显
    async getDepartmentDeta() {
      const data = await getDepartmentDeta(this.data.id)
      this.formData = data
    }
  }
}
</script>

<style>
</style>
