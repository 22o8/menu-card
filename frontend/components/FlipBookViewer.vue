<template>
  <div class="viewer-shell" :style="viewerVars">
    <div class="viewer-backdrop"></div>

    <div class="viewer-stage">
      <div class="viewer-topbar">
        <div class="viewer-title-wrap">
          <div class="viewer-badge">Interactive Menu</div>
          <div>
            <strong>{{ book?.restaurantName || 'Menu Book' }}</strong>
            <p>{{ book?.title || '...' }}</p>
          </div>
        </div>

        <div class="viewer-meta">
          <span class="viewer-chip">{{ totalPages }} صفحات</span>
          <span class="viewer-chip accent-chip">{{ currentPage }} / {{ totalPages }}</span>
        </div>
      </div>

      <div class="viewer-book-stage">
        <button
          class="viewer-arrow left"
          type="button"
          :disabled="!canGoPrev"
          aria-label="الصفحة السابقة"
          @click="prevPage"
        >
          <span>‹</span>
        </button>

        <div class="viewer-book-wrap">
          <div v-if="loading" class="viewer-state-card">
            <div class="loader-orb"></div>
            <strong>جارِ تجهيز المنيو</strong>
            <p>نضبط الصفحات والعرض حتى يطلع بشكل ناعم على كل الشاشات.</p>
          </div>

          <div v-else-if="errorMessage" class="viewer-state-card error">
            <strong>تعذر تحميل المنيو</strong>
            <p>{{ errorMessage }}</p>
          </div>

          <div v-else-if="!totalPages" class="viewer-state-card">
            <strong>لا توجد صفحات حالياً</strong>
            <p>هذا المنيو لا يحتوي على صفحات قابلة للعرض بعد.</p>
          </div>

          <div v-show="!loading && !errorMessage && totalPages" class="viewer-book-frame">
            <div class="viewer-book-shadow"></div>
            <div ref="bookRef" class="flip-root"></div>
          </div>
        </div>

        <button
          class="viewer-arrow right"
          type="button"
          :disabled="!canGoNext"
          aria-label="الصفحة التالية"
          @click="nextPage"
        >
          <span>›</span>
        </button>
      </div>

      <div class="viewer-toolbar">
        <button class="viewer-tool-btn" type="button" :disabled="!canGoPrev" @click="goToFirst">« البداية</button>
        <button class="viewer-tool-btn" type="button" :disabled="!canGoPrev" @click="prevPage">السابق</button>
        <div class="viewer-pagination">صفحة {{ currentPage }} من {{ totalPages }}</div>
        <button class="viewer-tool-btn" type="button" :disabled="!canGoNext" @click="nextPage">التالي</button>
        <button class="viewer-tool-btn" type="button" :disabled="!canGoNext" @click="goToLast">النهاية »</button>
      </div>
    </div>
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
const loading = ref(true)
const errorMessage = ref('')
const viewportWidth = ref(1440)
const defaultBg = 'radial-gradient(circle at center, #22170e 0%, #090705 75%, #000 100%)'
const { getBookBySlug } = useBooks()
const { themes, loadThemes, fallbackThemes } = useThemes()
const book = ref<any>(null)
let resizeTimer: ReturnType<typeof setTimeout> | null = null

const theme = computed(() => themes.value.find(t => t.id === book.value?.themeId) || fallbackThemes[0])

const viewerVars = computed(() => ({
  background: theme.value?.background || defaultBg,
  '--viewer-accent': theme.value?.accent || '#f1d9a8'
}))

const isCompact = computed(() => viewportWidth.value <= 768)
const canGoPrev = computed(() => currentPage.value > 1)
const canGoNext = computed(() => totalPages.value > 0 && currentPage.value < totalPages.value)

const buildPages = () => (book.value?.pages || []).map((page: any, index: number) => {
  const el = document.createElement('div')
  el.className = 'page-sheet'
  el.innerHTML = `
    <div class="page-image">
      <div class="page-surface">
        <img src="${page.imageUrl}" alt="${page.title || `Page ${index + 1}`}" loading="lazy" />
      </div>
    </div>`
  return el
})

const destroy = () => {
  if (pageFlip.value) {
    pageFlip.value.destroy()
    pageFlip.value = null
  }
  if (bookRef.value) bookRef.value.innerHTML = ''
}

const getFlipConfig = () => {
  const compact = isCompact.value

  return {
    width: compact ? 360 : 720,
    height: compact ? 520 : 1020,
    size: 'stretch' as const,
    minWidth: compact ? 240 : 320,
    maxWidth: compact ? 420 : 960,
    minHeight: compact ? 320 : 480,
    maxHeight: compact ? 620 : 1260,
    showCover: true,
    drawShadow: true,
    mobileScrollSupport: false,
    useMouseEvents: true,
    usePortrait: true,
    maxShadowOpacity: theme.value?.shadowStrength || 0.65,
    startPage: 0,
    flippingTime: compact ? 550 : 700,
    autoSize: true,
    clickEventForward: true,
    swipeDistance: compact ? 18 : 28,
    showPageCorners: !compact,
    disableFlipByClick: false
  }
}

const bindFlipEvents = () => {
  if (!pageFlip.value) return

  pageFlip.value.on('flip', (e: any) => {
    currentPage.value = (e.data || 0) + 1
  })

  pageFlip.value.on('changeState', () => {
    const current = pageFlip.value?.getCurrentPageIndex?.() ?? 0
    currentPage.value = current + 1
  })
}

const init = async () => {
  if (!bookRef.value || !book.value?.pages?.length) {
    totalPages.value = book.value?.pages?.length || 0
    return
  }

  destroy()
  await nextTick()

  pageFlip.value = new PageFlip(bookRef.value, getFlipConfig())
  pageFlip.value.loadFromHTML(buildPages())
  totalPages.value = book.value.pages.length
  currentPage.value = 1
  bindFlipEvents()
}

const refreshViewport = () => {
  viewportWidth.value = window.innerWidth
}

const reinitialize = async () => {
  refreshViewport()
  await init()
}

const nextPage = () => pageFlip.value?.flipNext()
const prevPage = () => pageFlip.value?.flipPrev()
const goToFirst = () => pageFlip.value?.flip(0)
const goToLast = () => {
  if (!totalPages.value) return
  pageFlip.value?.flip(totalPages.value - 1)
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowRight') prevPage()
  if (event.key === 'ArrowLeft') nextPage()
}

const onResize = () => {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    reinitialize()
  }, 160)
}

const loadBook = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await loadThemes()
    book.value = await getBookBySlug(props.slug)
    await init()
  } catch (error: any) {
    errorMessage.value = error?.message || 'حدث خطأ أثناء تحميل البيانات.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  refreshViewport()
  window.addEventListener('resize', onResize)
  window.addEventListener('keydown', onKeydown)
  await loadBook()
})

watch(() => props.slug, async () => {
  await loadBook()
})

onBeforeUnmount(() => {
  if (resizeTimer) clearTimeout(resizeTimer)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', onKeydown)
  destroy()
})
</script>
