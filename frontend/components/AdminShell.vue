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
        <NuxtLink to="/admin">الرئيسية</NuxtLink>
        <NuxtLink to="/admin/books">المنيوهات</NuxtLink>
        <NuxtLink to="/admin/themes">الستايلات</NuxtLink>
        <NuxtLink to="/admin/assets">الملفات</NuxtLink>
      </nav>
    </aside>

    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>
