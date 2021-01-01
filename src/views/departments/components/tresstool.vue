<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%;"
  >
    <el-col>
      <span>{{ data.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ data.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="operationDep">
            <span> 操作<i class="el-icon-arrow-down" /> </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <!-- command	点击菜单项触发的事件回调 -->
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!roots"
                command="edit"
              >编辑部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!roots"
                command="del"
              >删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartmentds } from '@/api/department'
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    roots: {
      type: Boolean
    }
  },
  methods: {
    operationDep(option) {
      console.log(option)
      if (option === 'add') {
        // 添加
        this.$emit('AddDep', this.data)
      }

      if (option === 'edit') {
        // 编辑
        this.$emit('editDep', this.data)
      }
      // 删除
      if (option === 'del') {
        this.$confirm('是否删除该部门', '删除部门', {
          confirmButtonText: '赶快',
          cancelButtonText: '害',
          type: 'warning'
        }).then(() => {
          // 点击的时候确定
          delDepartmentds(this.data.id).then(() => {
            // 通知父组件, 更新数据
            this.$emit('delDept')
            console.log('处理成功的')
          })
        }).catch(() => {
          console.log('处理失败的')
        })
      }
    }
  }
}
</script>

<style>
</style>
