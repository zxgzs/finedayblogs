import { TIANDITU_KEY } from '../config/map'

/**
 * 天地图地理编码（地名/地址 → 经纬度）
 * 通过 Vite/Nginx 代理 /tdt-api 转发到 https://api.tianditu.gov.cn 解决跨域
 * 文档：http://lbs.tianditu.gov.cn/server/geocodinginterface.html
 * @param {string} keyword 结构化地址或地名
 * @returns {Promise<{name: string, lng: number, lat: number, level: string}>}
 */
export async function geocode(keyword) {
  const ds = encodeURIComponent(JSON.stringify({ keyWord: keyword }))
  const url = `/tdt-api/geocoder?ds=${ds}&tk=${TIANDITU_KEY}`
  const res = await fetch(url)
  const data = await res.json()

  if (data.status !== '0' || !data.location) {
    throw new Error(data.msg === 'ok' ? '未找到该位置' : data.msg || '搜索失败')
  }

  return {
    name: data.location.keyWord || keyword,
    lng: Number(data.location.lon),
    lat: Number(data.location.lat),
    level: data.location.level || ''
  }
}
