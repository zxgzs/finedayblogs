/**
 * 分享功能工具
 */

export interface ShareOptions {
  title: string
  url: string
  text?: string
  image?: string
}

/**
 * 生成二维码数据 URL
 */
export async function generateQRCode(text: string): Promise<string> {
  // 使用 wttr.in 的 QR 代码 API 或者本地生成
  // 这里使用简单的 API 方式
  const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`
  return apiUrl
}

/**
 * 分享到微信
 */
export function shareToWeChat(options: ShareOptions) {
  // 微信需要通过扫码或复制链接分享
  const text = `${options.title}\n\n${options.url}`
  copyToClipboard(text)
  return '链接已复制，请在微信中粘贴分享'
}

/**
 * 分享到微博
 */
export function shareToWeibo(options: ShareOptions) {
  const url = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(options.title)}&url=${encodeURIComponent(options.url)}`
  window.open(url, '_blank', 'width=600,height=400')
}

/**
 * 分享到 Twitter
 */
export function shareToTwitter(options: ShareOptions) {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(options.title)}&url=${encodeURIComponent(options.url)}`
  window.open(url, '_blank', 'width=600,height=400')
}

/**
 * 分享到 LinkedIn
 */
export function shareToLinkedIn(options: ShareOptions) {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(options.url)}`
  window.open(url, '_blank', 'width=600,height=400')
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    } catch (e) {
      document.body.removeChild(textarea)
      return false
    }
  }
}

/**
 * 复制链接
 */
export async function copyLink(url: string): Promise<boolean> {
  return copyToClipboard(url)
}

/**
 * 系统分享（移动端）
 */
export async function nativeShare(options: ShareOptions) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: options.title,
        url: options.url,
        text: options.text
      })
      return true
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('分享失败:', err)
      }
      return false
    }
  }
  return false
}

/**
 * 打印文章
 */
export function printArticle() {
  window.print()
}
