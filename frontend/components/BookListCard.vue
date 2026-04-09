<template>
  <div class="book-list-card">
    <div>
      <div class="book-card-title-row">
        <h3>{{ book.title }}</h3>
        <span class="status-pill" :class="book.status">{{ book.status }}</span>
      </div>
      <p>{{ book.restaurantName }} • {{ book.pageCount }} صفحات</p>
      <small>{{ book.slug }}</small>
    </div>

    <div class="book-card-actions">
      <NuxtLink :to="`/view/${book.slug}`" class="soft-btn">عرض</NuxtLink>
      <button class="soft-btn">تعديل</button>
      <button class="soft-btn primary-btn">نشر</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuBook } from '~/types'
defineProps<{ book: MenuBook }>()
</script>
