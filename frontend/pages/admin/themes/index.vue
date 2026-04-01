<template>
  <AdminShell>
    <div class="page-head">
      <div>
        <span class="eyebrow">Themes</span>
        <h1>الثيمات الجاهزة</h1>
        <p>تم تحسين عرض الثيمات لتكون أوضح بصريًا ومناسبة لإضافة محرر ستايلات كامل لاحقًا.</p>
      </div>
      <button class="soft-btn primary-btn">إضافة ثيم</button>
    </div>

    <div class="theme-grid">
      <ThemeCard v-for="theme in themes" :key="theme.id" :theme="theme" />
    </div>
  </AdminShell>
</template>

<script setup lang="ts">
import AdminShell from '~/components/AdminShell.vue'
import ThemeCard from '~/components/ThemeCard.vue'
import { useThemes } from '~/composables/useThemes'

const { themes, loadThemes } = useThemes()
await loadThemes()
</script>
