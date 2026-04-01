<template>
  <div class="landing-shell page-shell">
    <section class="hero-card hero-upgraded">
      <div class="hero-copy">
        <span class="eyebrow">Menu Book SaaS</span>
        <h1>منصة احترافية لإنشاء منيو تفاعلي بأسلوب FlipBook واقعي</h1>
        <p>
          مشروع حديث يجمع بين واجهة إدارية أنيقة، API جاهز للتوسع، وعارض منيو يليق بالمطاعم والعلامات التي تريد تجربة عرض راقية على الهاتف والديسكتوب.
        </p>

        <div class="hero-actions">
          <NuxtLink to="/admin" class="soft-btn primary-btn">الدخول إلى الأدمن</NuxtLink>
          <NuxtLink to="/view/blossom-house-main-menu" class="soft-btn">مشاهدة مثال حي</NuxtLink>
        </div>

        <div class="hero-metrics">
          <div>
            <strong>{{ books.length }}</strong>
            <span>نماذج منيو</span>
          </div>
          <div>
            <strong>{{ themes.length }}</strong>
            <span>ثيمات جاهزة</span>
          </div>
          <div>
            <strong>SSR</strong>
            <span>جاهز للنشر</span>
          </div>
        </div>
      </div>

      <div class="hero-book-mock premium-book-scene">
        <div class="hero-cover">MENU</div>
        <div class="hero-pages"></div>
        <div class="hero-glow"></div>
      </div>
    </section>

    <section class="panel panel-soft">
      <div class="section-head">
        <div>
          <span class="eyebrow">Highlights</span>
          <h2>النسخة الحالية بعد رفع المستوى</h2>
        </div>
      </div>

      <div class="feature-grid">
        <article class="feature-card">
          <h3>واجهة أجمل وأكثر تنظيمًا</h3>
          <p>تم تحسين الصفحة الرئيسية، لوحة الإدارة، بطاقات البيانات، وتصميم العرض ليظهر بشكل أنظف وأقوى.</p>
        </article>
        <article class="feature-card">
          <h3>ربط API حقيقي مع Fallback</h3>
          <p>الفرونت صار يحاول يجلب البيانات من الباك، وإذا تعذر الاتصال يبقى المشروع شغال على البيانات الاحتياطية.</p>
        </article>
        <article class="feature-card">
          <h3>عناصر قابلة للتوسع</h3>
          <p>تم تجهيز هيكل أوضح لإدارة المنيوهات، الثيمات، الملفات، والإحصائيات لتمهيد التطويرات القادمة.</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useBooks } from '~/composables/useBooks'
import { useThemes } from '~/composables/useThemes'

const { books, loadBooks } = useBooks()
const { themes, loadThemes } = useThemes()

await Promise.all([loadBooks(), loadThemes()])
</script>
