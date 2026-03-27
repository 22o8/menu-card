<template>
  <section class="menu-card-screen" dir="ltr">
    <div class="ambient ambient-top"></div>
    <div class="ambient ambient-left"></div>
    <div class="ambient ambient-right"></div>

    <div class="menu-shell">
      <header class="hero-bar">
        <div class="brand-block">
          <span class="brand-mark">✦</span>
          <div>
            <p class="brand-kicker">{{ ui.brandKicker }}</p>
            <h1 class="brand-title">{{ ui.brandTitle }}</h1>
          </div>
        </div>

        <div class="hero-actions">
          <button class="hero-chip" type="button" @click="toggleLocale">
            {{ locale === 'ar' ? 'EN' : 'AR' }}
          </button>
          <button class="hero-chip" type="button" @click="resetZoom">
            {{ ui.reset }}
          </button>
        </div>
      </header>

      <div class="status-grid">
        <article class="status-card">
          <span class="status-label">{{ ui.experienceLabel }}</span>
          <strong>{{ fallbackMode ? ui.fallbackMode : ui.liveMode }}</strong>
        </article>
        <article class="status-card">
          <span class="status-label">{{ ui.pageLabel }}</span>
          <strong>{{ spreadIndicator }}</strong>
        </article>
        <article class="status-card">
          <span class="status-label">{{ ui.viewLabel }}</span>
          <strong>{{ isMobile ? ui.mobileView : isTablet ? ui.tabletView : ui.desktopView }}</strong>
        </article>
      </div>

      <div class="sections-scroller" aria-label="Sections">
        <button
          v-for="(spread, index) in menuSpreads"
          :key="`jump-${index}`"
          type="button"
          class="section-pill"
          :class="{ 'section-pill-active': currentSpread === index + 2 }"
          @click="jumpToSpread(index)"
        >
          <span>{{ getSectionLabel(spread.leftTitleKey) }}</span>
          <small>{{ getSectionLabel(spread.rightTitleKey) }}</small>
        </button>
      </div>

      <div class="viewer-shell" :class="{ 'viewer-shell-mobile': isMobile }">
        <button
          v-if="!isMobile"
          class="nav-arrow nav-arrow-left"
          type="button"
          :disabled="atStart"
          :aria-label="ui.prev"
          @click="prevPage"
        >
          <span>‹</span>
        </button>

        <div class="viewer-center">
          <div class="book-topbar">
            <div class="book-topbar-copy">
              <span class="eyebrow">{{ ui.topbarEyebrow }}</span>
              <strong>{{ ui.topbarTitle }}</strong>
            </div>
            <div class="topbar-actions">
              <button class="mini-btn" type="button" :disabled="atStart" @click="prevPage">{{ ui.prevShort }}</button>
              <button class="mini-btn" type="button" :disabled="atEnd" @click="nextPage">{{ ui.nextShort }}</button>
            </div>
          </div>

          <div class="book-frame" :class="{ 'book-frame-mobile': isMobile, 'book-frame-tablet': isTablet && !isMobile }">
            <div class="frame-glow"></div>
            <div class="frame-outline"></div>

            <div class="frame-badges">
              <span class="frame-badge">{{ ui.touchHint }}</span>
              <span class="frame-badge">{{ fallbackMode ? ui.safeRender : ui.bookMotion }}</span>
            </div>

            <div v-if="!fallbackMode" ref="bookRef" class="flip-book" :class="{ 'flip-book-mobile': isMobile }">
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
                          <h2 class="cover-title">{{ ui.coverTitle }}</h2>
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

            <div v-else class="fallback-view" :class="{ 'fallback-view-mobile': isMobile }">
              <div
                v-for="page in fallbackPages"
                :key="page.id"
                class="fallback-page"
              >
                <template v-if="page.type === 'cover'">
                  <div class="cover-surface cover-surface-right fallback-cover">
                    <div class="foil-outline"></div>
                    <div class="cover-content">
                      <p class="cover-kicker">{{ ui.kicker }}</p>
                      <h2 class="cover-title">{{ ui.coverTitle }}</h2>
                      <p class="cover-subtitle">{{ ui.coverSubtitle }}</p>
                      <div class="cover-meta">
                        <span>{{ ui.premiumDining }}</span>
                        <span>{{ ui.bookExperience }}</span>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <article class="menu-surface fallback-surface">
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

          <div class="toolbar" :class="{ 'toolbar-mobile': isMobile }">
            <button class="toolbar-btn" type="button" @click="zoomOut" :aria-label="ui.zoomOut">−</button>
            <div class="toolbar-indicator toolbar-indicator-compact">{{ zoomLabel }}</div>
            <button class="toolbar-btn" type="button" @click="zoomIn" :aria-label="ui.zoomIn">+</button>
            <button class="toolbar-btn toolbar-btn-wide" type="button" :disabled="atStart" @click="prevPage">{{ ui.prev }}</button>
            <div class="toolbar-indicator">{{ spreadIndicator }}</div>
            <button class="toolbar-btn toolbar-btn-wide" type="button" :disabled="atEnd" @click="nextPage">{{ ui.next }}</button>
            <button class="toolbar-btn toolbar-btn-locale" type="button" @click="toggleLocale">
              {{ locale === 'ar' ? 'EN' : 'AR' }}
            </button>
          </div>
        </div>

        <button
          v-if="!isMobile"
          class="nav-arrow nav-arrow-right"
          type="button"
          :disabled="atEnd"
          :aria-label="ui.next"
          @click="nextPage"
        >
          <span>›</span>
        </button>
      </div>
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
const fallbackMode = ref(false)
const currentPage = ref(0)
const currentSpread = ref(1)
const totalSpreads = ref(1)
const zoom = ref(1)
const viewportWidth = ref(1280)
const bookRef = ref<HTMLElement | null>(null)

let pageFlip: PageFlipInstance | null = null
let resizeTimer: ReturnType<typeof setTimeout> | null = null

const isMobile = computed(() => viewportWidth.value < 768)
const isTablet = computed(() => viewportWidth.value >= 768 && viewportWidth.value < 1180)

const uiMap = {
  ar: {
    brandKicker: 'QR MENU EXPERIENCE',
    brandTitle: 'Luxury Menu',
    reset: 'إعادة',
    experienceLabel: 'الحالة',
    liveMode: 'عرض تفاعلي',
    fallbackMode: 'عرض ثابت آمن',
    pageLabel: 'الانتقال',
    viewLabel: 'المشهد',
    mobileView: 'هاتف',
    tabletView: 'تابلت',
    desktopView: 'حاسبة',
    prev: 'السابق',
    next: 'التالي',
    prevShort: '←',
    nextShort: '→',
    topbarEyebrow: 'SMART MENU',
    topbarTitle: 'واجهة كتاب أنيقة وسريعة على كل الأجهزة',
    touchHint: 'اسحب أو استخدم الأزرار للتنقل',
    bookMotion: 'حركة صفحات ناعمة',
    safeRender: 'وضع احتياطي بدون انهيار',
    zoomIn: 'تكبير',
    zoomOut: 'تصغير',
    kicker: 'LUXURY DIGITAL MENU',
    coverTitle: 'قائمة الطعام',
    coverSubtitle: 'واجهة أكثر فخامة وتنظيم أفضل للهاتف والحاسبة بدون اختفاء العناصر.',
    premiumDining: 'هوية فاخرة',
    bookExperience: 'إحساس كتاب واقعي',
    sectionsLabel: 'المنيو',
    pageWord: 'صفحة',
    coverWord: 'الغلاف',
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
    brandKicker: 'QR MENU EXPERIENCE',
    brandTitle: 'Luxury Menu',
    reset: 'Reset',
    experienceLabel: 'Status',
    liveMode: 'Interactive View',
    fallbackMode: 'Safe Static View',
    pageLabel: 'Spread',
    viewLabel: 'Viewport',
    mobileView: 'Mobile',
    tabletView: 'Tablet',
    desktopView: 'Desktop',
    prev: 'Previous',
    next: 'Next',
    prevShort: '←',
    nextShort: '→',
    topbarEyebrow: 'SMART MENU',
    topbarTitle: 'Elegant book-style menu built for every screen',
    touchHint: 'Swipe or use the controls to move through the menu',
    bookMotion: 'Smooth page motion',
    safeRender: 'Protected fallback mode',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    kicker: 'LUXURY DIGITAL MENU',
    coverTitle: 'Menu Card',
    coverSubtitle: 'A more premium layout with better balance for phone and desktop without hidden content.',
    premiumDining: 'Premium Identity',
    bookExperience: 'Real Book Feel',
    sectionsLabel: 'MENU',
    pageWord: 'Page',
    coverWord: 'Cover',
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

function getSectionLabel(key: string) {
  return ui.value.sections[key as keyof typeof ui.value.sections] || key
}

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
const zoomLabel = computed(() => `${Math.round(zoom.value * 100)}%`)
const atStart = computed(() => currentPage.value <= 0)
const atEnd = computed(() => currentPage.value >= pages.value.length - 1)

const fallbackPages = computed<PageModel[]>(() => {
  if (currentSpread.value <= 1) {
    return [
      { id: 'fallback-cover', type: 'cover', side: 'right' }
    ]
  }

  const spreadIndex = Math.max(0, Math.min(menuSpreads.length - 1, currentSpread.value - 2))
  const left = pages.value[2 + spreadIndex * 2]
  const right = pages.value[3 + spreadIndex * 2]
  return [left, right].filter(Boolean) as PageModel[]
})

function updateViewport() {
  if (!process.client) return
  viewportWidth.value = Math.round(window.visualViewport?.width || window.innerWidth || 1280)
}

function getFlipConfig() {
  if (isMobile.value) {
    return {
      width: 360,
      height: 610,
      minWidth: 290,
      maxWidth: 420,
      minHeight: 500,
      maxHeight: 760,
      usePortrait: true,
      swipeDistance: 12,
      flippingTime: 620,
      mobileScrollSupport: true,
      maxShadowOpacity: 0.24,
      flipCorner: 'bottom' as const
    }
  }

  if (isTablet.value) {
    return {
      width: 430,
      height: 690,
      minWidth: 340,
      maxWidth: 490,
      minHeight: 540,
      maxHeight: 780,
      usePortrait: false,
      swipeDistance: 18,
      flippingTime: 760,
      mobileScrollSupport: true,
      maxShadowOpacity: 0.3,
      flipCorner: 'top' as const
    }
  }

  return {
    width: 520,
    height: 760,
    minWidth: 360,
    maxWidth: 560,
    minHeight: 560,
    maxHeight: 820,
    usePortrait: false,
    swipeDistance: 22,
    flippingTime: 880,
    mobileScrollSupport: false,
    maxShadowOpacity: 0.38,
    flipCorner: 'top' as const
  }
}

function syncState() {
  if (!pageFlip) return
  currentPage.value = pageFlip.getCurrentPageIndex?.() ?? 0
  const divider = isMobile.value ? 1 : 2
  const rawSpread = Math.floor(currentPage.value / divider) + 1
  currentSpread.value = Math.min(rawSpread, totalSpreads.value)
}

async function initFlipBook(targetIndex = 0) {
  if (!process.client || !bookRef.value) return

  ready.value = false
  fallbackMode.value = false

  if (pageFlip) {
    pageFlip.destroy()
    pageFlip = null
  }

  await nextTick()

  try {
    const mod = await import('page-flip')
    const PageFlip = mod.PageFlip
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

    totalSpreads.value = Math.max(1, Math.ceil(pageNodes.length / (isMobile.value ? 1 : 2)))

    pageFlip.on('flip', syncState)
    pageFlip.on('changeState', syncState)

    if (targetIndex > 0) {
      pageFlip.turnToPage(Math.min(targetIndex, pageNodes.length - 1))
    }

    await nextTick()
    applyZoom()
    syncState()
  } catch (error) {
    console.error('PageFlip init failed, using fallback view instead.', error)
    fallbackMode.value = true
    totalSpreads.value = Math.max(1, menuSpreads.length + 1)
    currentPage.value = Math.max(0, targetIndex)
    currentSpread.value = Math.min(totalSpreads.value, Math.floor(targetIndex / (isMobile.value ? 1 : 2)) + 1)
  } finally {
    ready.value = true
  }
}

function nextPage() {
  if (fallbackMode.value) {
    const max = totalSpreads.value
    currentSpread.value = Math.min(max, currentSpread.value + 1)
    currentPage.value = isMobile.value ? currentSpread.value - 1 : (currentSpread.value - 1) * 2
    return
  }

  if (!pageFlip) return
  pageFlip.flipNext(getFlipConfig().flipCorner)
}

function prevPage() {
  if (fallbackMode.value) {
    currentSpread.value = Math.max(1, currentSpread.value - 1)
    currentPage.value = isMobile.value ? currentSpread.value - 1 : (currentSpread.value - 1) * 2
    return
  }

  if (!pageFlip) return
  pageFlip.flipPrev(getFlipConfig().flipCorner)
}

function jumpToSpread(index: number) {
  const spread = index + 2
  if (fallbackMode.value) {
    currentSpread.value = Math.min(totalSpreads.value, Math.max(1, spread))
    currentPage.value = isMobile.value ? currentSpread.value - 1 : (currentSpread.value - 1) * 2
    return
  }

  if (!pageFlip) return
  const targetPage = isMobile.value ? spread - 1 : spread * 2 - 2
  pageFlip.turnToPage(Math.min(targetPage, pages.value.length - 1))
  syncState()
}

function applyZoom() {
  if (!bookRef.value) return
  bookRef.value.style.setProperty('--menu-book-scale', String(zoom.value))
}

function zoomIn() {
  const maxZoom = isMobile.value ? 1.03 : 1.08
  zoom.value = Math.min(maxZoom, +(zoom.value + 0.02).toFixed(2))
  applyZoom()
}

function zoomOut() {
  const minZoom = isMobile.value ? 0.97 : 0.92
  zoom.value = Math.max(minZoom, +(zoom.value - 0.02).toFixed(2))
  applyZoom()
}

function resetZoom() {
  zoom.value = 1
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

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') nextPage()
  if (event.key === 'ArrowLeft') prevPage()
}

onMounted(async () => {
  const storedLocale = localStorage.getItem('luxury-menu-locale') as Locale | null
  if (storedLocale === 'ar' || storedLocale === 'en') locale.value = storedLocale

  updateViewport()
  window.addEventListener('resize', handleResize, { passive: true })
  window.visualViewport?.addEventListener?.('resize', handleResize, { passive: true })
  window.addEventListener('keydown', handleKeydown)
  await initFlipBook(0)
})

watch(locale, async (value) => {
  if (process.client) localStorage.setItem('luxury-menu-locale', value)
  const keepPage = currentPage.value
  await initFlipBook(keepPage)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  window.visualViewport?.removeEventListener?.('resize', handleResize)
  window.removeEventListener('keydown', handleKeydown)
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
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 0%, rgba(212, 166, 71, 0.24), transparent 25%),
    radial-gradient(circle at 5% 55%, rgba(255, 255, 255, 0.05), transparent 20%),
    radial-gradient(circle at 95% 40%, rgba(255, 255, 255, 0.05), transparent 18%),
    linear-gradient(180deg, #111217 0%, #0b0c10 55%, #06070a 100%);
  padding: 22px;
}

.menu-shell {
  position: relative;
  z-index: 1;
  width: min(1480px, 100%);
  margin: 0 auto;
}

.ambient {
  position: absolute;
  pointer-events: none;
  filter: blur(70px);
  opacity: 0.52;
}

.ambient-top {
  width: 360px;
  height: 150px;
  top: 2%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(199, 150, 26, 0.34);
}

.ambient-left,
.ambient-right {
  width: 220px;
  height: 320px;
  top: 24%;
  background: rgba(255, 255, 255, 0.05);
}

.ambient-left { left: -1%; }
.ambient-right { right: -1%; }

.hero-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 20px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(14px);
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.brand-mark {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #d5a240;
  font-size: 24px;
  border: 1px solid rgba(213, 162, 64, 0.28);
  background: linear-gradient(180deg, rgba(213,162,64,0.16), rgba(213,162,64,0.05));
  flex-shrink: 0;
}

.brand-kicker {
  margin: 0 0 4px;
  color: rgba(255,255,255,0.6);
  font-size: 12px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.brand-title {
  margin: 0;
  color: #fff;
  font-size: clamp(1.3rem, 2vw, 2rem);
  line-height: 1.1;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.hero-chip,
.mini-btn,
.toolbar-btn,
.nav-arrow,
.section-pill {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  transition: transform 0.22s ease, background 0.22s ease, border-color 0.22s ease, opacity 0.22s ease;
}

.hero-chip {
  min-width: 84px;
  height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  font-weight: 700;
}

.hero-chip:hover,
.mini-btn:hover,
.toolbar-btn:hover,
.nav-arrow:hover,
.section-pill:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.11);
  border-color: rgba(213, 162, 64, 0.34);
}

.status-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.status-card {
  padding: 16px 18px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03));
  min-width: 0;
}

.status-label {
  display: block;
  color: rgba(255,255,255,0.58);
  font-size: 12px;
  margin-bottom: 8px;
}

.status-card strong {
  display: block;
  color: #fff;
  font-size: clamp(0.95rem, 1.5vw, 1.08rem);
}

.sections-scroller {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}

.sections-scroller::-webkit-scrollbar {
  display: none;
}

.section-pill {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 2px;
  min-width: 148px;
  min-height: 62px;
  padding: 12px 16px;
  border-radius: 18px;
}

.section-pill span {
  font-size: 15px;
  font-weight: 700;
}

.section-pill small {
  font-size: 12px;
  color: rgba(255,255,255,0.62);
}

.section-pill-active {
  background: linear-gradient(180deg, rgba(213,162,64,0.24), rgba(213,162,64,0.1));
  border-color: rgba(213, 162, 64, 0.36);
}

.viewer-shell {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr) 82px;
  gap: 14px;
  align-items: stretch;
}

.viewer-center {
  min-width: 0;
}

.book-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 18px;
  margin-bottom: 12px;
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.05);
}

.book-topbar-copy {
  min-width: 0;
}

.eyebrow {
  display: block;
  color: rgba(213,162,64,0.86);
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.book-topbar-copy strong {
  color: #fff;
  font-size: clamp(0.95rem, 1.5vw, 1.1rem);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mini-btn {
  min-width: 54px;
  height: 38px;
  border-radius: 999px;
  padding: 0 14px;
  font-weight: 800;
}

.book-frame {
  position: relative;
  padding: 22px;
  border-radius: 34px;
  border: 1px solid rgba(255,255,255,0.08);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)),
    linear-gradient(180deg, rgba(12,13,18,0.96), rgba(9,10,14,0.98));
  box-shadow:
    0 24px 80px rgba(0,0,0,0.34),
    inset 0 1px 0 rgba(255,255,255,0.05);
  overflow: hidden;
}

.frame-glow {
  position: absolute;
  inset: auto 10% -30px 10%;
  height: 100px;
  background: radial-gradient(circle, rgba(213,162,64,0.18), transparent 70%);
  pointer-events: none;
  filter: blur(14px);
}

.frame-outline {
  position: absolute;
  inset: 14px;
  border-radius: 24px;
  border: 1px solid rgba(213,162,64,0.12);
  pointer-events: none;
}

.frame-badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.frame-badge {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  font-size: 12px;
  color: rgba(255,255,255,0.84);
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.05);
}

.flip-book {
  --menu-book-scale: 1;
  transform: scale(var(--menu-book-scale));
  transform-origin: center top;
  transition: transform 0.22s ease;
  display: flex;
  justify-content: center;
}

.flip-book :deep(.stf__parent) {
  margin: 0 auto;
}

.page {
  background: transparent;
}

.page-inner,
.fallback-page {
  height: 100%;
  display: flex;
}

.cover-surface,
.menu-surface,
.fallback-page {
  width: 100%;
  min-height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
}

.cover-surface {
  background:
    radial-gradient(circle at 50% 20%, rgba(213,162,64,0.16), transparent 30%),
    linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)),
    #17191f;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
}

.cover-surface-left::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 28px;
  background: linear-gradient(90deg, rgba(255,255,255,0.02), rgba(0,0,0,0.3));
}

.cover-surface-right {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.cover-noise {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 12px 12px;
  opacity: 0.12;
}

.cover-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(10px);
  background: rgba(213,162,64,0.14);
}

.cover-orb-top {
  width: 140px;
  height: 140px;
  top: -20px;
  right: -10px;
}

.cover-orb-bottom {
  width: 170px;
  height: 170px;
  bottom: -40px;
  left: -30px;
}

.cover-spine-mark {
  position: absolute;
  left: 22px;
  top: 22px;
  bottom: 22px;
  width: 8px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(213,162,64,0.6), rgba(213,162,64,0.12));
}

.cover-content {
  position: relative;
  z-index: 1;
  max-width: 360px;
  text-align: center;
}

.cover-kicker {
  margin: 0 0 12px;
  color: rgba(213,162,64,0.9);
  letter-spacing: 0.28em;
  font-size: 12px;
  text-transform: uppercase;
}

.cover-title {
  margin: 0;
  color: #fff;
  font-size: clamp(2rem, 3vw, 3.4rem);
  line-height: 1.05;
}

.cover-subtitle {
  margin: 14px auto 0;
  color: rgba(255,255,255,0.72);
  line-height: 1.8;
  max-width: 32ch;
  font-size: 15px;
}

.cover-meta {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.cover-meta span,
.item-badge {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(213,162,64,0.18);
  background: rgba(213,162,64,0.08);
  color: #f0cb7b;
  font-size: 12px;
  font-weight: 700;
}

.menu-surface,
.fallback-surface {
  padding: 28px 24px 24px;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.97), rgba(247,240,228,0.98));
  border: 1px solid rgba(196,173,127,0.42);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.62);
}

.menu-surface-left {
  box-shadow: inset -14px 0 28px rgba(0,0,0,0.06);
}

.menu-surface-right {
  box-shadow: inset 14px 0 28px rgba(0,0,0,0.06);
}

.foil-outline {
  position: absolute;
  inset: 14px;
  border-radius: 16px;
  border: 1px solid rgba(208, 172, 97, 0.26);
  pointer-events: none;
}

.menu-flourish {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 999px;
  border: 1px solid rgba(213,162,64,0.1);
}

.menu-flourish-top {
  top: -76px;
  right: -54px;
}

.menu-flourish-bottom {
  bottom: -86px;
  left: -64px;
}

.menu-header {
  position: relative;
  z-index: 1;
  margin-bottom: 18px;
}

.menu-kicker {
  display: inline-block;
  margin-bottom: 8px;
  color: #9a7a3e;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.menu-title {
  margin: 0;
  color: #171717;
  font-size: clamp(1.45rem, 2vw, 2rem);
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.menu-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: flex-start;
  padding: 14px 0;
  border-bottom: 1px dashed rgba(72, 57, 32, 0.16);
}

.menu-item:last-child {
  border-bottom: 0;
}

.menu-copy {
  min-width: 0;
}

.item-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.item-title {
  margin: 0;
  color: #141414;
  font-size: 17px;
}

.item-desc {
  margin: 7px 0 0;
  color: #5e5548;
  line-height: 1.75;
  font-size: 13.5px;
}

.item-price {
  color: #0f0f0f;
  font-size: 18px;
  font-weight: 900;
  white-space: nowrap;
}

.fallback-view {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.fallback-page {
  min-height: 640px;
}

.fallback-cover {
  min-height: 640px;
}

.nav-arrow {
  align-self: center;
  width: 70px;
  height: 70px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 40px;
  backdrop-filter: blur(10px);
}

.nav-arrow span {
  transform: translateY(-1px);
}

.toolbar {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px;
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.05);
}

.toolbar-btn {
  min-width: 46px;
  height: 46px;
  padding: 0 16px;
  border-radius: 14px;
  font-size: 18px;
  font-weight: 800;
}

.toolbar-btn-wide {
  min-width: 110px;
  font-size: 14px;
}

.toolbar-btn-locale {
  min-width: 72px;
}

.toolbar-indicator {
  min-width: 120px;
  height: 46px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  color: #fff;
  font-weight: 800;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.08);
}

.toolbar-indicator-compact {
  min-width: 88px;
}

.hero-chip:disabled,
.mini-btn:disabled,
.toolbar-btn:disabled,
.nav-arrow:disabled {
  opacity: 0.38;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 1180px) {
  .viewer-shell {
    grid-template-columns: 66px minmax(0, 1fr) 66px;
  }

  .book-frame {
    padding: 18px;
  }
}

@media (max-width: 900px) {
  .status-grid {
    grid-template-columns: 1fr;
  }

  .book-topbar {
    flex-direction: column;
    align-items: stretch;
  }

  .topbar-actions {
    justify-content: flex-end;
  }

  .fallback-view {
    grid-template-columns: 1fr;
  }

  .fallback-page,
  .fallback-cover {
    min-height: 560px;
  }
}

@media (max-width: 767px) {
  .menu-card-screen {
    padding: 14px;
  }

  .hero-bar {
    padding: 16px;
    border-radius: 24px;
    flex-direction: column;
    align-items: stretch;
  }

  .hero-actions {
    justify-content: space-between;
  }

  .viewer-shell,
  .viewer-shell-mobile {
    grid-template-columns: 1fr;
  }

  .book-frame {
    padding: 14px;
    border-radius: 26px;
  }

  .frame-outline {
    inset: 10px;
    border-radius: 18px;
  }

  .menu-surface,
  .fallback-surface,
  .cover-surface-right {
    padding: 22px 18px 20px;
  }

  .menu-item {
    gap: 10px;
  }

  .item-title {
    font-size: 16px;
  }

  .item-desc {
    font-size: 13px;
  }

  .item-price {
    font-size: 16px;
  }

  .toolbar {
    padding: 12px;
    gap: 8px;
  }

  .toolbar-mobile .toolbar-btn-wide {
    min-width: calc(50% - 4px);
    flex: 1 1 calc(50% - 4px);
  }

  .toolbar-mobile .toolbar-indicator {
    flex: 1 1 calc(50% - 4px);
    min-width: calc(50% - 4px);
  }

  .fallback-page,
  .fallback-cover {
    min-height: 480px;
  }
}

@media (max-width: 520px) {
  .brand-mark {
    width: 46px;
    height: 46px;
    border-radius: 14px;
  }

  .brand-kicker {
    letter-spacing: 0.18em;
  }

  .section-pill {
    min-width: 136px;
    min-height: 58px;
    padding: 10px 14px;
  }

  .cover-title {
    font-size: 1.9rem;
  }

  .cover-subtitle {
    font-size: 14px;
  }

  .toolbar-indicator,
  .toolbar-btn-wide {
    min-width: 100%;
    flex: 1 1 100%;
  }

  .toolbar-indicator-compact,
  .toolbar-btn,
  .toolbar-btn-locale {
    min-width: calc(33.333% - 6px);
    flex: 1 1 calc(33.333% - 6px);
  }
}
</style>
