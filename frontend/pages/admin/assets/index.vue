<template>
  <AdminShell>
    <div class="page-head">
      <div>
        <span class="eyebrow">Assets</span>
        <h1>مكتبة الملفات</h1>
        <p>صور الصفحات، الأغلفة، خامات الورق، وملفات PDF ضمن عرض مرتب وجاهز للتطوير لاحقًا.</p>
      </div>
      <button class="soft-btn primary-btn">رفع ملفات</button>
    </div>

    <div class="panel panel-soft">
      <div class="asset-grid">
        <div class="asset-card" v-for="item in assets" :key="item.id">
          <div class="asset-thumb"></div>
          <strong>{{ item.name }}</strong>
          <small>{{ item.type }}</small>
          <small class="muted-text">{{ formatSize(item.sizeInBytes) }}</small>
        </div>
      </div>
    </div>
  </AdminShell>
</template>

<script setup lang="ts">
import AdminShell from '~/components/AdminShell.vue'
import { useAssets } from '~/composables/useAssets'

const { assets, loadAssets } = useAssets()
await loadAssets()

const formatSize = (size: number) => {
  if (size >= 1_000_000) return `${(size / 1_000_000).toFixed(1)} MB`
  if (size >= 1_000) return `${Math.round(size / 1_000)} KB`
  return `${size} B`
}
</script>
