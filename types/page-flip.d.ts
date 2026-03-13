declare module 'page-flip' {
  export interface PageFlipSettings {
    width: number
    height: number
    minWidth?: number
    maxWidth?: number
    minHeight?: number
    maxHeight?: number
    size?: 'fixed' | 'stretch'
    showCover?: boolean
    usePortrait?: boolean
    startZIndex?: number
    autoSize?: boolean
    maxShadowOpacity?: number
    drawShadow?: boolean
    flippingTime?: number
    mobileScrollSupport?: boolean
    swipeDistance?: number
    clickEventForward?: boolean
    useMouseEvents?: boolean
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: PageFlipSettings)
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void
    destroy(): void
    turnToPage(index: number): void
    getCurrentPageIndex(): number
    flipNext(corner?: 'top' | 'bottom'): void
    flipPrev(corner?: 'top' | 'bottom'): void
    on(event: string, callback: () => void): void
  }
}
