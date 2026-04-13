<template>
  <div class="reward-section">
    <div class="reward-tip">觉得文章有帮助？</div>
    <el-button type="primary" size="large" class="reward-btn" @click="toggleReward">
      <el-icon><Coin /></el-icon>
      赞赏支持
    </el-button>
    <div class="reward-qr" v-if="showReward">
      <div class="qr-item">
        <div class="qr-placeholder">
          <el-icon :size="40"><Picture /></el-icon>
        </div>
        <span>微信支付</span>
      </div>
      <div class="qr-item">
        <div class="qr-placeholder">
          <el-icon :size="40"><Picture /></el-icon>
        </div>
        <span>支付宝</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Coin, Picture } from '@element-plus/icons-vue'

const showReward = ref(false)

const toggleReward = () => {
  showReward.value = !showReward.value
}
</script>

<style scoped>
.reward-section {
  margin: 32px 0;
  padding: 32px;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(124, 58, 237, 0.05));
  border-radius: var(--radius-lg);
  text-align: center;
  border: 1px solid var(--border-color);
}

.reward-tip {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.reward-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border: none;
}

.reward-qr {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 24px;
}

.qr-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.qr-placeholder {
  width: 180px;
  height: 180px;
  background: var(--bg-color);
  border: 2px dashed var(--border-color);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.qr-item span {
  font-size: 14px;
  color: var(--text-secondary);
}
</style>
