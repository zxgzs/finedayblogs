<template>
  <div class="contact-page">
    <div class="contact-header">
      <h1>
        <el-icon><Message /></el-icon>
        联系我
      </h1>
      <p>有任何问题或建议，欢迎联系我</p>
    </div>

    <div class="contact-content">
      <div class="contact-info">
        <div class="info-item">
          <div class="info-icon">
            <el-icon><Message /></el-icon>
          </div>
          <div class="info-text">
            <div class="info-label">电子邮件</div>
            <div class="info-value">tech@example.com</div>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon">
            <el-icon><Position /></el-icon>
          </div>
          <div class="info-text">
            <div class="info-label">GitHub</div>
            <div class="info-value">github.com/techblog</div>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon">
            <el-icon><Link /></el-icon>
          </div>
          <div class="info-text">
            <div class="info-label">个人网站</div>
            <div class="info-value">www.example.com</div>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon">
            <el-icon><Clock /></el-icon>
          </div>
          <div class="info-text">
            <div class="info-label">在线时间</div>
            <div class="info-value">周一至周五 9:00-18:00</div>
          </div>
        </div>
      </div>

      <div class="contact-form-wrapper">
        <div class="form-header">
          <h3>发送消息</h3>
          <p>填写以下表单，我会尽快回复您</p>
        </div>
        <el-form ref="formRef" :model="formData" :rules="formRules" size="large">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formData.name" placeholder="请输入您的姓名" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="请输入您的邮箱" />
          </el-form-item>
          <el-form-item label="主题" prop="subject">
            <el-input v-model="formData.subject" placeholder="请输入邮件主题" />
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input
              v-model="formData.content"
              type="textarea"
              :rows="5"
              placeholder="请输入留言内容..."
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" @click="handleSubmit" :loading="loading" class="submit-btn">
              <el-icon v-if="!loading"><Promotion /></el-icon>
              发送消息
            </el-button>
            <el-button size="large" @click="handleReset" class="reset-btn">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive({
  name: '',
  email: '',
  subject: '',
  content: ''
})

const formRules: FormRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  subject: [
    { required: true, message: '请输入主题', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
    { min: 10, message: '内容至少10个字符', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    // 模拟发送
    await new Promise(resolve => setTimeout(resolve, 1500))

    ElMessage.success('消息发送成功！我会尽快回复您')
    handleReset()
  } catch (error) {
    console.error('Validation failed:', error)
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  formRef.value?.resetFields()
}
</script>

<style scoped lang="scss">
.contact-page {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 48px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .contact-header {
    text-align: center;
    margin-bottom: 48px;
    padding-bottom: 32px;
    border-bottom: 2px solid var(--border-color);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 2px;
      background: linear-gradient(90deg, var(--primary-color), var(--info-color));
    }

    h1 {
      font-size: 32px;
      font-weight: 800;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      background: linear-gradient(135deg, var(--primary-color), var(--info-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;

      svg {
        -webkit-text-fill-color: var(--primary-color);
      }
    }

    p {
      color: var(--text-muted);
      font-size: 16px;
    }
  }

  .contact-content {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 48px;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }

    .contact-info {
      .info-item {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 24px;
        background: var(--bg-color);
        border-radius: var(--radius-lg);
        margin-bottom: 16px;
        transition: all 0.3s ease;
        border: 1px solid var(--border-color);

        &:hover {
          transform: translateX(8px);
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.05));
          border-color: var(--primary-color);

          .info-icon {
            background: linear-gradient(135deg, var(--primary-color), var(--info-color));
            transform: scale(1.1);
          }
        }

        .info-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, var(--primary-color), var(--info-color));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          flex-shrink: 0;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .info-text {
          .info-label {
            font-size: 13px;
            color: var(--text-muted);
            margin-bottom: 4px;
          }

          .info-value {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
          }
        }
      }
    }

    .contact-form-wrapper {
      background: var(--bg-color);
      padding: 32px;
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-color);

      .form-header {
        margin-bottom: 24px;

        h3 {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        p {
          font-size: 14px;
          color: var(--text-muted);
        }
      }

      :deep(.el-form-item__label) {
        font-weight: 500;
        color: var(--text-primary);
      }

      .submit-btn {
        background: linear-gradient(135deg, var(--primary-color), var(--info-color));
        border: none;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
        }
      }

      .reset-btn {
        margin-left: 12px;
      }
    }
  }
}

@media (max-width: 768px) {
  .contact-page {
    padding: 24px;

    .contact-header h1 {
      font-size: 26px;
    }
  }
}
</style>
