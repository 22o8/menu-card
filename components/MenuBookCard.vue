<template>
  <section class="menu-card-screen" dir="ltr">
    <div class="ambient ambient-top"></div>
    <div class="ambient ambient-left"></div>
    <div class="ambient ambient-right"></div>

    <div class="viewer-shell" :class="{ 'viewer-shell-mobile': isMobile }">
      <button
        class="nav-arrow nav-arrow-left"
        :class="{ 'nav-arrow-mobile': isMobile }"
        type="button"
        :disabled="!ready || atStart"
        aria-label="Previous page"
        @click="prevPage"
      >
        ‹
      </button>

      <div class="viewer-center">
        <div v-if="isMobile" class="mobile-actions-bar">
          <button
            class="mobile-nav-btn"
            type="button"
            :disabled="!ready || atStart"
            aria-label="Previous page"
            @click="prevPage"
          >
            ‹
          </button>
          <div class="mobile-indicator-wrap">
            <span class="mobile-indicator-label">{{ locale === 'ar' ? 'المنيو الرقمي' : 'Digital Menu' }}</span>
            <strong class="mobile-indicator-value">{{ spreadIndicator }}</strong>
          </div>
          <button
            class="mobile-nav-btn"
            type="button"
            :disabled="!ready || atEnd"
            aria-label="Next page"
            @click="nextPage"
          >
            ›
          </button>
        </div>

        <div class="book-frame" :class="{ 'book-frame-mobile': isMobile, 'book-frame-tablet': isTablet && !isMobile }">
          <div class="frame-glow"></div>
          <div class="frame-outline"></div>
          <div class="touch-hint" v-if="isMobile">
            {{ locale === 'ar' ? 'اسحب الصفحة أو استخدم الأسهم' : 'Swipe pages or use arrows' }}
          </div>

          <div ref="bookRef" class="flip-book" :class="{ 'flip-book-mobile': isMobile }">
            <div
              v-for="page in pages"
              :key="`${locale}-${page.id}`"
              class="page js-page"
              :class="[
                page.type === 'cover' ? 'page-cover' : 'page-menu',
                page.side === 'left' ? 'page-left' : 'page-right'
              ]"
            >
              <div class="page-inner" :class="page.side === 'left' ? 'page-inner-left' : 'page-inner-right'">
                <template v-if="page.type === 'cover'">
                  <div class="cover-surface" :class="page.side === 'left' ? 'cover-surface-left' : 'cover-surface-right'">
                    <div class="foil-outline"></div>
                    <div class="cover-noise"></div>
                    <div class="cover-orb cover-orb-top"></div>
                    <div class="cover-orb cover-orb-bottom"></div>

                    <template v-if="page.side === 'left'">
                      <div class="cover-spine-mark"></div>
                    </template>

                    <template v-else>
                      <div class="cover-content">
                        <p class="cover-kicker">{{ ui.kicker }}</p>
                        <h1 class="cover-title">{{ ui.coverTitle }}</h1>
                        <p class="cover-subtitle">{{ ui.coverSubtitle }}</p>
                        <div class="cover-meta">
                          <span>{{ ui.premiumDining }}</span>
                          <span>{{ ui.bookExperience }}</span>
                        </div>
                      </div>
                    </template>
                  </div>
                </template>

                <template v-else>
                  <article class="menu-surface" :class="page.side === 'left' ? 'menu-surface-left' : 'menu-surface-right'">
                    <div class="foil-outline"></div>
                    <div class="menu-flourish menu-flourish-top"></div>
                    <div class="menu-flourish menu-flourish-bottom"></div>

                    <header class="menu-header">
                      <span class="menu-kicker">{{ page.eyebrow }}</span>
                      <h2 class="menu-title">{{ page.title }}</h2>
                    </header>

                    <div class="menu-items">
                      <article
                        v-for="item in page.items"
                        :key="`${page.id}-${item.title}-${item.price}`"
                        class="menu-item"
                      >
                        <div class="menu-copy">
                          <div class="item-title-row">
                            <h3 class="item-title">{{ item.title }}</h3>
                            <span v-if="item.badge" class="item-badge">{{ item.badge }}</span>
                          </div>
                          <p class="item-desc">{{ item.desc }}</p>
                        </div>
                        <strong class="item-price">{{ item.price }}</strong>
                      </article>
                    </div>
                  </article>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="toolbar" :class="{ 'toolbar-mobile': isMobile }">
          <button class="toolbar-btn" type="button" @click="zoomOut" aria-label="Zoom out">−</button>
          <button class="toolbar-btn" type="button" @click="zoomIn" aria-label="Zoom in">+</button>
          <button
            v-if="!isMobile"
            class="toolbar-btn"
            type="button"
            :disabled="!ready || atStart"
            aria-label="Previous"
            @click="prevPage"
          >
            ❮
          </button>
          <div class="toolbar-indicator">{{ spreadIndicator }}</div>
          <button
            v-if="!isMobile"
            class="toolbar-btn"
            type="button"
            :disabled="!ready || atEnd"
            aria-label="Next"
            @click="nextPage"
          >
            ❯
          </button>
          <button class="toolbar-btn toolbar-btn-locale" type="button" @click="toggleLocale">
            {{ locale === 'ar' ? 'EN' : 'AR' }}
          </button>
        </div>
      </div>

      <button
        class="nav-arrow nav-arrow-right"
        :class="{ 'nav-arrow-mobile': isMobile }"
        type="button"
        :disabled="!ready || atEnd"
        aria-label="Next page"
        @click="nextPage"
      >
        ›
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { PageFlip as PageFlipInstance } from 'page-flip'
import { menuSpreads } from '~/data/menu'

type Locale = 'ar' | 'en'

type MenuBadge = 'chef' | 'spicy' | 'new'

type PageModel = {
  id: string
  type: 'cover' | 'menu'
  side: 'left' | 'right'
  eyebrow?: string
  title?: string
  items?: Array<{ title: string; desc: string; price: string; badge?: string }>
}

const locale = ref<Locale>('en')
const ready = ref(false)
const currentPage = ref(0)
const currentSpread = ref(1)
const totalSpreads = ref(1)
const zoom = ref(1)
const viewportWidth = ref(1280)
const bookRef = ref<HTMLElement | null>(null)

let pageFlip: PageFlipInstance | null = null
let resizeTimer: ReturnType<typeof setTimeout> | null = null

const isMobile = computed(() => viewportWidth.value < 768)
const isTablet = computed(() => viewportWidth.value >= 768 && viewportWidth.value < 1100)

const uiMap = {
  ar: {
    kicker: 'LUXURY DIGITAL MENU',
    coverTitle: 'قائمة الطعام',
    coverSubtitle: 'تجربة منيو فاخرة بحركة صفحات ناعمة مثل الكتاب الحقيقي.',
    premiumDining: 'خدمة راقية',
    bookExperience: 'إحساس دفتر واقعي',
    sectionsLabel: 'المنيو',
    badges: {
      chef: 'اختيار الشيف',
      spicy: 'حار',
      new: 'جديد'
    },
    sections: {
      breakfast: 'الفطور',
      salads: 'السلطات',
      soups: 'الشوربات',
      baguettes: 'الباغيت',
      mains: 'الأطباق الرئيسية',
      desserts: 'الحلويات',
      drinks: 'المشروبات',
      signature: 'أطباق خاصة'
    }
  },
  en: {
    kicker: 'LUXURY DIGITAL MENU',
    coverTitle: 'Menu Card',
    coverSubtitle: 'A refined luxury menu with smooth page motion like a real book.',
    premiumDining: 'Premium Dining',
    bookExperience: 'Real Book Feel',
    sectionsLabel: 'MENU',
    badges: {
      chef: 'Chef Choice',
      spicy: 'Spicy',
      new: 'New'
    },
    sections: {
      breakfast: 'Breakfast',
      salads: 'Salads',
      soups: 'Soups',
      baguettes: 'Baguettes',
      mains: 'Main Courses',
      desserts: 'Desserts',
      drinks: 'Drinks',
      signature: 'Signature'
    }
  }
} as const

const ui = computed(() => uiMap[locale.value])

const pages = computed<PageModel[]>(() => {
  const currentUi = ui.value
  const localizedBadge = (badge?: MenuBadge) => (badge ? currentUi.badges[badge] : undefined)

  const pageModels: PageModel[] = [
    { id: 'cover-left', type: 'cover', side: 'left' },
    { id: 'cover-right', type: 'cover', side: 'right' }
  ]

  menuSpreads.forEach((spread, index) => {
    pageModels.push({
      id: `spread-${index + 1}-left`,
      type: 'menu',
      side: 'left',
      eyebrow: currentUi.sectionsLabel,
      title: currentUi.sections[spread.leftTitleKey as keyof typeof currentUi.sections],
      items: spread.leftItems.map((item) => ({
        title: locale.value === 'ar' ? item.nameAr : item.nameEn,
        desc: locale.value === 'ar' ? item.descAr : item.descEn,
        price: item.price,
        badge: localizedBadge(item.badge)
      }))
    })

    pageModels.push({
      id: `spread-${index + 1}-right`,
      type: 'menu',
      side: 'right',
      eyebrow: currentUi.sectionsLabel,
      title: currentUi.sections[spread.rightTitleKey as keyof typeof currentUi.sections],
      items: spread.rightItems.map((item) => ({
        title: locale.value === 'ar' ? item.nameAr : item.nameEn,
        desc: locale.value === 'ar' ? item.descAr : item.descEn,
        price: item.price,
        badge: localizedBadge(item.badge)
      }))
    })
  })

  return pageModels
})

const spreadIndicator = computed(() => `${currentSpread.value} / ${totalSpreads.value}`)
const atStart = computed(() => currentPage.value <= 0)
const atEnd = computed(() => currentPage.value >= pages.value.length - 1)

function updateViewport() {
  if (!process.client) return
  viewportWidth.value = Math.round(window.visualViewport?.width || window.innerWidth || 1280)
}

function getFlipConfig() {
  if (isMobile.value) {
    return {
      width: 356,
      height: 592,
      minWidth: 280,
      maxWidth: 430,
      minHeight: 430,
      maxHeight: 720,
      usePortrait: true,
      swipeDistance: 14,
      flippingTime: 620,
      mobileScrollSupport: true,
      maxShadowOpacity: 0.28
    }
  }

  if (isTablet.value) {
    return {
      width: 430,
      height: 650,
      minWidth: 330,
      maxWidth: 470,
      minHeight: 460,
      maxHeight: 720,
      usePortrait: false,
      swipeDistance: 20,
      flippingTime: 760,
      mobileScrollSupport: true,
      maxShadowOpacity: 0.34
    }
  }

  return {
    width: 520,
    height: 720,
    minWidth: 360,
    maxWidth: 560,
    minHeight: 520,
    maxHeight: 760,
    usePortrait: false,
    swipeDistance: 24,
    flippingTime: 880,
    mobileScrollSupport: false,
    maxShadowOpacity: 0.42
  }
}

function syncState() {
  if (!pageFlip) return
  currentPage.value = pageFlip.getCurrentPageIndex?.() ?? 0
  const rawSpread = Math.floor(currentPage.value / 2) + 1
  currentSpread.value = Math.min(rawSpread, totalSpreads.value)
}

async function initFlipBook(targetIndex = 0) {
  if (!process.client || !bookRef.value) return

  ready.value = false

  if (pageFlip) {
    pageFlip.destroy()
    pageFlip = null
  }

  await nextTick()

  const { PageFlip } = await import('page-flip')
  const container = bookRef.value
  const cfg = getFlipConfig()

  pageFlip = new PageFlip(container, {
    width: cfg.width,
    height: cfg.height,
    minWidth: cfg.minWidth,
    maxWidth: cfg.maxWidth,
    minHeight: cfg.minHeight,
    maxHeight: cfg.maxHeight,
    size: 'stretch',
    showCover: true,
    usePortrait: cfg.usePortrait,
    startZIndex: 10,
    autoSize: true,
    maxShadowOpacity: cfg.maxShadowOpacity,
    drawShadow: true,
    flippingTime: cfg.flippingTime,
    mobileScrollSupport: cfg.mobileScrollSupport,
    swipeDistance: cfg.swipeDistance,
    clickEventForward: true,
    useMouseEvents: true
  })

  const pageNodes = container.querySelectorAll<HTMLElement>('.js-page')
  pageFlip.loadFromHTML(pageNodes)

  totalSpreads.value = Math.max(1, Math.ceil(pageNodes.length / 2))

  pageFlip.on('flip', syncState)
  pageFlip.on('changeState', syncState)

  if (targetIndex > 0) {
    pageFlip.turnToPage(Math.min(targetIndex, pageNodes.length - 1))
  }

  await nextTick()
  applyZoom()
  syncState()
  ready.value = true
}

function nextPage() {
  if (!pageFlip) return
  pageFlip.flipNext(isMobile.value ? 'bottom' : 'top')
}

function prevPage() {
  if (!pageFlip) return
  pageFlip.flipPrev(isMobile.value ? 'bottom' : 'top')
}

function applyZoom() {
  if (!bookRef.value) return
  bookRef.value.style.setProperty('--menu-book-scale', String(zoom.value))
}

function zoomIn() {
  const maxZoom = isMobile.value ? 1.04 : 1.1
  zoom.value = Math.min(maxZoom, +(zoom.value + 0.03).toFixed(2))
  applyZoom()
}

function zoomOut() {
  const minZoom = isMobile.value ? 0.96 : 0.9
  zoom.value = Math.max(minZoom, +(zoom.value - 0.03).toFixed(2))
  applyZoom()
}

function toggleLocale() {
  locale.value = locale.value === 'ar' ? 'en' : 'ar'
}

function handleResize() {
  updateViewport()
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    const keepPage = currentPage.value
    void initFlipBook(keepPage)
  }, 180)
}

onMounted(async () => {
  updateViewport()
  window.addEventListener('resize', handleResize, { passive: true })
  window.visualViewport?.addEventListener?.('resize', handleResize, { passive: true })
  await initFlipBook(0)
})

watch(locale, async () => {
  const keepPage = currentPage.value
  await initFlipBook(keepPage)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  window.visualViewport?.removeEventListener?.('resize', handleResize)
  if (resizeTimer) clearTimeout(resizeTimer)
  if (pageFlip) {
    pageFlip.destroy()
    pageFlip = null
  }
})
</script>

<style scoped>
.menu-card-screen {
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 8%, rgba(212, 166, 71, 0.28), transparent 24%),
    radial-gradient(circle at 12% 50%, rgba(255, 255, 255, 0.045), transparent 20%),
    radial-gradient(circle at 88% 50%, rgba(255, 255, 255, 0.045), transparent 20%),
    linear-gradient(180deg, #121319 0%, #0b0c11 54%, #07080b 100%);
  display: grid;
  place-items: center;
  padding: 24px 22px 92px;
}

.ambient {
  position: absolute;
  pointer-events: none;
  filter: blur(60px);
  opacity: 0.55;
}

.ambient-top {
  width: 340px;
  height: 120px;
  top: 4%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(201, 151, 43, 0.34);
}

.ambient-left,
.ambient-right {
  width: 220px;
  height: 280px;
  top: 28%;
  background: rgba(255, 255, 255, 0.04);
}

.ambient-left { left: 2%; }
.ambient-right { right: 2%; }

.viewer-shell {
  width: min(1340px, 100%);
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 72px;
  align-items: center;
  gap: 18px;
}

.viewer-center {
  display: grid;
  place-items: center;
  gap: 24px;
}

.mobile-actions-bar {
  width: min(460px, calc(100vw - 26px));
  display: none;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 4px;
}

.mobile-nav-btn {
  width: 46px;
  height: 46px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(12, 13, 18, 0.78);
  color: #fff;
  font-size: 28px;
  box-shadow: 0 14px 24px rgba(0,0,0,0.24);
}

.mobile-nav-btn:disabled { opacity: 0.32; }

.mobile-indicator-wrap {
  flex: 1;
  min-width: 0;
  border-radius: 999px;
  padding: 9px 16px;
  background: rgba(255,255,255,0.055);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
  text-align: center;
}

.mobile-indicator-label {
  display: block;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.58);
  margin-bottom: 2px;
}

.mobile-indicator-value {
  display: block;
  color: #f5f1e8;
  font-size: 16px;
}

.book-frame {
  position: relative;
  width: min(1140px, 100%);
  min-height: 720px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px;
  border-radius: 40px;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.045);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
}

.book-frame-mobile {
  width: min(460px, calc(100vw - 18px));
  min-height: auto;
  padding: 10px;
  border-radius: 30px;
}

.book-frame-tablet {
  width: min(920px, 100%);
}

.frame-glow {
  position: absolute;
  inset: auto 10% -38px 10%;
  height: 86px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.55), transparent 70%);
  filter: blur(20px);
  pointer-events: none;
}

.frame-outline {
  position: absolute;
  inset: 16px;
  border-radius: 32px;
  border: 1px solid rgba(255,255,255,0.04);
  pointer-events: none;
}

.touch-hint {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(9, 10, 14, 0.7);
  border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.72);
  font-size: 12px;
  z-index: 3;
  backdrop-filter: blur(8px);
}

.flip-book {
  width: min(1080px, 100%);
  max-width: 1080px;
  height: auto;
  transform: scale(var(--menu-book-scale, 1));
  transform-origin: center center;
  transition: transform 0.24s ease;
  will-change: transform;
}

.flip-book-mobile {
  width: 100%;
}

:deep(.stf__parent),
:deep(.stf__wrapper) {
  margin-inline: auto;
}

:deep(.stf__wrapper) {
  touch-action: pan-y pinch-zoom;
}

:deep(.stf__wrapper)::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 2.4%;
  transform: translateX(-50%);
  width: 12px;
  height: 95.2%;
  border-radius: 999px;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(0,0,0,0.56), rgba(216,166,70,0.1) 50%, rgba(0,0,0,0.56));
  opacity: 0.38;
  filter: blur(1px);
}

:deep(.stf__item) {
  background: transparent !important;
  padding: 0 !important;
}

:deep(.stf__block) {
  box-shadow: none !important;
  margin: 0 !important;
}

.page {
  width: 100%;
  height: 100%;
  background: transparent;
}

.page-inner {
  width: 100%;
  height: 100%;
  position: relative;
}

.page-inner-left {
  padding: 12px 6px 12px 12px;
}

.page-inner-right {
  padding: 12px 12px 12px 6px;
}

.cover-surface,
.menu-surface {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.014)),
    linear-gradient(180deg, #28292d 0%, #17181c 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.05),
    0 24px 60px rgba(0, 0, 0, 0.34);
}

.cover-surface-left,
.menu-surface-left {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.cover-surface-right,
.menu-surface-right {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.foil-outline {
  position: absolute;
  inset: 16px;
  border-radius: 16px;
  border: 1px solid rgba(199, 150, 26, 0.14);
  pointer-events: none;
}

.cover-noise {
  position: absolute;
  inset: 0;
  opacity: 0.06;
  background-image: radial-gradient(circle, rgba(255,255,255,0.18) 0.5px, transparent 0.5px);
  background-size: 8px 8px;
}

.cover-orb {
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  filter: blur(60px);
  opacity: 0.18;
}

.cover-orb-top {
  top: -40px;
  right: -12px;
  background: rgba(199,150,26,0.34);
}

.cover-orb-bottom {
  bottom: -60px;
  left: -40px;
  background: rgba(255,255,255,0.08);
}

.cover-spine-mark {
  position: absolute;
  top: 8%;
  bottom: 8%;
  right: 24px;
  width: 8px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(0,0,0,0.72), rgba(255,255,255,0.08), rgba(0,0,0,0.72));
  opacity: 0.52;
}

.cover-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 52px 42px;
}

.cover-kicker {
  margin: 0 0 18px;
  color: #d0a247;
  font-size: 13px;
  letter-spacing: 0.3em;
}

.cover-title {
  margin: 0;
  font-size: clamp(42px, 5vw, 66px);
  line-height: 1.02;
  color: #f6f2e9;
}

.cover-subtitle {
  margin: 18px 0 0;
  font-size: 18px;
  line-height: 1.9;
  color: rgba(255,255,255,0.76);
  max-width: 400px;
}

.cover-meta {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.cover-meta span {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(199,150,26,0.18);
  background: rgba(199,150,26,0.08);
  color: #e7bf69;
  font-size: 13px;
}

.menu-surface {
  padding: 28px 28px 22px;
}

.menu-flourish {
  position: absolute;
  width: 150px;
  height: 78px;
  opacity: 0.11;
  pointer-events: none;
}

.menu-flourish-top {
  left: 18px;
  bottom: 36px;
  border-left: 2px solid rgba(255,255,255,0.32);
  border-top: 2px solid rgba(255,255,255,0.32);
  border-top-left-radius: 120px 80px;
}

.menu-flourish-bottom {
  right: 18px;
  bottom: 36px;
  border-right: 2px solid rgba(255,255,255,0.32);
  border-top: 2px solid rgba(255,255,255,0.32);
  border-top-right-radius: 120px 80px;
}

.menu-header {
  margin-bottom: 18px;
}

.menu-kicker {
  display: block;
  color: #c99b36;
  letter-spacing: 0.16em;
  font-size: 12px;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.menu-title {
  color: #f5f1e8;
  margin: 0;
  font-size: 32px;
  line-height: 1.05;
}

.menu-items {
  display: grid;
  gap: 8px;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0 15px;
  border-bottom: 1px dashed rgba(255,255,255,0.09);
  align-items: flex-start;
}

.menu-copy {
  min-width: 0;
  flex: 1;
}

.item-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.item-title {
  margin: 0;
  color: #f7f3ea;
  font-size: 18px;
  line-height: 1.3;
}

.item-badge {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid rgba(199,150,26,0.22);
  color: #d4a848;
  background: rgba(199,150,26,0.08);
}

.item-desc {
  margin: 0;
  color: rgba(255,255,255,0.64);
  line-height: 1.7;
  font-size: 14px;
}

.item-price {
  min-width: 66px;
  text-align: right;
  color: #f5f1e8;
  font-size: 18px;
  padding-top: 2px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 18px;
  background: rgba(247, 247, 248, 0.96);
  box-shadow: 0 20px 40px rgba(0,0,0,0.26);
  backdrop-filter: blur(12px);
}

.toolbar-mobile {
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  z-index: 12;
  width: min(330px, calc(100vw - 20px));
  padding: 10px 12px;
  border-radius: 22px;
}

.toolbar-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.08);
  background: white;
  color: #555;
  font-size: 22px;
}

.toolbar-btn:disabled,
.mobile-nav-btn:disabled,
.nav-arrow:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.toolbar-indicator {
  min-width: 102px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #f6f6f6;
  color: #444;
  font-weight: 800;
}

.toolbar-btn-locale {
  font-size: 18px;
  font-weight: 800;
}

.nav-arrow {
  width: 58px;
  height: 58px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(10, 10, 12, 0.42);
  color: #fff;
  font-size: 38px;
  line-height: 1;
  cursor: pointer;
  z-index: 8;
  backdrop-filter: blur(10px);
  transition: all 0.22s ease;
}

.nav-arrow:hover:not(:disabled),
.mobile-nav-btn:hover:not(:disabled),
.toolbar-btn:hover:not(:disabled) {
  border-color: rgba(203,160,67,0.5);
  color: #d9b25f;
}

.nav-arrow-mobile {
  display: none;
}

@media (max-width: 1099px) {
  .menu-card-screen {
    padding: 18px 16px 90px;
  }

  .viewer-shell {
    grid-template-columns: 56px minmax(0, 1fr) 56px;
    gap: 10px;
  }

  .book-frame {
    min-height: 650px;
  }

  .menu-title {
    font-size: 28px;
  }

  .cover-title {
    font-size: 52px;
  }
}

@media (max-width: 767px) {
  .menu-card-screen {
    padding: 14px 10px 94px;
    place-items: start center;
  }

  .ambient-top {
    width: 260px;
    top: 1%;
  }

  .ambient-left,
  .ambient-right {
    width: 120px;
    height: 190px;
    top: 24%;
  }

  .viewer-shell,
  .viewer-shell-mobile {
    width: 100%;
    grid-template-columns: 1fr;
  }

  .nav-arrow {
    display: none;
  }

  .mobile-actions-bar {
    display: flex;
  }

  .viewer-center {
    width: 100%;
    gap: 14px;
  }

  .book-frame,
  .book-frame-mobile {
    width: 100%;
    min-height: auto;
    padding: 10px 8px 14px;
    border-radius: 28px;
  }

  .frame-outline {
    inset: 10px;
    border-radius: 22px;
  }

  .touch-hint {
    top: 10px;
    font-size: 11px;
    padding: 7px 12px;
  }

  .page-inner-left,
  .page-inner-right {
    padding: 10px 8px;
  }

  .cover-surface,
  .menu-surface {
    border-radius: 22px;
  }

  .cover-surface-left,
  .menu-surface-left,
  .cover-surface-right,
  .menu-surface-right {
    border-radius: 22px;
  }

  .cover-content {
    padding: 46px 26px 28px;
  }

  .cover-title {
    font-size: 38px;
  }

  .cover-subtitle {
    font-size: 15px;
    line-height: 1.8;
  }

  .cover-meta span {
    font-size: 12px;
    padding: 7px 12px;
  }

  .menu-surface {
    padding: 22px 18px 18px;
  }

  .menu-title {
    font-size: 25px;
  }

  .menu-item {
    gap: 10px;
    padding: 12px 0 13px;
  }

  .item-title {
    font-size: 17px;
  }

  .item-desc {
    font-size: 13px;
    line-height: 1.65;
  }

  .item-price {
    min-width: 56px;
    font-size: 17px;
  }

  .toolbar {
    gap: 8px;
  }

  .toolbar-btn,
  .toolbar-indicator {
    height: 42px;
  }

  .toolbar-btn {
    width: 42px;
  }

  .toolbar-indicator {
    min-width: 90px;
  }

  :deep(.stf__wrapper)::after {
    width: 10px;
    opacity: 0.2;
  }
}

@media (max-width: 420px) {
  .mobile-actions-bar {
    width: calc(100vw - 20px);
  }

  .mobile-nav-btn {
    width: 42px;
    height: 42px;
    font-size: 26px;
  }

  .mobile-indicator-wrap {
    padding: 8px 12px;
  }

  .book-frame,
  .book-frame-mobile {
    padding: 8px 7px 12px;
  }

  .cover-title {
    font-size: 34px;
  }

  .menu-title {
    font-size: 22px;
  }

  .item-title {
    font-size: 16px;
  }

  .item-desc {
    font-size: 12px;
  }

  .item-price {
    min-width: 52px;
    font-size: 16px;
  }

  .toolbar-mobile {
    width: calc(100vw - 16px);
    bottom: 10px;
  }
}
</style>
