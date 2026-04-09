<template>
  <AdminShell>
    <div class="page-head">
      <div>
        <h1>الستايلات الجاهزة</h1>
        <p>النسخة الأولى تحتوي على 4 Themes ويمكن لاحقًا إضافة محرر ستايلات كامل.</p>
      </div>
      <button class="soft-btn primary-btn">إضافة ستايل</button>
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
const { themes } = useThemes()
</script>
