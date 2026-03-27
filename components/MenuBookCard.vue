<template>
  <section class="menu-book-screen" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <ClientOnly>
      <div class="menu-book-stage" :class="{ 'is-ready': bookReady, 'is-fallback': fallbackMode }">
        <div class="menu-book-shell">
          <div ref="bookRef" class="menu-book"></div>
        </div>

        <div ref="pagesRef" class="menu-book-pages-source" aria-hidden="true">
          <article class="menu-page menu-page--cover" data-density="hard">
            <div class="cover-page">
              <div class="cover-page__texture"></div>
              <div class="cover-page__shine"></div>
              <div class="cover-page__inner">
                <span class="cover-page__eyebrow">{{ coverLabels.eyebrow }}</span>
                <h1 class="cover-page__title">{{ coverLabels.title }}</h1>
                <p class="cover-page__subtitle">{{ coverLabels.subtitle }}</p>
                <div class="cover-page__seal">
                  <span>{{ coverLabels.sealTop }}</span>
                  <strong>{{ coverLabels.sealBottom }}</strong>
                </div>
              </div>
              <div class="cover-page__spine"></div>
            </div>
          </article>

          <article
            v-for="(page, index) in localizedPages"
            :key="page.id"
            class="menu-page"
            :class="page.side === 'left' ? 'menu-page--left' : 'menu-page--right'"
          >
            <div class="paper-page">
              <div class="paper-page__grain"></div>
              <div class="paper-page__shadow"></div>
              <div class="paper-page__corner paper-page__corner--top"></div>
              <div class="paper-page__corner paper-page__corner--bottom"></div>

              <header class="paper-page__header">
                <span class="paper-page__kicker">{{ labels.menu }}</span>
                <h2 class="paper-page__title">{{ page.title }}</h2>
                <span class="paper-page__folio">{{ index + 1 }}</span>
              </header>

              <div class="paper-list">
                <article
                  v-for="item in page.items"
                  :key="`${page.id}-${item.title}-${item.price}`"
                  class="paper-item"
                >
                  <div class="paper-item__main">
                    <div class="paper-item__topline">
                      <h3 class="paper-item__title">{{ item.title }}</h3>
                      <span v-if="item.badge" class="paper-item__badge">{{ item.badge }}</span>
                    </div>
                    <p class="paper-item__desc">{{ item.desc }}</p>
                  </div>
                  <strong class="paper-item__price">{{ item.price }}</strong>
                </article>
              </div>
            </div>
          </article>

          <article class="menu-page menu-page--back" data-density="hard">
            <div class="back-page">
              <div class="back-page__inner">
                <span>{{ coverLabels.backTop }}</span>
                <strong>{{ coverLabels.backBottom }}</strong>
              </div>
            </div>
          </article>
        </div>

        <div v-if="fallbackMode" class="menu-fallback-list">
          <article class="cover-page cover-page--fallback">
            <div class="cover-page__texture"></div>
            <div class="cover-page__shine"></div>
            <div class="cover-page__inner">
              <span class="cover-page__eyebrow">{{ coverLabels.eyebrow }}</span>
              <h1 class="cover-page__title">{{ coverLabels.title }}</h1>
              <p class="cover-page__subtitle">{{ coverLabels.subtitle }}</p>
              <div class="cover-page__seal">
                <span>{{ coverLabels.sealTop }}</span>
                <strong>{{ coverLabels.sealBottom }}</strong>
              </div>
            </div>
            <div class="cover-page__spine"></div>
          </article>

          <article
            v-for="(page, index) in localizedPages"
            :key="`fallback-${page.id}`"
            class="paper-page paper-page--fallback"
          >
            <header class="paper-page__header">
              <span class="paper-page__kicker">{{ labels.menu }}</span>
              <h2 class="paper-page__title">{{ page.title }}</h2>
              <span class="paper-page__folio">{{ index + 1 }}</span>
            </header>

            <div class="paper-list">
              <article
                v-for="item in page.items"
                :key="`fallback-${page.id}-${item.title}-${item.price}`"
                class="paper-item"
              >
                <div class="paper-item__main">
                  <div class="paper-item__topline">
                    <h3 class="paper-item__title">{{ item.title }}</h3>
                    <span v-if="item.badge" class="paper-item__badge">{{ item.badge }}</span>
                  </div>
                  <p class="paper-item__desc">{{ item.desc }}</p>
                </div>
                <strong class="paper-item__price">{{ item.price }}</strong>
              </article>
            </div>
          </article>
        </div>
      </div>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { menuSpreads } from '~/data/menu'

type Locale = 'ar' | 'en'
type MenuBadge = 'chef' | 'spicy' | 'new'
type SwipeSide = 'left' | 'right'

type UiShape = {
  menu: string
  badges: Record<MenuBadge, string>
  sections: Record<string, string>
  cover: {
    eyebrow: string
    title: string
    subtitle: string
    sealTop: string
    sealBottom: string
    backTop: string
    backBottom: string
  }
}

type MenuPage = {
  id: string
  title: string
  items: {
    title: string
    desc: string
    price: string
    badge?: string
  }[]
  side: SwipeSide
}

type PageFlipInstance = {
  destroy: () => void
  loadFromHTML: (items: HTMLElement[] | NodeListOf<HTMLElement>) => void
  updateFromHtml?: (items: HTMLElement[] | NodeListOf<HTMLElement>) => void
}

const locale = ref<Locale>('ar')
const bookRef = ref<HTMLElement | null>(null)
const pagesRef = ref<HTMLElement | null>(null)
const flipInstance = ref<PageFlipInstance | null>(null)
const bookReady = ref(false)
const fallbackMode = ref(false)

const uiMap: Record<Locale, UiShape> = {
  ar: {
    menu: 'المنيو',
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
      signature: 'الأطباق الخاصة'
    },
    cover: {
      eyebrow: 'قائمة طعام فاخرة',
      title: 'Luxury Menu',
      subtitle: 'اسحب الصفحة أو المس الحافة لتقليب دفتر المنيو بشكل واقعي.',
      sealTop: 'Premium',
      sealBottom: 'Dining',
      backTop: 'شكراً لزيارتكم',
      backBottom: 'نتمنى لكم تجربة مميزة'
    }
  },
  en: {
    menu: 'MENU',
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
    },
    cover: {
      eyebrow: 'Luxury Dining Collection',
      title: 'Luxury Menu',
      subtitle: 'Drag the page or tap the edge to turn the menu like a real book.',
      sealTop: 'Premium',
      sealBottom: 'Dining',
      backTop: 'Thank you for visiting',
      backBottom: 'We wish you a memorable meal'
    }
  }
}

const labels = computed(() => uiMap[locale.value])
const coverLabels = computed(() => uiMap[locale.value].cover)

const localizedPages = computed<MenuPage[]>(() => {
  const ui = uiMap[locale.value]

  return menuSpreads.flatMap((spread, spreadIndex) => {
    const mapItems = (items: typeof spread.leftItems) =>
      items.map((item) => ({
        title: locale.value === 'ar' ? item.nameAr : item.nameEn,
        desc: locale.value === 'ar' ? item.descAr : item.descEn,
        price: item.price,
        badge: item.badge ? ui.badges[item.badge as MenuBadge] : undefined
      }))

    return [
      {
        id: `spread-${spreadIndex + 1}-left`,
        title: ui.sections[spread.leftTitleKey] ?? spread.leftTitleKey,
        items: mapItems(spread.leftItems),
        side: 'left' as SwipeSide
      },
      {
        id: `spread-${spreadIndex + 1}-right`,
        title: ui.sections[spread.rightTitleKey] ?? spread.rightTitleKey,
        items: mapItems(spread.rightItems),
        side: 'right' as SwipeSide
      }
    ]
  })
})

async function destroyFlip() {
  flipInstance.value?.destroy()
  flipInstance.value = null
  bookReady.value = false
  if (bookRef.value) bookRef.value.innerHTML = ''
}

async function setupFlip() {
  if (typeof window === 'undefined') return

  await nextTick()
  await destroyFlip()

  if (!bookRef.value || !pagesRef.value) return

  try {
    const mod = await import('page-flip')
    const PageFlipCtor = mod.PageFlip
    const pageNodes = Array.from(pagesRef.value.querySelectorAll<HTMLElement>('.menu-page'))

    if (!pageNodes.length) {
      fallbackMode.value = true
      return
    }

    fallbackMode.value = false

    const instance = new PageFlipCtor(bookRef.value, {
      width: 430,
      height: 620,
      size: 'stretch',
      minWidth: 260,
      maxWidth: 520,
      minHeight: 380,
      maxHeight: 720,
      maxShadowOpacity: 0.45,
      showCover: true,
      mobileScrollSupport: false,
      useMouseEvents: true,
      swipeDistance: 24,
      clickEventForward: true,
      usePortrait: true,
      autoSize: true,
      drawShadow: true,
      startZIndex: 20,
      flippingTime: 950,
      startPage: 0
    }) as PageFlipInstance

    instance.loadFromHTML(pageNodes)
    flipInstance.value = instance
    bookReady.value = true
  } catch {
    fallbackMode.value = true
    bookReady.value = false
  }
}

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const queryLang = params.get('lang')
  const storedLang = localStorage.getItem('luxury-menu-locale')
  const nextLang = queryLang === 'en' || queryLang === 'ar'
    ? queryLang
    : storedLang === 'en' || storedLang === 'ar'
      ? storedLang
      : 'ar'

  locale.value = nextLang as Locale
  localStorage.setItem('luxury-menu-locale', locale.value)
  document.documentElement.lang = locale.value
  document.documentElement.dir = locale.value === 'ar' ? 'rtl' : 'ltr'

  await setupFlip()
})

watch(locale, async (value) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('luxury-menu-locale', value)
  document.documentElement.lang = value
  document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr'
  await setupFlip()
})

onBeforeUnmount(() => {
  destroyFlip()
})
</script>

<style scoped>
.menu-book-screen {
  min-height: 100vh;
  padding: clamp(10px, 2.2vw, 26px);
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at top, rgba(198, 144, 39, 0.16), transparent 28%),
    linear-gradient(180deg, #050608 0%, #06070b 100%);
  overflow: hidden;
}

.menu-book-stage {
  width: 100%;
  display: grid;
  place-items: center;
}

.menu-book-shell {
  width: min(100%, 1140px);
  position: relative;
  display: grid;
  place-items: center;
  filter: drop-shadow(0 26px 52px rgba(0, 0, 0, 0.5));
}

.menu-book {
  width: min(100%, 1020px);
  margin: 0 auto;
}

.menu-book-pages-source {
  position: absolute;
  inset: -9999px;
  opacity: 0;
  pointer-events: none;
}

.menu-page {
  background: transparent;
}

.cover-page,
.back-page,
.paper-page {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  overflow: hidden;
}

.cover-page {
  background:
    linear-gradient(135deg, rgba(23, 12, 7, 0.98) 0%, rgba(44, 24, 11, 0.98) 45%, rgba(14, 10, 10, 1) 100%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent);
  border: 1px solid rgba(214, 172, 84, 0.18);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.03),
    inset 0 0 70px rgba(0, 0, 0, 0.34),
    0 14px 36px rgba(0, 0, 0, 0.4);
}

.cover-page__texture,
.cover-page__shine,
.cover-page__spine,
.paper-page__grain,
.paper-page__shadow,
.paper-page__corner,
.back-page::before {
  position: absolute;
  pointer-events: none;
}

.cover-page__texture {
  inset: 0;
  background:
    radial-gradient(circle at 18% 20%, rgba(255, 219, 140, 0.08), transparent 22%),
    radial-gradient(circle at 78% 18%, rgba(255, 219, 140, 0.06), transparent 16%),
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.015) 0,
      rgba(255, 255, 255, 0.015) 1px,
      transparent 1px,
      transparent 6px
    );
}

.cover-page__shine {
  inset: 0;
  background: linear-gradient(112deg, transparent 0%, rgba(255, 255, 255, 0.08) 26%, transparent 42%);
  mix-blend-mode: screen;
}

.cover-page__spine {
  top: 0;
  bottom: 0;
  left: 0;
  width: 30px;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.36), rgba(255, 196, 84, 0.12), rgba(0, 0, 0, 0.28));
}

.cover-page__inner {
  position: relative;
  z-index: 1;
  height: 100%;
  padding: clamp(34px, 6vw, 64px) clamp(28px, 5vw, 52px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  text-align: center;
}

.cover-page__eyebrow {
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: rgba(241, 197, 96, 0.86);
  font-size: 0.72rem;
}

.cover-page__title {
  margin: 0;
  color: #f7e9c6;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 0.95;
  font-weight: 800;
}

.cover-page__subtitle {
  max-width: 28rem;
  margin: 0;
  color: rgba(243, 232, 214, 0.82);
  line-height: 1.8;
  font-size: clamp(0.96rem, 2vw, 1.08rem);
}

.cover-page__seal {
  min-width: 120px;
  padding: 14px 18px;
  border-radius: 999px;
  border: 1px solid rgba(231, 192, 105, 0.3);
  background: rgba(0, 0, 0, 0.22);
  color: #f0d389;
  display: grid;
  gap: 6px;
  justify-items: center;
  box-shadow: inset 0 0 16px rgba(255, 211, 132, 0.05);
}

.cover-page__seal span,
.back-page__inner span {
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.cover-page__seal strong,
.back-page__inner strong {
  font-size: 1rem;
  letter-spacing: 0.08em;
}

.back-page {
  border: 1px solid rgba(198, 159, 90, 0.18);
  background: linear-gradient(135deg, #170d09, #2a1d11 52%, #110c0b 100%);
  box-shadow: inset 0 0 46px rgba(0, 0, 0, 0.28);
}

.back-page::before {
  content: '';
  inset: 0;
  background: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.015) 0, rgba(255, 255, 255, 0.015) 1px, transparent 1px, transparent 6px);
}

.back-page__inner {
  position: relative;
  z-index: 1;
  height: 100%;
  display: grid;
  place-content: center;
  gap: 8px;
  color: #eed18f;
  text-align: center;
}

.paper-page {
  background: linear-gradient(180deg, #fcfaf2 0%, #f6f0e4 100%);
  border: 1px solid rgba(192, 165, 124, 0.34);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.56),
    inset 0 0 40px rgba(151, 124, 83, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.08);
}

.paper-page__grain {
  inset: 0;
  background:
    radial-gradient(circle at top right, rgba(190, 150, 96, 0.06), transparent 18%),
    repeating-linear-gradient(0deg, rgba(107, 87, 52, 0.024) 0, rgba(107, 87, 52, 0.024) 1px, transparent 1px, transparent 7px);
  opacity: 0.7;
}

.paper-page__shadow {
  top: 0;
  bottom: 0;
  width: 13%;
  opacity: 0.32;
}

.menu-page--left .paper-page__shadow {
  right: 0;
  background: linear-gradient(90deg, transparent, rgba(102, 78, 39, 0.14), rgba(46, 28, 15, 0.12));
}

.menu-page--right .paper-page__shadow {
  left: 0;
  background: linear-gradient(90deg, rgba(46, 28, 15, 0.12), rgba(102, 78, 39, 0.14), transparent);
}

.paper-page__corner {
  width: 92px;
  height: 92px;
  border: 1px solid rgba(213, 182, 126, 0.22);
  opacity: 0.55;
}

.paper-page__corner--top {
  top: -42px;
  right: -42px;
  border-radius: 50%;
}

.paper-page__corner--bottom {
  bottom: -54px;
  left: -54px;
  border-radius: 50%;
}

.paper-page__header {
  position: relative;
  z-index: 1;
  padding: clamp(26px, 4vw, 34px) clamp(20px, 4vw, 34px) 12px;
  display: grid;
  gap: 8px;
}

.paper-page__kicker {
  color: #c89526;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  font-size: 0.72rem;
  font-weight: 800;
}

.paper-page__title {
  margin: 0;
  color: #120c08;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1;
}

.paper-page__folio {
  position: absolute;
  inset-inline-end: clamp(20px, 4vw, 34px);
  top: clamp(24px, 4vw, 32px);
  color: rgba(124, 92, 42, 0.62);
  font-size: 0.9rem;
  font-weight: 700;
}

.paper-list {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 0;
  padding: 4px clamp(18px, 4vw, 32px) clamp(22px, 4vw, 30px);
}

.paper-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  align-items: start;
  padding: 18px 0;
  border-bottom: 1px dashed rgba(176, 148, 106, 0.2);
}

.paper-item:last-child {
  border-bottom: 0;
}

.paper-item__topline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.paper-item__title {
  margin: 0;
  color: #140e0a;
  font-size: clamp(1.05rem, 2.2vw, 1.52rem);
  font-weight: 800;
}

.paper-item__desc {
  margin: 8px 0 0;
  color: #816b4f;
  line-height: 1.7;
  font-size: clamp(0.9rem, 1.9vw, 1.02rem);
}

.paper-item__badge {
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid rgba(205, 171, 104, 0.3);
  color: #bb8d2f;
  background: rgba(232, 219, 186, 0.48);
  font-size: 0.73rem;
  font-weight: 700;
  white-space: nowrap;
}

.paper-item__price {
  align-self: center;
  min-width: 96px;
  padding: 10px 16px;
  border-radius: 18px;
  background: rgba(255, 251, 243, 0.84);
  border: 1px solid rgba(223, 205, 171, 0.8);
  text-align: center;
  color: #130d09;
  font-size: clamp(1.1rem, 2vw, 1.45rem);
  font-weight: 900;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.menu-fallback-list {
  width: min(100%, 880px);
  display: grid;
  gap: 16px;
}

.cover-page--fallback,
.paper-page--fallback {
  min-height: 540px;
}

:deep(.stf__parent) {
  margin: 0 auto;
}

:deep(.stf__wrapper) {
  margin: 0 auto;
}

:deep(.stf__block) {
  border-radius: 24px;
}

:deep(.stf__item) {
  overflow: visible !important;
}

:deep(.stf__itemShadow) {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.34), rgba(0, 0, 0, 0.04)) !important;
}

:deep(.stf__outerShadow) {
  background: radial-gradient(circle, rgba(0, 0, 0, 0.2), transparent 70%) !important;
}

@media (max-width: 920px) {
  .menu-book-screen {
    padding: 8px;
  }

  .menu-book-shell {
    width: 100%;
  }

  .menu-book {
    width: min(100%, 760px);
  }

  .paper-page__title {
    font-size: clamp(1.75rem, 6vw, 2.55rem);
  }

  .paper-item {
    gap: 12px;
  }

  .paper-item__price {
    min-width: 76px;
    padding: 8px 12px;
  }
}

@media (max-width: 640px) {
  .menu-book-screen {
    padding: 6px;
  }

  .cover-page__inner {
    padding: 28px 20px;
  }

  .paper-page__header {
    padding: 22px 18px 10px;
  }

  .paper-list {
    padding: 0 16px 18px;
  }

  .paper-item {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
    padding: 14px 0;
  }

  .paper-item__price {
    justify-self: start;
    min-width: 68px;
  }

  .cover-page--fallback,
  .paper-page--fallback {
    min-height: 440px;
  }
}
</style>
