<template>
  <el-container>
    <el-header>
      <h1>Dubbo 服务监控</h1>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>服务列表</span>
                <el-button type="primary" @click="refreshServices">刷新</el-button>
              </div>
            </template>
            <el-tree
              :data="services"
              :props="{ 
                label: 'serviceName',
                children: 'methods'
              }"
              @node-click="handleNodeClick"
            />
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card v-if="selectedMethod">
            <template #header>
              <div class="card-header">
                <span>方法调用</span>
              </div>
            </template>
            <el-form :model="invokeForm" label-width="120px">
              <el-form-item label="服务名称">
                <span>{{ selectedService?.serviceName }}</span>
              </el-form-item>
              <el-form-item label="方法名称">
                <span>{{ selectedMethod?.methodName }}</span>
              </el-form-item>
              <el-form-item 
                v-for="(type, index) in selectedMethod.parameterTypes" 
                :key="index"
                :label="'参数 ' + (index + 1)"
              >
                <el-input v-model="invokeForm.args[index]" :placeholder="type" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="invokeMethod">调用</el-button>
              </el-form-item>
            </el-form>
            <div v-if="invokeResult">
              <h3>调用结果：</h3>
              <pre>{{ JSON.stringify(invokeResult, null, 2) }}</pre>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const services = ref([])
const selectedService = ref(null)
const selectedMethod = ref(null)
const invokeResult = ref(null)
const invokeForm = reactive({
  args: []
})

const refreshServices = async () => {
  try {
    const response = await axios.get('/api/dubbo/services')
    services.value = response.data
  } catch (error) {
    ElMessage.error('获取服务列表失败')
  }
}

const handleNodeClick = (data) => {
  if (data.methodName) {
    selectedMethod.value = data
    selectedService.value = services.value.find(
      s => s.methods.some(m => m.methodName === data.methodName)
    )
    invokeForm.args = new Array(data.parameterTypes.length).fill('')
  }
}

const invokeMethod = async () => {
  try {
    const response = await axios.post('/api/dubbo/invoke', {
      serviceName: selectedService.value.serviceName,
      methodName: selectedMethod.value.methodName,
      parameterTypes: selectedMethod.value.parameterTypes,
      args: invokeForm.args
    })
    invokeResult.value = response.data
  } catch (error) {
    ElMessage.error('调用服务失败')
  }
}

// 初始化加载服务列表
refreshServices()
</script>

<style>
.el-header {
  background-color: #409EFF;
  color: white;
  line-height: 60px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

pre {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
}
</style> 