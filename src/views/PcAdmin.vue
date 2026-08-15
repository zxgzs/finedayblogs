<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import { getFences, saveFence, deleteFence } from '../api/fence'
import { geocode } from '../api/geocode'
import { createBaseLayers, fencesToLayers } from '../composables/useTianditu'

const mapEl = ref(null)
const fences = ref([])
const form = ref({ name: '', type: 'polygon', radius: 200 })
const hasDraft = ref(false)
const searchKw = ref('')
const searching = ref(false)
const searchMsg = ref('')
const locating = ref(false)
const locateMsg = ref('')

let map = null
let savedGroup = null
let currentLayer = null
let searchMarker = null
let locateMarker = null
let locateCircle = null

function initMap() {
  map = L.map(mapEl.value, { center: [39.9087, 116.3975], zoom: 15 })
  const { baseLayer, labelLayer } = createBaseLayers()
  baseLayer.addTo(map)
  labelLayer.addTo(map)

  savedGroup = L.featureGroup().addTo(map)

  const drawControl = new L.Control.Draw({
    position: 'topleft',
    draw: {
      polygon: { allowIntersection: false, shapeOptions: DRAFT_STYLE },
      circle: { shapeOptions: DRAFT_STYLE },
      rectangle: false,
      polyline: false,
      marker: false,
      circlemarker: false
    },
    edit: { featureGroup: savedGroup, remove: false }
  })
  map.addControl(drawControl)

  map.on(L.Draw.Event.CREATED, onCreated)
  renderSavedFences()
}

const DRAFT_STYLE = { color: '#e67e22', weight: 2, fillOpacity: 0.15 }

function onCreated(e) {
  if (currentLayer) {
    map.removeLayer(currentLayer)
  }
  currentLayer = e.layer
  currentLayer.setStyle(DRAFT_STYLE)
  map.addLayer(currentLayer)

  form.value.type = e.layerType === 'circle' ? 'circle' : 'polygon'
  form.value.radius = Math.round(currentLayer.getRadius?.() || 200)
  hasDraft.value = true
}

function renderSavedFences() {
  savedGroup.clearLayers()
  const layers = fencesToLayers(fences.value, { color: '#3388ff' })
  layers.forEach((l) => savedGroup.addLayer(l))
}

async function searchLocation() {
  const kw = searchKw.value.trim()
  if (!kw) return
  searching.value = true
  searchMsg.value = ''
  try {
    const r = await geocode(kw)
    if (searchMarker) map.removeLayer(searchMarker)
    searchMarker = L.marker([r.lat, r.lng])
      .addTo(map)
      .bindTooltip(r.name, { direction: 'top' })
      .openTooltip()
    map.setView([r.lat, r.lng], 16)
    searchMsg.value = `已定位到：${r.name}`
  } catch (e) {
    searchMsg.value = e.message
  } finally {
    searching.value = false
  }
}

function locateMe() {
  if (!('geolocation' in navigator)) {
    locateMsg.value = '当前环境不支持定位，请使用 HTTPS 或 localhost 访问'
    return
  }
  locating.value = true
  locateMsg.value = ''
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lng = pos.coords.longitude
      const lat = pos.coords.latitude
      locating.value = false

      if (locateMarker) map.removeLayer(locateMarker)
      if (locateCircle) map.removeLayer(locateCircle)

      locateCircle = L.circle([lat, lng], {
        radius: pos.coords.accuracy || 50,
        color: '#3388ff',
        weight: 1,
        fillOpacity: 0.08
      }).addTo(map)

      locateMarker = L.circleMarker([lat, lng], {
        radius: 8,
        color: '#e74c3c',
        weight: 2,
        fillColor: '#e74c3c',
        fillOpacity: 1
      })
        .addTo(map)
        .bindTooltip('我的位置', { direction: 'top' })
        .openTooltip()

      map.fitBounds(locateCircle.getBounds().pad(1.5), { maxZoom: 18 })
      locateMsg.value = `当前位置：${lat.toFixed(6)}, ${lng.toFixed(6)}`
    },
    (err) => {
      locating.value = false
      locateMsg.value =
        err.code === 1
          ? '定位权限被拒绝，请在浏览器设置中允许定位'
          : `定位失败（${err.message}）`
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  )
}

function save() {
  if (!hasDraft.value || !currentLayer) {
    alert('请先在地图上绘制围栏')
    return
  }
  if (!form.value.name.trim()) {
    alert('请输入围栏名称')
    return
  }
  const g = currentLayer.toGeoJSON()
  let fence
  if (form.value.type === 'circle') {
    fence = {
      name: form.value.name.trim(),
      type: 'circle',
      center: g.geometry.coordinates,
      radius: currentLayer.getRadius(),
      geojson: g
    }
  } else {
    fence = {
      name: form.value.name.trim(),
      type: 'polygon',
      coordinates: g.geometry.coordinates[0].slice(0, -1),
      geojson: g
    }
  }
  saveFence(fence)
  currentLayer._fenceId = fence.id
  currentLayer.setStyle({ color: '#3388ff' })
  savedGroup.addLayer(currentLayer)
  currentLayer = null
  hasDraft.value = false
  form.value = { name: '', type: 'polygon', radius: 200 }
  reload()
}

function reload() {
  fences.value = getFences()
}

function remove(id) {
  if (!confirm('确定删除该围栏？')) return
  deleteFence(id)
  savedGroup.getLayers().forEach((l) => {
    if (l._fenceId === id) savedGroup.removeLayer(l)
  })
  reload()
}

function focusFence(f) {
  if (f.type === 'circle') {
    map.setView([f.center[1], f.center[0]], 16)
  } else {
    map.fitBounds(L.latLngBounds(f.coordinates.map((c) => [c[1], c[0]])))
  }
}

onMounted(() => {
  reload()
  initMap()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div class="admin">
    <aside class="sidebar">
      <div class="head">
        <h2>电子围栏管理</h2>
        <router-link to="/">返回首页</router-link>
      </div>

      <div class="search">
        <input
          v-model="searchKw"
          placeholder="搜索位置，如：北京市朝阳区"
          @keyup.enter="searchLocation"
        />
        <button class="btn-search" :disabled="searching" @click="searchLocation">
          {{ searching ? '搜索中' : '搜索' }}
        </button>
        <button class="btn-locate" :disabled="locating" @click="locateMe">
          {{ locating ? '定位中' : '定位我' }}
        </button>
        <small v-if="searchMsg" :class="{ err: searchMsg.startsWith('未') }">
          {{ searchMsg }}
        </small>
        <small v-if="locateMsg" class="ok">{{ locateMsg }}</small>
      </div>

      <ol class="steps">
        <li>点击左上角工具栏 <em>多边形</em> 或 <em>圆形</em> 绘制围栏</li>
        <li>填写名称后点击保存</li>
      </ol>

      <div class="form">
        <input v-model="form.name" placeholder="围栏名称，如：公司园区" />
        <div class="row">
          <span>类型</span>
          <select v-model="form.type" :disabled="!hasDraft">
            <option value="polygon">多边形</option>
            <option value="circle">圆形</option>
          </select>
          <span>半径(m)</span>
          <input
            v-model.number="form.radius"
            type="number"
            min="10"
            :disabled="form.type !== 'circle'"
          />
        </div>
        <button class="btn-save" :disabled="!hasDraft" @click="save">
          {{ hasDraft ? '保存围栏' : '请先绘制围栏' }}
        </button>
      </div>

      <div class="list-head">
        <span>已保存围栏（{{ fences.length }}）</span>
      </div>
      <ul class="list">
        <li v-for="f in fences" :key="f.id">
          <div class="info">
            <strong>{{ f.name }}</strong>
            <small>{{ f.type === 'circle' ? '圆形' : '多边形' }} · {{ f.type === 'circle' ? f.radius + 'm' : f.coordinates.length + ' 个点' }}</small>
          </div>
          <div class="ops">
            <button class="btn-focus" @click="focusFence(f)">定位</button>
            <button class="btn-del" @click="remove(f.id)">删除</button>
          </div>
        </li>
        <li v-if="!fences.length" class="empty">暂无围栏</li>
      </ul>
    </aside>

    <div ref="mapEl" class="map"></div>
  </div>
</template>

<style scoped>
.admin {
  display: flex;
  height: 100%;
}

.sidebar {
  width: 300px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 14px;
  overflow-y: auto;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.head h2 {
  font-size: 18px;
  color: #1a3a6b;
}

.head a {
  font-size: 13px;
  color: #3388ff;
  text-decoration: none;
}

.search {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.search input {
  flex: 1;
  min-width: 150px;
}

.btn-search {
  background: #3388ff;
  color: #fff;
  padding: 7px 14px;
}

.btn-search:disabled {
  background: #b9cdec;
  cursor: not-allowed;
}

.btn-locate {
  background: #22b07d;
  color: #fff;
  padding: 7px 14px;
}

.btn-locate:disabled {
  background: #a9cfc0;
  cursor: not-allowed;
}

.search small {
  width: 100%;
  font-size: 12px;
  color: #1d8f66;
}

.search small.err {
  color: #c0392b;
}

.search small.ok {
  color: #1d8f66;
}

.steps {
  font-size: 13px;
  color: #667;
  padding-left: 18px;
  line-height: 1.9;
}

.steps em {
  color: #e67e22;
  font-style: normal;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: #f6f8fb;
  border-radius: 8px;
}

.row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #667;
}

.row select {
  flex: 1;
}

.row input[type='number'] {
  width: 76px;
}

.btn-save {
  background: #3388ff;
  color: #fff;
  padding: 9px 0;
  font-size: 15px;
}

.btn-save:disabled {
  background: #b9cdec;
  cursor: not-allowed;
}

.list-head {
  font-size: 13px;
  color: #889;
}

.list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid #ececec;
  border-radius: 8px;
}

.list .info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.list .info small {
  color: #889;
  font-size: 12px;
}

.list .ops {
  display: flex;
  gap: 6px;
}

.btn-focus,
.btn-del {
  font-size: 12px;
  padding: 4px 10px;
}

.btn-focus {
  background: #eef4ff;
  color: #3388ff;
}

.btn-del {
  background: #fdecec;
  color: #d33;
}

.empty {
  justify-content: center !important;
  color: #aaa;
  font-size: 13px;
}

.map {
  flex: 1;
  min-width: 0;
}
</style>
