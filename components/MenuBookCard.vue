<template>
  <section class="menu-page" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="menu-page__inner">
      <article
        v-for="section in sections"
        :key="`${locale}-${section.id}`"
        class="menu-card"
      >
        <header class="menu-card__header">
          <span class="menu-card__kicker">{{ labels.menu }}</span>
          <h2 class="menu-card__title">{{ section.title }}</h2>
        </header>

        <div class="menu-list">
          <article
            v-for="item in section.items"
            :key="`${section.id}-${item.title}-${item.price}`"
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
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { menuSpreads } from '~/data/menu'

type Locale = 'ar' | 'en'
type MenuBadge = 'chef' | 'spicy' | 'new'

type UiShape = {
  menu: string
  badges: Record<MenuBadge, string>
  sections: Record<string, string>
}

const locale = ref<Locale>('ar')

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
    }
  }
}

const labels = computed(() => uiMap[locale.value])

const sections = computed(() => {
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
})
</script>
