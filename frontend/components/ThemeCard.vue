<template>
  <div class="theme-card">
    <div class="theme-preview" :style="{ background: theme.background }">
      <div class="mini-book" :style="{ borderColor: theme.accent }">
        <span :style="{ color: theme.accent }">{{ theme.name }}</span>
      </div>
    </div>
    <div class="theme-meta">
      <h3>{{ theme.name }}</h3>
      <p>{{ theme.preset }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ThemeConfig } from '~/types'
defineProps<{ theme: ThemeConfig }>()
</script>
