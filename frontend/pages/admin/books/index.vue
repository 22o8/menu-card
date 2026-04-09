<template>
  <AdminShell>
    <div class="page-head">
      <div>
        <h1>إدارة المنيوهات</h1>
        <p>إنشاء، تعديل، ونشر عدة Menu Books بسهولة.</p>
      </div>
      <button class="soft-btn primary-btn">منيو جديد</button>
    </div>

    <BookBuilderForm />

    <section class="panel top-space">
      <h3>قائمة المنيوهات</h3>
      <div class="stack-list">
        <BookListCard v-for="book in books" :key="book.id" :book="book" />
      </div>
    </section>
  </AdminShell>
</template>

<script setup lang="ts">
import AdminShell from '~/components/AdminShell.vue'
import BookBuilderForm from '~/components/BookBuilderForm.vue'
import BookListCard from '~/components/BookListCard.vue'
import { useBooks } from '~/composables/useBooks'
const { books } = useBooks()
</script>
