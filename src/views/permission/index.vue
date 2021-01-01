<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button
            type="primary"
            size="small"
            @click="addPermission(1, '0')"
          >添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table border :data="List" row-key="id">
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              @click="addPermission(2, row.id)"
            >添加权限</el-button>
            <el-button
              type="text"
              @click="editPermission(row.id)"
            >编辑权限</el-button>
            <el-button
              type="text"
              @click="deletePermission(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹出层 -->
    <el-dialog
      :title="titles"
      :visible="showDialog"
      :destroy-on-close="true"
      @close="btnCancel"
    >
      <!-- 表单 -->
      <el-form
        ref="perForm"
        :rules="rules"
        :model="formData"
        label-width="120px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="激化状态">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getpermissionList,
  deletePermission,
  addPermission,
  updatePermission,
  getPermissionDetail
} from '@/api/permission'
// 转换
import { convertTreeData } from '@/utils'

export default {
  data() {
    return {
      showDialog: false,
      List: [],
      formData: {
        enVisible: '0',
        name: '',
        code: '',
        description: '',
        type: '',
        pid: ''
      },
      rules: {
        name: [
          { required: true, message: '权限的名字不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限的标识不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '权限的描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 通过计算属性判断它是新增函数编辑
    titles() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getpermissionList()
  },
  methods: {
    async getpermissionList() {
      this.List = await getpermissionList()
      // console.log(data)
      // this.List = data
      // 通过这个管理每一个部门的东西
      this.List = convertTreeData(this.List, '0')
    },
    // 删除
    async deletePermission(id) {
      try {
        await this.$confirm('确定删除数据？')
        await deletePermission(id)
        this.getpermissionList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 添加
    addPermission(type, pid) {
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    // 确定按钮:先关闭窗口再提示添加成功
    async btnOK() {
      let data
      if (this.formData.id) {
        data = await updatePermission(this.formData)
      } else {
        data = await addPermission(this.formData)
      }
      console.log(data)
      this.showDialog = false
      this.$message.success(this.formData.id ? '编辑成功' : '新增成功')
      this.getpermissionList()
    },

    // 点取消
    btnCancel() {
      this.formData = {
        enVisible: '0',
        name: '',
        code: '',
        description: '',
        type: '',
        pid: ''
      }
      this.showDialog = false
    },
    // 编辑:通过调用获取权限详情进行回显
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }
  }
}
</script>

<style>
</style>
