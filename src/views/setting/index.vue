<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="List">
              <el-table-column label="序号" width="120">
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column prop="name" label="角色名称" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="editassign(row.id)"
                  >分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                  >编辑</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="getcompanyDel(row.id)"
                  >删除</el-button>
                </template></el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageSetting.total"
                :current-page="pageSetting.page"
                :page-size="pageSetting.pagesize"
                :page-sizes="[2, 5, 10, 20]"
                @current-change="changPage"
                @size-change="sizeChange"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input
                  placeholder="小劉科技信息股份有限公司"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 这里是编辑/新增的弹窗部分 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="showDialog"
        width="50%"
        @close="btnCancel"
      >
        <el-form ref="roleForm" label-width="120px" :rules="rules">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <template slot="footer">
          <el-row>
            <el-col :span="6">
              <el-button size="small" @click="btnCancel">取消</el-button>
              <el-button
                size="small"
                type="primary"
                @click="btnOK"
              >确定</el-button>
            </el-col>
          </el-row>
        </template>
      </el-dialog>
    </div>
    <!-- 权限的弹窗 default-expand-all展开所有的节点  show-checkbox节点是否可被选择  heck-strictly在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false-->
    <el-dialog
      title="编辑权限"
      :visible="showPermDialog"
      :show-checkbox="true"
      :check-strictly="true"
      @close="btnPermCancel"
    >
      <!-- node-key	每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
     default-checked-keys	默认勾选的节点的 key 的数组-->
      <el-tree
        ref="permTree"
        node-key="id"
        :default-checked-keys="oldselectCheck"
        :data="permisList"
        :props="{ label: 'name' }"
        :default-expand-all="true"
        :show-checkbox="true"
        :check-strictly="true"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button
            type="primary"
            size="small"
            @click="btnPermOK"
          >确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolelist,
  getcompanyInfo,
  getcompanyDel,
  getRoleDetail,
  updateRole,
  addRole,
  assignPrem
} from '@/api/setting'
// 树形组件
import { convertTreeData } from '@/utils'
import { getpermissionList } from '@/api/permission'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      oldselectCheck: [], // 加载之前默认选中的id
      permisList: [], // 分配权限的
      showPermDialog: false,
      showDialog: false,
      activeName: 'role',
      List: [],
      rolesId: '',
      pageSetting: {
        // 页码
        page: 1,
        pagesize: 10,
        total: 0
      },
      formData: {},
      // 定义编辑弹层数据
      roleForm: {},
      rules: {
        name: '',
        description: '',
        message: '角色名称不能空',
        trigger: 'blur'
      }
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    dialogTitle() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  watch: {
    // 刷新页面依旧有id 别的页面一进来id依旧存在 不做这一步只能拿到当前的
    companyId: {
      handler() {
        // 判断id是否存在 在就发起请求
        if (this.companyId) {
          this.getcompanyInfo()
        }
      },
      // 不管怎么样页面一进来就执行一次
      immediate: true
    }
  },
  created() {
    this.getRolelist()
  },
  methods: {
    async getRolelist() {
      const { total, rows } = await getRolelist(this.pageSetting)
      // console.log(total, rows)
      this.pageSetting.total = total
      this.List = rows
    },
    async getcompanyInfo() {
      this.formData = await getcompanyInfo(this.companyId)
      // console.log(this.formData)
      // console.log(this.companyId)
    },
    changPage(newpage) {
      this.pageSetting.page = newpage
      this.getRolelist()
    },
    // 正方形里面的几页几页
    sizeChange(newpagesize) {
      this.pageSetting.pagesize = newpagesize
      this.getRolelist()
    },
    // 删除功能
    async getcompanyDel(id) {
      try {
        await this.$confirm('确定删除角色吗')
        await getcompanyDel(id)
        this.getRolelist()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 点击编辑
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true // 为了不出现闪烁的问题 先获取数据 再弹出层
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        // 只有校验通过的情况下 才会执行await的下方内容
        // roleForm这个对象有id就是编辑 没有id就是新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          // 新增的
          await addRole(this.roleForm)
        }
        // 重新拉数据
        this.getRolelist()
        this.$message.success('获取成功')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    // 分配权限
    async editassign(id) {
      this.rolesId = id
      this.permisList = await getpermissionList()
      this.permisList = convertTreeData(this.permisList, '0')
      this.showPermDialog = true
      // 回显之前选中的id 调用 获取所有角色列表的接口
      const { permIds } = await getRoleDetail(id)
      // console.log(permIds)
      this.oldselectCheck = permIds
    },
    // 分配权限的确定
    /**  getCheckedKeys	若节点可被选择（即 show-checkbox 为 true），
         则返回目前被选中的节点的 key 所组成的数组
    */
    async btnPermOK() {
      const id = this.rolesId
      const permIds = this.$refs.permTree.getCheckedKeys()
      console.log(this.$refs.permTree.getCheckedKeys())
      const data = { permIds, id }
      await assignPrem(data)
      this.$message.success('修改成功')
      this.showPermDialog = false
    },
    // // 分配权限的取消
    btnPermCancel() {
      this.oldselectCheck = []
      this.showPermDialog = false
    }
  }
}
</script>

<style>
</style>
