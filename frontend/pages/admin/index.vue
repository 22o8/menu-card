<template>
  <AdminShell>
    <div class="page-head">
      <div>
        <h1>لوحة الإدارة</h1>
        <p>إدارة المنيوهات، الستايلات، والملفات من مكان واحد.</p>
      </div>
      <NuxtLink to="/admin/books" class="soft-btn primary-btn">إنشاء منيو</NuxtLink>
    </div>

    <div class="stats-grid">
      <StatsCard label="إجمالي المنيوهات" value="12" note="4 منشورة حاليًا" />
      <StatsCard label="إجمالي الزيارات" value="18,420" note="آخر 30 يوم" />
      <StatsCard label="الستايلات الجاهزة" value="4" note="قابلة للتوسع" />
      <StatsCard label="الملفات المرفوعة" value="96" note="صور + PDF" />
    </div>

    <div class="two-col-grid">
      <section class="panel">
        <h3>آخر المنيوهات</h3>
        <div class="stack-list">
          <BookListCard v-for="book in books" :key="book.id" :book="book" />
        </div>
      </section>

      <section class="panel">
        <h3>الستايلات الجاهزة</h3>
        <div class="theme-grid compact">
          <ThemeCard v-for="theme in themes" :key="theme.id" :theme="theme" />
        </div>
      </section>
    </div>
  </AdminShell>
</template>

<script setup lang="ts">
import AdminShell from '~/components/AdminShell.vue'
import StatsCard from '~/components/StatsCard.vue'
import BookListCard from '~/components/BookListCard.vue'
import ThemeCard from '~/components/ThemeCard.vue'
import { useBooks } from '~/composables/useBooks'
import { useThemes } from '~/composables/useThemes'

const { books } = useBooks()
const { themes } = useThemes()
</script>
