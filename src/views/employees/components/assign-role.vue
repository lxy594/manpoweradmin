<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <!-- 选项 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRolelist } from '@/api/setting'
import { getUserheadByid } from '@/api/user'
import { assignRoles } from '@/api/employess'
export default {
  // 通过接受让页面的组件隐藏
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [],
      roleIds: []
    }
  },
  created() {
    this.getRolelist()
  },
  methods: {
    async getRolelist() {
      const { rows } = await getRolelist()
      this.list = rows
    },
    async  getUserheadByid(id) {
      const { roleIds } = await getUserheadByid(id)
      console.log('获取用户的当前角')
      this.roleIds = roleIds
      console.log(this.roleIds)
    },
    async btnOK() {
      const btnok = await assignRoles({ roleIds: this.roleIds, id: this.userId })
      console.log(btnok)
      this.$message.success('修改成功')
      this.$emit('update:showRoleDialog', false)
    },
    async btnCancel() {
      this.roleIds = []
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style lang="scss" scoped>

.el-checkbox {
  margin: 8px;
}
</style>
