<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <div class="brand-block">
        <div class="brand-mark">MB</div>
        <div>
          <strong>MenuBook</strong>
          <p>Admin Dashboard</p>
        </div>
      </div>

      <nav class="sidebar-nav">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to">
          <span>{{ item.label }}</span>
          <small>{{ item.note }}</small>
        </NuxtLink>
      </nav>

      <div class="sidebar-foot-note">
        <strong>جاهز للتوسع</strong>
        <p>هيكل الإدارة صار أوضح، منظم، ومهيأ للإنتقال لاحقًا إلى نظام SaaS كامل.</p>
      </div>
    </aside>

    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const navItems = [
  { to: '/admin', label: 'الرئيسية', note: 'نظرة عامة' },
  { to: '/admin/books', label: 'المنيوهات', note: 'إنشاء وإدارة' },
  { to: '/admin/themes', label: 'الثيمات', note: 'ستايلات العرض' },
  { to: '/admin/assets', label: 'الملفات', note: 'الصور والخامات' }
]
</script>
