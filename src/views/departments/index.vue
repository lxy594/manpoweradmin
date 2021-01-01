<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs>
        <el-tab-pane class="title" label="组织架构" name="first" />
      </el-tabs>

      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->

        <tresstool :data="company" :roots="true" />

        <!-- 以下是树形结构 data是数组 props是return下面的-->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 右侧的负责人和操作 利用插槽的方式进行 slot-scope="{data}" 下面data.name -->
          <tresstool
            slot-scope="{ data }"
            :data="data"
            @AddDep="AddDep"
            @delDept="loadpage"
            @editDep="editDep"
          /></el-tree>
      </el-card>

      <div />
    </div>
    <AddDep ref="deptDialog" :show-dialog.sync="showDialog" :data="node" @AddDepts="loadpage" />
  </div>
</template>

<script>
import AddDep from './components/addDep'
import tresstool from './components/tresstool'
import { getDepartmentds } from '@/api/department'
import { convertTreeData } from '@/utils'
export default {
  components: {
    tresstool,
    AddDep
  },
  data() {
    return {
      // 显示窗体
      showDialog: false,
      defaultProps: {
        label: 'name'
      },
      // departs: [{
      //   name: '总裁办',
      //   manage: '小劉',
      //   children: [{
      //     name: '董事会',
      //     manage: '小劉'
      //   }]
      // },
      // { name: '行政部',
      //   manage: '小陈' },
      // { name: '人事部',
      //   manage: '小沈' }
      // ],
      departs: [],
      default: {
        label: 'name',
        children: 'children'
      },
      company: {
        // name: '小劉科技信息股份有限公司',
        // manage: '负责人'
      },
      node: {}
    }
  },
  created() {
    this.loadpage()
  },
  methods: {
    loadpage() {
      getDepartmentds().then(res => {
        console.log(res)
        this.company = {
          name: '小劉科技信息股份有限公司',
          manager: '负责人',
          id: ''
        }
        //
        this.departs = convertTreeData(res.depts, '')
      })
    },
    AddDep(node) {
      // 显示弹窗
      this.showDialog = true
      // node是当前的点击的部门
      this.node = node
    },
    editDep(node) {
      this.showDialog = true
      this.node = node
      //  编辑弹窗和记录数据,通知子组件回显数据
      this.$nextTick(() => {
        this.$refs.deptDialog.getDepartmentDeta()
      })
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
