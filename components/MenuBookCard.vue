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
    width: 520,
    height: 720,
    minWidth: 320,
    maxWidth: 520,
    minHeight: 440,
    maxHeight: 720,
    size: 'stretch',
    showCover: true,
    usePortrait: false,
    startZIndex: 10,
    autoSize: true,
    maxShadowOpacity: 0.45,
    drawShadow: true,
    flippingTime: 950,
    mobileScrollSupport: false,
    swipeDistance: 18,
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
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 8%, rgba(212, 166, 71, 0.24), transparent 24%),
    radial-gradient(circle at 12% 50%, rgba(255, 255, 255, 0.04), transparent 20%),
    radial-gradient(circle at 88% 50%, rgba(255, 255, 255, 0.04), transparent 20%),
    linear-gradient(180deg, #111216 0%, #0a0b0f 55%, #07080b 100%);
  display: grid;
  place-items: center;
  padding: 28px 24px 96px;
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
  width: min(1280px, 100%);
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 72px;
  align-items: center;
  gap: 18px;
}

.viewer-center {
  display: grid;
  place-items: center;
  gap: 26px;
}

.book-frame {
  position: relative;
  width: min(1060px, 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.frame-glow {
  position: absolute;
  inset: auto 8% -36px 8%;
  height: 74px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.5), transparent 70%);
  filter: blur(18px);
  pointer-events: none;
}

.flip-book {
  width: min(1040px, 100%);
  max-width: 1040px;
  height: auto;
  transform: scale(var(--menu-book-scale, 1));
  transform-origin: center center;
  transition: transform 0.24s ease;
}

:deep(.stf__parent) {
  margin-inline: auto;
}

:deep(.stf__wrapper) {
  margin-inline: auto;
}

:deep(.stf__wrapper)::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 2%;
  transform: translateX(-50%);
  width: 14px;
  height: 96%;
  border-radius: 999px;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(0,0,0,0.5), rgba(216,166,70,0.12) 50%, rgba(0,0,0,0.5));
  opacity: 0.4;
  filter: blur(1px);
}

:deep(.stf__item) {
  background: transparent !important;
}

:deep(.stf__block) {
  box-shadow: none !important;
  margin: 0 !important;
}

:deep(.stf__item) {
  padding: 0 !important;
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
  padding: 14px 6px 14px 14px;
}

.page-inner-right {
  padding: 14px 14px 14px 6px;
}

.cover-surface,
.menu-surface {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.012)),
    linear-gradient(180deg, #26272b 0%, #18191d 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.05),
    0 24px 60px rgba(0, 0, 0, 0.34);
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
  inset: 18px;
  border: 1px solid rgba(208, 164, 72, 0.16);
  border-radius: 12px;
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
  width: 110px;
  height: 110px;
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
  margin: 0 0 18px;
}

.cover-title {
  color: #f6f1e8;
  font-size: 60px;
  line-height: 1.04;
  margin: 0 0 18px;
  font-weight: 700;
}

.cover-subtitle {
  color: rgba(255, 255, 255, 0.76);
  font-size: 18px;
  line-height: 1.85;
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
  padding: 34px 28px 24px;
}

.menu-flourish {
  position: absolute;
  width: 120px;
  height: 72px;
  opacity: 0.12;
  pointer-events: none;
}

.menu-flourish-top {
  left: 18px;
  bottom: 48px;
  border-left: 2px solid rgba(255, 255, 255, 0.32);
  border-top: 2px solid rgba(255, 255, 255, 0.32);
  border-top-left-radius: 120px 72px;
}

.menu-flourish-bottom {
  right: 18px;
  bottom: 48px;
  border-right: 2px solid rgba(255, 255, 255, 0.32);
  border-top: 2px solid rgba(255, 255, 255, 0.32);
  border-top-right-radius: 120px 72px;
}

.menu-header {
  position: relative;
  z-index: 1;
  margin-bottom: 18px;
}

.menu-title {
  color: #f6f1e8;
  font-size: 32px;
  line-height: 1.08;
  margin: 0;
  font-weight: 700;
}

.menu-items {
  display: grid;
  gap: 10px;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
  padding: 12px 0 14px;
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
  line-height: 1.65;
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
  width: 58px;
  height: 58px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(10, 10, 12, 0.48);
  color: white;
  font-size: 38px;
  line-height: 1;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.22s ease;
  backdrop-filter: blur(10px);
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
}

.toolbar-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
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
  min-width: 96px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid rgba(18, 18, 18, 0.06);
  background: #f7f7f7;
  color: #444;
  display: grid;
  place-items: center;
  font-size: 17px;
  padding: 0 10px;
}

@media (max-width: 1200px) {
  .viewer-shell {
    grid-template-columns: 58px minmax(0, 1fr) 58px;
    gap: 12px;
  }

  .cover-title {
    font-size: 48px;
  }
}

@media (max-width: 900px) {
  .menu-card-screen {
    padding-inline: 16px;
    padding-bottom: 108px;
  }

  .viewer-shell {
    grid-template-columns: 48px minmax(0, 1fr) 48px;
  }

  .nav-arrow {
    width: 48px;
    height: 48px;
    font-size: 30px;
  }

  .menu-surface {
    padding: 24px 18px 18px;
  }

  .menu-title {
    font-size: 24px;
  }

  .item-title {
    font-size: 15px;
  }

  .item-desc {
    font-size: 12px;
  }

  .item-price {
    font-size: 15px;
    min-width: 50px;
  }

  .cover-title {
    font-size: 38px;
  }

  .cover-subtitle {
    font-size: 15px;
  }

  .toolbar {
    gap: 6px;
    padding: 8px 10px;
  }

  .toolbar-btn,
  .toolbar-indicator {
    height: 36px;
  }

  .toolbar-btn {
    width: 36px;
    font-size: 18px;
  }

  .toolbar-indicator {
    min-width: 78px;
    font-size: 15px;
  }
}
</style>
