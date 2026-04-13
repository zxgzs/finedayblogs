/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  _gKeyPending: boolean
  OML2D?: {
    loadOml2d: (config: any) => void
  }
}
