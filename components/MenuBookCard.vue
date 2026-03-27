<template>
  <section class="menu-stage" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <ClientOnly>
      <div class="menu-shell" :class="{ 'is-fallback': fallbackMode }">
        <button class="book-arrow book-arrow--prev" type="button" :aria-label="labels.prev" @click="goPrev">
          <span>‹</span>
        </button>

        <div ref="bookHost" class="book-host"></div>

        <button class="book-arrow book-arrow--next" type="button" :aria-label="labels.next" @click="goNext">
          <span>›</span>
        </button>
      </div>

      <div ref="pagesRef" class="book-source" aria-hidden="true">
        <article class="book-page book-page--cover" data-density="hard">
          <div class="cover-page">
            <div class="cover-page__shine"></div>
            <div class="cover-page__spine"></div>
            <div class="cover-page__edge"></div>
            <div class="cover-page__inner">
              <span class="cover-page__eyebrow">{{ labels.cover.eyebrow }}</span>
              <h1 class="cover-page__title">{{ labels.cover.title }}</h1>
              <p class="cover-page__subtitle">{{ labels.cover.subtitle }}</p>
              <div class="cover-page__seal">
                <span>{{ labels.cover.sealTop }}</span>
                <strong>{{ labels.cover.sealBottom }}</strong>
              </div>
            </div>
          </div>
        </article>

        <article v-for="(page, index) in localizedPages" :key="page.id" class="book-page">
          <div class="paper-page">
            <div class="paper-page__grain"></div>
            <div class="paper-page__shade"></div>
            <div class="paper-page__corner paper-page__corner--top"></div>
            <div class="paper-page__corner paper-page__corner--bottom"></div>

            <header class="paper-page__header">
              <span class="paper-page__kicker">{{ labels.menu }}</span>
              <span class="paper-page__folio">{{ index + 1 }}</span>
              <h2 class="paper-page__title">{{ page.title }}</h2>
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

        <article class="book-page book-page--back" data-density="hard">
          <div class="back-page">
            <div class="back-page__inner">
              <span>{{ labels.cover.backTop }}</span>
              <strong>{{ labels.cover.backBottom }}</strong>
            </div>
          </div>
        </article>
      </div>

      <div v-if="fallbackMode" class="fallback-panel">
        <div class="paper-page fallback-paper">
          <header class="paper-page__header">
            <span class="paper-page__kicker">{{ labels.menu }}</span>
            <span class="paper-page__folio">{{ fallbackIndex + 1 }}</span>
            <h2 class="paper-page__title">{{ localizedPages[fallbackIndex]?.title }}</h2>
          </header>

          <div class="paper-list">
            <article
              v-for="item in localizedPages[fallbackIndex]?.items || []"
              :key="`fallback-${item.title}-${item.price}`"
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
      </div>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { menuSpreads } from '~/data/menu'

type Locale = 'ar' | 'en'
type MenuBadge = 'chef' | 'spicy' | 'new'

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
}

type FlipApi = {
  destroy: () => void
  loadFromHTML: (items: HTMLElement[] | NodeListOf<HTMLElement>) => void
  updateFromHtml?: (items: HTMLElement[] | NodeListOf<HTMLElement>) => void
  flipNext?: () => void
  flipPrev?: () => void
}

const locale = ref<Locale>('ar')
const bookHost = ref<HTMLElement | null>(null)
const pagesRef = ref<HTMLElement | null>(null)
const flipApi = ref<FlipApi | null>(null)
const fallbackMode = ref(false)
const fallbackIndex = ref(0)
const resizeTimer = ref<number | null>(null)

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
      subtitle: 'اسحب الصفحة أو استخدم الأسهم لتقليب دفتر المنيو بشكل واقعي.',
      sealTop: 'Premium',
      sealBottom: 'Dining',
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
      sealTop: 'Premium',
      sealBottom: 'Dining',
      backTop: 'Thank you for visiting',
      backBottom: 'We wish you a memorable meal'
    }
  }
}

const labels = computed(() => uiMap[locale.value])

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
        items: mapItems(spread.leftItems)
      },
      {
        id: `spread-${spreadIndex + 1}-right`,
        title: ui.sections[spread.rightTitleKey] ?? spread.rightTitleKey,
        items: mapItems(spread.rightItems)
      }
    ]
  })
})

async function destroyFlip() {
  try {
    flipApi.value?.destroy()
  } catch {}
  flipApi.value = null
  if (bookHost.value) bookHost.value.innerHTML = ''
}

async function setupFlip() {
  if (typeof window === 'undefined') return
  await nextTick()
  await destroyFlip()

  if (!bookHost.value || !pagesRef.value) return

  const pageNodes = Array.from(pagesRef.value.querySelectorAll<HTMLElement>('.book-page'))
  if (!pageNodes.length) {
    fallbackMode.value = true
    return
  }

  try {
    const mod = await import('page-flip')
    const PageFlipCtor = mod.PageFlip

    const api = new PageFlipCtor(bookHost.value, {
      width: 420,
      height: 620,
      size: 'stretch',
      minWidth: 260,
      maxWidth: 480,
      minHeight: 380,
      maxHeight: 760,
      showCover: true,
      mobileScrollSupport: false,
      useMouseEvents: true,
      swipeDistance: 26,
      clickEventForward: true,
      usePortrait: true,
      autoSize: false,
      drawShadow: true,
      maxShadowOpacity: 0.45,
      flippingTime: 900,
      startPage: 0
    }) as FlipApi

    api.loadFromHTML(pageNodes)
    flipApi.value = api
    fallbackMode.value = false
  } catch {
    fallbackMode.value = true
  }
}

function goNext() {
  if (fallbackMode.value) {
    fallbackIndex.value = Math.min(fallbackIndex.value + 1, localizedPages.value.length - 1)
    return
  }
  flipApi.value?.flipNext?.()
}

function goPrev() {
  if (fallbackMode.value) {
    fallbackIndex.value = Math.max(fallbackIndex.value - 1, 0)
    return
  }
  flipApi.value?.flipPrev?.()
}

function handleResize() {
  if (typeof window === 'undefined') return
  if (resizeTimer.value) window.clearTimeout(resizeTimer.value)
  resizeTimer.value = window.setTimeout(() => {
    setupFlip()
  }, 180)
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
  window.addEventListener('resize', handleResize, { passive: true })
})

watch(locale, async (value) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('luxury-menu-locale', value)
  document.documentElement.lang = value
  document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr'
  fallbackIndex.value = 0
  await setupFlip()
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
    if (resizeTimer.value) window.clearTimeout(resizeTimer.value)
  }
  destroyFlip()
})
</script>
