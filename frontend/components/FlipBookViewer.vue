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
          <span class="viewer-chip accent-chip">{{ currentSpreadText }}</span>
        </div>
      </div>

      <div class="viewer-book-stage">
        <button
          class="viewer-arrow left"
          type="button"
          :disabled="!canGoPrev || isFlipping"
          aria-label="الصفحة السابقة"
          @click="prevPage"
        >
          <span>‹</span>
        </button>

        <div ref="bookWrapRef" class="viewer-book-wrap">
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
            <div v-if="showSpineDecor" class="viewer-book-spine"></div>
            <div ref="bookRef" class="flip-root" :style="bookFrameStyle"></div>
          </div>
        </div>

        <button
          class="viewer-arrow right"
          type="button"
          :disabled="!canGoNext || isFlipping"
          aria-label="الصفحة التالية"
          @click="nextPage"
        >
          <span>›</span>
        </button>
      </div>

      <div class="viewer-toolbar">
        <button class="viewer-tool-btn" type="button" :disabled="!canGoPrev || isFlipping" @click="goToFirst">« البداية</button>
        <button class="viewer-tool-btn" type="button" :disabled="!canGoPrev || isFlipping" @click="prevPage">السابق</button>
        <div class="viewer-pagination">{{ currentSpreadText }}</div>
        <button class="viewer-tool-btn" type="button" :disabled="!canGoNext || isFlipping" @click="nextPage">التالي</button>
        <button class="viewer-tool-btn" type="button" :disabled="!canGoNext || isFlipping" @click="goToLast">النهاية »</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useBooks } from '~/composables/useBooks'
import { useThemes } from '~/composables/useThemes'

const props = defineProps<{ slug: string }>()
const bookRef = ref<HTMLElement | null>(null)
const pageFlip = ref<any>(null)
const PageFlipCtor = ref<any>(null)
const currentPage = ref(1)
const totalPages = ref(0)
const loading = ref(true)
const errorMessage = ref('')
const viewportWidth = ref(1440)
const bookWrapRef = ref<HTMLElement | null>(null)
const stageWidth = ref(1200)
const isFlipping = ref(false)
const pageRatio = ref(0.707)
const defaultBg = 'radial-gradient(circle at center, #22170e 0%, #090705 75%, #000 100%)'
const { getBookBySlug } = useBooks()
const { themes, loadThemes, fallbackThemes } = useThemes()
const book = ref<any>(null)
let resizeTimer: ReturnType<typeof setTimeout> | null = null
let resizeObserver: ResizeObserver | null = null

const theme = computed(() => themes.value.find(t => t.id === book.value?.themeId) || fallbackThemes[0])

const viewerVars = computed(() => ({
  background: theme.value?.background || defaultBg,
  '--viewer-accent': theme.value?.accent || '#f1d9a8'
}))

const isCompact = computed(() => viewportWidth.value <= 900)
const isPhone = computed(() => viewportWidth.value <= 640)
const showSpineDecor = computed(() => !isCompact.value && currentPage.value > 1 && totalPages.value > 2)
const canGoPrev = computed(() => currentPage.value > 1)
const canGoNext = computed(() => totalPages.value > 0 && currentPage.value < totalPages.value)
const currentSpreadText = computed(() => `صفحة ${currentPage.value} من ${totalPages.value}`)

const spreadWidth = computed(() => {
  const available = Math.max(320, stageWidth.value - (isCompact.value ? 0 : 20))
  if (isPhone.value) return Math.min(available, 420)
  if (isCompact.value) return Math.min(available, 620)
  return Math.min(available, 1220)
})

const pageWidth = computed(() => {
  if (isPhone.value) return Math.max(220, Math.floor(spreadWidth.value))
  if (isCompact.value) return Math.max(260, Math.floor(spreadWidth.value))
  return Math.max(320, Math.floor((spreadWidth.value - 6) / 2))
})

const pageHeight = computed(() => Math.round(pageWidth.value / pageRatio.value))
const rootWidth = computed(() => (isCompact.value ? pageWidth.value : pageWidth.value * 2 + 6))
const bookFrameStyle = computed(() => ({
  '--book-page-width': `${pageWidth.value}px`,
  '--book-page-height': `${pageHeight.value}px`,
  '--book-root-width': `${rootWidth.value}px`
}))

const preloadRatio = async (url?: string) => {
  if (!url || !import.meta.client) return
  try {
    const ratio = await new Promise<number>((resolve) => {
      const img = new Image()
      img.onload = () => resolve(img.naturalWidth > 0 && img.naturalHeight > 0 ? img.naturalWidth / img.naturalHeight : 0.707)
      img.onerror = () => resolve(0.707)
      img.src = url
    })
    if (ratio > 0.45 && ratio < 1.1) pageRatio.value = ratio
  } catch {
    pageRatio.value = 0.707
  }
}

const buildPages = () => (book.value?.pages || []).map((page: any, index: number) => {
  const el = document.createElement('div')
  const isFirst = index === 0
  const isLast = index === (book.value?.pages?.length || 1) - 1
  const sideClass = index % 2 === 0 ? 'page-right' : 'page-left'
  el.className = `page-sheet ${sideClass} ${isFirst ? 'page-cover-front' : ''} ${isLast ? 'page-cover-back' : ''}`.trim()
  el.innerHTML = `
    <div class="page-image">
      <div class="page-surface">
        <img src="${page.imageUrl}" alt="${page.title || `Page ${index + 1}`}" loading="eager" draggable="false" />
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

const getFlipConfig = () => ({
  width: pageWidth.value,
  height: pageHeight.value,
  size: 'fixed' as const,
  minWidth: Math.max(220, Math.round(pageWidth.value * 0.86)),
  maxWidth: Math.round(pageWidth.value * 1.02),
  minHeight: Math.max(300, Math.round(pageHeight.value * 0.86)),
  maxHeight: Math.round(pageHeight.value * 1.02),
  showCover: false,
  drawShadow: true,
  mobileScrollSupport: true,
  useMouseEvents: true,
  usePortrait: true,
  maxShadowOpacity: isPhone.value ? 0.16 : 0.24,
  startPage: 0,
  flippingTime: isPhone.value ? 900 : 1050,
  autoSize: false,
  clickEventForward: true,
  swipeDistance: isPhone.value ? 12 : 20,
  showPageCorners: !isCompact.value,
  disableFlipByClick: false
})

const bindFlipEvents = () => {
  if (!pageFlip.value) return

  pageFlip.value.on('flip', (e: any) => {
    currentPage.value = (e.data || 0) + 1
  })

  pageFlip.value.on('changeState', (e: any) => {
    isFlipping.value = e?.data === 'flipping'
  })

  pageFlip.value.on('init', () => {
    currentPage.value = 1
    isFlipping.value = false
  })
}

const ensureLibrary = async () => {
  if (PageFlipCtor.value || !import.meta.client) return
  const mod: any = await import('page-flip')
  PageFlipCtor.value = mod?.PageFlip || mod?.default?.PageFlip || mod?.default || null
  if (!PageFlipCtor.value) throw new Error('تعذر تحميل مكتبة تقليب الصفحات.')
}

const init = async () => {
  if (!bookRef.value || !book.value?.pages?.length) {
    totalPages.value = book.value?.pages?.length || 0
    return
  }

  await ensureLibrary()
  destroy()
  await nextTick()
  refreshViewport()

  pageFlip.value = new PageFlipCtor.value(bookRef.value, getFlipConfig())
  pageFlip.value.loadFromHTML(buildPages())
  totalPages.value = book.value.pages.length
  currentPage.value = 1
  bindFlipEvents()
}

const refreshViewport = () => {
  viewportWidth.value = window.innerWidth
  stageWidth.value = Math.max(320, Math.floor(bookWrapRef.value?.clientWidth || window.innerWidth - 24))
}

const reinitialize = async () => {
  refreshViewport()
  await init()
}

const nextPage = () => pageFlip.value?.flipNext('top')
const prevPage = () => pageFlip.value?.flipPrev('top')
const goToFirst = () => pageFlip.value?.flip(0, 'top')
const goToLast = () => {
  if (!totalPages.value) return
  pageFlip.value?.flip(totalPages.value - 1, 'top')
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowRight') prevPage()
  if (event.key === 'ArrowLeft') nextPage()
}

const onResize = () => {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    reinitialize()
  }, 180)
}

const loadBook = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await loadThemes()
    book.value = await getBookBySlug(props.slug)
    await preloadRatio(book.value?.pages?.[0]?.imageUrl)
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
  if (import.meta.client && 'ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => onResize())
    if (bookWrapRef.value) resizeObserver.observe(bookWrapRef.value)
  }
  await loadBook()
})

watch(() => props.slug, async () => {
  await loadBook()
})

onBeforeUnmount(() => {
  if (resizeTimer) clearTimeout(resizeTimer)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', onKeydown)
  resizeObserver?.disconnect()
  destroy()
})
</script>
