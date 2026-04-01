<template>
  <div class="viewer-shell" :style="{ background: theme?.background || defaultBg }">
    <button class="viewer-arrow left" @click="prevPage" aria-label="Previous">‹</button>

    <div class="viewer-stage">
      <div class="viewer-topbar glass-bar">
        <div>
          <strong>{{ book.title }}</strong>
          <p>{{ book.restaurantName }} • {{ book.pages.length }} صفحات</p>
        </div>
        <div class="viewer-badges">
          <span>{{ book.status === 'published' ? 'Published' : 'Draft' }}</span>
          <NuxtLink to="/admin" class="soft-btn subtle-btn">لوحة الإدارة</NuxtLink>
        </div>
      </div>

      <div class="viewer-inner">
        <div ref="bookRef" class="flip-root"></div>
      </div>

      <div class="viewer-toolbar glass-bar">
        <button class="soft-btn subtle-btn" @click="prevPage">السابق</button>
        <span>تقليب واقعي للمنيو</span>
        <button class="soft-btn subtle-btn" @click="nextPage">التالي</button>
      </div>
    </div>

    <button class="viewer-arrow right" @click="nextPage" aria-label="Next">›</button>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { PageFlip } from 'page-flip'
import type { MenuBook, ThemeConfig } from '~/types'
import { useApi } from '~/composables/useApi'

const props = defineProps<{
  book: MenuBook
  theme: ThemeConfig
}>()

const bookRef = ref<HTMLElement | null>(null)
const pageFlip = ref<any>(null)
const defaultBg = 'radial-gradient(circle at center, #22170e 0%, #090705 75%, #000 100%)'
const { toPublicAssetUrl } = useApi()

const buildPages = () => {
  return props.book.pages.map((page, index) => {
    const el = document.createElement('div')
    el.className = index === 0 ? 'page-cover' : 'page-sheet'
    el.innerHTML = `
      <div class="page-layer" style="background-image:url('${toPublicAssetUrl(page.imageUrl)}'), url('${toPublicAssetUrl(props.theme.pageTexture)}')">
        <div class="page-shine"></div>
        <div class="page-shadow-edge"></div>
      </div>`
    return el
  })
}

const destroy = () => {
  if (pageFlip.value) {
    pageFlip.value.destroy()
    pageFlip.value = null
  }
  if (bookRef.value) {
    bookRef.value.innerHTML = ''
  }
}

const init = async () => {
  await nextTick()
  if (!bookRef.value || !props.book?.pages?.length) return

  destroy()

  pageFlip.value = new PageFlip(bookRef.value, {
    width: 560,
    height: 780,
    size: 'stretch',
    minWidth: 280,
    maxWidth: 760,
    minHeight: 420,
    maxHeight: 980,
    maxShadowOpacity: props.theme.shadowStrength,
    showCover: true,
    mobileScrollSupport: false,
    useMouseEvents: true,
    swipeDistance: 24,
    clickEventForward: true,
    usePortrait: true,
    startZIndex: 20,
    autoSize: true
  })

  pageFlip.value.loadFromHTML(buildPages())
}

const nextPage = () => pageFlip.value?.flipNext()
const prevPage = () => pageFlip.value?.flipPrev()

watch(() => [props.book.id, props.theme.id], () => {
  init()
})

onMounted(init)
onBeforeUnmount(destroy)
</script>
