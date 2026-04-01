<template>
  <div class="book-list-card">
    <div class="book-card-main">
      <div class="book-card-title-row">
        <h3>{{ book.title }}</h3>
        <span class="status-pill" :class="book.status">{{ book.status === 'published' ? 'published' : 'draft' }}</span>
      </div>
      <p>{{ book.restaurantName }} • {{ book.pageCount || book.pages.length }} صفحات</p>
      <small class="mono-text">/{{ book.slug }}</small>
    </div>

    <div class="book-card-side">
      <div class="book-meta-chips">
        <span>{{ book.views.toLocaleString() }} مشاهدة</span>
        <span>{{ formattedDate }}</span>
      </div>

      <div class="book-card-actions">
        <NuxtLink :to="`/view/${book.slug}`" class="soft-btn">عرض</NuxtLink>
        <button class="soft-btn" @click="$emit('preview', book)">تفاصيل</button>
        <button class="soft-btn primary-btn" @click="$emit('publish', book)">نشر</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MenuBook } from '~/types'

const props = defineProps<{ book: MenuBook }>()
defineEmits<{ preview: [book: MenuBook], publish: [book: MenuBook] }>()

const formattedDate = computed(() => {
  const value = props.book.updatedAtUtc || props.book.updatedAt
  if (!value) return '—'
  return new Intl.DateTimeFormat('ar', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value))
})
</script>
