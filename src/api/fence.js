// 围栏数据存储（demo 用 localStorage 模拟后端）
// 生产环境请替换为后端 API：GET/POST/DELETE /api/fences
const STORAGE_KEY = 'fence_data_v1'

export function getFences() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveFence(fence) {
  const list = getFences()
  if (fence.id) {
    const i = list.findIndex((f) => f.id === fence.id)
    if (i > -1) list[i] = fence
  } else {
    fence.id = 'f_' + Date.now().toString(36)
    fence.createdAt = Date.now()
    list.push(fence)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  return fence
}

export function deleteFence(id) {
  const list = getFences().filter((f) => f.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}
