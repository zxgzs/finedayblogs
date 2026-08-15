<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getFences } from '../api/fence'
import { createBaseLayers, fencesToLayers } from '../composables/useTianditu'
import { findFence } from '../composables/useFence'

const mapEl = ref(null)
const coords = ref(null)
const locating = ref(false)
const result = ref(null)
const fenceCount = ref(0)

let map = null
let fenceGroup = null
let userMarker = null
let accuracyCircle = null

function initMap() {
  map = L.map(mapEl.value, { center: [39.9087, 116.3975], zoom: 15 })
  const { baseLayer, labelLayer } = createBaseLayers()
  baseLayer.addTo(map)
  labelLayer.addTo(map)

  fenceGroup = L.featureGroup().addTo(map)
  renderFences()
}

function renderFences() {
  const fences = getFences()
  fenceCount.value = fences.length
  fenceGroup.clearLayers()
  const layers = fencesToLayers(fences, { color: '#22b07d' })
  layers.forEach((l) => fenceGroup.addLayer(l))
  if (fences.length) {
    map.fitBounds(fenceGroup.getBounds().pad(0.2), { maxZoom: 16 })
  }
}

function onLocate() {
  if (!('geolocation' in navigator)) {
    result.value = {
      ok: false,
      text: '当前环境不支持定位。请使用 HTTPS 或 localhost 访问'
    }
    return
  }
  locating.value = true
  result.value = null

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lng = pos.coords.longitude
      const lat = pos.coords.latitude
      coords.value = { lng, lat }
      locating.value = false

      if (userMarker) map.removeLayer(userMarker)
      if (accuracyCircle) map.removeLayer(accuracyCircle)

      accuracyCircle = L.circle([lat, lng], {
        radius: pos.coords.accuracy || 50,
        color: '#3388ff',
        weight: 1,
        fillOpacity: 0.08
      }).addTo(map)

      userMarker = L.circleMarker([lat, lng], {
        radius: 8,
        color: '#e74c3c',
        weight: 2,
        fillColor: '#e74c3c',
        fillOpacity: 1
      })
        .addTo(map)
        .bindTooltip('我的位置', { direction: 'top' })
        .openTooltip()

      map.fitBounds(accuracyCircle.getBounds().pad(1.5), { maxZoom: 18 })
    },
    (err) => {
      locating.value = false
      const msg =
        err.code === 1
          ? '定位权限被拒绝，请在浏览器设置中允许定位'
          : `定位失败（${err.message}）`
      result.value = { ok: false, text: msg }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  )
}

function onCheckin() {
  if (!coords.value) {
    result.value = { ok: false, text: '请先点击「定位我」' }
    return
  }
  if (!fenceCount.value) {
    result.value = { ok: false, text: '当前没有配置围栏，请先在 PC 管理端配置' }
    return
  }
  const hit = findFence(coords.value, getFences())
  if (hit) {
    result.value = {
      ok: true,
      text: `签到成功！当前位置位于「${hit.name}」围栏内`,
      name: hit.name
    }
  } else {
    result.value = {
      ok: false,
      text: '当前位置不在任何签到围栏内，无法签到'
    }
  }
}

onMounted(initMap)
onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div class="checkin">
    <header class="header">
      <router-link to="/" class="back">‹</router-link>
      <h2>移动签到</h2>
      <span class="badge" :class="{ none: fenceCount === 0 }">
        {{ fenceCount ? fenceCount + ' 个围栏' : '无围栏' }}
      </span>
    </header>

    <div ref="mapEl" class="map"></div>

    <footer class="panel">
      <div class="pos">
        <template v-if="coords">
          经度 {{ coords.lng.toFixed(6) }} ／ 纬度 {{ coords.lat.toFixed(6) }}
        </template>
        <template v-else>尚未定位</template>
      </div>

      <div class="btns">
        <button class="btn-locate" :disabled="locating" @click="onLocate">
          {{ locating ? '定位中…' : '定位我' }}
        </button>
        <button class="btn-checkin" :disabled="!coords || locating" @click="onCheckin">
          立即签到
        </button>
      </div>

      <div v-if="result" class="result" :class="{ ok: result.ok, fail: !result.ok }">
        {{ result.text }}
      </div>
    </footer>
  </div>
</template>

<style scoped>
.checkin {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f2f4f7;
}

.header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #fff;
  border-bottom: 1px solid #ececec;
}

.back {
  font-size: 26px;
  line-height: 1;
  color: #3388ff;
  text-decoration: none;
  padding-bottom: 4px;
}

.header h2 {
  flex: 1;
  font-size: 17px;
  color: #1a3a6b;
}

.badge {
  font-size: 12px;
  background: #e6f7f0;
  color: #22b07d;
  padding: 3px 8px;
  border-radius: 20px;
}

.badge.none {
  background: #f0f0f0;
  color: #999;
}

.map {
  flex: 1;
  min-height: 0;
}

.panel {
  background: #fff;
  border-top: 1px solid #ececec;
  padding: 12px 14px calc(12px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pos {
  font-size: 12px;
  color: #667;
  text-align: center;
}

.btns {
  display: flex;
  gap: 10px;
}

.btns button {
  flex: 1;
  padding: 12px 0;
  font-size: 16px;
  border-radius: 10px;
  color: #fff;
}

.btn-locate {
  background: #3388ff;
}

.btn-checkin {
  background: #22b07d;
}

.btns button:disabled {
  background: #c5cedb;
  cursor: not-allowed;
}

.result {
  font-size: 14px;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
}

.result.ok {
  background: #e6f7f0;
  color: #1d8f66;
}

.result.fail {
  background: #fdecec;
  color: #c0392b;
}
</style>
