import { defineComponent, ref, computed, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import { u as useHead } from './v3-BojIiCh6.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const menuSpreads = [
  {
    leftTitleKey: "breakfast",
    rightTitleKey: "salads",
    leftItems: [
      { nameAr: "\u0625\u0641\u0637\u0627\u0631 \u0634\u0631\u0642\u064A", nameEn: "Oriental Breakfast", descAr: "\u0628\u064A\u0636\u060C \u062C\u0628\u0646\u060C \u0632\u064A\u062A\u0648\u0646\u060C \u062E\u0628\u0632 \u0637\u0627\u0632\u062C", descEn: "Eggs, cheese, olives, fresh bread", price: "8.50" },
      { nameAr: "\u0623\u0648\u0645\u0644\u064A\u062A \u0627\u0644\u0634\u064A\u0641", nameEn: "Chef Omelette", descAr: "\u0628\u064A\u0636 \u0645\u062E\u0641\u0648\u0642 \u0628\u0627\u0644\u0623\u0639\u0634\u0627\u0628 \u0648\u0627\u0644\u062C\u0628\u0646", descEn: "Fluffy eggs with herbs and cheese", price: "9.20", badge: "chef" },
      { nameAr: "\u0643\u0631\u0648\u0627\u0633\u0648\u0646 \u0627\u0644\u0632\u0628\u062F\u0629", nameEn: "Butter Croissant", descAr: "\u064A\u0642\u062F\u0645 \u0645\u0639 \u0627\u0644\u0645\u0631\u0628\u0649 \u0648\u0627\u0644\u0632\u0628\u062F\u0629", descEn: "Served with butter and jam", price: "3.90" },
      { nameAr: "\u0628\u0627\u0646 \u0643\u064A\u0643 \u0627\u0644\u0641\u0627\u0646\u064A\u0644\u0627", nameEn: "Vanilla Pancakes", descAr: "\u0645\u0639 \u0639\u0633\u0644 \u0637\u0628\u064A\u0639\u064A \u0648\u0643\u0631\u064A\u0645\u0629", descEn: "With honey and cream", price: "7.80", badge: "new" },
      { nameAr: "\u062A\u0648\u0633\u062A \u0623\u0641\u0648\u0643\u0627\u062F\u0648", nameEn: "Avocado Toast", descAr: "\u062E\u0628\u0632 \u0645\u062D\u0645\u0635 \u0645\u0639 \u0623\u0641\u0648\u0643\u0627\u062F\u0648 \u0648\u0644\u064A\u0645\u0648\u0646", descEn: "Toasted bread with avocado and lemon", price: "6.40" }
    ],
    rightItems: [
      { nameAr: "\u0633\u0644\u0637\u0629 \u0627\u0644\u0645\u0646\u0632\u0644", nameEn: "House Salad", descAr: "\u062E\u0633\u060C \u062E\u064A\u0627\u0631\u060C \u0637\u0645\u0627\u0637\u0645\u060C \u0635\u0648\u0635 \u062E\u0627\u0635", descEn: "Lettuce, cucumber, tomato, house dressing", price: "7.00" },
      { nameAr: "\u0633\u0644\u0637\u0629 \u064A\u0648\u0646\u0627\u0646\u064A\u0629", nameEn: "Greek Salad", descAr: "\u062C\u0628\u0646 \u0641\u064A\u062A\u0627\u060C \u0632\u064A\u062A\u0648\u0646\u060C \u062E\u064A\u0627\u0631\u060C \u0637\u0645\u0627\u0637\u0645", descEn: "Feta, olives, cucumber, tomato", price: "8.50" },
      { nameAr: "\u0633\u0644\u0637\u0629 \u0627\u0644\u0631\u0648\u0643\u0627", nameEn: "Rocket Salad", descAr: "\u062C\u0631\u062C\u064A\u0631\u060C \u0631\u0645\u0627\u0646\u060C \u0628\u0627\u0631\u0645\u064A\u0632\u0627\u0646", descEn: "Rocket leaves, pomegranate, parmesan", price: "8.90", badge: "chef" },
      { nameAr: "\u0633\u0644\u0637\u0629 \u0627\u0644\u0633\u064A\u0632\u0631", nameEn: "Caesar Salad", descAr: "\u062E\u0633\u060C \u062F\u062C\u0627\u062C\u060C \u062E\u0628\u0632 \u0645\u062D\u0645\u0635\u060C \u0628\u0627\u0631\u0645\u064A\u0632\u0627\u0646", descEn: "Lettuce, chicken, croutons, parmesan", price: "9.80" },
      { nameAr: "\u0633\u0644\u0637\u0629 \u0627\u0644\u0643\u064A\u0646\u0648\u0627", nameEn: "Quinoa Salad", descAr: "\u0643\u064A\u0646\u0648\u0627 \u0645\u0644\u0648\u0646\u0629 \u0648\u062E\u0636\u0627\u0631 \u0637\u0627\u0632\u062C\u0629", descEn: "Mixed quinoa with fresh vegetables", price: "10.20", badge: "new" }
    ]
  },
  {
    leftTitleKey: "soups",
    rightTitleKey: "baguettes",
    leftItems: [
      { nameAr: "\u0634\u0648\u0631\u0628\u0629 \u0627\u0644\u0639\u062F\u0633", nameEn: "Lentil Soup", descAr: "\u0643\u0644\u0627\u0633\u064A\u0643\u064A\u0629 \u0643\u0631\u064A\u0645\u064A\u0629 \u0645\u0639 \u0644\u064A\u0645\u0648\u0646", descEn: "Creamy classic with lemon", price: "5.20" },
      { nameAr: "\u0634\u0648\u0631\u0628\u0629 \u0627\u0644\u0637\u0645\u0627\u0637\u0645", nameEn: "Tomato Soup", descAr: "\u0645\u062D\u0636\u0631\u0629 \u064A\u0648\u0645\u064A\u064B\u0627 \u0648\u062A\u0642\u062F\u0645 \u0633\u0627\u062E\u0646\u0629", descEn: "Freshly prepared and served warm", price: "5.90" },
      { nameAr: "\u0634\u0648\u0631\u0628\u0629 \u0627\u0644\u0641\u0637\u0631", nameEn: "Mushroom Soup", descAr: "\u0628\u0637\u0639\u0645 \u063A\u0646\u064A \u0648\u0643\u0631\u064A\u0645\u0629 \u0646\u0627\u0639\u0645\u0629", descEn: "Rich flavor with smooth cream", price: "6.30", badge: "chef" },
      { nameAr: "\u0634\u0648\u0631\u0628\u0629 \u0627\u0644\u062F\u062C\u0627\u062C", nameEn: "Chicken Soup", descAr: "\u0645\u0631\u0642 \u063A\u0646\u064A \u0645\u0639 \u062E\u0636\u0627\u0631 \u0637\u0627\u0632\u062C\u0629", descEn: "Rich broth with fresh vegetables", price: "6.00" }
    ],
    rightItems: [
      { nameAr: "\u0628\u0627\u063A\u064A\u062A \u062C\u0628\u0646", nameEn: "Cheese Baguette", descAr: "\u062C\u0628\u0646 \u0645\u0630\u0627\u0628 \u0628\u062E\u0628\u0632 \u0628\u0627\u063A\u064A\u062A \u0647\u0634", descEn: "Melted cheese in crispy baguette", price: "7.10" },
      { nameAr: "\u0628\u0627\u063A\u064A\u062A \u062F\u062C\u0627\u062C", nameEn: "Chicken Baguette", descAr: "\u0634\u0631\u0627\u0626\u062D \u062F\u062C\u0627\u062C \u0648\u0635\u0648\u0635 \u062E\u0627\u0635", descEn: "Chicken slices with house sauce", price: "8.40" },
      { nameAr: "\u0628\u0627\u063A\u064A\u062A \u0631\u0648\u0633\u062A \u0628\u064A\u0641", nameEn: "Roast Beef Baguette", descAr: "\u0644\u062D\u0645 \u0628\u0642\u0631\u064A \u0645\u0634\u0648\u064A \u0648\u062E\u0631\u062F\u0644 \u0646\u0627\u0639\u0645", descEn: "Roast beef with light mustard", price: "9.30", badge: "chef" },
      { nameAr: "\u0628\u0627\u063A\u064A\u062A \u062A\u0648\u0646\u0629", nameEn: "Tuna Baguette", descAr: "\u062A\u0648\u0646\u0629 \u0645\u0639 \u062E\u0633 \u0648\u0628\u0635\u0644 \u0623\u062D\u0645\u0631", descEn: "Tuna with lettuce and red onion", price: "7.90" },
      { nameAr: "\u0628\u0627\u063A\u064A\u062A \u0633\u0628\u0627\u064A\u0633\u064A", nameEn: "Spicy Baguette", descAr: "\u062F\u062C\u0627\u062C \u062D\u0627\u0631 \u0648\u062C\u0628\u0646 \u0645\u062F\u062E\u0646", descEn: "Spicy chicken with smoked cheese", price: "8.80", badge: "spicy" }
    ]
  },
  {
    leftTitleKey: "mains",
    rightTitleKey: "signature",
    leftItems: [
      { nameAr: "\u0641\u064A\u0644\u064A\u0647 \u0645\u0634\u0648\u064A", nameEn: "Grilled Fillet", descAr: "\u0645\u0639 \u062E\u0636\u0627\u0631 \u0645\u0648\u0633\u0645\u064A\u0629 \u0648\u0635\u0648\u0635 \u0641\u0644\u0641\u0644", descEn: "With seasonal vegetables and pepper sauce", price: "18.50", badge: "chef" },
      { nameAr: "\u062F\u062C\u0627\u062C \u0628\u0627\u0644\u0643\u0631\u064A\u0645\u0629", nameEn: "Creamy Chicken", descAr: "\u0635\u062F\u0631 \u062F\u062C\u0627\u062C \u0645\u0639 \u0635\u0648\u0635 \u0627\u0644\u0641\u0637\u0631", descEn: "Chicken breast with mushroom cream sauce", price: "15.40" },
      { nameAr: "\u0628\u0627\u0633\u062A\u0627 \u0623\u0644\u0641\u0631\u064A\u062F\u0648", nameEn: "Alfredo Pasta", descAr: "\u0628\u0627\u0633\u062A\u0627 \u0637\u0627\u0632\u062C\u0629 \u0645\u0639 \u0643\u0631\u064A\u0645\u0629 \u0648\u062C\u0628\u0646", descEn: "Fresh pasta with cream and cheese", price: "13.90" },
      { nameAr: "\u0633\u062A\u064A\u0643 \u0645\u0634\u0648\u064A", nameEn: "Grilled Steak", descAr: "\u0645\u0637\u0647\u0648 \u062D\u0633\u0628 \u0627\u0644\u0637\u0644\u0628 \u0645\u0639 \u0628\u0637\u0627\u0637\u0627", descEn: "Cooked to preference with potatoes", price: "22.00" },
      { nameAr: "\u0633\u0645\u0643 \u0627\u0644\u064A\u0648\u0645", nameEn: "Catch of the Day", descAr: "\u064A\u0642\u062F\u0645 \u0645\u0639 \u0635\u0648\u0635 \u0632\u0628\u062F\u0629 \u0627\u0644\u0644\u064A\u0645\u0648\u0646", descEn: "Served with lemon butter sauce", price: "19.70", badge: "new" }
    ],
    rightItems: [
      { nameAr: "\u0637\u0628\u0642 \u0627\u0644\u0633\u064A\u063A\u0646\u062A\u0634\u0631", nameEn: "Signature Plate", descAr: "\u062A\u062C\u0631\u0628\u0629 \u0637\u0628\u0642 \u0641\u0627\u062E\u0631 \u0645\u062A\u0643\u0627\u0645\u0644\u0629", descEn: "A complete premium signature experience", price: "24.50", badge: "chef" },
      { nameAr: "\u0631\u064A\u0632\u0648\u062A\u0648 \u0627\u0644\u0632\u0639\u0641\u0631\u0627\u0646", nameEn: "Saffron Risotto", descAr: "\u0623\u0631\u0632 \u0643\u0631\u064A\u0645\u064A \u0628\u0646\u0643\u0647\u0629 \u0627\u0644\u0632\u0639\u0641\u0631\u0627\u0646", descEn: "Creamy rice infused with saffron", price: "17.20" },
      { nameAr: "\u0631\u0648\u0628\u064A\u0627\u0646 \u062D\u0627\u0631", nameEn: "Spicy Prawns", descAr: "\u0635\u0648\u0635 \u062E\u0627\u0635 \u0648\u0644\u0645\u0633\u0629 \u0641\u0644\u0641\u0644 \u062D\u0627\u0631", descEn: "House sauce with a spicy kick", price: "21.10", badge: "spicy" },
      { nameAr: "\u0637\u0628\u0642 \u0627\u0644\u0628\u062D\u0631", nameEn: "Sea Platter", descAr: "\u062A\u0634\u0643\u064A\u0644\u0629 \u0628\u062D\u0631\u064A\u0629 \u0645\u062E\u062A\u0627\u0631\u0629", descEn: "Selected seafood assortment", price: "26.80" }
    ]
  },
  {
    leftTitleKey: "desserts",
    rightTitleKey: "drinks",
    leftItems: [
      { nameAr: "\u062A\u0634\u064A\u0632 \u0643\u064A\u0643", nameEn: "Cheesecake", descAr: "\u0646\u0627\u0639\u0645 \u0648\u064A\u0642\u062F\u0645 \u0645\u0639 \u0635\u0648\u0635 \u0627\u0644\u062A\u0648\u062A", descEn: "Smooth and served with berry sauce", price: "6.50" },
      { nameAr: "\u0641\u0648\u0646\u062F\u0627\u0646 \u0627\u0644\u0634\u0648\u0643\u0648\u0644\u0627\u062A\u0629", nameEn: "Chocolate Fondant", descAr: "\u0642\u0644\u0628 \u0633\u0627\u0626\u0644 \u0645\u0639 \u0622\u064A\u0633 \u0643\u0631\u064A\u0645", descEn: "Molten center with ice cream", price: "7.10", badge: "chef" },
      { nameAr: "\u062A\u064A\u0631\u0627\u0645\u064A\u0633\u0648", nameEn: "Tiramisu", descAr: "\u0625\u064A\u0637\u0627\u0644\u064A \u0643\u0644\u0627\u0633\u064A\u0643\u064A \u0628\u0644\u0645\u0633\u0629 \u0641\u0627\u062E\u0631\u0629", descEn: "Classic Italian with a premium twist", price: "6.90" },
      { nameAr: "\u0643\u0631\u064A\u0645\u0629 \u0628\u0631\u0648\u0644\u064A\u0647", nameEn: "Cr\xE8me Br\xFBl\xE9e", descAr: "\u0642\u0634\u0631\u0629 \u0643\u0631\u0627\u0645\u064A\u0644 \u0645\u0642\u0631\u0645\u0634\u0629", descEn: "Crunchy caramelized top", price: "6.80" }
    ],
    rightItems: [
      { nameAr: "\u0625\u0633\u0628\u0631\u064A\u0633\u0648", nameEn: "Espresso", descAr: "\u0642\u0647\u0648\u0629 \u0645\u0631\u0643\u0632\u0629", descEn: "Rich short coffee", price: "3.20" },
      { nameAr: "\u0643\u0627\u0628\u062A\u0634\u064A\u0646\u0648", nameEn: "Cappuccino", descAr: "\u0631\u063A\u0648\u0629 \u062D\u0644\u064A\u0628 \u0646\u0627\u0639\u0645\u0629", descEn: "Smooth milk foam", price: "4.10" },
      { nameAr: "\u0634\u0627\u064A \u0641\u0627\u062E\u0631", nameEn: "Premium Tea", descAr: "\u0627\u062E\u062A\u064A\u0627\u0631 \u0645\u0646 \u0623\u0635\u0646\u0627\u0641 \u0627\u0644\u0634\u0627\u064A", descEn: "Selection of fine teas", price: "3.60" },
      { nameAr: "\u0639\u0635\u064A\u0631 \u0645\u0648\u0633\u0645\u064A", nameEn: "Seasonal Juice", descAr: "\u0637\u0627\u0632\u062C \u064A\u0648\u0645\u064A\u064B\u0627", descEn: "Freshly prepared daily", price: "4.50", badge: "new" },
      { nameAr: "\u0645\u0648\u0647\u064A\u062A\u0648", nameEn: "Mojito", descAr: "\u0645\u0646\u0639\u0634 \u0628\u0627\u0644\u0646\u0639\u0646\u0627\u0639 \u0648\u0627\u0644\u0644\u064A\u0645\u0648\u0646", descEn: "Refreshing mint and lime", price: "5.20" }
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
        coverTitle: "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0637\u0639\u0627\u0645",
        coverSubtitle: "\u062A\u062C\u0631\u0628\u0629 \u0645\u0646\u064A\u0648 \u0641\u0627\u062E\u0631\u0629 \u0628\u062D\u0631\u0643\u0629 \u0635\u0641\u062D\u0627\u062A \u0646\u0627\u0639\u0645\u0629 \u0645\u062B\u0644 \u0627\u0644\u0643\u062A\u0627\u0628 \u0627\u0644\u062D\u0642\u064A\u0642\u064A.",
        premiumDining: "\u062E\u062F\u0645\u0629 \u0631\u0627\u0642\u064A\u0629",
        bookExperience: "\u0625\u062D\u0633\u0627\u0633 \u062F\u0641\u062A\u0631 \u0648\u0627\u0642\u0639\u064A",
        sectionsLabel: "\u0627\u0644\u0645\u0646\u064A\u0648",
        badges: {
          chef: "\u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0634\u064A\u0641",
          spicy: "\u062D\u0627\u0631",
          new: "\u062C\u062F\u064A\u062F"
        },
        sections: {
          breakfast: "\u0627\u0644\u0641\u0637\u0648\u0631",
          salads: "\u0627\u0644\u0633\u0644\u0637\u0627\u062A",
          soups: "\u0627\u0644\u0634\u0648\u0631\u0628\u0627\u062A",
          baguettes: "\u0627\u0644\u0628\u0627\u063A\u064A\u062A",
          mains: "\u0627\u0644\u0623\u0637\u0628\u0627\u0642 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",
          desserts: "\u0627\u0644\u062D\u0644\u0648\u064A\u0627\u062A",
          drinks: "\u0627\u0644\u0645\u0634\u0631\u0648\u0628\u0627\u062A",
          signature: "\u0623\u0637\u0628\u0627\u0642 \u062E\u0627\u0635\u0629"
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
      }, _attrs))} data-v-3c0023d7><div class="ambient ambient-top" data-v-3c0023d7></div><div class="ambient ambient-left" data-v-3c0023d7></div><div class="ambient ambient-right" data-v-3c0023d7></div><div class="viewer-shell" data-v-3c0023d7><button class="nav-arrow nav-arrow-left" type="button"${ssrIncludeBooleanAttr(!ready.value || atStart.value) ? " disabled" : ""} aria-label="Previous page" data-v-3c0023d7> \u2039 </button><div class="viewer-center" data-v-3c0023d7><div class="book-frame" data-v-3c0023d7><div class="frame-glow" data-v-3c0023d7></div><div class="flip-book" data-v-3c0023d7><!--[-->`);
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
      _push(`<!--]--></div></div><div class="toolbar" data-v-3c0023d7><button class="toolbar-btn" type="button" aria-label="Zoom out" data-v-3c0023d7>\u2212</button><button class="toolbar-btn" type="button" aria-label="Zoom in" data-v-3c0023d7>+</button><button class="toolbar-btn" type="button"${ssrIncludeBooleanAttr(!ready.value || atStart.value) ? " disabled" : ""} aria-label="Previous" data-v-3c0023d7> \u276E </button><div class="toolbar-indicator" data-v-3c0023d7>${ssrInterpolate(spreadIndicator.value)}</div><button class="toolbar-btn" type="button"${ssrIncludeBooleanAttr(!ready.value || atEnd.value) ? " disabled" : ""} aria-label="Next" data-v-3c0023d7> \u276F </button><button class="toolbar-btn toolbar-btn-locale" type="button" data-v-3c0023d7>${ssrInterpolate(locale.value === "ar" ? "EN" : "AR")}</button></div></div><button class="nav-arrow nav-arrow-right" type="button"${ssrIncludeBooleanAttr(!ready.value || atEnd.value) ? " disabled" : ""} aria-label="Next page" data-v-3c0023d7> \u203A </button></div></section>`);
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

export { _sfc_main as default };
//# sourceMappingURL=index-BdtkllOH.mjs.map
