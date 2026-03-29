<template>
  <div class="viewer-shell" :style="{ background: theme?.background || defaultBg }">
    <button class="viewer-arrow left" @click="prevPage">‹</button>

    <div class="viewer-stage">
      <div class="viewer-inner">
        <div ref="bookRef" class="flip-root"></div>
      </div>
    </div>

    <button class="viewer-arrow right" @click="nextPage">›</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { PageFlip } from 'page-flip'
import { useBooks } from '~/composables/useBooks'
import { useThemes } from '~/composables/useThemes'

const props = defineProps<{ slug: string }>()
const bookRef = ref<HTMLElement | null>(null)
const pageFlip = ref<any>(null)
const defaultBg = 'radial-gradient(circle at center, #22170e 0%, #090705 75%, #000 100%)'
const { books } = useBooks()
const { themes } = useThemes()

const book = computed(() => books.value.find(b => b.slug === props.slug) || books.value[0])
const theme = computed(() => themes.value.find(t => t.id === book.value.themeId) || themes.value[0])

const buildPages = () => {
  if (!bookRef.value) return []
  const pages = book.value.pages.map((page, index) => {
    const el = document.createElement('div')
    el.className = index === 0 ? 'page-cover' : 'page-sheet'
    el.innerHTML = `
      <div class="page-layer" style="background-image:url('${page.imageUrl}'), url('${theme.value.pageTexture}')">
        <div class="page-shine"></div>
        <div class="page-shadow-edge"></div>
      </div>`
    return el
  })
  return pages
}

const init = () => {
  if (!bookRef.value) return
  pageFlip.value = new PageFlip(bookRef.value, {
    width: 520,
    height: 720,
    size: 'stretch',
    minWidth: 280,
    maxWidth: 720,
    minHeight: 420,
    maxHeight: 920,
    maxShadowOpacity: theme.value.shadowStrength,
    showCover: true,
    mobileScrollSupport: false,
    useMouseEvents: true,
    swipeDistance: 20,
    clickEventForward: true,
    usePortrait: true,
    startZIndex: 20,
    autoSize: true
  })

  pageFlip.value.loadFromHTML(buildPages())
}

const nextPage = () => pageFlip.value?.flipNext()
const prevPage = () => pageFlip.value?.flipPrev()

onMounted(() => {
  init()
})
</script>
