import L from 'leaflet'
import { TIANDITU_VEC, TIANDITU_CVA } from '../config/map'

/**
 * 创建天地图底图图层（矢量底图 + 中文注记）
 * @returns {{ baseLayer: L.TileLayer, labelLayer: L.TileLayer }}
 */
export function createBaseLayers() {
  const baseLayer = L.tileLayer(TIANDITU_VEC.url, TIANDITU_VEC.options)
  const labelLayer = L.tileLayer(TIANDITU_CVA.url, TIANDITU_CVA.options)
  return { baseLayer, labelLayer }
}

/**
 * 把围栏数据渲染为 Leaflet 图层（供 PC 管理端 / 移动端复用）
 * @param {Array} fences 围栏数组
 * @param {object} opts 样式配置
 * @returns {L.Layer[]}
 */
export function fencesToLayers(fences, opts = {}) {
  const style = {
    color: opts.color || '#3388ff',
    weight: 2,
    fillOpacity: 0.15,
    ...opts.style
  }
  return fences.map((f) => {
    let layer
    if (f.type === 'circle') {
      layer = L.circle([f.center[1], f.center[0]], { ...style, radius: f.radius })
    } else {
      layer = L.polygon(f.coordinates.map((c) => [c[1], c[0]]), style)
    }
    layer._fenceId = f.id
    layer.bindTooltip(f.name)
    return layer
  })
}
