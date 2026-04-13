<template>
  <div :class="{ open: visible }" class="settings-panel" @click.stop>
    <div class="settings-header">
      <h3>
        <el-icon>
          <Setting/>
        </el-icon>
        博客设置
      </h3>
      <span class="close-btn" @click="close">
        <el-icon><Close/></el-icon>
      </span>
    </div>
    <div class="settings-content">
      <div class="setting-item">
        <div class="setting-label">
          <el-icon>
            <Moon v-if="!isDarkMode"/>
            <Sunny v-else/>
          </el-icon>
          深色模式
        </div>
        <el-switch v-model="isDarkMode" @change="saveDarkMode"/>
        <p class="setting-desc">开启后切换到深色主题</p>
      </div>

      <div class="setting-item">
        <div class="setting-label">
          <el-icon>
            <Sunrise/>
          </el-icon>
          自动夜间模式
        </div>
        <el-switch v-model="autoDarkMode" @change="saveAutoDarkMode"/>
        <p class="setting-desc">晚 8 点至早 7 点自动深色模式</p>
      </div>

      <div class="setting-item">
        <div class="setting-label">
          <el-icon>
            <View/>
          </el-icon>
          显示阅读进度
        </div>
        <el-switch v-model="showReadingProgress" @change="saveReadingProgress"/>
        <p class="setting-desc">在文章页面显示阅读进度条</p>
      </div>

      <div class="setting-item">
        <div class="setting-label">
          <el-icon>
            <Timer/>
          </el-icon>
          阅读字号
        </div>
        <el-slider v-model="fontSize" :max="20" :min="14" :step="1" @change="saveFontSize"/>
        <p class="setting-desc">调整文章正文字号大小</p>
      </div>

      <div class="setting-item">
        <div class="setting-label">
          <el-icon>
            <List/>
          </el-icon>
          显示目录
        </div>
        <el-switch v-model="showToc" @change="saveToc"/>
        <p class="setting-desc">在文章详情页显示文章目录</p>
      </div>

      <div class="setting-item">
        <div class="setting-label">
          <el-icon>
            <MagicStick/>
          </el-icon>
          动画效果
        </div>
        <el-switch v-model="enableAnimations" @change="saveAnimations"/>
        <p class="setting-desc">开启页面切换动画</p>
      </div>

      <el-divider/>

      <div class="setting-item">
        <div class="setting-label">
          <el-icon>
            <InfoFilled/>
          </el-icon>
          关于博客
        </div>
        <p class="setting-desc">版本: 3.0.0</p>
        <p class="setting-desc">基于 Vue 3 + Element Plus 构建</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Setting, Close, Moon, Sunny, Sunrise, View, Timer, List, MagicStick, InfoFilled } from '@element-plus/icons-vue'

const visible = defineModel<boolean>('visible')

const props = defineProps<{
  isDarkMode: boolean
  autoDarkMode: boolean
  showReadingProgress: boolean
  fontSize: number
  showToc: boolean
  enableAnimations: boolean
}>()

const emit = defineEmits(['close', 'update:isDarkMode', 'update:autoDarkMode', 'update:showReadingProgress', 'update:fontSize', 'update:showToc', 'update:enableAnimations'])

const isDarkMode = defineModel<boolean>('isDarkMode')
const autoDarkMode = defineModel<boolean>('autoDarkMode')
const showReadingProgress = defineModel<boolean>('showReadingProgress')
const fontSize = defineModel<number>('fontSize')
const showToc = defineModel<boolean>('showToc')
const enableAnimations = defineModel<boolean>('enableAnimations')

const close = () => {
  emit('close')
}

const saveDarkMode = () => {
  localStorage.setItem('dark_mode', String(isDarkMode.value))
}

const saveAutoDarkMode = () => {
  localStorage.setItem('auto_dark_mode', String(autoDarkMode.value))
}

const saveReadingProgress = () => {
  localStorage.setItem('show_progress', String(showReadingProgress.value))
}

const saveFontSize = () => {
  localStorage.setItem('font_size', String(fontSize.value))
}

const saveToc = () => {
  localStorage.setItem('show_toc', String(showToc.value))
}

const saveAnimations = () => {
  localStorage.setItem('enable_animations', String(enableAnimations.value))
}
</script>

<style scoped>
.settings-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  z-index: 2000;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  width: 420px;
  max-height: 80vh;
  overflow-y: auto;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;

  &.open {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, -50%) scale(1);
  }

  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);

    h3 {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);

      svg {
        color: var(--primary-color);
      }
    }

    .close-btn {
      cursor: pointer;
      color: var(--text-muted);
      transition: color 0.3s;

      &:hover {
        color: var(--primary-color);
      }
    }
  }

  .settings-content {
    padding: 24px;

    .setting-item {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }

      .setting-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 8px;

        svg {
          color: var(--primary-color);
        }
      }

      .setting-desc {
        margin: 8px 0 0 0;
        font-size: 12px;
        color: var(--text-muted);
      }
    }
  }
}
</style>
