<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索框和添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="queryParams.query"
            :clearable="true"
            @clear="getUserInfos"
            @keyup.enter.native="getUserInfos"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserInfos"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="140"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="130"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
        <el-table-column label="状态" width="70">
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(info.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryParams.total"
      ></el-pagination>
      <!-- 添加用户弹框区 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 搜索用户弹窗区 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <el-form :rules="editFormRules" ref="editFormRef" :model="editForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="editForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserInfos()
  },
  data() {
    var checMkbile = (rule, value, callback) => {
      if (!/^1[35789]\d{9}$/.test(value)) {
        return callback(new Error('手机号码格式不正确'))
      }
      // 检验通过
      callback() // 继续执行
    }
    return {
      // 修改用户1
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // form 表单校验制作
      editFormRules: {
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: checMkbile, trigger: 'blur' }
        ]
      },
      // true就是显示 false 为隐藏
      editDialogVisible: false,
      // 修改用户2
      // 添加用户1
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // form 表单校验制作
      addFormRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: checMkbile, trigger: 'blur' }
        ]
      },
      // true就是显示 false 为隐藏
      addDialogVisible: false,
      // 添加用户2
      // 搜索关键字
      keywords: '',
      // 接收用户数据
      userInfos: {},
      // 定义获取用户数据时用到的查询条件参数
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 3
      }
    }
  },
  methods: {
    // 修改用户1
    async showEditDialog(id) {
      this.editDialogVisible = true
      // 把被修改的用户的信息展示到form表单中
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 接收被修改用户信息
      this.editForm = res.data
    },
    // 接收用户信息入库
    async editUser() {
      const { data: res } = await this.$http.put(
        'users/' + this.editForm.id,
        this.editForm
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 修改用户信息完毕 更新列表数据
      this.editDialogVisible = false
      this.$message.success(res.meta.msg)
      this.getUserInfos()
    },
    // 删除用户
    delUser(id) {
      this.$confirm('确定删除该会员么?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          // axios 触发api接口删除
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }

          // 删除成功：提示 和 刷新页面
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加用户相关1
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 收集用户信息储存到后端api的数据库中
    addUser() {
      // 通过客户端form表单校验
      this.$refs.addFormRef.validate(async valid => {
        // 校验成功处理
        if (valid) {
          const { data: res } = await this.$http.post('users', this.addForm)

          // 提交不成功处理
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.addDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        }
      })
    },
    // 数据分页相关
    // 每页信息条数变化回调函数处理
    handleSizeChange(val) {
      this.queryParams.pagesize = val
      this.getUserInfos()
    },
    // 当前页变化回调处理
    handleCurrentChange(val) {
      // val代表变化后的 页码
      this.queryParams.pagenum = val
      // 根据变化后的 页码 重新获得数据
      this.getUserInfos()
    },
    // 获得首屏用户数据
    async getUserInfos() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryParams
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 丰富记录总条变量
      this.queryParams.tatal = res.data.total
      // 把获得的用户数据赋予给userInfos成员
      this.userInfos = res.data.users
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
</style>
