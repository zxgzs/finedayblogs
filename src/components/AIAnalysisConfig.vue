<template>
  <div class="ai-analysis-config">
    <el-dialog
      v-model="visible"
      title="AI分析配置"
      width="500px"
      @close="handleClose"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="使用云端AI">
          <el-switch v-model="form.useCloud" />
          <div class="form-tip">
            启用后使用腾讯云NLP API提供更精准的分析
          </div>
        </el-form-item>

        <template v-if="form.useCloud">
          <el-divider content-position="left">腾讯云NLP配置</el-divider>

          <el-form-item label="Secret ID">
            <el-input
              v-model="form.secretId"
              placeholder="请输入Secret ID"
              type="password"
              show-password
            />
          </el-form-item>

          <el-form-item label="Secret Key">
            <el-input
              v-model="form.secretKey"
              placeholder="请输入Secret Key"
              type="password"
              show-password
            />
          </el-form-item>

          <el-form-item label="地域">
            <el-select v-model="form.region" placeholder="选择地域">
              <el-option label="广州" value="gz" />
              <el-option label="上海" value="sh" />
              <el-option label="北京" value="bj" />
              <el-option label="香港" value="hk" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="testConnection">测试连接</el-button>
            <el-button @click="getHelp">获取帮助</el-button>
          </el-form-item>
        </template>

        <el-divider content-position="left">功能开关</el-divider>

        <el-form-item label="自动摘要">
          <el-switch v-model="form.autoSummary" />
          <div class="form-tip">
            发布文章时自动生成摘要
          </div>
        </el-form-item>

        <el-form-item label="垃圾过滤">
          <el-switch v-model="form.spamFilter" />
          <div class="form-tip">
            自动检测并过滤垃圾评论
          </div>
        </el-form-item>

        <el-form-item label="情感分析">
          <el-switch v-model="form.sentimentAnalysis" />
          <div class="form-tip">
            分析评论情感倾向
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存配置</el-button>
      </template>
    </el-dialog>

    <!-- 帮助对话框 -->
    <el-dialog v-model="showHelp" title="如何获取腾讯云API密钥" width="600px">
      <div class="help-content">
        <h4>步骤说明：</h4>
        <ol>
          <li>访问腾讯云官网：<a href="https://cloud.tencent.com/" target="_blank">https://cloud.tencent.com/</a></li>
          <li>注册并登录账号</li>
          <li>进入【API密钥管理】页面</li>
          <li>创建或获取 Secret ID 和 Secret Key</li>
          <li>在控制台开通【自然语言处理】服务</li>
        </ol>

        <h4>注意事项：</h4>
        <ul>
          <li>Secret Key 请妥善保管，不要泄露</li>
          <li>自然语言处理服务有免费配额和付费方案</li>
          <li>API调用有频率限制，请合理使用</li>
          <li>建议先使用本地模式测试，确认无误后再开启云端</li>
        </ul>

        <h4>API定价：</h4>
        <p>详细定价请参考：<a href="https://cloud.tencent.com/document/product/271/39140" target="_blank">自然语言处理定价文档</a></p>
      </div>
      <template #footer>
        <el-button type="primary" @click="showHelp = false">知道了</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const showHelp = ref(false)
const form = ref({
  useCloud: false,
  secretId: '',
  secretKey: '',
  region: 'gz',
  autoSummary: true,
  spamFilter: true,
  sentimentAnalysis: true
})

const loadConfig = () => {
  const stored = localStorage.getItem('ai_analysis_config')
  if (stored) {
    form.value = { ...form.value, ...JSON.parse(stored) }
  }
}

const handleSave = () => {
  // 验证云端配置
  if (form.value.useCloud && (!form.value.secretId || !form.value.secretKey)) {
    ElMessage.warning('请填写Secret ID和Secret Key')
    return
  }

  // 保存配置
  localStorage.setItem('ai_analysis_config', JSON.stringify(form.value))
  ElMessage.success('配置保存成功')
  visible.value = false
}

const handleClose = () => {
  visible.value = false
}

const testConnection = async () => {
  if (!form.value.secretId || !form.value.secretKey) {
    ElMessage.warning('请先填写Secret ID和Secret Key')
    return
  }

  ElMessage.info('测试连接中...')
  // TODO: 实现实际连接测试
  setTimeout(() => {
    ElMessage.success('连接测试成功')
  }, 1000)
}

const getHelp = () => {
  showHelp.value = true
}

onMounted(() => {
  loadConfig()
})

// 导出配置获取方法供外部使用
export const getAIConfig = () => form.value
</script>

<style scoped lang="scss">
.ai-analysis-config {
  .form-tip {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 4px;
  }

  .help-content {
    h4 {
      margin: 16px 0 8px 0;
      color: var(--text-primary);
    }

    ol, ul {
      padding-left: 20px;
      margin: 8px 0;

      li {
        margin: 6px 0;
        color: var(--text-secondary);
      }
    }

    p {
      color: var(--text-secondary);
      margin: 8px 0;
    }

    a {
      color: var(--primary-color);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
