<template>
  <div class="builder-grid">
    <section class="panel">
      <h3>إنشاء منيو جديد</h3>
      <div class="field-grid">
        <label>
          <span>اسم المطعم</span>
          <input placeholder="مثال: Blossom House" />
        </label>
        <label>
          <span>عنوان المنيو</span>
          <input placeholder="مثال: Main Menu 2026" />
        </label>
        <label>
          <span>Slug</span>
          <input placeholder="blossom-house-main-menu" />
        </label>
        <label>
          <span>اختيار الستايل</span>
          <select>
            <option>Classic Luxury</option>
            <option>Clean Modern</option>
            <option>Dark Elegant</option>
            <option>Arabic Premium</option>
          </select>
        </label>
      </div>
      <label>
        <span>وصف مختصر</span>
        <textarea rows="4" placeholder="وصف المنيو أو ملاحظات النشر"></textarea>
      </label>
      <div class="actions-row">
        <button class="soft-btn primary-btn">حفظ كمسودة</button>
        <button class="soft-btn">معاينة</button>
      </div>
    </section>

    <section class="panel">
      <h3>رفع الصفحات والملفات</h3>
      <div class="upload-box">
        <strong>اسحب PDF أو صور الصفحات هنا</strong>
        <p>يدعم JPG / PNG / PDF</p>
      </div>

      <div class="upload-list">
        <div class="upload-item" v-for="i in 4" :key="i">
          <span>Page {{ i }}</span>
          <small>ready</small>
        </div>
      </div>
    </section>
  </div>
</template>
