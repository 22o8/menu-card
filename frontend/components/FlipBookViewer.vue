<template>
  <div class="viewer-shell" :style="{ background: theme?.background || defaultBg }">
    <button class="viewer-arrow" @click="prevPage">‹</button>

    <div class="viewer-stage">
      <div class="viewer-topbar">
        <div>
          <strong>{{ book?.restaurantName }}</strong>
          <p>{{ book?.title }}</p>
        </div>
        <div class="viewer-counter">{{ currentPage }} / {{ totalPages }}</div>
      </div>

      <div class="viewer-inner">
        <div ref="bookRef" class="flip-root"></div>
      </div>
    </div>

    <button class="viewer-arrow" @click="nextPage">›</button>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { PageFlip } from 'page-flip'
import { useBooks } from '~/composables/useBooks'
import { useThemes } from '~/composables/useThemes'

const props = defineProps<{ slug: string }>()
const bookRef = ref<HTMLElement | null>(null)
const pageFlip = ref<any>(null)
const currentPage = ref(1)
const totalPages = ref(0)
const defaultBg = 'radial-gradient(circle at center, #22170e 0%, #090705 75%, #000 100%)'
const { getBookBySlug } = useBooks()
const { themes, loadThemes, fallbackThemes } = useThemes()
const book = ref<any>(null)

const theme = computed(() => themes.value.find(t => t.id === book.value?.themeId) || fallbackThemes[0])

const buildPages = () => (book.value?.pages || []).map((page: any) => {
  const el = document.createElement('div')
  el.className = 'page-sheet'
  el.innerHTML = `<div class="page-image"><img src="${page.imageUrl}" alt="${page.title}" /></div>`
  return el
})

const destroy = () => {
  if (pageFlip.value) {
    pageFlip.value.destroy()
    pageFlip.value = null
  }
  if (bookRef.value) bookRef.value.innerHTML = ''
}

const init = async () => {
  if (!bookRef.value || !book.value?.pages?.length) return
  destroy()
  await nextTick()
  pageFlip.value = new PageFlip(bookRef.value, {
    width: 620,
    height: 880,
    size: 'stretch',
    minWidth: 260,
    maxWidth: 920,
    minHeight: 360,
    maxHeight: 1200,
    showCover: true,
    drawShadow: true,
    mobileScrollSupport: false,
    useMouseEvents: true,
    usePortrait: true,
    maxShadowOpacity: theme.value.shadowStrength,
    startPage: 0,
    flippingTime: 700,
    autoSize: true
  })
  pageFlip.value.loadFromHTML(buildPages())
  totalPages.value = book.value.pages.length
  currentPage.value = 1
  pageFlip.value.on('flip', (e: any) => {
    currentPage.value = (e.data || 0) + 1
  })
}

const nextPage = () => pageFlip.value?.flipNext()
const prevPage = () => pageFlip.value?.flipPrev()

onMounted(async () => {
  await loadThemes()
  book.value = await getBookBySlug(props.slug)
  await init()
})

watch(() => props.slug, async (slug) => {
  book.value = await getBookBySlug(slug)
  await init()
})

onBeforeUnmount(destroy)
</script>
