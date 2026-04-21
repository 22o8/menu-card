<template>
  <FlipBookViewer :slug="slug" />
</template>

<script setup lang="ts">
import FlipBookViewer from '~/components/FlipBookViewer.vue'
const route = useRoute()
const slug = computed(() => String(route.params.slug || 'blossom-house-main-menu'))
</script>
