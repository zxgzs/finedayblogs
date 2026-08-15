// 天地图配置
// Key 申请地址：https://lbs.tianditu.gov.cn/  -> 控制台 -> 创建应用
// 注意：上线前请到控制台配置“白名单域名（referer）”，防止 Key 被盗用
export const TIANDITU_KEY = '22e2f991b08836462a58c873afad3519'

// 矢量底图（vec）与中文注记（cva）
export const TIANDITU_VEC = {
  url: `https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_KEY}`,
  options: {
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    maxZoom: 18,
    attribution: '&copy; 天地图'
  }
}

export const TIANDITU_CVA = {
  url: `https://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_KEY}`,
  options: {
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    maxZoom: 18
  }
}
