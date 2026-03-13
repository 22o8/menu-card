<template>
  <section class="menu-card-screen" dir="ltr">
    <div class="ambient ambient-top"></div>
    <div class="ambient ambient-left"></div>
    <div class="ambient ambient-right"></div>
    <div class="ambient ambient-gold"></div>

    <div class="viewer-shell" :class="[`device-${deviceMode}`]">
      <button
        class="nav-arrow nav-arrow-left nav-arrow-desktop"
        type="button"
        :disabled="!ready || atStart"
        aria-label="Previous page"
        @click="prevPage"
      >
        ‹
      </button>

      <div class="viewer-center">
        <div class="mobile-controls" v-if="isCompact">
          <button
            class="nav-arrow nav-arrow-mobile"
            type="button"
            :disabled="!ready || atStart"
            aria-label="Previous page"
            @click="prevPage"
          >
            ‹
          </button>

          <div class="mobile-status">
            <span class="mobile-status__label">{{ locale === 'ar' ? 'تصفح سلس' : 'Smooth Swipe' }}</span>
            <strong class="mobile-status__value">{{ spreadIndicator }}</strong>
          </div>

          <button
            class="nav-arrow nav-arrow-mobile"
            type="button"
            :disabled="!ready || atEnd"
            aria-label="Next page"
            @click="nextPage"
          >
            ›
          </button>
        </div>

        <div class="book-frame" :class="[`device-${deviceMode}`]">
          <div class="frame-glow"></div>
          <div class="frame-halo"></div>
          <div class="book-sheen"></div>
          <div ref="bookRef" class="flip-book"></div>
        </div>

        <div class="mobile-hint" v-if="isCompact">
          {{ locale === 'ar' ? 'اسحب الصفحة أو استخدم الأسهم' : 'Swipe the page or use arrows' }}
        </div>

        <div class="toolbar" :class="[`device-${deviceMode}`]">
          <button class="toolbar-btn" type="button" @click="zoomOut" aria-label="Zoom out">−</button>
          <button class="toolbar-btn" type="button" @click="zoomIn" aria-label="Zoom in">+</button>
          <button
            class="toolbar-btn toolbar-btn-nav"
            type="button"
            :disabled="!ready || atStart"
            aria-label="Previous"
            @click="prevPage"
          >
            ❮
          </button>
          <div class="toolbar-indicator">{{ spreadIndicator }}</div>
          <button
            class="toolbar-btn toolbar-btn-nav"
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
        class="nav-arrow nav-arrow-right nav-arrow-desktop"
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
const bookRef = ref<HTMLElement | null>(null)
const viewportWidth = ref(1440)

let pageFlip: PageFlipInstance | null = null
let resizeTimer: ReturnType<typeof setTimeout> | null = null

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
const isPhone = computed(() => viewportWidth.value <= 640)
const isTablet = computed(() => viewportWidth.value > 640 && viewportWidth.value <= 980)
const isCompact = computed(() => viewportWidth.value <= 980)
const deviceMode = computed<'phone' | 'tablet' | 'desktop'>(() => {
  if (isPhone.value) return 'phone'
  if (isTablet.value) return 'tablet'
  return 'desktop'
})

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

function getFlipConfig() {
  if (deviceMode.value === 'phone') {
    return {
      width: 345,
      height: 560,
      minWidth: 280,
      maxWidth: 390,
      minHeight: 460,
      maxHeight: 640,
      usePortrait: true,
      maxShadowOpacity: 0.28,
      flippingTime: 720,
      swipeDistance: 6
    }
  }

  if (deviceMode.value === 'tablet') {
    return {
      width: 430,
      height: 620,
      minWidth: 320,
      maxWidth: 450,
      minHeight: 500,
      maxHeight: 700,
      usePortrait: true,
      maxShadowOpacity: 0.34,
      flippingTime: 780,
      swipeDistance: 8
    }
  }

  return {
    width: 520,
    height: 720,
    minWidth: 320,
    maxWidth: 520,
    minHeight: 440,
    maxHeight: 720,
    usePortrait: false,
    maxShadowOpacity: 0.44,
    flippingTime: 900,
    swipeDistance: 14
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
  const flipConfig = getFlipConfig()

  pageFlip = new PageFlip(container, {
    ...flipConfig,
    size: 'stretch',
    showCover: true,
    startZIndex: 10,
    autoSize: true,
    drawShadow: true,
    mobileScrollSupport: true,
    clickEventForward: false,
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
  pageFlip.flipNext(isCompact.value ? 'bottom' : 'top')
}

function prevPage() {
  if (!pageFlip) return
  pageFlip.flipPrev(isCompact.value ? 'bottom' : 'top')
}

function applyZoom() {
  if (!bookRef.value) return
  bookRef.value.style.setProperty('--menu-book-scale', String(zoom.value))
}

function zoomIn() {
  const max = isCompact.value ? 1.04 : 1.1
  zoom.value = Math.min(max, +(zoom.value + 0.02).toFixed(2))
  applyZoom()
}

function zoomOut() {
  const min = isCompact.value ? 0.94 : 0.92
  zoom.value = Math.max(min, +(zoom.value - 0.02).toFixed(2))
  applyZoom()
}

function toggleLocale() {
  locale.value = locale.value === 'ar' ? 'en' : 'ar'
}

function handleResize() {
  viewportWidth.value = window.innerWidth
}

onMounted(async () => {
  handleResize()
  window.addEventListener('resize', handleResize)
  await initFlipBook(0)
})

watch(locale, async () => {
  const keepPage = currentPage.value
  await initFlipBook(keepPage)
})

watch(deviceMode, async () => {
  if (!process.client) return
  const keepPage = currentPage.value
  zoom.value = 1
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(async () => {
    await initFlipBook(keepPage)
  }, 140)
})

onBeforeUnmount(() => {
  if (pageFlip) {
    pageFlip.destroy()
    pageFlip = null
  }
  if (process.client) {
    window.removeEventListener('resize', handleResize)
  }
  if (resizeTimer) {
    clearTimeout(resizeTimer)
    resizeTimer = null
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
    radial-gradient(circle at 14% 54%, rgba(255, 255, 255, 0.05), transparent 20%),
    radial-gradient(circle at 86% 54%, rgba(255, 255, 255, 0.05), transparent 20%),
    linear-gradient(180deg, #111216 0%, #0a0b0f 54%, #06070a 100%);
  display: grid;
  place-items: center;
  padding: 24px 20px 88px;
  touch-action: pan-y;
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
  top: 3%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(201, 151, 43, 0.34);
}

.ambient-left,
.ambient-right {
  width: 220px;
  height: 280px;
  top: 28%;
  background: rgba(255, 255, 255, 0.045);
}

.ambient-left { left: 2%; }
.ambient-right { right: 2%; }

.ambient-gold {
  width: 420px;
  height: 140px;
  bottom: 6%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(197, 147, 40, 0.1);
}

.viewer-shell {
  width: min(1320px, 100%);
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 72px;
  align-items: center;
  gap: 18px;
}

.viewer-center {
  display: grid;
  place-items: center;
  gap: 18px;
}

.mobile-controls {
  width: min(100%, 420px);
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) 56px;
  gap: 12px;
  align-items: center;
}

.mobile-status {
  min-height: 56px;
  border-radius: 18px;
  border: 1px solid rgba(212, 164, 66, 0.18);
  background: linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02));
  box-shadow: 0 10px 30px rgba(0,0,0,0.22);
  display: grid;
  place-items: center;
  padding: 6px 12px;
}

.mobile-status__label {
  color: rgba(255,255,255,0.6);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.mobile-status__value {
  color: #f5efe3;
  font-size: 17px;
  line-height: 1.2;
}

.book-frame {
  position: relative;
  width: min(1080px, 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-radius: 34px;
}

.frame-glow {
  position: absolute;
  inset: auto 8% -38px 8%;
  height: 78px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.52), transparent 70%);
  filter: blur(18px);
  pointer-events: none;
}

.frame-halo {
  position: absolute;
  inset: -10px;
  border-radius: 38px;
  border: 1px solid rgba(255,255,255,0.04);
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0));
  pointer-events: none;
}

.book-sheen {
  position: absolute;
  inset: 12px 18px auto;
  height: 18%;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0));
  opacity: 0.22;
  pointer-events: none;
}

.flip-book {
  width: min(1040px, 100%);
  max-width: 1040px;
  height: auto;
  transform: scale(var(--menu-book-scale, 1));
  transform-origin: center center;
  transition: transform 0.22s ease;
}

:deep(.stf__parent),
:deep(.stf__wrapper) {
  margin-inline: auto;
}

:deep(.stf__wrapper) {
  overflow: visible !important;
}

:deep(.stf__wrapper)::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 2%;
  transform: translateX(-50%);
  width: 10px;
  height: 96%;
  border-radius: 999px;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(0,0,0,0.5), rgba(216,166,70,0.14) 50%, rgba(0,0,0,0.5));
  opacity: 0.28;
  filter: blur(1px);
}

:deep(.stf__item),
:deep(.stf__block) {
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  box-shadow: none !important;
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
  padding: 12px 4px 12px 12px;
}

.page-inner-right {
  padding: 12px 12px 12px 4px;
}

.cover-surface,
.menu-surface {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.012)),
    radial-gradient(circle at 50% 0%, rgba(212, 164, 66, 0.08), transparent 40%),
    linear-gradient(180deg, #27282d 0%, #18191d 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.05),
    0 24px 60px rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(8px);
}

.cover-surface-left,
.menu-surface-left {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.cover-surface-right,
.menu-surface-right {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.foil-outline {
  position: absolute;
  inset: 16px;
  border: 1px solid rgba(208, 164, 72, 0.16);
  border-radius: 14px;
  pointer-events: none;
}

.cover-noise {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.18) 0.5px, transparent 0.5px);
  background-size: 9px 9px;
}

.cover-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(28px);
  opacity: 0.35;
  pointer-events: none;
}

.cover-orb-top {
  width: 140px;
  height: 140px;
  top: 6%;
  right: 6%;
  background: rgba(212, 164, 66, 0.22);
}

.cover-orb-bottom {
  width: 160px;
  height: 160px;
  left: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.06);
}

.cover-spine-mark {
  position: absolute;
  inset: 18px;
  display: grid;
  place-items: center;
}

.cover-spine-mark::before {
  content: '';
  width: 112px;
  height: 112px;
  border-radius: 999px;
  border: 1px solid rgba(212, 164, 66, 0.18);
  box-shadow: inset 0 0 0 16px rgba(212, 164, 66, 0.02);
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
  padding: 48px;
}

.cover-kicker,
.menu-kicker {
  color: #d2a34a;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  font-size: 12px;
  margin: 0 0 16px;
}

.cover-title {
  color: #f6f1e8;
  font-size: 60px;
  line-height: 1.02;
  margin: 0 0 16px;
  font-weight: 700;
}

.cover-subtitle {
  color: rgba(255, 255, 255, 0.76);
  font-size: 18px;
  line-height: 1.82;
  max-width: 340px;
  margin: 0;
}

.cover-meta {
  margin-top: 28px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.cover-meta span {
  color: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 13px;
}

.menu-surface {
  padding: 30px 24px 22px;
}

.menu-flourish {
  position: absolute;
  width: 126px;
  height: 76px;
  opacity: 0.11;
  pointer-events: none;
}

.menu-flourish-top {
  left: 18px;
  bottom: 44px;
  border-left: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid rgba(255, 255, 255, 0.3);
  border-top-left-radius: 126px 76px;
}

.menu-flourish-bottom {
  right: 18px;
  bottom: 44px;
  border-right: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid rgba(255, 255, 255, 0.3);
  border-top-right-radius: 126px 76px;
}

.menu-header {
  position: relative;
  z-index: 1;
  margin-bottom: 16px;
}

.menu-title {
  color: #f6f1e8;
  font-size: 31px;
  line-height: 1.04;
  margin: 0;
  font-weight: 700;
}

.menu-items {
  display: grid;
  gap: 8px;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  padding: 12px 0 13px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
}

.menu-copy {
  flex: 1;
  min-width: 0;
}

.item-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 7px;
}

.item-title {
  color: #f6f1e8;
  font-size: 18px;
  margin: 0;
  font-weight: 700;
}

.item-badge {
  color: #e3be74;
  background: rgba(212, 164, 66, 0.08);
  border: 1px solid rgba(212, 164, 66, 0.24);
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 11px;
  line-height: 1;
  white-space: nowrap;
}

.item-desc {
  color: rgba(255, 255, 255, 0.64);
  font-size: 14px;
  line-height: 1.58;
  margin: 0;
}

.item-price {
  color: #f7f2ea;
  font-size: 18px;
  min-width: 64px;
  text-align: right;
  padding-top: 2px;
}

.nav-arrow {
  width: 60px;
  height: 60px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(10, 10, 12, 0.56);
  color: white;
  font-size: 38px;
  line-height: 1;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.22s ease;
  backdrop-filter: blur(12px);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.22);
}

.nav-arrow:hover:not(:disabled),
.toolbar-btn:hover:not(:disabled) {
  border-color: rgba(212, 164, 66, 0.36);
  color: #d6af60;
}

.nav-arrow:disabled,
.toolbar-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(243, 243, 243, 0.96);
  padding: 10px 14px;
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(14px);
}

.toolbar-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid rgba(18, 18, 18, 0.08);
  background: white;
  color: #555;
  cursor: pointer;
  font-size: 22px;
  transition: all 0.2s ease;
}

.toolbar-btn-locale {
  font-size: 17px;
  font-weight: 700;
}

.toolbar-indicator {
  min-width: 98px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid rgba(18, 18, 18, 0.06);
  background: #f7f7f7;
  color: #444;
  display: grid;
  place-items: center;
  font-size: 17px;
  padding: 0 10px;
  font-weight: 700;
}

.mobile-hint {
  color: rgba(255,255,255,0.68);
  font-size: 12px;
  letter-spacing: 0.06em;
}

@media (max-width: 1200px) {
  .viewer-shell {
    grid-template-columns: 60px minmax(0, 1fr) 60px;
    gap: 12px;
  }

  .cover-title {
    font-size: 48px;
  }
}

@media (max-width: 980px) {
  .menu-card-screen {
    padding-inline: 14px;
    padding-bottom: 96px;
  }

  .viewer-shell {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }

  .nav-arrow-desktop {
    display: none;
  }

  .book-frame.device-tablet,
  .book-frame.device-phone {
    width: min(100%, 460px);
  }

  :deep(.stf__wrapper)::after {
    width: 6px;
    opacity: 0.16;
  }

  .toolbar {
    gap: 8px;
    padding: 8px 10px;
  }

  .toolbar-btn,
  .toolbar-indicator {
    height: 38px;
  }

  .toolbar-btn {
    width: 38px;
    font-size: 18px;
  }

  .toolbar-indicator {
    min-width: 86px;
    font-size: 15px;
  }
}

@media (max-width: 640px) {
  .menu-card-screen {
    padding: 18px 12px 86px;
  }

  .ambient-top {
    width: 240px;
    height: 90px;
  }

  .ambient-left,
  .ambient-right,
  .ambient-gold {
    opacity: 0.35;
  }

  .mobile-controls {
    width: min(100%, 390px);
    grid-template-columns: 52px minmax(0, 1fr) 52px;
    gap: 10px;
  }

  .nav-arrow-mobile {
    width: 52px;
    height: 52px;
    font-size: 30px;
  }

  .book-frame.device-phone {
    width: min(100%, 392px);
    padding: 4px;
  }

  .frame-halo {
    inset: -4px;
    border-radius: 28px;
  }

  .menu-surface {
    padding: 22px 16px 18px;
  }

  .menu-title {
    font-size: 22px;
  }

  .menu-kicker,
  .cover-kicker {
    font-size: 10px;
    letter-spacing: 0.22em;
    margin-bottom: 12px;
  }

  .item-title {
    font-size: 15px;
  }

  .item-desc {
    font-size: 12px;
    line-height: 1.5;
  }

  .item-price {
    font-size: 14px;
    min-width: 48px;
  }

  .cover-title {
    font-size: 34px;
  }

  .cover-subtitle {
    font-size: 14px;
    line-height: 1.7;
    max-width: 260px;
  }

  .cover-content {
    padding: 24px 18px;
  }

  .cover-meta {
    gap: 8px;
    margin-top: 20px;
  }

  .cover-meta span {
    padding: 8px 12px;
    font-size: 11px;
  }

  .toolbar {
    width: min(100%, 390px);
    justify-content: center;
    gap: 6px;
    padding: 8px;
    border-radius: 14px;
  }

  .toolbar-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    font-size: 17px;
  }

  .toolbar-indicator {
    min-width: 74px;
    height: 36px;
    font-size: 14px;
  }

  .mobile-hint {
    font-size: 11px;
  }
}
</style>
