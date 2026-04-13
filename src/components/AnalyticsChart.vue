<template>
  <div class="analytics-chart" ref="chartRef" :style="{ height: height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

interface Props {
  option: any
  height?: string
  theme?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  theme: 'default'
})

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value, props.theme)
  chartInstance.setOption(props.option)
}

const resizeChart = () => {
  chartInstance?.resize()
}

watch(() => props.option, (newOption) => {
  chartInstance?.setOption(newOption, true)
}, { deep: true })

onMounted(() => {
  nextTick(() => {
    initChart()
    window.addEventListener('resize', resizeChart)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose()
})

defineExpose({
  getInstance: () => chartInstance,
  resize: resizeChart
})
</script>

<style scoped>
.analytics-chart {
  width: 100%;
}
</style>
