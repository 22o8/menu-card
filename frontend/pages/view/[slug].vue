<template>
  <div v-if="book && theme">
    <FlipBookViewer :book="book" :theme="theme" />
  </div>
  <div v-else class="page-shell centered-state">
    <div class="panel panel-soft narrow-panel">
      <h1>المنيو غير موجود</h1>
      <p>تعذر العثور على المنيو المطلوب. تأكد من الرابط أو ارجع إلى الصفحة الرئيسية.</p>
      <NuxtLink to="/" class="soft-btn primary-btn">الرجوع للرئيسية</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FlipBookViewer from '~/components/FlipBookViewer.vue'
import { useBooks } from '~/composables/useBooks'
import { useThemes } from '~/composables/useThemes'

const route = useRoute()
const slug = computed(() => String(route.params.slug || 'blossom-house-main-menu'))

const { books, loadBooks } = useBooks()
const { themes, loadThemes } = useThemes()

await Promise.all([loadBooks(), loadThemes()])

const book = computed(() => books.value.find(item => item.slug === slug.value))
const theme = computed(() => themes.value.find(item => item.id === book.value?.themeId) || themes.value[0])
</script>
