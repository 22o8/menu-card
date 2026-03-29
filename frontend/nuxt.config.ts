export default defineNuxtConfig({
  compatibilityDate: '2025-03-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5117/api'
    }
  },
  app: {
    head: {
      title: 'Menu Book SaaS',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'منصة إدارة منيو بوك تفاعلي للمطاعم' }
      ]
    }
  }
})
