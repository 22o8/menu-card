<template>
  <div class="builder-grid">
    <section class="panel panel-soft">
      <div class="section-head compact-head">
        <div>
          <span class="eyebrow">Quick Builder</span>
          <h3>إنشاء منيو جديد</h3>
        </div>
        <div class="helper-badge">Draft First</div>
      </div>

      <form class="field-stack" @submit.prevent="submitForm">
        <div class="field-grid">
          <label>
            <span>اسم المطعم</span>
            <input v-model.trim="form.restaurantName" placeholder="مثال: Blossom House" />
          </label>
          <label>
            <span>عنوان المنيو</span>
            <input v-model.trim="form.title" placeholder="مثال: Main Menu 2026" @input="syncSlug" />
          </label>
          <label>
            <span>Slug</span>
            <input v-model.trim="form.slug" dir="ltr" placeholder="blossom-house-main-menu" />
          </label>
          <label>
            <span>اختيار الثيم</span>
            <select v-model="form.themeId">
              <option v-for="theme in themes" :key="theme.id" :value="theme.id">{{ theme.name }}</option>
            </select>
          </label>
        </div>

        <label>
          <span>وصف مختصر</span>
          <textarea v-model.trim="form.description" rows="4" placeholder="وصف يوضح نوع المنيو أو ملاحظات النشر"></textarea>
        </label>

        <div class="actions-row split-actions">
          <button class="soft-btn primary-btn" :disabled="pending">
            {{ pending ? 'جاري الحفظ...' : 'إنشاء كمسودة' }}
          </button>
          <NuxtLink v-if="form.slug" :to="`/view/${form.slug}`" class="soft-btn">معاينة الرابط</NuxtLink>
        </div>

        <p v-if="feedback" class="form-feedback">{{ feedback }}</p>
      </form>
    </section>

    <section class="panel panel-soft preview-panel">
      <div class="section-head compact-head">
        <div>
          <span class="eyebrow">Live Preview</span>
          <h3>بطاقة المنيو قبل الحفظ</h3>
        </div>
      </div>

      <div class="preview-book-card" :style="previewStyle">
        <div class="preview-book-meta">
          <strong>{{ form.title || 'عنوان المنيو' }}</strong>
          <span>{{ form.restaurantName || 'اسم المطعم' }}</span>
        </div>
        <p>{{ form.description || 'أضف وصفًا مختصرًا يظهر هنا لعرض شكل البطاقة داخل الأدمن.' }}</p>
        <div class="preview-book-footer">
          <small>{{ selectedTheme?.name || 'Theme' }}</small>
          <small>/{{ form.slug || 'menu-slug' }}</small>
        </div>
      </div>

      <div class="upload-box compact-upload">
        <strong>منطقة الملفات</strong>
        <p>تم تجهيز الواجهة لاستقبال PDF أو صور الصفحات لاحقًا عند ربط الرفع الحقيقي.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useBooks } from '~/composables/useBooks'
import { useThemes } from '~/composables/useThemes'

const { createBook, pending } = useBooks()
const { themes } = useThemes()
const feedback = ref('')

const form = reactive({
  restaurantName: 'Blossom House',
  title: '',
  slug: '',
  description: '',
  themeId: 'theme-1'
})

const slugify = (value: string) => value
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')

const syncSlug = () => {
  if (!form.slug || form.slug === slugify(form.title.slice(0, -1))) {
    form.slug = slugify(form.title)
  }
}

const selectedTheme = computed(() => themes.value.find((theme) => theme.id === form.themeId))
const previewStyle = computed(() => ({
  background: selectedTheme.value?.background,
  borderColor: `${selectedTheme.value?.accent || '#d6b36a'}55`
}))

const submitForm = async () => {
  if (!form.restaurantName || !form.title || !form.slug) {
    feedback.value = 'أكمل اسم المطعم، عنوان المنيو، و الـ slug أولًا.'
    return
  }

  const result = await createBook({ ...form })
  feedback.value = result.ok
    ? 'تم إنشاء المنيو بنجاح داخل الـ API.'
    : 'تم إنشاء المنيو محليًا كنسخة احتياطية لأن الاتصال بالـ API غير متاح حاليًا.'

  form.title = ''
  form.slug = ''
  form.description = ''
}
</script>
