<template>
  <AdminShell>
    <div class="page-head">
      <div>
        <h1>مكتبة الملفات</h1>
        <p>صور الصفحات، الأغلفة، خامات الورق، وملفات PDF.</p>
      </div>
      <button class="soft-btn primary-btn">رفع ملفات</button>
    </div>

    <div class="panel">
      <div class="asset-grid">
        <div class="asset-card" v-for="item in assets" :key="item.name">
          <div class="asset-thumb"></div>
          <strong>{{ item.name }}</strong>
          <small>{{ item.type }}</small>
        </div>
      </div>
    </div>
  </AdminShell>
</template>

<script setup lang="ts">
import AdminShell from '~/components/AdminShell.vue'
const assets = [
  { name: 'cover.jpg', type: 'Image' },
  { name: 'page-1.jpg', type: 'Image' },
  { name: 'paper-light.jpg', type: 'Texture' },
  { name: 'restaurant-menu.pdf', type: 'PDF' },
  { name: 'flip-soft.mp3', type: 'Audio' },
  { name: 'logo.svg', type: 'Brand Asset' }
]
</script>
