<template>
  <section class="viewer" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <ClientOnly>
      <div class="viewer__stage">
        <button
          class="viewer__arrow viewer__arrow--prev"
          type="button"
          :aria-label="locale === 'ar' ? 'الصفحة السابقة' : 'Previous page'"
          @click="flipPrev"
        >
          <span>‹</span>
        </button>

        <div class="viewer__book-shell">
          <div class="viewer__book-frame">
            <div ref="bookRef" class="viewer__book"></div>
          </div>

          <div class="viewer__controls" aria-hidden="true">
            <button type="button" class="viewer__ctrl" @click="zoomOut">−</button>
            <button type="button" class="viewer__ctrl" @click="zoomIn">+</button>
            <div class="viewer__counter">{{ displayPage }} / {{ totalPages }}</div>
          </div>
        </div>

        <button
          class="viewer__arrow viewer__arrow--next"
          type="button"
          :aria-label="locale === 'ar' ? 'الصفحة التالية' : 'Next page'"
          @click="flipNext"
        >
          <span>›</span>
        </button>

        <div ref="pagesRef" class="viewer__source" aria-hidden="true">
          <article class="book-sheet book-sheet--cover" data-density="hard">
            <div class="cover-sheet">
              <div class="cover-sheet__edge"></div>
              <div class="cover-sheet__content">
                <div class="cover-sheet__logo"></div>
                <span class="cover-sheet__eyebrow">{{ labels.cover.eyebrow }}</span>
                <h1 class="cover-sheet__title">{{ labels.cover.title }}</h1>
                <p class="cover-sheet__subtitle">{{ labels.cover.subtitle }}</p>
              </div>
            </div>
          </article>

          <article v-for="(page, pageIndex) in localizedPages" :key="page.id" class="book-sheet">
            <div class="menu-sheet">
              <div class="menu-sheet__paper"></div>
              <div class="menu-sheet__content">
                <header class="menu-sheet__header">
                  <span class="menu-sheet__kicker">{{ labels.menu }}</span>
                  <h2 class="menu-sheet__title">{{ page.title }}</h2>
                  <span class="menu-sheet__folio">{{ pageIndex + 1 }}</span>
                </header>

                <div class="menu-sheet__list">
                  <article
                    v-for="item in page.items"
                    :key="`${page.id}-${item.title}-${item.price}`"
                    class="menu-item"
                  >
                    <div class="menu-item__copy">
                      <div class="menu-item__top">
                        <h3 class="menu-item__title">{{ item.title }}</h3>
                        <span v-if="item.badge" class="menu-item__badge">{{ item.badge }}</span>
                      </div>
                      <p class="menu-item__desc">{{ item.desc }}</p>
                    </div>
                    <strong class="menu-item__price">{{ item.price }}</strong>
                  </article>
                </div>
              </div>
            </div>
          </article>

          <article class="book-sheet book-sheet--back" data-density="hard">
            <div class="cover-sheet cover-sheet--back">
              <div class="cover-sheet__edge"></div>
              <div class="cover-sheet__content">
                <span class="cover-sheet__eyebrow">{{ labels.cover.backTop }}</span>
                <h2 class="cover-sheet__title cover-sheet__title--small">{{ labels.cover.backBottom }}</h2>
              </div>
            </div>
          </article>
        </div>
      </div>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { menuSpreads } from '~/data/menu'

type Locale = 'ar' | 'en'
type MenuBadge = 'chef' | 'spicy' | 'new'

type PageFlipApi = {
  destroy: () => void
  loadFromHTML: (items: HTMLElement[] | NodeListOf<HTMLElement>) => void
  flipNext: () => void
  flipPrev: () => void
  getCurrentPageIndex?: () => number
  on?: (event: string, callback: (e: { data: number }) => void) => void
  update?: () => void
}

type UiShape = {
  menu: string
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

type LocalizedPage = {
  id: string
  title: string
  items: {
    title: string
    desc: string
    price: string
    badge?: string
  }[]
}

const locale = ref<Locale>('en')
const zoom = ref(1)
const currentPage = ref(0)
const bookRef = ref<HTMLElement | null>(null)
const pagesRef = ref<HTMLElement | null>(null)
const flip = ref<PageFlipApi | null>(null)

const uiMap: Record<Locale, UiShape> = {
  ar: {
    menu: 'المنيو',
    badges: { chef: 'اختيار الشيف', spicy: 'حار', new: 'جديد' },
    sections: {
      breakfast: 'الفطور', salads: 'السلطات', soups: 'الشوربات', baguettes: 'الباغيت',
      mains: 'الأطباق الرئيسية', desserts: 'الحلويات', drinks: 'المشروبات', signature: 'الأطباق الخاصة'
    },
    cover: {
      eyebrow: 'قائمة المطعم',
      title: 'Luxury Menu',
      subtitle: 'اسحب الصفحة أو استخدم الأسهم للتنقل بسلاسة داخل المنيو.',
      backTop: 'شكراً لزيارتكم',
      backBottom: 'نتمنى لكم تجربة مميزة'
    }
  },
  en: {
    menu: 'MENU',
    badges: { chef: 'Chef Choice', spicy: 'Spicy', new: 'New' },
    sections: {
      breakfast: 'Breakfast', salads: 'Salads', soups: 'Soups', baguettes: 'Baguettes',
      mains: 'Main Courses', desserts: 'Desserts', drinks: 'Drinks', signature: 'Signature'
    },
    cover: {
      eyebrow: 'Restaurant Menu',
      title: 'Luxury Menu',
      subtitle: 'Drag the page or use the arrows for a smooth menu experience.',
      backTop: 'Thank you for visiting',
      backBottom: 'We wish you a memorable meal'
    }
  }
}

const labels = computed(() => uiMap[locale.value])

const localizedPages = computed<LocalizedPage[]>(() => {
  const ui = uiMap[locale.value]
  return menuSpreads.flatMap((spread, spreadIndex) => {
    const mapItems = (items: typeof spread.leftItems) => items.map((item) => ({
      title: locale.value === 'ar' ? item.nameAr : item.nameEn,
      desc: locale.value === 'ar' ? item.descAr : item.descEn,
      price: item.price,
      badge: item.badge ? ui.badges[item.badge as MenuBadge] : undefined
    }))

    return [
      { id: `spread-${spreadIndex + 1}-left`, title: ui.sections[spread.leftTitleKey] ?? spread.leftTitleKey, items: mapItems(spread.leftItems) },
      { id: `spread-${spreadIndex + 1}-right`, title: ui.sections[spread.rightTitleKey] ?? spread.rightTitleKey, items: mapItems(spread.rightItems) }
    ]
  })
})

const totalPages = computed(() => localizedPages.value.length + 2)
const displayPage = computed(() => currentPage.value + 1)

async function destroyBook() {
  flip.value?.destroy()
  flip.value = null
  currentPage.value = 0
  if (bookRef.value) bookRef.value.innerHTML = ''
}

function applyScale() {
  if (bookRef.value) {
    bookRef.value.style.transform = `scale(${zoom.value})`
  }
}

async function initBook() {
  if (typeof window === 'undefined') return
  await nextTick()
  await destroyBook()
  if (!bookRef.value || !pagesRef.value) return

  const mod = await import('page-flip')
  const PageFlip = mod.PageFlip
  const nodes = Array.from(pagesRef.value.querySelectorAll<HTMLElement>('.book-sheet'))

  const instance = new PageFlip(bookRef.value, {
    width: 360,
    height: 540,
    size: 'fixed',
    minWidth: 280,
    maxWidth: 360,
    minHeight: 420,
    maxHeight: 540,
    drawShadow: true,
    maxShadowOpacity: 0.22,
    usePortrait: true,
    showCover: true,
    mobileScrollSupport: false,
    swipeDistance: 18,
    clickEventForward: false,
    useMouseEvents: true,
    flippingTime: 720,
    autoSize: false,
    showPageCorners: true,
    startZIndex: 10
  }) as PageFlipApi

  instance.loadFromHTML(nodes)
  instance.on?.('flip', (e) => {
    currentPage.value = e.data ?? 0
  })
  flip.value = instance
  applyScale()
}

function flipNext() { flip.value?.flipNext() }
function flipPrev() { flip.value?.flipPrev() }
function zoomIn() { zoom.value = Math.min(1.08, +(zoom.value + 0.04).toFixed(2)); applyScale() }
function zoomOut() { zoom.value = Math.max(0.92, +(zoom.value - 0.04).toFixed(2)); applyScale() }

onMounted(async () => {
  const stored = localStorage.getItem('luxury-menu-locale')
  locale.value = stored === 'ar' || stored === 'en' ? stored : 'en'
  document.documentElement.lang = locale.value
  document.documentElement.dir = locale.value === 'ar' ? 'rtl' : 'ltr'
  await initBook()

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') flipNext()
    if (event.key === 'ArrowLeft') flipPrev()
  })
})

onBeforeUnmount(() => {
  destroyBook()
})
</script>
