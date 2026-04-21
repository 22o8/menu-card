<template>
  <AdminShell>
    <div class="page-head simple-head">
      <div>
        <h1>إدارة المنيو</h1>
        <p>هنا فقط ترفع PDF، ينقسم تلقائيًا إلى صفحات، وبعدها تقدر تعدل أو تضيف صفحات جديدة.</p>
      </div>
    </div>

    <section class="panel top-space">
      <div class="field-grid admin-key-grid">
        <label>
          <span>مفتاح الأدمن</span>
          <input v-model="adminKeyModel" type="password" placeholder="أدخل مفتاح الأدمن" />
        </label>
        <div class="key-actions">
          <button class="soft-btn primary-btn" @click="saveAdminKey">حفظ المفتاح</button>
          <small class="helper-text">كل عمليات الرفع والإنشاء محمية بهذا المفتاح فقط.</small>
        </div>
      </div>
    </section>

    <section class="panel top-space">
      <h2>إنشاء منيو جديد من PDF</h2>
      <div class="field-grid">
        <label>
          <span>اسم المطعم</span>
          <input v-model="form.restaurantName" placeholder="مثال: Blossom House" />
        </label>
        <label>
          <span>عنوان المنيو</span>
          <input v-model="form.title" placeholder="مثال: Main Menu" @input="syncSlug" />
        </label>
        <label>
          <span>Slug</span>
          <input v-model="form.slug" placeholder="blossom-house-main-menu" />
        </label>
        <label>
          <span>الثيم</span>
          <select v-model="form.themeId">
            <option v-for="theme in themes" :key="theme.id" :value="theme.id">{{ theme.name }}</option>
          </select>
        </label>
      </div>

      <label>
        <span>وصف مختصر</span>
        <textarea v-model="form.description" rows="3" placeholder="وصف مختصر للمنيو"></textarea>
      </label>

      <div class="upload-box pdf-box">
        <input class="hidden-input" type="file" accept="application/pdf" @change="onPdfSelected" />
        <strong>ارفع ملف PDF فقط</strong>
        <p v-if="!selectedPdf">النظام سيحوّل كل صفحات الملف تلقائيًا إلى صور ويضيفها داخل المنيو.</p>
        <p v-else>
          الملف: <b>{{ selectedPdf.name }}</b> — الصفحات المكتشفة: <b>{{ previewPages.length }}</b>
        </p>
      </div>

      <div v-if="previewPages.length" class="preview-strip">
        <div v-for="page in previewPages.slice(0, 8)" :key="page.order" class="thumb-card">
          <img :src="page.imageBase64" :alt="page.title" />
          <span>صفحة {{ page.order }}</span>
        </div>
      </div>

      <div class="actions-row top-space">
        <button class="soft-btn primary-btn" :disabled="saving || !previewPages.length" @click="submitBook">
          {{ saving ? 'جاري الإنشاء...' : 'إنشاء المنيو من PDF' }}
        </button>
        <span class="helper-text">{{ statusMessage }}</span>
      </div>
    </section>

    <section class="panel top-space">
      <div class="page-head compact-head">
        <div>
          <h2>المنيوهات الحالية</h2>
          <p>اضغط تعديل حتى تضيف صفحات PDF جديدة أو تحذف صفحات من المنيو.</p>
        </div>
        <button class="soft-btn" @click="reload">تحديث</button>
      </div>

      <div class="stack-list" v-if="books.length">
        <div class="book-list-card" v-for="book in books" :key="book.id">
          <div>
            <div class="book-card-title-row">
              <h3>{{ book.title }}</h3>
              <span class="status-pill" :class="book.status">{{ book.status }}</span>
            </div>
            <p>{{ book.restaurantName }} — {{ book.pageCount }} صفحة</p>
            <small class="muted-line">/{{ book.slug }}</small>
          </div>

          <div class="book-card-actions">
            <NuxtLink class="soft-btn" :to="`/view/${book.slug}`">عرض</NuxtLink>
            <NuxtLink class="soft-btn" :to="`/admin/sss/${book.id}`">تعديل</NuxtLink>
            <button class="soft-btn danger-btn" @click="removeBook(book.id)">حذف</button>
          </div>
        </div>
      </div>
      <p v-else class="helper-text">لا يوجد أي منيو حاليًا.</p>
    </section>
  </AdminShell>
</template>

<script setup lang="ts">
import AdminShell from '~/components/AdminShell.vue'
import { pdfToImages } from '~/utils/pdf'
import { useBooks } from '~/composables/useBooks'
import { useThemes } from '~/composables/useThemes'
import { useApi } from '~/composables/useApi'

const { books, loadBooks, createBook, deleteBook } = useBooks()
const { themes, loadThemes, fallbackThemes } = useThemes()
const { adminKey } = useApi()
const adminKeyModel = ref('')
const selectedPdf = ref<File | null>(null)
const previewPages = ref<Array<{ title: string; imageBase64: string; order: number }>>([])
const saving = ref(false)
const statusMessage = ref('')
const form = reactive({
  restaurantName: '',
  title: '',
  slug: '',
  description: '',
  themeId: 'theme-1'
})

const slugify = (value: string) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')

const syncSlug = () => {
  if (!form.slug || form.slug === slugify(form.title)) {
    form.slug = slugify(form.title)
  }
}

const saveAdminKey = () => {
  adminKey.value = adminKeyModel.value.trim()
  if (process.client) localStorage.setItem('menu-admin-key', adminKey.value)
  statusMessage.value = adminKey.value ? 'تم حفظ مفتاح الأدمن.' : 'أدخل مفتاحًا صحيحًا.'
}

const onPdfSelected = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  selectedPdf.value = file
  statusMessage.value = 'جاري تحويل الـ PDF إلى صفحات...'
  const converted = await pdfToImages(file)
  previewPages.value = converted.pages
  statusMessage.value = `تم تجهيز ${converted.pageCount} صفحة.`
}

const submitBook = async () => {
  if (!adminKey.value) {
    statusMessage.value = 'أدخل مفتاح الأدمن أولًا.'
    return
  }
  if (!previewPages.value.length) {
    statusMessage.value = 'ارفع ملف PDF أولًا.'
    return
  }
  saving.value = true
  statusMessage.value = 'جاري إنشاء المنيو...'
  try {
    await createBook({
      restaurantName: form.restaurantName,
      title: form.title,
      slug: form.slug,
      description: form.description,
      themeId: form.themeId,
      pages: previewPages.value,
      publish: true
    })
    Object.assign(form, { restaurantName: '', title: '', slug: '', description: '', themeId: themes.value[0]?.id || fallbackThemes[0].id })
    selectedPdf.value = null
    previewPages.value = []
    statusMessage.value = 'تم إنشاء المنيو بنجاح.'
  } catch (error: any) {
    statusMessage.value = error?.data || 'فشل إنشاء المنيو.'
  } finally {
    saving.value = false
  }
}

const reload = async () => {
  await Promise.all([loadBooks(), loadThemes()])
}

const removeBook = async (id: string) => {
  if (!confirm('هل تريد حذف هذا المنيو؟')) return
  try {
    await deleteBook(id)
  } catch (error: any) {
    alert(error?.data || 'تعذر حذف المنيو')
  }
}

onMounted(async () => {
  await Promise.all([loadBooks(), loadThemes()])
  if (!themes.value.length) themes.value = fallbackThemes
  if (process.client) {
    const saved = localStorage.getItem('menu-admin-key') || ''
    adminKey.value = saved
    adminKeyModel.value = saved
  }
  form.themeId = themes.value[0]?.id || fallbackThemes[0].id
})
</script>
