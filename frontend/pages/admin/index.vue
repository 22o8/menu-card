<template>
  <AdminShell>
    <div class="page-head">
      <div>
        <span class="eyebrow">Overview</span>
        <h1>لوحة الإدارة</h1>
        <p>إدارة المنيوهات، الثيمات، والملفات من مكان واحد مع واجهة أوضح وأكثر جاهزية للتوسع.</p>
      </div>
      <NuxtLink to="/admin/books" class="soft-btn primary-btn">إنشاء منيو</NuxtLink>
    </div>

    <div class="stats-grid">
      <StatsCard label="إجمالي المنيوهات" :value="summary.totalBooks" :note="`${summary.publishedBooks} منشورة حاليًا`" />
      <StatsCard label="إجمالي الزيارات" :value="summary.totalViews.toLocaleString()" note="من جميع الروابط" />
      <StatsCard label="إجمالي الصفحات" :value="summary.totalPages" note="داخل كل المنيوهات" />
      <StatsCard label="الملفات الجاهزة" :value="summary.totalAssets" note="صور + خامات + PDF" />
    </div>

    <div class="two-col-grid">
      <section class="panel panel-soft">
        <div class="section-head compact-head">
          <h3>آخر المنيوهات</h3>
          <small class="muted-text">{{ books.length }} عنصر</small>
        </div>

        <div class="stack-list">
          <BookListCard
            v-for="book in books"
            :key="book.id"
            :book="book"
            @publish="handlePublish"
            @preview="selectedBook = $event"
          />
        </div>
      </section>

      <section class="panel panel-soft">
        <div class="section-head compact-head">
          <h3>الثيمات الجاهزة</h3>
          <small class="muted-text">{{ themes.length }} ثيم</small>
        </div>

        <div class="theme-grid compact">
          <ThemeCard v-for="theme in themes" :key="theme.id" :theme="theme" />
        </div>
      </section>
    </div>

    <section v-if="selectedBook" class="panel panel-soft top-space">
      <div class="section-head compact-head">
        <h3>تفاصيل سريعة</h3>
        <button class="soft-btn" @click="selectedBook = null">إغلاق</button>
      </div>
      <div class="detail-grid">
        <div>
          <strong>{{ selectedBook.title }}</strong>
          <p>{{ selectedBook.description || 'لا يوجد وصف مضاف بعد.' }}</p>
        </div>
        <div class="book-meta-chips wrap-chips">
          <span>{{ selectedBook.restaurantName }}</span>
          <span>{{ selectedBook.pages.length }} صفحات</span>
          <span>{{ selectedBook.views }} مشاهدة</span>
          <span>{{ selectedBook.status }}</span>
        </div>
      </div>
    </section>
  </AdminShell>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MenuBook } from '~/types'
import AdminShell from '~/components/AdminShell.vue'
import StatsCard from '~/components/StatsCard.vue'
import BookListCard from '~/components/BookListCard.vue'
import ThemeCard from '~/components/ThemeCard.vue'
import { useBooks } from '~/composables/useBooks'
import { useDashboard } from '~/composables/useDashboard'
import { useThemes } from '~/composables/useThemes'

const selectedBook = ref<MenuBook | null>(null)
const { books, loadBooks, publishBook } = useBooks()
const { summary, loadSummary } = useDashboard()
const { themes, loadThemes } = useThemes()

await Promise.all([loadBooks(), loadSummary(), loadThemes()])

const handlePublish = async (book: MenuBook) => {
  await publishBook(book.id)
  await loadSummary()
}
</script>
