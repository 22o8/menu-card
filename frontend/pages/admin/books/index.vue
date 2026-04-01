<template>
  <AdminShell>
    <div class="page-head">
      <div>
        <span class="eyebrow">Books</span>
        <h1>إدارة المنيوهات</h1>
        <p>إنشاء، معاينة، ونشر عدة Menu Books بسهولة داخل واجهة أكثر احترافية.</p>
      </div>
      <NuxtLink to="/view/blossom-house-main-menu" class="soft-btn">معاينة المثال</NuxtLink>
    </div>

    <BookBuilderForm />

    <section class="panel panel-soft top-space">
      <div class="section-head compact-head">
        <h3>قائمة المنيوهات</h3>
        <small class="muted-text">تحديث مباشر من الـ API إن كان متوفرًا</small>
      </div>

      <div class="stack-list">
        <BookListCard v-for="book in books" :key="book.id" :book="book" @publish="handlePublish" />
      </div>
    </section>
  </AdminShell>
</template>

<script setup lang="ts">
import AdminShell from '~/components/AdminShell.vue'
import BookBuilderForm from '~/components/BookBuilderForm.vue'
import BookListCard from '~/components/BookListCard.vue'
import { useBooks } from '~/composables/useBooks'

const { books, loadBooks, publishBook } = useBooks()
await loadBooks()

const handlePublish = async (book: any) => {
  await publishBook(book.id)
}
</script>
