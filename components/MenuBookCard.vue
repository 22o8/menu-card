<template>
  <section
    class="book-stage"
    :class="{ 'is-mobile': isMobile, 'is-cover-view': !bookOpened }"
    :dir="locale === 'ar' ? 'rtl' : 'ltr'"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <div class="book-shell">
      <button
        class="book-nav book-nav--prev"
        type="button"
        :disabled="!canGoPrev"
        aria-label="Previous"
        @click="goPrev"
      >
        <span>‹</span>
      </button>

      <div class="book-frame" :class="{ 'book-frame--cover': !bookOpened }">
        <div class="book-cover-glow" aria-hidden="true"></div>
        <div class="book-shell-shadow" aria-hidden="true"></div>

        <Transition :name="bookOpened ? transitionName : 'cover-open'" mode="out-in">
          <button
            v-if="!bookOpened"
            key="cover"
            type="button"
            class="book-cover"
            @click="goNext"
          >
            <div class="book-cover__edge" aria-hidden="true"></div>
            <div class="book-cover__hinge" aria-hidden="true"></div>
            <div class="book-cover__shine" aria-hidden="true"></div>
            <div class="book-cover__content">
              <span class="book-cover__eyebrow">{{ coverLabels.eyebrow }}</span>
              <h1 class="book-cover__title">{{ coverLabels.title }}</h1>
              <p class="book-cover__subtitle">{{ coverLabels.subtitle }}</p>

              <div class="book-cover__seal">
                <span>{{ coverLabels.sealTop }}</span>
                <strong>{{ coverLabels.sealBottom }}</strong>
              </div>

              <div class="book-cover__hint">
                <span class="book-cover__hint-line"></span>
                <span>{{ coverLabels.hint }}</span>
                <span class="book-cover__hint-line"></span>
              </div>
            </div>
          </button>

          <div v-else-if="isMobile" :key="`page-${mobilePageIndex}`" class="book-mobile-page-wrap">
            <article class="book-page book-page--mobile" :class="pageSideClass(mobilePages[mobilePageIndex]?.side)">
              <div class="book-page__paper"></div>
              <div class="book-page__paper-grain"></div>
              <div class="book-page__ornament book-page__ornament--top"></div>
              <div class="book-page__ornament book-page__ornament--bottom"></div>

              <header class="book-page__header">
                <span class="book-page__kicker">{{ labels.menu }}</span>
                <h2 class="book-page__title">{{ mobilePages[mobilePageIndex]?.title }}</h2>
                <div class="book-page__folio">{{ mobilePageIndex + 1 }} / {{ mobilePages.length }}</div>
              </header>

              <div class="book-list">
                <article
                  v-for="item in mobilePages[mobilePageIndex]?.items ?? []"
                  :key="`${mobilePages[mobilePageIndex]?.id}-${item.title}-${item.price}`"
                  class="book-item"
                >
                  <div class="book-item__copy">
                    <div class="book-item__top">
                      <h3 class="book-item__title">{{ item.title }}</h3>
                      <span v-if="item.badge" class="book-item__badge">{{ item.badge }}</span>
                    </div>
                    <p class="book-item__desc">{{ item.desc }}</p>
                  </div>
                  <strong class="book-item__price">{{ item.price }}</strong>
                </article>
              </div>
            </article>
          </div>

          <div v-else :key="`spread-${currentSpreadIndex}`" class="book-spread-wrap">
            <div class="book-spine" aria-hidden="true"></div>

            <article class="book-page book-page--left">
              <div class="book-page__paper"></div>
              <div class="book-page__paper-grain"></div>
              <div class="book-page__ornament book-page__ornament--top"></div>
              <div class="book-page__ornament book-page__ornament--bottom"></div>

              <header class="book-page__header">
                <span class="book-page__kicker">{{ labels.menu }}</span>
                <h2 class="book-page__title">{{ currentSpread.left.title }}</h2>
                <div class="book-page__folio">{{ currentSpreadIndex * 2 + 1 }}</div>
              </header>

              <div class="book-list">
                <article
                  v-for="item in currentSpread.left.items"
                  :key="`${currentSpread.left.id}-${item.title}-${item.price}`"
                  class="book-item"
                >
                  <div class="book-item__copy">
                    <div class="book-item__top">
                      <h3 class="book-item__title">{{ item.title }}</h3>
                      <span v-if="item.badge" class="book-item__badge">{{ item.badge }}</span>
                    </div>
                    <p class="book-item__desc">{{ item.desc }}</p>
                  </div>
                  <strong class="book-item__price">{{ item.price }}</strong>
                </article>
              </div>
            </article>

            <article class="book-page book-page--right">
              <div class="book-page__paper"></div>
              <div class="book-page__paper-grain"></div>
              <div class="book-page__ornament book-page__ornament--top"></div>
              <div class="book-page__ornament book-page__ornament--bottom"></div>

              <header class="book-page__header">
                <span class="book-page__kicker">{{ labels.menu }}</span>
                <h2 class="book-page__title">{{ currentSpread.right.title }}</h2>
                <div class="book-page__folio">{{ currentSpreadIndex * 2 + 2 }}</div>
              </header>

              <div class="book-list">
                <article
                  v-for="item in currentSpread.right.items"
                  :key="`${currentSpread.right.id}-${item.title}-${item.price}`"
                  class="book-item"
                >
                  <div class="book-item__copy">
                    <div class="book-item__top">
                      <h3 class="book-item__title">{{ item.title }}</h3>
                      <span v-if="item.badge" class="book-item__badge">{{ item.badge }}</span>
                    </div>
                    <p class="book-item__desc">{{ item.desc }}</p>
                  </div>
                  <strong class="book-item__price">{{ item.price }}</strong>
                </article>
              </div>
            </article>
          </div>
        </Transition>
      </div>

      <button
        class="book-nav book-nav--next"
        type="button"
        :disabled="!canGoNext"
        aria-label="Next"
        @click="goNext"
      >
        <span>›</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
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
    hint: string
    sealTop: string
    sealBottom: string
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

const locale = ref<Locale>('ar')
const isMobile = ref(false)
const bookOpened = ref(false)
const currentSpreadIndex = ref(0)
const mobilePageIndex = ref(0)
const navDirection = ref<'next' | 'prev'>('next')
const touchStartX = ref<number | null>(null)

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
      title: 'دفتر المنيو',
      subtitle: 'تجربة أنيقة تشبه الكتاب الحقيقي مع انتقالات سلسة وصفحات واضحة على الهاتف والحاسبة.',
      hint: 'المس لفتح الغلاف',
      sealTop: 'Premium',
      sealBottom: 'Menu'
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
      title: 'Restaurant Menu',
      subtitle: 'An elegant book-style experience with smooth realistic motion and balanced pages for every screen.',
      hint: 'Tap to open the cover',
      sealTop: 'Premium',
      sealBottom: 'Menu'
    }
  }
}

const labels = computed(() => uiMap[locale.value])
const coverLabels = computed(() => uiMap[locale.value].cover)

const spreads = computed(() => {
  const ui = uiMap[locale.value]

  return menuSpreads.map((spread, spreadIndex) => {
    const mapItems = (items: typeof spread.leftItems) =>
      items.map((item) => ({
        title: locale.value === 'ar' ? item.nameAr : item.nameEn,
        desc: locale.value === 'ar' ? item.descAr : item.descEn,
        price: item.price,
        badge: item.badge ? ui.badges[item.badge as MenuBadge] : undefined
      }))

    return {
      left: {
        id: `spread-${spreadIndex + 1}-left`,
        title: ui.sections[spread.leftTitleKey] ?? spread.leftTitleKey,
        items: mapItems(spread.leftItems),
        side: 'left' as SwipeSide
      },
      right: {
        id: `spread-${spreadIndex + 1}-right`,
        title: ui.sections[spread.rightTitleKey] ?? spread.rightTitleKey,
        items: mapItems(spread.rightItems),
        side: 'right' as SwipeSide
      }
    }
  })
})

const mobilePages = computed<MenuPage[]>(() => spreads.value.flatMap((spread) => [spread.left, spread.right]))
const currentSpread = computed(() => spreads.value[currentSpreadIndex.value] ?? spreads.value[0])
const transitionName = computed(() => (navDirection.value === 'next' ? 'page-next' : 'page-prev'))

const canGoPrev = computed(() => {
  if (!bookOpened.value) return false
  return isMobile.value ? mobilePageIndex.value > 0 : currentSpreadIndex.value > 0
})

const canGoNext = computed(() => {
  if (!bookOpened.value) return true
  if (isMobile.value) return mobilePageIndex.value < mobilePages.value.length - 1
  return currentSpreadIndex.value < spreads.value.length - 1
})

function pageSideClass(side?: SwipeSide) {
  return side === 'left' ? 'book-page--left' : 'book-page--right'
}

function syncResponsiveMode() {
  if (typeof window === 'undefined') return

  const nextIsMobile = window.innerWidth < 920
  if (nextIsMobile === isMobile.value) return

  if (bookOpened.value) {
    if (nextIsMobile) {
      mobilePageIndex.value = currentSpreadIndex.value * 2
    } else {
      currentSpreadIndex.value = Math.floor(mobilePageIndex.value / 2)
    }
  }

  isMobile.value = nextIsMobile
}

function goNext() {
  navDirection.value = 'next'

  if (!bookOpened.value) {
    bookOpened.value = true
    return
  }

  if (!canGoNext.value) return

  if (isMobile.value) {
    mobilePageIndex.value += 1
    return
  }

  currentSpreadIndex.value += 1
}

function goPrev() {
  if (!bookOpened.value) return
  navDirection.value = 'prev'

  if (isMobile.value) {
    if (mobilePageIndex.value === 0) {
      bookOpened.value = false
      return
    }
    mobilePageIndex.value -= 1
    return
  }

  if (currentSpreadIndex.value === 0) {
    bookOpened.value = false
    return
  }

  currentSpreadIndex.value -= 1
}

function onTouchStart(event: TouchEvent) {
  touchStartX.value = event.changedTouches[0]?.clientX ?? null
}

function onTouchEnd(event: TouchEvent) {
  if (touchStartX.value === null) return

  const endX = event.changedTouches[0]?.clientX ?? touchStartX.value
  const delta = endX - touchStartX.value
  touchStartX.value = null

  if (Math.abs(delta) < 40) return

  if (delta < 0) {
    locale.value === 'ar' ? goPrev() : goNext()
  } else {
    locale.value === 'ar' ? goNext() : goPrev()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') {
    locale.value === 'ar' ? goPrev() : goNext()
  }

  if (event.key === 'ArrowLeft') {
    locale.value === 'ar' ? goNext() : goPrev()
  }
}

onMounted(() => {
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

  syncResponsiveMode()
  window.addEventListener('resize', syncResponsiveMode)
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('resize', syncResponsiveMode)
  window.removeEventListener('keydown', onKeydown)
})
</script>
