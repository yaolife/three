<template>
  <div class="dynamic-table-wrapper">
    <el-table
      :data="tableData"
      v-loading="loading"
      border
      style="width: 100%"
      :header-cell-style="{ background: '#f5f7fa' }"
    >
      <!-- 序号列 -->
      <el-table-column type="index" label="序号" width="60" />
      
      <!-- 动态列 -->
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.minWidth"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row[column.prop]"
            :placeholder="`请输入${column.label}`"
            size="small"
          />
        </template>
      </el-table-column>
      
      <!-- 操作列 -->
      <el-table-column label="操作" width="80" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="danger"
            size="small"
            @click="handleDelete(scope.$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Props
const props = defineProps({
  tableData: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(['delete']);

// 删除行
const handleDelete = (index) => {
  emit('delete', index);
};
</script>

<style scoped>
.dynamic-table-wrapper {
  width: 100%;
}
</style>
