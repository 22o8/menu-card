<template>
  <section class="menu-card-screen" dir="ltr">
    <div class="ambient ambient-top"></div>
    <div class="ambient ambient-left"></div>
    <div class="ambient ambient-right"></div>

    <div class="viewer-shell">
      <button
        class="nav-arrow nav-arrow-left"
        type="button"
        :disabled="!ready || atStart"
        aria-label="Previous page"
        @click="prevPage"
      >
        ‹
      </button>

      <div class="viewer-center">
        <div class="book-frame">
          <div class="frame-glow"></div>
          <div ref="bookRef" class="flip-book">
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

        <div class="toolbar">
          <button class="toolbar-btn" type="button" @click="zoomOut" aria-label="Zoom out">−</button>
          <button class="toolbar-btn" type="button" @click="zoomIn" aria-label="Zoom in">+</button>
          <button
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

let pageFlip: PageFlipInstance | null = null

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

  pageFlip = new PageFlip(container, {
    width: 560,
    height: 760,
    minWidth: 280,
    maxWidth: 560,
    minHeight: 420,
    maxHeight: 760,
    size: 'stretch',
    showCover: true,
    usePortrait: true,
    startZIndex: 10,
    autoSize: true,
    maxShadowOpacity: 0.58,
    drawShadow: true,
    flippingTime: 1100,
    mobileScrollSupport: false,
    swipeDistance: 24,
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

  nextTick(() => {
    applyZoom()
    syncState()
    ready.value = true
  })
}

function nextPage() {
  if (!pageFlip) return
  pageFlip.flipNext('top')
}

function prevPage() {
  if (!pageFlip) return
  pageFlip.flipPrev('top')
}

function applyZoom() {
  if (!bookRef.value) return
  bookRef.value.style.setProperty('--menu-book-scale', String(zoom.value))
}

function zoomIn() {
  zoom.value = Math.min(1.12, +(zoom.value + 0.04).toFixed(2))
  applyZoom()
}

function zoomOut() {
  zoom.value = Math.max(0.9, +(zoom.value - 0.04).toFixed(2))
  applyZoom()
}

function toggleLocale() {
  locale.value = locale.value === 'ar' ? 'en' : 'ar'
}

onMounted(async () => {
  await initFlipBook(0)
})

watch(locale, async () => {
  const keepPage = currentPage.value
  await initFlipBook(keepPage)
})

onBeforeUnmount(() => {
  if (pageFlip) {
    pageFlip.destroy()
    pageFlip = null
  }
})
</script>

<style scoped>
.menu-card-screen {
  min-height: 100svh;
  width: 100%;
  position: relative;
  overflow: clip;
  background:
    radial-gradient(circle at 50% 2%, rgba(216, 171, 78, 0.26), transparent 20%),
    radial-gradient(circle at 12% 50%, rgba(255, 255, 255, 0.045), transparent 18%),
    radial-gradient(circle at 88% 50%, rgba(255, 255, 255, 0.045), transparent 18%),
    linear-gradient(180deg, #111216 0%, #0a0b0f 58%, #07080b 100%);
  display: grid;
  place-items: center;
  padding: clamp(18px, 3vw, 30px) clamp(12px, 2.2vw, 24px) max(88px, env(safe-area-inset-bottom));
}

.menu-card-screen::before,
.menu-card-screen::after {
  content: '';
  position: absolute;
  inset: auto;
  pointer-events: none;
  border-radius: 999px;
  filter: blur(70px);
  opacity: 0.45;
}

.menu-card-screen::before {
  width: 34vw;
  max-width: 420px;
  min-width: 220px;
  height: 10vw;
  min-height: 80px;
  left: 50%;
  top: 4%;
  transform: translateX(-50%);
  background: rgba(209, 156, 53, 0.26);
}

.menu-card-screen::after {
  width: 52vw;
  max-width: 740px;
  min-width: 260px;
  height: 18vw;
  min-height: 140px;
  left: 50%;
  bottom: 6%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.42);
}

.ambient {
  position: absolute;
  pointer-events: none;
  filter: blur(70px);
  opacity: 0.62;
}

.ambient-top {
  width: min(420px, 36vw);
  height: 136px;
  top: 2%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(201, 151, 43, 0.28);
}

.ambient-left,
.ambient-right {
  width: min(260px, 18vw);
  height: min(340px, 28vw);
  top: 26%;
  background: rgba(255, 255, 255, 0.035);
}

.ambient-left { left: max(-40px, -2vw); }
.ambient-right { right: max(-40px, -2vw); }

.viewer-shell {
  width: min(1380px, 100%);
  display: grid;
  grid-template-columns: clamp(44px, 5vw, 72px) minmax(0, 1fr) clamp(44px, 5vw, 72px);
  align-items: center;
  gap: clamp(8px, 1.5vw, 20px);
  position: relative;
  z-index: 1;
}

.viewer-center {
  display: grid;
  place-items: center;
  gap: clamp(16px, 2vw, 26px);
  width: 100%;
}

.book-frame {
  position: relative;
  width: min(1140px, 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: clamp(4px, 0.8vw, 10px);
}

.frame-glow {
  position: absolute;
  inset: auto 8% -28px 8%;
  height: clamp(54px, 7vw, 78px);
  border-radius: 999px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.56), transparent 70%);
  filter: blur(22px);
  pointer-events: none;
}

.flip-book {
  width: min(1080px, 100%);
  max-width: 1080px;
  height: auto;
  transform: scale(var(--menu-book-scale, 1));
  transform-origin: center center;
  transition: transform 0.28s ease;
  will-change: transform;
}

:deep(.stf__parent),
:deep(.stf__wrapper) {
  margin-inline: auto;
}

:deep(.stf__wrapper) {
  filter: drop-shadow(0 24px 44px rgba(0, 0, 0, 0.24));
}

:deep(.stf__wrapper)::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 2.2%;
  transform: translateX(-50%);
  width: clamp(6px, 1vw, 12px);
  height: 95.6%;
  border-radius: 999px;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(0,0,0,0.42), rgba(216,166,70,0.08) 50%, rgba(0,0,0,0.42));
  opacity: 0.28;
  filter: blur(0.6px);
}

:deep(.stf__block),
:deep(.stf__item) {
  background: transparent !important;
  box-shadow: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.stf__item--left .page-inner-left) {
  padding-right: 4px;
}

:deep(.stf__item--right .page-inner-right) {
  padding-left: 4px;
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
  padding: 10px 2px 10px 10px;
}

.page-inner-right {
  padding: 10px 10px 10px 2px;
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
    radial-gradient(circle at 50% 0%, rgba(212, 164, 66, 0.055), transparent 26%),
    linear-gradient(180deg, #26272b 0%, #18191d 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.055),
    0 22px 54px rgba(0, 0, 0, 0.34);
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
  inset: clamp(14px, 2vw, 18px);
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
  width: min(140px, 28vw);
  height: min(140px, 28vw);
  top: 6%;
  right: 6%;
  background: rgba(212, 164, 66, 0.22);
}

.cover-orb-bottom {
  width: min(160px, 30vw);
  height: min(160px, 30vw);
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
  width: min(110px, 26vw);
  height: min(110px, 26vw);
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
  padding: clamp(28px, 5vw, 48px);
}

.cover-kicker,
.menu-kicker {
  color: #d2a34a;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  font-size: clamp(10px, 1vw, 12px);
  margin: 0 0 18px;
}

.cover-title {
  color: #f6f1e8;
  font-size: clamp(28px, 4.2vw, 60px);
  line-height: 1.04;
  margin: 0 0 18px;
  font-weight: 700;
  text-wrap: balance;
}

.cover-subtitle {
  color: rgba(255, 255, 255, 0.76);
  font-size: clamp(14px, 1.4vw, 18px);
  line-height: 1.8;
  max-width: 340px;
  margin: 0;
  text-wrap: balance;
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
  font-size: clamp(11px, 1vw, 13px);
}

.menu-surface {
  padding: clamp(18px, 3vw, 34px) clamp(14px, 2.4vw, 28px) clamp(16px, 2vw, 24px);
}

.menu-flourish {
  position: absolute;
  width: clamp(80px, 10vw, 120px);
  height: clamp(48px, 6vw, 72px);
  opacity: 0.1;
  pointer-events: none;
}

.menu-flourish-top {
  left: 18px;
  bottom: 44px;
  border-left: 2px solid rgba(255, 255, 255, 0.28);
  border-top: 2px solid rgba(255, 255, 255, 0.28);
  border-top-left-radius: 120px 72px;
}

.menu-flourish-bottom {
  right: 18px;
  bottom: 44px;
  border-right: 2px solid rgba(255, 255, 255, 0.28);
  border-top: 2px solid rgba(255, 255, 255, 0.28);
  border-top-right-radius: 120px 72px;
}

.menu-header {
  position: relative;
  z-index: 1;
  margin-bottom: clamp(14px, 2vw, 18px);
}

.menu-title {
  color: #f6f1e8;
  font-size: clamp(22px, 2.6vw, 32px);
  line-height: 1.08;
  margin: 0;
  font-weight: 700;
}

.menu-items {
  display: grid;
  gap: clamp(8px, 1.2vw, 10px);
}

.menu-item {
  display: flex;
  justify-content: space-between;
  gap: clamp(10px, 1.5vw, 18px);
  align-items: flex-start;
  padding: clamp(10px, 1.4vw, 12px) 0 clamp(12px, 1.8vw, 14px);
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
  font-size: clamp(14px, 1.5vw, 18px);
  margin: 0;
  font-weight: 700;
}

.item-badge {
  color: #e3be74;
  background: rgba(212, 164, 66, 0.08);
  border: 1px solid rgba(212, 164, 66, 0.24);
  border-radius: 999px;
  padding: 4px 10px;
  font-size: clamp(10px, .85vw, 11px);
  line-height: 1;
  white-space: nowrap;
}

.item-desc {
  color: rgba(255, 255, 255, 0.64);
  font-size: clamp(11px, 1.08vw, 14px);
  line-height: 1.62;
  margin: 0;
}

.item-price {
  color: #f7f2ea;
  font-size: clamp(14px, 1.45vw, 18px);
  min-width: clamp(50px, 5vw, 68px);
  text-align: right;
  padding-top: 2px;
}

.nav-arrow {
  width: clamp(44px, 5vw, 58px);
  height: clamp(44px, 5vw, 58px);
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(10, 10, 12, 0.52);
  color: white;
  font-size: clamp(28px, 3vw, 38px);
  line-height: 1;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.22s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 12px 26px rgba(0,0,0,0.2);
}

.nav-arrow:hover:not(:disabled),
.toolbar-btn:hover:not(:disabled) {
  border-color: rgba(212, 164, 66, 0.36);
  color: #d6af60;
  transform: translateY(-1px);
}

.nav-arrow:disabled,
.toolbar-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: clamp(6px, 1vw, 10px);
  background: rgba(243, 243, 243, 0.97);
  padding: clamp(8px, 1vw, 10px) clamp(10px, 1.2vw, 14px);
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
  max-width: calc(100vw - 24px);
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
}

.toolbar::-webkit-scrollbar { display: none; }

.toolbar-btn {
  width: clamp(36px, 4vw, 40px);
  height: clamp(36px, 4vw, 40px);
  border-radius: 12px;
  border: 1px solid rgba(18, 18, 18, 0.08);
  background: white;
  color: #555;
  cursor: pointer;
  font-size: clamp(18px, 1.8vw, 22px);
  transition: all 0.2s ease;
  flex: 0 0 auto;
}

.toolbar-btn-locale {
  font-size: clamp(14px, 1.2vw, 17px);
  font-weight: 700;
}

.toolbar-indicator {
  min-width: clamp(70px, 8vw, 96px);
  height: clamp(36px, 4vw, 40px);
  border-radius: 12px;
  border: 1px solid rgba(18, 18, 18, 0.06);
  background: #f7f7f7;
  color: #444;
  display: grid;
  place-items: center;
  font-size: clamp(14px, 1.4vw, 17px);
  padding: 0 10px;
  flex: 0 0 auto;
}

@media (max-width: 980px) {
  .viewer-shell {
    grid-template-columns: 1fr;
  }

  .nav-arrow {
    position: absolute;
    top: 50%;
    z-index: 5;
  }

  .nav-arrow-left { left: 0; transform: translateY(-50%); }
  .nav-arrow-right { right: 0; transform: translateY(-50%); }

  .book-frame {
    width: 100%;
    padding-inline: 34px;
  }

  :deep(.stf__wrapper)::after {
    opacity: 0.2;
  }
}

@media (max-width: 760px) {
  .menu-card-screen {
    padding-inline: 10px;
    padding-bottom: max(86px, calc(76px + env(safe-area-inset-bottom)));
  }

  .book-frame {
    padding-inline: 8px;
  }

  .page-inner-left,
  .page-inner-right {
    padding: 8px;
  }

  .cover-meta {
    gap: 8px;
  }

  .cover-meta span {
    padding: 8px 12px;
  }

  .menu-surface {
    padding: 18px 14px 14px;
  }

  .menu-flourish {
    opacity: 0.08;
  }

  .menu-item {
    gap: 10px;
  }

  .item-title-row {
    gap: 8px;
  }

  .toolbar {
    width: min(100%, 520px);
    justify-content: center;
    border-radius: 16px;
  }
}

@media (max-width: 560px) {
  .ambient-left,
  .ambient-right {
    display: none;
  }

  .nav-arrow {
    width: 42px;
    height: 42px;
    font-size: 26px;
    background: rgba(10, 10, 12, 0.62);
  }

  .nav-arrow-left { left: 2px; }
  .nav-arrow-right { right: 2px; }

  .book-frame {
    padding-inline: 0;
  }

  .toolbar {
    gap: 6px;
    padding: 8px;
  }

  .toolbar-btn:nth-child(1),
  .toolbar-btn:nth-child(2) {
    display: none;
  }

  .cover-kicker,
  .menu-kicker {
    letter-spacing: 0.18em;
  }
}
</style>
