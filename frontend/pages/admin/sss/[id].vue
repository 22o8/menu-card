<template>
  <AdminShell>
    <div class="page-head simple-head">
      <div>
        <h1>تعديل المنيو</h1>
        <p>تحديث بيانات المنيو أو إضافة صفحات جديدة من PDF أو حذف أي صفحة.</p>
      </div>
      <NuxtLink to="/admin/sss" class="soft-btn">رجوع</NuxtLink>
    </div>

    <section class="panel top-space" v-if="book">
      <div class="field-grid admin-key-grid">
        <label>
          <span>مفتاح الأدمن</span>
          <input v-model="adminKeyModel" type="password" placeholder="أدخل مفتاح الأدمن" />
        </label>
        <div class="key-actions">
          <button class="soft-btn primary-btn" @click="saveAdminKey">حفظ المفتاح</button>
          <small class="helper-text">بدون المفتاح لن تعمل الإضافة والحذف والتعديل.</small>
        </div>
      </div>
    </section>

    <section class="panel top-space" v-if="book">
      <h2>بيانات المنيو</h2>
      <div class="field-grid">
        <label><span>اسم المطعم</span><input v-model="form.restaurantName" /></label>
        <label><span>عنوان المنيو</span><input v-model="form.title" /></label>
        <label><span>Slug</span><input v-model="form.slug" /></label>
        <label>
          <span>الثيم</span>
          <select v-model="form.themeId">
            <option v-for="theme in themes" :key="theme.id" :value="theme.id">{{ theme.name }}</option>
          </select>
        </label>
      </div>
      <label><span>الوصف</span><textarea v-model="form.description" rows="3"></textarea></label>
      <div class="actions-row">
        <button class="soft-btn primary-btn" @click="saveBook">حفظ التعديلات</button>
        <NuxtLink class="soft-btn" :to="`/view/${book.slug}`">عرض المنيو</NuxtLink>
      </div>
    </section>

    <section class="panel top-space" v-if="book">
      <h2>إضافة صفحات جديدة من PDF</h2>
      <div class="upload-box pdf-box">
        <input class="hidden-input" type="file" accept="application/pdf" @change="onPdfSelected" />
        <strong>رفع PDF جديد</strong>
        <p v-if="!selectedPdf">سيتم إضافة صفحاته في نهاية المنيو الحالي تلقائيًا.</p>
        <p v-else>تم تجهيز {{ previewPages.length }} صفحة جديدة من الملف {{ selectedPdf.name }}</p>
      </div>

      <div v-if="previewPages.length" class="preview-strip">
        <div v-for="page in previewPages.slice(0, 8)" :key="page.order" class="thumb-card">
          <img :src="page.imageBase64" :alt="page.title" />
          <span>صفحة {{ page.order }}</span>
        </div>
      </div>

      <div class="actions-row top-space">
        <button class="soft-btn primary-btn" @click="appendPages">إضافة الصفحات</button>
        <span class="helper-text">{{ statusMessage }}</span>
      </div>
    </section>

    <section class="panel top-space" v-if="book">
      <h2>صفحات المنيو الحالية</h2>
      <div class="pages-grid">
        <div class="page-card" v-for="page in book.pages" :key="page.id">
          <img :src="page.imageUrl" :alt="page.title" />
          <div class="page-card-meta">
            <strong>{{ page.title }}</strong>
            <small>الترتيب: {{ page.order }}</small>
          </div>
          <button class="soft-btn danger-btn full-width" @click="removePage(page.id)">حذف الصفحة</button>
        </div>
      </div>
    </section>
  </AdminShell>
</template>

<script setup lang="ts">
import AdminShell from '~/components/AdminShell.vue'
import { pdfToImages } from '~/utils/pdf'
import { useBooks } from '~/composables/useBooks'
import { useThemes } from '~/composables/useThemes'
import { useApi } from '~/composables/useApi'

const route = useRoute()
const id = String(route.params.id)
const { getBookById, updateBook, addPages, deletePage } = useBooks()
const { themes, loadThemes, fallbackThemes } = useThemes()
const { adminKey } = useApi()
const adminKeyModel = ref('')
const selectedPdf = ref<File | null>(null)
const previewPages = ref<Array<{ title: string; imageBase64: string; order: number }>>([])
const book = ref<any>(null)
const statusMessage = ref('')
const form = reactive({ restaurantName: '', title: '', slug: '', description: '', themeId: 'theme-1' })

const fillForm = () => {
  if (!book.value) return
  form.restaurantName = book.value.restaurantName
  form.title = book.value.title
  form.slug = book.value.slug
  form.description = book.value.description || ''
  form.themeId = book.value.themeId
}

const saveAdminKey = () => {
  adminKey.value = adminKeyModel.value.trim()
  if (process.client) localStorage.setItem('menu-admin-key', adminKey.value)
  statusMessage.value = 'تم حفظ مفتاح الأدمن.'
}

const loadBook = async () => {
  book.value = await getBookById(id)
  fillForm()
}

const saveBook = async () => {
  try {
    book.value = await updateBook(id, { ...form, publish: book.value.status === 'published' })
    fillForm()
    statusMessage.value = 'تم حفظ التعديلات.'
  } catch (error: any) {
    statusMessage.value = error?.data || 'فشل حفظ التعديلات.'
  }
}

const onPdfSelected = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  selectedPdf.value = file
  statusMessage.value = 'جاري تجهيز الصفحات الجديدة...'
  const converted = await pdfToImages(file)
  previewPages.value = converted.pages
  statusMessage.value = `تم تجهيز ${converted.pageCount} صفحة جديدة.`
}

const appendPages = async () => {
  if (!previewPages.value.length) return
  try {
    book.value = await addPages(id, { pages: previewPages.value })
    previewPages.value = []
    selectedPdf.value = null
    statusMessage.value = 'تمت إضافة الصفحات.'
  } catch (error: any) {
    statusMessage.value = error?.data || 'فشل إضافة الصفحات.'
  }
}

const removePage = async (pageId: string) => {
  if (!confirm('هل تريد حذف الصفحة؟')) return
  try {
    await deletePage(id, pageId)
    await loadBook()
  } catch (error: any) {
    statusMessage.value = error?.data || 'فشل حذف الصفحة.'
  }
}

onMounted(async () => {
  await loadThemes()
  if (!themes.value.length) themes.value = fallbackThemes
  if (process.client) {
    const saved = localStorage.getItem('menu-admin-key') || ''
    adminKey.value = saved
    adminKeyModel.value = saved
  }
  await loadBook()
})
</script>
