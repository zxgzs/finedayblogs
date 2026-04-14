<template>
  <div v-if="visible" class="keyboard-hints">
    <div class="hint-title">
      <el-icon>
        <SetUp/>
      </el-icon>
      快捷键
    </div>
    <div class="hint-item">
      <kbd>Ctrl</kbd><kbd>K</kbd> 全局搜索
    </div>
    <div class="hint-item">
      <kbd>G</kbd> <kbd>H</kbd> 首页
    </div>
    <div class="hint-item">
      <kbd>G</kbd> <kbd>A</kbd> 关于
    </div>
    <div class="hint-item">
      <kbd>G</kbd> <kbd>C</kbd> 联系
    </div>
    <div class="hint-item">
      <kbd>G</kbd> <kbd>T</kbd> 时光机
    </div>
    <div class="hint-item">
      <kbd>T</kbd> 切换主题
    </div>
    <div class="hint-item">
      <kbd>E</kbd> 护眼模式
    </div>
    <div class="hint-item">
      <kbd>M</kbd> 音乐播放
    </div>
    <div class="hint-item">
      <kbd>P</kbd> 专注模式
    </div>
    <div class="hint-item">
      <kbd>S</kbd> 设置
    </div>
    <div class="hint-item">
      <kbd>J</kbd> <kbd>K</kbd> 上下篇
    </div>
    <div class="hint-item">
      <kbd>Space</kbd> 下一页
    </div>
    <div class="hint-item">
      <kbd>F</kbd> 全屏
    </div>
    <div class="hint-item">
      <kbd>?</kbd> 帮助
    </div>
    <div class="hint-item">
      <kbd>Esc</kbd> 关闭弹窗（音乐播放器除外）
    </div>
  </div>
</template>

<script setup lang="ts">
import { SetUp } from '@element-plus/icons-vue'

const visible = defineModel<boolean>('visible')
</script>

<style scoped>
.keyboard-hints {
  position: fixed;
  top: 80px;
  right: 20px;
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-lg);
  z-index: 10000;
  min-width: 200px;
  animation: slideIn 0.2s ease;

  .hint-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary);

    svg {
      color: var(--primary-color);
    }
  }

  .hint-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    font-size: 14px;
    color: var(--text-secondary);

    :deep(kbd) {
      display: inline-block;
      padding: 4px 8px;
      font-size: 12px;
      font-family: inherit;
      font-weight: 600;
      color: var(--text-primary);
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      box-shadow: 0 2px 0 var(--border-color);
      min-width: 24px;
      text-align: center;
    }
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
