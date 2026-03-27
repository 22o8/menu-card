<template>
  <section class="menu-card-screen" dir="ltr">
    <div class="menu-shell">
      <div class="book-frame" :class="{ 'book-frame-mobile': useStaticStack }">
        <div class="frame-glow"></div>
        <div class="frame-outline"></div>

        <div v-if="!useStaticStack && !fallbackMode" ref="bookRef" class="flip-book">
          <div
            v-for="page in menuPages"
            :key="`${locale}-${page.id}`"
            class="page js-page"
            :class="page.side === 'left' ? 'page-left' : 'page-right'"
          >
            <div class="page-inner" :class="page.side === 'left' ? 'page-inner-left' : 'page-inner-right'">
              <article class="menu-surface" :class="page.side === 'left' ? 'menu-surface-left' : 'menu-surface-right'">
                <div class="foil-outline"></div>
                <div class="menu-flourish menu-flourish-top"></div>
                <div class="menu-flourish menu-flourish-bottom"></div>

                <header class="menu-header">
                  <span class="menu-kicker">{{ currentUi.sectionsLabel }}</span>
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
            </div>
          </div>
        </div>

        <div v-else class="stack-view">
          <article
            v-for="page in menuPages"
            :key="`stack-${locale}-${page.id}`"
            class="stack-page"
          >
            <div class="foil-outline"></div>
            <div class="menu-flourish menu-flourish-top"></div>
            <div class="menu-flourish menu-flourish-bottom"></div>

            <header class="menu-header">
              <span class="menu-kicker">{{ currentUi.sectionsLabel }}</span>
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
        </div>

        <button
          v-if="!useStaticStack"
          class="nav-hit nav-hit-left"
          type="button"
          :disabled="atStart"
          aria-label="Previous"
          @click="prevPage"
        ></button>
        <button
          v-if="!useStaticStack"
          class="nav-hit nav-hit-right"
          type="button"
          :disabled="atEnd"
          aria-label="Next"
          @click="nextPage"
        ></button>
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

type MenuPage = {
  id: string
  side: 'left' | 'right'
  title: string
  items: Array<{ title: string; desc: string; price: string; badge?: string }>
}

const locale = ref<Locale>('ar')
const fallbackMode = ref(false)
const currentPage = ref(0)
const viewportWidth = ref(1280)
const bookRef = ref<HTMLElement | null>(null)

let pageFlip: PageFlipInstance | null = null
let resizeTimer: ReturnType<typeof setTimeout> | null = null

const isMobile = computed(() => viewportWidth.value < 900)
const useStaticStack = computed(() => isMobile.value || fallbackMode.value)

const uiMap = {
  ar: {
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

const currentUi = computed(() => uiMap[locale.value])

const menuPages = computed<MenuPage[]>(() => {
  const ui = currentUi.value
  return menuSpreads.flatMap((spread, index) => {
    const localizeBadge = (badge?: MenuBadge) => (badge ? ui.badges[badge] : undefined)

    return [
      {
        id: `spread-${index + 1}-left`,
        side: 'left' as const,
        title: ui.sections[spread.leftTitleKey as keyof typeof ui.sections],
        items: spread.leftItems.map((item) => ({
          title: locale.value === 'ar' ? item.nameAr : item.nameEn,
          desc: locale.value === 'ar' ? item.descAr : item.descEn,
          price: item.price,
          badge: localizeBadge(item.badge)
        }))
      },
      {
        id: `spread-${index + 1}-right`,
        side: 'right' as const,
        title: ui.sections[spread.rightTitleKey as keyof typeof ui.sections],
        items: spread.rightItems.map((item) => ({
          title: locale.value === 'ar' ? item.nameAr : item.nameEn,
          desc: locale.value === 'ar' ? item.descAr : item.descEn,
          price: item.price,
          badge: localizeBadge(item.badge)
        }))
      }
    ]
  })
})

const atStart = computed(() => currentPage.value <= 0)
const atEnd = computed(() => currentPage.value >= menuPages.value.length - 2)

function updateViewport() {
  if (!process.client) return
  viewportWidth.value = Math.round(window.visualViewport?.width || window.innerWidth || 1280)
}

function getFlipConfig() {
  return {
    width: 560,
    height: 860,
    minWidth: 420,
    maxWidth: 680,
    minHeight: 640,
    maxHeight: 920,
    usePortrait: false,
    swipeDistance: 16,
    flippingTime: 760,
    mobileScrollSupport: false,
    maxShadowOpacity: 0.32
  }
}

function syncState() {
  if (!pageFlip) return
  currentPage.value = pageFlip.getCurrentPageIndex?.() ?? 0
}

async function initFlipBook(targetIndex = 0) {
  if (!process.client) return

  if (pageFlip) {
    pageFlip.destroy()
    pageFlip = null
  }

  if (useStaticStack.value || !bookRef.value) {
    fallbackMode.value = false
    currentPage.value = 0
    return
  }

  await nextTick()

  try {
    const mod = await import('page-flip')
    const PageFlip = mod.PageFlip
    const container = bookRef.value
    if (!container) return

    const cfg = getFlipConfig()

    pageFlip = new PageFlip(container, {
      width: cfg.width,
      height: cfg.height,
      minWidth: cfg.minWidth,
      maxWidth: cfg.maxWidth,
      minHeight: cfg.minHeight,
      maxHeight: cfg.maxHeight,
      size: 'stretch',
      showCover: false,
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

    if (targetIndex > 0) {
      pageFlip.turnToPage(Math.min(targetIndex, Math.max(0, pageNodes.length - 2)))
    }

    await nextTick()
    syncState()
  } catch (error) {
    console.error('PageFlip init failed, using stacked view instead.', error)
    fallbackMode.value = true
  }
}

function nextPage() {
  if (useStaticStack.value || !pageFlip) return
  pageFlip.flipNext('top')
}

function prevPage() {
  if (useStaticStack.value || !pageFlip) return
  pageFlip.flipPrev('top')
}

function handleResize() {
  updateViewport()
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    void initFlipBook(currentPage.value)
  }, 180)
}

function handleKeydown(event: KeyboardEvent) {
  if (useStaticStack.value) return
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

watch(locale, async () => {
  if (process.client) localStorage.setItem('luxury-menu-locale', locale.value)
  await initFlipBook(currentPage.value)
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
  overflow-x: hidden;
  overflow-y: visible;
  background:
    radial-gradient(circle at 50% 0%, rgba(212, 166, 71, 0.22), transparent 24%),
    radial-gradient(circle at 0% 40%, rgba(255, 255, 255, 0.04), transparent 18%),
    radial-gradient(circle at 100% 40%, rgba(255, 255, 255, 0.04), transparent 18%),
    linear-gradient(180deg, #111217 0%, #0b0c10 55%, #06070a 100%);
  padding: 18px;
}

.menu-shell {
  width: min(1420px, 100%);
  margin: 0 auto;
}

.book-frame {
  position: relative;
  padding: 18px;
  border-radius: 34px;
  border: 1px solid rgba(255,255,255,0.08);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)),
    linear-gradient(180deg, rgba(12,13,18,0.98), rgba(9,10,14,0.99));
  box-shadow:
    0 24px 80px rgba(0,0,0,0.34),
    inset 0 1px 0 rgba(255,255,255,0.05);
  overflow: visible;
}

.book-frame-mobile {
  padding: 10px;
  border-radius: 26px;
}

.frame-glow {
  position: absolute;
  inset: auto 10% -26px 10%;
  height: 90px;
  background: radial-gradient(circle, rgba(213,162,64,0.18), transparent 70%);
  pointer-events: none;
  filter: blur(16px);
}

.frame-outline {
  position: absolute;
  inset: 12px;
  border-radius: 24px;
  border: 1px solid rgba(213,162,64,0.12);
  pointer-events: none;
}

.flip-book {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flip-book :deep(.stf__parent) {
  margin: 0 auto;
}

.flip-book :deep(.stf__wrapper) {
  margin: 0 auto;
}

.page {
  background: transparent;
}

.page-inner {
  height: 100%;
  display: flex;
}

.menu-surface,
.stack-page {
  width: 100%;
  min-height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  padding: 30px 26px 26px;
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,240,228,0.99));
  border: 1px solid rgba(196,173,127,0.42);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.62);
}

.menu-surface-left {
  box-shadow: inset -14px 0 28px rgba(0,0,0,0.06);
}

.menu-surface-right {
  box-shadow: inset 14px 0 28px rgba(0,0,0,0.06);
}

.stack-view {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.stack-page {
  min-height: 640px;
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

.item-badge {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(213,162,64,0.18);
  background: rgba(213,162,64,0.08);
  color: #b78618;
  font-size: 12px;
  font-weight: 700;
}

.nav-hit {
  position: absolute;
  top: 18px;
  bottom: 18px;
  width: 12%;
  min-width: 68px;
  border: 0;
  background: transparent;
  opacity: 0;
  z-index: 20;
}

.nav-hit:disabled {
  pointer-events: none;
}

.nav-hit-left {
  left: 18px;
}

.nav-hit-right {
  right: 18px;
}

@media (max-width: 1199px) {
  .menu-card-screen {
    padding: 14px;
  }

  .book-frame {
    padding: 14px;
  }

  .stack-page {
    min-height: 580px;
  }
}

@media (max-width: 899px) {
  .menu-card-screen {
    padding: 10px;
  }

  .menu-shell {
    width: 100%;
  }

  .book-frame,
  .book-frame-mobile {
    padding: 8px;
    border-radius: 22px;
  }

  .frame-outline {
    inset: 8px;
    border-radius: 16px;
  }

  .stack-view {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .stack-page {
    min-height: auto;
    padding: 24px 18px 20px;
    border-radius: 18px;
  }

  .menu-item {
    gap: 10px;
  }

  .item-title {
    font-size: 16px;
  }

  .item-desc {
    font-size: 13px;
    line-height: 1.7;
  }

  .item-price {
    font-size: 16px;
  }
}

@media (max-width: 520px) {
  .menu-card-screen {
    padding: 8px;
  }

  .book-frame,
  .book-frame-mobile {
    padding: 6px;
    border-radius: 18px;
  }

  .stack-page {
    padding: 22px 16px 18px;
  }

  .menu-title {
    font-size: 1.35rem;
  }

  .item-title-row {
    gap: 8px;
  }

  .item-badge {
    min-height: 30px;
    padding: 0 10px;
    font-size: 11px;
  }
}
</style>
