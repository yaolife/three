<template>
  <div class="user-management-container">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>账号管理</span>
        </div>
      </template>
      <div class="page-content">
        <div class="toolbar">
          <div class="search-group">
            <el-input
              v-model="searchForm.userNickName"
              placeholder="请输入用户昵称"
              prefix-icon="Search"
              style="width: 200px"
              clearable
              @keyup.enter="handleSearch"
            />
            <el-input
              v-model="searchForm.userName"
              placeholder="请输入用户名"
              prefix-icon="Search"
              style="width: 200px; margin-left: 12px"
              clearable
              @keyup.enter="handleSearch"
            />
            <el-button type="primary" @click="handleSearch" style="margin-left: 12px">
              搜索
            </el-button>
          </div>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增用户
          </el-button>
        </div>

        <el-table
          :data="tableData"
          v-loading="loading"
          style="width: 100%"
          :header-cell-style="{ background: '#f5f7fa' }"
        >
          <el-table-column label="序号" width="80" align="center">
            <template #default="scope">
              {{ scope.$index + 1 + (currentPage - 1) * pageSize }}
            </template>
          </el-table-column>
          <el-table-column prop="userNickName" label="用户昵称" min-width="120" />
          <el-table-column prop="userName" label="用户名" min-width="120" />
          <el-table-column prop="level" label="账号级别" width="120" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.level === 1 ? 'danger' : 'info'">
                {{ scope.row.level === 1 ? '管理员' : '普通账号' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="状态" width="80" align="center">
            <template #default="scope">
              <el-switch
                v-model="scope.row.state"
                :active-value="0"
                :inactive-value="1"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="IP地址" min-width="150" />
          <el-table-column prop="createBy" label="创建人" width="120" />
          <el-table-column prop="createName" label="创建人名称" width="120" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="150" fixed="right" align="center">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="large"
                @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          class="pagination"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑用户弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
      class="user-dialog"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="用户昵称" prop="userNickName">
          <el-input
            v-model="formData.userNickName"
            placeholder="请输入用户昵称"
            clearable
          />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="formData.userName"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            :placeholder="isEdit ? '留空则不修改密码' : '请输入密码（8-16位，包含大小写字母和特殊字符）'"
            show-password
            clearable
          />
          <div class="password-tip" v-if="!isEdit">
            密码要求：8-16位，必须包含大小写字母和至少一个特殊字符
          </div>
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input
            v-model="formData.ip"
            placeholder="请输入IP地址"
            clearable
          />
        </el-form-item>
        <el-form-item label="账号级别" prop="level">
          <el-select
            v-model="formData.level"
            placeholder="请选择账号级别"
            style="width: 100%"
          >
            <el-option label="普通账号" :value="0" />
            <el-option label="管理员" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="state" v-if="isEdit">
          <el-switch
            v-model="formData.state"
            :active-value="0"
            :inactive-value="1"
            active-text="正常"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { getUserInfoPage, addUserInfo, updateUserInfo } from "@/api/index.js";

// 搜索表单
const searchForm = reactive({
  userNickName: "",
  userName: "",
});

// 表格数据
const tableData = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 弹窗相关
const dialogVisible = ref(false);
const dialogTitle = ref("新增用户");
const isEdit = ref(false);
const submitLoading = ref(false);
const formRef = ref(null);

// 表单数据
const formData = reactive({
  id: "",
  userNickName: "",
  userName: "",
  password: "",
  ip: "",
  level: 0,
  state: 0,
});

// 密码验证规则
const validatePassword = (rule, value, callback) => {
  if (!isEdit.value && !value) {
    callback(new Error("请输入密码"));
    return;
  }
  if (value && value.length < 8) {
    callback(new Error("密码长度不能少于8位"));
    return;
  }
  if (value && value.length > 16) {
    callback(new Error("密码长度不能超过16位"));
    return;
  }
  if (value) {
    // 检查是否包含大写字母
    if (!/[A-Z]/.test(value)) {
      callback(new Error("密码必须包含至少一个大写字母"));
      return;
    }
    // 检查是否包含小写字母
    if (!/[a-z]/.test(value)) {
      callback(new Error("密码必须包含至少一个小写字母"));
      return;
    }
    // 检查是否包含特殊字符
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
      callback(new Error("密码必须包含至少一个特殊字符"));
      return;
    }
  }
  callback();
};

// 表单验证规则
const formRules = {
  userNickName: [
    { required: true, message: "请输入用户昵称", trigger: "blur" },
  ],
  userName: [
    { required: true, message: "请输入用户名", trigger: "blur" },
  ],
  password: [
    { validator: validatePassword, trigger: "blur" },
  ],
  level: [
    { required: true, message: "请选择账号级别", trigger: "change" },
  ],
};

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true;
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    };

    if (searchForm.userNickName && searchForm.userNickName.trim()) {
      params.userNickName = searchForm.userNickName.trim();
    }
    if (searchForm.userName && searchForm.userName.trim()) {
      params.userName = searchForm.userName.trim();
    }

    const response = await getUserInfoPage(params);

    if (response && response.code === "0") {
      const records = response.data.records || [];
      // 确保state字段是数字类型
      tableData.value = records.map(item => ({
        ...item,
        state: item.state !== undefined && item.state !== null ? Number(item.state) : 0,
        level: item.level !== undefined && item.level !== null ? Number(item.level) : 0,
      }));
      total.value = response.data.total || 0;
    } else {
      ElMessage.error(response?.msg || "获取用户列表失败");
    }
  } catch (error) {
    console.error("获取用户列表失败:", error);
    ElMessage.error("获取用户列表失败，请检查网络连接");
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
  fetchUserList();
};

// 分页变化
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchUserList();
};

// 新增用户
const handleAdd = () => {
  isEdit.value = false;
  dialogTitle.value = "新增用户";
  dialogVisible.value = true;
  resetForm();
};

// 编辑用户
const handleEdit = (row) => {
  isEdit.value = true;
  dialogTitle.value = "编辑用户";
  dialogVisible.value = true;
  formData.id = row.id;
  formData.userNickName = row.userNickName || "";
  formData.userName = row.userName || "";
  formData.password = ""; // 编辑时不显示密码，留空则不修改
  formData.ip = row.ip || "";
  formData.level = row.level !== undefined && row.level !== null ? Number(row.level) : 0;
  formData.state = row.state !== undefined && row.state !== null ? Number(row.state) : 0;
};

// 重置表单
const resetForm = () => {
  formData.id = "";
  formData.userNickName = "";
  formData.userName = "";
  formData.password = "";
  formData.ip = "";
  formData.level = 0;
  formData.state = 0;
  if (formRef.value) {
    formRef.value.clearValidate();
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    submitLoading.value = true;
    try {
      const params = {
        userNickName: formData.userNickName,
        userName: formData.userName,
        ip: formData.ip,
        level: formData.level,
      };

      // 编辑时需要添加id和state
      if (isEdit.value) {
        params.id = formData.id;
        params.state = formData.state;
        // 如果密码不为空，才添加密码字段
        if (formData.password) {
          params.password = formData.password;
        }
      } else {
        // 新增时必须要有密码
        params.password = formData.password;
      }

      const response = isEdit.value
        ? await updateUserInfo(params)
        : await addUserInfo(params);

      if (response && response.code === "0") {
        ElMessage.success(isEdit.value ? "修改成功" : "新增成功");
        dialogVisible.value = false;
        fetchUserList();
      } else {
        ElMessage.error(response?.msg || (isEdit.value ? "修改失败" : "新增失败"));
      }
    } catch (error) {
      console.error("操作失败:", error);
      ElMessage.error("操作失败，请检查网络连接");
    } finally {
      submitLoading.value = false;
    }
  });
};

// 状态切换
const handleStatusChange = async (row) => {
  const oldState = row.state === 0 ? 1 : 0; // 保存旧状态
  try {
    const params = {
      id: row.id,
      userNickName: row.userNickName,
      userName: row.userName,
      ip: row.ip || "",
      level: row.level,
      state: Number(row.state), // 确保是数字类型
    };

    const response = await updateUserInfo(params);

    if (response && response.code === "0") {
      ElMessage.success("状态更新成功");
    } else {
      // 如果失败，恢复原状态
      row.state = oldState;
      ElMessage.error(response?.msg || "状态更新失败");
    }
  } catch (error) {
    console.error("状态更新失败:", error);
    // 如果失败，恢复原状态
    row.state = oldState;
    ElMessage.error("状态更新失败，请检查网络连接");
  }
};

onMounted(() => {
  fetchUserList();
});
</script>

<style scoped>
.user-management-container {
  padding: 20px 0;
}

.page-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
}

.page-content {
  padding: 20px 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-group {
  display: flex;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.password-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 6px;
  line-height: 1.6;
  padding-left: 4px;
}

:deep(.user-dialog .el-dialog__header) {
  padding: 20px 24px;
  border-bottom: 1px solid #ebeef5;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0;
}

:deep(.user-dialog .el-dialog__title) {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}

:deep(.user-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: #fff;
  font-size: 20px;
}

:deep(.user-dialog .el-dialog__headerbtn .el-dialog__close:hover) {
  color: rgba(255, 255, 255, 0.8);
}

:deep(.user-dialog .el-dialog__body) {
  padding: 30px 40px;
  background: #fafafa;
}

:deep(.user-dialog .el-form-item) {
  margin-bottom: 24px;
}

:deep(.user-dialog .el-form-item__label) {
  font-weight: 500;
  color: #303133;
  font-size: 14px;
}

:deep(.user-dialog .el-input),
:deep(.user-dialog .el-select) {
  width: 100%;
}

:deep(.user-dialog .el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  transition: all 0.3s;
}

:deep(.user-dialog .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.user-dialog .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.user-dialog .el-select .el-input__wrapper) {
  cursor: pointer;
}

:deep(.user-dialog .el-dialog__footer) {
  padding: 20px 24px;
  border-top: 1px solid #ebeef5;
  background: #fff;
}

:deep(.user-dialog .el-button) {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
}

:deep(.user-dialog .el-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s;
}

:deep(.user-dialog .el-button--primary:hover) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
</style>

