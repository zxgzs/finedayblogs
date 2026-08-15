import { booleanPointInPolygon, distance, point } from '@turf/turf'

/**
 * 判断一个经纬度坐标是否在某个围栏内
 * @param {{lng: number, lat: number}} lngLat
 * @param {{type: string, coordinates: number[][], center?: number[], radius?: number}} fence
 * @returns {boolean}
 */
export function isInsideFence(lngLat, fence) {
  const pt = point([lngLat.lng, lngLat.lat])

  if (fence.type === 'circle') {
    const d = distance(pt, point([fence.center[0], fence.center[1]]), {
      units: 'meters'
    })
    return d <= fence.radius
  }

  // 多边形：首尾闭合后做点在多边形内判断
  const ring = [...fence.coordinates, fence.coordinates[0]]
  return booleanPointInPolygon(pt, {
    type: 'Polygon',
    coordinates: [ring]
  })
}

/**
 * 查找该坐标命中的围栏，未命中返回 null
 * @returns {object|null}
 */
export function findFence(lngLat, fences) {
  return fences.find((f) => isInsideFence(lngLat, f)) || null
}
