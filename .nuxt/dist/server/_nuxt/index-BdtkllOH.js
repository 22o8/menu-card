import { defineComponent, ref, computed, watch, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
import { u as useHead } from "./v3-BojIiCh6.js";
import "C:/Users/Administrator/Desktop/restaurant-qr-menu-clean-stable/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/Administrator/Desktop/restaurant-qr-menu-clean-stable/node_modules/hookable/dist/index.mjs";
import "C:/Users/Administrator/Desktop/restaurant-qr-menu-clean-stable/node_modules/unctx/dist/index.mjs";
import "C:/Users/Administrator/Desktop/restaurant-qr-menu-clean-stable/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/Administrator/Desktop/restaurant-qr-menu-clean-stable/node_modules/defu/dist/defu.mjs";
import "C:/Users/Administrator/Desktop/restaurant-qr-menu-clean-stable/node_modules/ufo/dist/index.mjs";
import "C:/Users/Administrator/Desktop/restaurant-qr-menu-clean-stable/node_modules/@unhead/vue/dist/index.mjs";
const menuSpreads = [
  {
    leftTitleKey: "breakfast",
    rightTitleKey: "salads",
    leftItems: [
      { nameAr: "إفطار شرقي", nameEn: "Oriental Breakfast", descAr: "بيض، جبن، زيتون، خبز طازج", descEn: "Eggs, cheese, olives, fresh bread", price: "8.50" },
      { nameAr: "أومليت الشيف", nameEn: "Chef Omelette", descAr: "بيض مخفوق بالأعشاب والجبن", descEn: "Fluffy eggs with herbs and cheese", price: "9.20", badge: "chef" },
      { nameAr: "كرواسون الزبدة", nameEn: "Butter Croissant", descAr: "يقدم مع المربى والزبدة", descEn: "Served with butter and jam", price: "3.90" },
      { nameAr: "بان كيك الفانيلا", nameEn: "Vanilla Pancakes", descAr: "مع عسل طبيعي وكريمة", descEn: "With honey and cream", price: "7.80", badge: "new" },
      { nameAr: "توست أفوكادو", nameEn: "Avocado Toast", descAr: "خبز محمص مع أفوكادو وليمون", descEn: "Toasted bread with avocado and lemon", price: "6.40" }
    ],
    rightItems: [
      { nameAr: "سلطة المنزل", nameEn: "House Salad", descAr: "خس، خيار، طماطم، صوص خاص", descEn: "Lettuce, cucumber, tomato, house dressing", price: "7.00" },
      { nameAr: "سلطة يونانية", nameEn: "Greek Salad", descAr: "جبن فيتا، زيتون، خيار، طماطم", descEn: "Feta, olives, cucumber, tomato", price: "8.50" },
      { nameAr: "سلطة الروكا", nameEn: "Rocket Salad", descAr: "جرجير، رمان، بارميزان", descEn: "Rocket leaves, pomegranate, parmesan", price: "8.90", badge: "chef" },
      { nameAr: "سلطة السيزر", nameEn: "Caesar Salad", descAr: "خس، دجاج، خبز محمص، بارميزان", descEn: "Lettuce, chicken, croutons, parmesan", price: "9.80" },
      { nameAr: "سلطة الكينوا", nameEn: "Quinoa Salad", descAr: "كينوا ملونة وخضار طازجة", descEn: "Mixed quinoa with fresh vegetables", price: "10.20", badge: "new" }
    ]
  },
  {
    leftTitleKey: "soups",
    rightTitleKey: "baguettes",
    leftItems: [
      { nameAr: "شوربة العدس", nameEn: "Lentil Soup", descAr: "كلاسيكية كريمية مع ليمون", descEn: "Creamy classic with lemon", price: "5.20" },
      { nameAr: "شوربة الطماطم", nameEn: "Tomato Soup", descAr: "محضرة يوميًا وتقدم ساخنة", descEn: "Freshly prepared and served warm", price: "5.90" },
      { nameAr: "شوربة الفطر", nameEn: "Mushroom Soup", descAr: "بطعم غني وكريمة ناعمة", descEn: "Rich flavor with smooth cream", price: "6.30", badge: "chef" },
      { nameAr: "شوربة الدجاج", nameEn: "Chicken Soup", descAr: "مرق غني مع خضار طازجة", descEn: "Rich broth with fresh vegetables", price: "6.00" }
    ],
    rightItems: [
      { nameAr: "باغيت جبن", nameEn: "Cheese Baguette", descAr: "جبن مذاب بخبز باغيت هش", descEn: "Melted cheese in crispy baguette", price: "7.10" },
      { nameAr: "باغيت دجاج", nameEn: "Chicken Baguette", descAr: "شرائح دجاج وصوص خاص", descEn: "Chicken slices with house sauce", price: "8.40" },
      { nameAr: "باغيت روست بيف", nameEn: "Roast Beef Baguette", descAr: "لحم بقري مشوي وخردل ناعم", descEn: "Roast beef with light mustard", price: "9.30", badge: "chef" },
      { nameAr: "باغيت تونة", nameEn: "Tuna Baguette", descAr: "تونة مع خس وبصل أحمر", descEn: "Tuna with lettuce and red onion", price: "7.90" },
      { nameAr: "باغيت سبايسي", nameEn: "Spicy Baguette", descAr: "دجاج حار وجبن مدخن", descEn: "Spicy chicken with smoked cheese", price: "8.80", badge: "spicy" }
    ]
  },
  {
    leftTitleKey: "mains",
    rightTitleKey: "signature",
    leftItems: [
      { nameAr: "فيليه مشوي", nameEn: "Grilled Fillet", descAr: "مع خضار موسمية وصوص فلفل", descEn: "With seasonal vegetables and pepper sauce", price: "18.50", badge: "chef" },
      { nameAr: "دجاج بالكريمة", nameEn: "Creamy Chicken", descAr: "صدر دجاج مع صوص الفطر", descEn: "Chicken breast with mushroom cream sauce", price: "15.40" },
      { nameAr: "باستا ألفريدو", nameEn: "Alfredo Pasta", descAr: "باستا طازجة مع كريمة وجبن", descEn: "Fresh pasta with cream and cheese", price: "13.90" },
      { nameAr: "ستيك مشوي", nameEn: "Grilled Steak", descAr: "مطهو حسب الطلب مع بطاطا", descEn: "Cooked to preference with potatoes", price: "22.00" },
      { nameAr: "سمك اليوم", nameEn: "Catch of the Day", descAr: "يقدم مع صوص زبدة الليمون", descEn: "Served with lemon butter sauce", price: "19.70", badge: "new" }
    ],
    rightItems: [
      { nameAr: "طبق السيغنتشر", nameEn: "Signature Plate", descAr: "تجربة طبق فاخر متكاملة", descEn: "A complete premium signature experience", price: "24.50", badge: "chef" },
      { nameAr: "ريزوتو الزعفران", nameEn: "Saffron Risotto", descAr: "أرز كريمي بنكهة الزعفران", descEn: "Creamy rice infused with saffron", price: "17.20" },
      { nameAr: "روبيان حار", nameEn: "Spicy Prawns", descAr: "صوص خاص ولمسة فلفل حار", descEn: "House sauce with a spicy kick", price: "21.10", badge: "spicy" },
      { nameAr: "طبق البحر", nameEn: "Sea Platter", descAr: "تشكيلة بحرية مختارة", descEn: "Selected seafood assortment", price: "26.80" }
    ]
  },
  {
    leftTitleKey: "desserts",
    rightTitleKey: "drinks",
    leftItems: [
      { nameAr: "تشيز كيك", nameEn: "Cheesecake", descAr: "ناعم ويقدم مع صوص التوت", descEn: "Smooth and served with berry sauce", price: "6.50" },
      { nameAr: "فوندان الشوكولاتة", nameEn: "Chocolate Fondant", descAr: "قلب سائل مع آيس كريم", descEn: "Molten center with ice cream", price: "7.10", badge: "chef" },
      { nameAr: "تيراميسو", nameEn: "Tiramisu", descAr: "إيطالي كلاسيكي بلمسة فاخرة", descEn: "Classic Italian with a premium twist", price: "6.90" },
      { nameAr: "كريمة بروليه", nameEn: "Crème Brûlée", descAr: "قشرة كراميل مقرمشة", descEn: "Crunchy caramelized top", price: "6.80" }
    ],
    rightItems: [
      { nameAr: "إسبريسو", nameEn: "Espresso", descAr: "قهوة مركزة", descEn: "Rich short coffee", price: "3.20" },
      { nameAr: "كابتشينو", nameEn: "Cappuccino", descAr: "رغوة حليب ناعمة", descEn: "Smooth milk foam", price: "4.10" },
      { nameAr: "شاي فاخر", nameEn: "Premium Tea", descAr: "اختيار من أصناف الشاي", descEn: "Selection of fine teas", price: "3.60" },
      { nameAr: "عصير موسمي", nameEn: "Seasonal Juice", descAr: "طازج يوميًا", descEn: "Freshly prepared daily", price: "4.50", badge: "new" },
      { nameAr: "موهيتو", nameEn: "Mojito", descAr: "منعش بالنعناع والليمون", descEn: "Refreshing mint and lime", price: "5.20" }
    ]
  }
];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MenuBookCard",
  __ssrInlineRender: true,
  setup(__props) {
    const locale = ref("en");
    const ready = ref(false);
    const currentPage = ref(0);
    const currentSpread = ref(1);
    const totalSpreads = ref(1);
    ref(1);
    ref(null);
    const uiMap = {
      ar: {
        kicker: "LUXURY DIGITAL MENU",
        coverTitle: "قائمة الطعام",
        coverSubtitle: "تجربة منيو فاخرة بحركة صفحات ناعمة مثل الكتاب الحقيقي.",
        premiumDining: "خدمة راقية",
        bookExperience: "إحساس دفتر واقعي",
        sectionsLabel: "المنيو",
        badges: {
          chef: "اختيار الشيف",
          spicy: "حار",
          new: "جديد"
        },
        sections: {
          breakfast: "الفطور",
          salads: "السلطات",
          soups: "الشوربات",
          baguettes: "الباغيت",
          mains: "الأطباق الرئيسية",
          desserts: "الحلويات",
          drinks: "المشروبات",
          signature: "أطباق خاصة"
        }
      },
      en: {
        kicker: "LUXURY DIGITAL MENU",
        coverTitle: "Menu Card",
        coverSubtitle: "A refined luxury menu with smooth page motion like a real book.",
        premiumDining: "Premium Dining",
        bookExperience: "Real Book Feel",
        sectionsLabel: "MENU",
        badges: {
          chef: "Chef Choice",
          spicy: "Spicy",
          new: "New"
        },
        sections: {
          breakfast: "Breakfast",
          salads: "Salads",
          soups: "Soups",
          baguettes: "Baguettes",
          mains: "Main Courses",
          desserts: "Desserts",
          drinks: "Drinks",
          signature: "Signature"
        }
      }
    };
    const ui = computed(() => uiMap[locale.value]);
    const pages = computed(() => {
      const currentUi = ui.value;
      const localizedBadge = (badge) => badge ? currentUi.badges[badge] : void 0;
      const pageModels = [
        { id: "cover-left", type: "cover", side: "left" },
        { id: "cover-right", type: "cover", side: "right" }
      ];
      menuSpreads.forEach((spread, index) => {
        pageModels.push({
          id: `spread-${index + 1}-left`,
          type: "menu",
          side: "left",
          eyebrow: currentUi.sectionsLabel,
          title: currentUi.sections[spread.leftTitleKey],
          items: spread.leftItems.map((item) => ({
            title: locale.value === "ar" ? item.nameAr : item.nameEn,
            desc: locale.value === "ar" ? item.descAr : item.descEn,
            price: item.price,
            badge: localizedBadge(item.badge)
          }))
        });
        pageModels.push({
          id: `spread-${index + 1}-right`,
          type: "menu",
          side: "right",
          eyebrow: currentUi.sectionsLabel,
          title: currentUi.sections[spread.rightTitleKey],
          items: spread.rightItems.map((item) => ({
            title: locale.value === "ar" ? item.nameAr : item.nameEn,
            desc: locale.value === "ar" ? item.descAr : item.descEn,
            price: item.price,
            badge: localizedBadge(item.badge)
          }))
        });
      });
      return pageModels;
    });
    const spreadIndicator = computed(() => `${currentSpread.value} / ${totalSpreads.value}`);
    const atStart = computed(() => currentPage.value <= 0);
    const atEnd = computed(() => currentPage.value >= pages.value.length - 1);
    async function initFlipBook(targetIndex = 0) {
      return;
    }
    watch(locale, async () => {
      const keepPage = currentPage.value;
      await initFlipBook(keepPage);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "menu-card-screen",
        dir: "ltr"
      }, _attrs))} data-v-3c0023d7><div class="ambient ambient-top" data-v-3c0023d7></div><div class="ambient ambient-left" data-v-3c0023d7></div><div class="ambient ambient-right" data-v-3c0023d7></div><div class="viewer-shell" data-v-3c0023d7><button class="nav-arrow nav-arrow-left" type="button"${ssrIncludeBooleanAttr(!ready.value || atStart.value) ? " disabled" : ""} aria-label="Previous page" data-v-3c0023d7> ‹ </button><div class="viewer-center" data-v-3c0023d7><div class="book-frame" data-v-3c0023d7><div class="frame-glow" data-v-3c0023d7></div><div class="flip-book" data-v-3c0023d7><!--[-->`);
      ssrRenderList(pages.value, (page) => {
        _push(`<div class="${ssrRenderClass([[
          page.type === "cover" ? "page-cover" : "page-menu",
          page.side === "left" ? "page-left" : "page-right"
        ], "page js-page"])}" data-v-3c0023d7><div class="${ssrRenderClass([page.side === "left" ? "page-inner-left" : "page-inner-right", "page-inner"])}" data-v-3c0023d7>`);
        if (page.type === "cover") {
          _push(`<div class="${ssrRenderClass([page.side === "left" ? "cover-surface-left" : "cover-surface-right", "cover-surface"])}" data-v-3c0023d7><div class="foil-outline" data-v-3c0023d7></div><div class="cover-noise" data-v-3c0023d7></div><div class="cover-orb cover-orb-top" data-v-3c0023d7></div><div class="cover-orb cover-orb-bottom" data-v-3c0023d7></div>`);
          if (page.side === "left") {
            _push(`<div class="cover-spine-mark" data-v-3c0023d7></div>`);
          } else {
            _push(`<div class="cover-content" data-v-3c0023d7><p class="cover-kicker" data-v-3c0023d7>${ssrInterpolate(ui.value.kicker)}</p><h1 class="cover-title" data-v-3c0023d7>${ssrInterpolate(ui.value.coverTitle)}</h1><p class="cover-subtitle" data-v-3c0023d7>${ssrInterpolate(ui.value.coverSubtitle)}</p><div class="cover-meta" data-v-3c0023d7><span data-v-3c0023d7>${ssrInterpolate(ui.value.premiumDining)}</span><span data-v-3c0023d7>${ssrInterpolate(ui.value.bookExperience)}</span></div></div>`);
          }
          _push(`</div>`);
        } else {
          _push(`<article class="${ssrRenderClass([page.side === "left" ? "menu-surface-left" : "menu-surface-right", "menu-surface"])}" data-v-3c0023d7><div class="foil-outline" data-v-3c0023d7></div><div class="menu-flourish menu-flourish-top" data-v-3c0023d7></div><div class="menu-flourish menu-flourish-bottom" data-v-3c0023d7></div><header class="menu-header" data-v-3c0023d7><span class="menu-kicker" data-v-3c0023d7>${ssrInterpolate(page.eyebrow)}</span><h2 class="menu-title" data-v-3c0023d7>${ssrInterpolate(page.title)}</h2></header><div class="menu-items" data-v-3c0023d7><!--[-->`);
          ssrRenderList(page.items, (item) => {
            _push(`<article class="menu-item" data-v-3c0023d7><div class="menu-copy" data-v-3c0023d7><div class="item-title-row" data-v-3c0023d7><h3 class="item-title" data-v-3c0023d7>${ssrInterpolate(item.title)}</h3>`);
            if (item.badge) {
              _push(`<span class="item-badge" data-v-3c0023d7>${ssrInterpolate(item.badge)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><p class="item-desc" data-v-3c0023d7>${ssrInterpolate(item.desc)}</p></div><strong class="item-price" data-v-3c0023d7>${ssrInterpolate(item.price)}</strong></article>`);
          });
          _push(`<!--]--></div></article>`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div></div><div class="toolbar" data-v-3c0023d7><button class="toolbar-btn" type="button" aria-label="Zoom out" data-v-3c0023d7>−</button><button class="toolbar-btn" type="button" aria-label="Zoom in" data-v-3c0023d7>+</button><button class="toolbar-btn" type="button"${ssrIncludeBooleanAttr(!ready.value || atStart.value) ? " disabled" : ""} aria-label="Previous" data-v-3c0023d7> ❮ </button><div class="toolbar-indicator" data-v-3c0023d7>${ssrInterpolate(spreadIndicator.value)}</div><button class="toolbar-btn" type="button"${ssrIncludeBooleanAttr(!ready.value || atEnd.value) ? " disabled" : ""} aria-label="Next" data-v-3c0023d7> ❯ </button><button class="toolbar-btn toolbar-btn-locale" type="button" data-v-3c0023d7>${ssrInterpolate(locale.value === "ar" ? "EN" : "AR")}</button></div></div><button class="nav-arrow nav-arrow-right" type="button"${ssrIncludeBooleanAttr(!ready.value || atEnd.value) ? " disabled" : ""} aria-label="Next page" data-v-3c0023d7> › </button></div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MenuBookCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-3c0023d7"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Luxury Menu Card"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_MenuBookCard = __nuxt_component_0;
      _push(ssrRenderComponent(_component_MenuBookCard, _attrs, null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-BdtkllOH.js.map
