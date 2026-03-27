<template>
  <section class="menu-book-screen" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <ClientOnly>
      <div class="menu-book-stage">
        <div class="menu-book-shell" :class="{ 'is-ready': bookReady }">
          <button
            class="book-arrow book-arrow--prev"
            type="button"
            :aria-label="labels.prev"
            @click="prevPage"
          >
            <span>‹</span>
          </button>

          <div class="menu-book-center">
            <div ref="bookRef" class="menu-book"></div>
          </div>

          <button
            class="book-arrow book-arrow--next"
            type="button"
            :aria-label="labels.next"
            @click="nextPage"
          >
            <span>›</span>
          </button>
        </div>

        <div ref="pagesRef" class="menu-book-pages-source" aria-hidden="true">
          <article class="menu-page menu-page--cover" data-density="hard">
            <div class="cover-page">
              <div class="cover-page__texture"></div>
              <div class="cover-page__shine"></div>
              <div class="cover-page__spine"></div>
              <div class="cover-page__edge"></div>
              <div class="cover-page__inner">
                <span class="cover-page__eyebrow">{{ coverLabels.eyebrow }}</span>
                <h1 class="cover-page__title">{{ coverLabels.title }}</h1>
                <p class="cover-page__subtitle">{{ coverLabels.subtitle }}</p>
              </div>
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
              <div class="paper-page__fold"></div>
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

        <div v-if="fallbackMode" class="menu-fallback-shell">
          <article class="cover-page cover-page--fallback">
            <div class="cover-page__texture"></div>
            <div class="cover-page__shine"></div>
            <div class="cover-page__spine"></div>
            <div class="cover-page__edge"></div>
            <div class="cover-page__inner">
              <span class="cover-page__eyebrow">{{ coverLabels.eyebrow }}</span>
              <h1 class="cover-page__title">{{ coverLabels.title }}</h1>
              <p class="cover-page__subtitle">{{ coverLabels.subtitle }}</p>
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
  prev: string
  next: string
  badges: Record<MenuBadge, string>
  sections: Record<string, string>
  cover: {
    eyebrow: string
    title: string
    subtitle: string
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
  flipNext?: (corner?: 'top' | 'bottom') => void
  flipPrev?: (corner?: 'top' | 'bottom') => void
  turnToNextPage?: () => void
  turnToPrevPage?: () => void
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
    prev: 'الصفحة السابقة',
    next: 'الصفحة التالية',
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
      subtitle: 'اسحب الصفحة أو استخدم الأسهم لتقليب المنيو بإحساس كتاب حقيقي.',
      backTop: 'شكراً لزيارتكم',
      backBottom: 'نتمنى لكم تجربة مميزة'
    }
  },
  en: {
    menu: 'MENU',
    prev: 'Previous page',
    next: 'Next page',
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
      subtitle: 'Drag the page or use the arrows to turn the menu like a real book.',
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

function updateDocumentLang(value: Locale) {
  document.documentElement.lang = value
  document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr'
}

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
      width: 420,
      height: 620,
      size: 'stretch',
      minWidth: 250,
      maxWidth: 470,
      minHeight: 360,
      maxHeight: 690,
      showCover: true,
      usePortrait: true,
      autoSize: false,
      maxShadowOpacity: 0.45,
      mobileScrollSupport: false,
      useMouseEvents: true,
      swipeDistance: 18,
      clickEventForward: true,
      drawShadow: true,
      startZIndex: 10,
      flippingTime: 900
    }) as PageFlipInstance

    instance.loadFromHTML(pageNodes)
    flipInstance.value = instance
    bookReady.value = true
  } catch (error) {
    console.error(error)
    fallbackMode.value = true
    bookReady.value = false
  }
}

function nextPage() {
  const instance = flipInstance.value
  if (!instance) return
  if (typeof instance.flipNext === 'function') {
    instance.flipNext('top')
    return
  }
  instance.turnToNextPage?.()
}

function prevPage() {
  const instance = flipInstance.value
  if (!instance) return
  if (typeof instance.flipPrev === 'function') {
    instance.flipPrev('top')
    return
  }
  instance.turnToPrevPage?.()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') {
    locale.value === 'ar' ? prevPage() : nextPage()
  }
  if (event.key === 'ArrowLeft') {
    locale.value === 'ar' ? nextPage() : prevPage()
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
  updateDocumentLang(locale.value)
  window.addEventListener('keydown', onKeydown)
  await setupFlip()
})

watch(locale, async (value) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('luxury-menu-locale', value)
  updateDocumentLang(value)
  await setupFlip()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  destroyFlip()
})
</script>

<style scoped>
.menu-book-screen {
  min-height: 100vh;
  min-height: 100svh;
  height: 100vh;
  height: 100svh;
  padding: clamp(10px, 1.6vw, 20px);
  display: grid;
  place-items: center;
  overflow: hidden;
  background:
    radial-gradient(circle at top center, rgba(200, 145, 41, 0.16), transparent 22%),
    radial-gradient(circle at center, rgba(255, 255, 255, 0.035), transparent 34%),
    linear-gradient(180deg, #0d0b0a 0%, #060608 100%);
}

.menu-book-stage {
  width: min(100%, 1360px);
  height: 100%;
  display: grid;
  place-items: center;
}

.menu-book-shell {
  position: relative;
  width: 100%;
  height: min(100%, 920px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-book-center {
  width: min(100%, 1120px);
  height: min(100%, 820px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.menu-book {
  width: min(100%, 1040px);
  height: min(100%, 820px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  filter: drop-shadow(0 34px 80px rgba(0, 0, 0, 0.52));
}

.menu-book-pages-source {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
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
  border-radius: 20px;
  overflow: hidden;
}

.cover-page {
  background:
    linear-gradient(90deg, rgba(0, 0, 0, 0.34), rgba(255, 211, 128, 0.08) 10%, rgba(34, 17, 9, 0.82) 22%, rgba(70, 34, 13, 0.96) 52%, rgba(16, 9, 7, 0.98) 100%),
    linear-gradient(180deg, rgba(255,255,255,0.04), transparent 26%);
  border: 1px solid rgba(214, 172, 84, 0.18);
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.03),
    inset -18px 0 30px rgba(0,0,0,0.36),
    inset 0 0 80px rgba(0,0,0,0.24);
}

.cover-page__texture,
.cover-page__shine,
.cover-page__spine,
.cover-page__edge,
.paper-page__grain,
.paper-page__fold,
.paper-page__corner,
.back-page::before {
  position: absolute;
  pointer-events: none;
}

.cover-page__texture {
  inset: 0;
  background:
    radial-gradient(circle at 18% 18%, rgba(255, 222, 155, 0.09), transparent 18%),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.014) 0, rgba(255,255,255,0.014) 1px, transparent 1px, transparent 5px);
}

.cover-page__shine {
  inset: 0;
  background: linear-gradient(112deg, transparent 0%, rgba(255,255,255,0.08) 24%, transparent 42%);
  mix-blend-mode: screen;
}

.cover-page__spine {
  top: 0;
  bottom: 0;
  left: 0;
  width: 34px;
  background: linear-gradient(90deg, rgba(0,0,0,0.42), rgba(255, 205, 120, 0.14), rgba(0,0,0,0.28));
}

.cover-page__edge {
  top: 14px;
  right: 0;
  bottom: 14px;
  width: 18px;
  border-radius: 14px 0 0 14px;
  background: linear-gradient(180deg, rgba(255, 216, 146, 0.5), rgba(111, 70, 18, 0.6), rgba(255, 216, 146, 0.4));
}

.cover-page__inner,
.back-page__inner {
  position: relative;
  z-index: 1;
  height: 100%;
  padding: clamp(34px, 5vw, 62px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  text-align: center;
}

.cover-page__eyebrow,
.back-page__inner span {
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: rgba(241, 197, 96, 0.88);
  font-size: 0.76rem;
}

.cover-page__title {
  margin: 0;
  color: #f7e9c6;
  font-size: clamp(2.2rem, 5.6vw, 4.2rem);
  line-height: 0.96;
  font-weight: 800;
}

.cover-page__subtitle,
.back-page__inner strong {
  margin: 0;
  max-width: 30rem;
  color: rgba(243, 232, 214, 0.84);
  line-height: 1.8;
  font-size: clamp(0.98rem, 2vw, 1.12rem);
}

.back-page {
  border: 1px solid rgba(198, 159, 90, 0.18);
  background: linear-gradient(135deg, #170d09, #2a1d11 52%, #110c0b 100%);
  box-shadow: inset 0 0 46px rgba(0, 0, 0, 0.28);
}

.back-page::before {
  inset: 0;
  background: linear-gradient(112deg, transparent, rgba(255,255,255,0.06) 36%, transparent 58%);
}

.paper-page {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.48), rgba(255,255,255,0) 12%),
    linear-gradient(90deg, #f7f1e6 0%, #f0e8db 48%, #ede2d1 100%);
  border: 1px solid rgba(164, 138, 94, 0.18);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.22);
  color: #17120d;
}

.paper-page__grain {
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(134, 103, 46, 0.05), transparent 18%),
    radial-gradient(circle at 80% 30%, rgba(134, 103, 46, 0.03), transparent 14%),
    repeating-linear-gradient(180deg, rgba(70, 47, 21, 0.018) 0, rgba(70, 47, 21, 0.018) 1px, transparent 1px, transparent 34px);
}

.paper-page__fold {
  top: 0;
  bottom: 0;
  width: 16%;
  background: linear-gradient(90deg, rgba(255,255,255,0.34), rgba(143, 116, 70, 0.07), transparent 72%);
}

.menu-page--left .paper-page__fold {
  right: 0;
}

.menu-page--right .paper-page__fold {
  left: 0;
  transform: scaleX(-1);
}

.paper-page__corner--top,
.paper-page__corner--bottom {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid rgba(193, 157, 95, 0.16);
}

.paper-page__corner--top {
  top: -70px;
  right: -70px;
}

.paper-page__corner--bottom {
  bottom: -78px;
  left: -78px;
}

.paper-page__header {
  position: relative;
  z-index: 1;
  padding: 28px 32px 16px;
}

.paper-page__kicker {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.24em;
  color: #c2932f;
  text-transform: uppercase;
}

.paper-page__title {
  margin: 10px 0 0;
  font-size: clamp(2rem, 4vw, 3.35rem);
  line-height: 0.98;
  font-weight: 900;
}

.paper-page__folio {
  position: absolute;
  top: 28px;
  right: 32px;
  font-size: 1rem;
  color: rgba(183, 141, 66, 0.9);
  font-weight: 700;
}

.paper-list {
  position: relative;
  z-index: 1;
  padding: 0 32px 30px;
}

.paper-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: start;
  padding: 18px 0;
  border-top: 1px dashed rgba(115, 84, 42, 0.12);
}

.paper-item:first-child {
  border-top: 0;
}

.paper-item__topline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.paper-item__title {
  margin: 0;
  font-size: clamp(1.25rem, 2.4vw, 1.8rem);
  line-height: 1.15;
}

.paper-item__badge {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(194, 145, 52, 0.2);
  background: rgba(204, 158, 71, 0.08);
  color: #c38e28;
  font-size: 0.78rem;
  font-weight: 800;
}

.paper-item__desc {
  margin: 10px 0 0;
  color: #7c6e5c;
  line-height: 1.65;
  font-size: clamp(0.95rem, 1.3vw, 1.04rem);
}

.paper-item__price {
  min-width: 88px;
  padding: 12px 16px;
  border-radius: 20px;
  text-align: center;
  background: rgba(255, 250, 240, 0.7);
  border: 1px solid rgba(208, 178, 130, 0.28);
  box-shadow: 0 8px 20px rgba(151, 123, 70, 0.08);
  font-size: clamp(1.25rem, 2vw, 1.8rem);
  line-height: 1;
}

.book-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 30;
  width: clamp(48px, 4vw, 64px);
  height: clamp(48px, 4vw, 64px);
  border: 1px solid rgba(229, 201, 137, 0.18);
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(13, 13, 16, 0.55);
  color: #f5e3ba;
  backdrop-filter: blur(8px);
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.26);
  cursor: pointer;
  transition: transform 0.22s ease, background 0.22s ease, border-color 0.22s ease;
}

.book-arrow:hover {
  transform: translateY(-50%) scale(1.05);
  background: rgba(28, 22, 15, 0.88);
  border-color: rgba(229, 201, 137, 0.3);
}

.book-arrow span {
  font-size: clamp(1.8rem, 2.6vw, 2.4rem);
  line-height: 1;
  transform: translateY(-1px);
}

.book-arrow--prev {
  left: clamp(8px, 1.6vw, 22px);
}

.book-arrow--next {
  right: clamp(8px, 1.6vw, 22px);
}

.menu-fallback-shell {
  width: min(100%, 450px);
  height: min(72vh, 640px);
}

.cover-page--fallback {
  height: 100%;
}

.menu-book :deep(.stf__parent) {
  margin: 0 auto;
}

.menu-book :deep(.stf__wrapper) {
  margin: 0 auto;
}

.menu-book :deep(.stf__block) {
  overflow: visible;
}

.menu-book :deep(.stf__item) {
  border-radius: 20px;
}

@media (max-width: 920px) {
  .menu-book-shell {
    height: min(100%, 760px);
  }

  .menu-book-center,
  .menu-book {
    width: min(100%, 760px);
    height: min(100%, 720px);
  }

  .book-arrow {
    width: 52px;
    height: 52px;
  }
}

@media (max-width: 720px) {
  .menu-book-screen {
    padding: 10px;
  }

  .menu-book-shell {
    height: 100%;
  }

  .menu-book-center,
  .menu-book {
    width: 100%;
    height: min(100%, 700px);
  }

  .book-arrow {
    width: 46px;
    height: 46px;
    background: rgba(13, 13, 16, 0.66);
  }

  .book-arrow--prev {
    left: 2px;
  }

  .book-arrow--next {
    right: 2px;
  }

  .paper-page__header {
    padding: 22px 22px 12px;
  }

  .paper-list {
    padding: 0 22px 22px;
  }

  .paper-item {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .paper-item__price {
    justify-self: start;
  }
}
</style>
