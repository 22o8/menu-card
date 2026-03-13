import { computed, ref, watch } from 'vue'

const locale = ref<'ar' | 'en'>('ar')
const theme = ref<'dark' | 'light'>('dark')

const messages = {
  ar: {
    topPhone: '000 000 0000',
    topEmail: 'info@example.com',
    brand: 'Luxury Menu',
    nav: {
      home: 'الرئيسية',
      menu: 'المنيو',
      about: 'من نحن',
      catering: 'الضيافة',
      news: 'الأخبار',
      contact: 'تواصل',
      menuCard: 'كارت المنيو'
    },
    heroTag: 'تصميم فاخر مستوحى من مواقع المطاعم الراقية',
    heroTitle: 'اكتشف منيو رقمي بإحساس كتاب حقيقي',
    heroText: 'واجهة راقية مع عارض منيو في المنتصف، حركة تقليب صفحات مثل الدفتر، وتجربة ثنائية اللغة مناسبة للـ QR Menu.',
    openMenu: 'فتح المنيو',
    preview: 'استعراض المعاينة',
    callOrder: 'اتصل واطلب',
    footerText: 'تجربة منيو راقية قابلة للتخصيص بالكامل.',
    viewer: {
      coverTitle: 'قائمة الطعام',
      coverSubtitle: 'Luxury Dining Experience',
      chooseLanguage: 'اختر اللغة',
      page: 'صفحة',
      of: 'من',
      zoomIn: 'تكبير',
      zoomOut: 'تصغير',
      reset: 'إعادة',
      share: 'مشاركة',
      fullscreen: 'ملء الشاشة'
    },
    sections: {
      breakfast: 'الفطور',
      salads: 'السلطات',
      soups: 'الشوربات',
      baguettes: 'الباغيت',
      mains: 'الأطباق الرئيسية',
      desserts: 'الحلويات',
      drinks: 'المشروبات',
      signature: 'أطباق خاصة'
    },
    notes: {
      spicy: 'حار',
      chef: 'اختيار الشيف',
      new: 'جديد'
    }
  },
  en: {
    topPhone: '000 000 0000',
    topEmail: 'info@example.com',
    brand: 'Luxury Menu',
    nav: {
      home: 'Home',
      menu: 'Menu',
      about: 'About Us',
      catering: 'Catering',
      news: 'News',
      contact: 'Contact',
      menuCard: 'Menu Card'
    },
    heroTag: 'Luxury design inspired by premium restaurant websites',
    heroTitle: 'Discover a digital menu with a real book feel',
    heroText: 'Elegant interface with a centered menu viewer, notebook-like page flips, and a bilingual QR-ready experience.',
    openMenu: 'Open Menu',
    preview: 'Preview',
    callOrder: 'Call and order',
    footerText: 'A premium menu experience, fully customizable.',
    viewer: {
      coverTitle: 'Menu Card',
      coverSubtitle: 'Luxury Dining Experience',
      chooseLanguage: 'Choose language',
      page: 'Page',
      of: 'of',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      reset: 'Reset',
      share: 'Share',
      fullscreen: 'Fullscreen'
    },
    sections: {
      breakfast: 'Breakfast',
      salads: 'Salads',
      soups: 'Soups',
      baguettes: 'Baguettes',
      mains: 'Main Courses',
      desserts: 'Desserts',
      drinks: 'Drinks',
      signature: 'Signature'
    },
    notes: {
      spicy: 'Spicy',
      chef: 'Chef Choice',
      new: 'New'
    }
  }
}

export function useLocale() {
  const t = computed(() => messages[locale.value])
  const dir = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'))

  if (process.client) {
    const storedLocale = localStorage.getItem('menu-locale') as 'ar' | 'en' | null
    const storedTheme = localStorage.getItem('menu-theme') as 'dark' | 'light' | null
    if (storedLocale) locale.value = storedLocale
    if (storedTheme) theme.value = storedTheme
  }

  watch(locale, (value) => {
    if (process.client) localStorage.setItem('menu-locale', value)
  }, { immediate: true })

  watch(theme, (value) => {
    if (process.client) localStorage.setItem('menu-theme', value)
  }, { immediate: true })

  return {
    locale,
    theme,
    t,
    dir,
    toggleLocale: () => {
      locale.value = locale.value === 'ar' ? 'en' : 'ar'
    },
    setLocale: (value: 'ar' | 'en') => {
      locale.value = value
    },
    toggleTheme: () => {
      theme.value = theme.value === 'dark' ? 'light' : 'dark'
    }
  }
}
