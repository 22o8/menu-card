<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <NuxtLink to="/" class="brand-block brand-link">
        <div class="brand-mark">MB</div>
        <div>
          <strong>MenuBook</strong>
          <p>Simple Admin</p>
        </div>
      </NuxtLink>

      <nav class="sidebar-nav">
        <NuxtLink to="/admin/sss">إدارة المنيوهات</NuxtLink>
      </nav>
    </aside>

    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>
