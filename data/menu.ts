export type MenuItem = {
  nameAr: string
  nameEn: string
  descAr: string
  descEn: string
  price: string
  badge?: 'chef' | 'spicy' | 'new'
}

export type MenuSpread = {
  leftTitleKey: string
  rightTitleKey: string
  leftItems: MenuItem[]
  rightItems: MenuItem[]
}

export const menuSpreads: MenuSpread[] = [
  {
    leftTitleKey: 'breakfast',
    rightTitleKey: 'salads',
    leftItems: [
      { nameAr: 'إفطار شرقي', nameEn: 'Oriental Breakfast', descAr: 'بيض، جبن، زيتون، خبز طازج', descEn: 'Eggs, cheese, olives, fresh bread', price: '8.50' },
      { nameAr: 'أومليت الشيف', nameEn: 'Chef Omelette', descAr: 'بيض مخفوق بالأعشاب والجبن', descEn: 'Fluffy eggs with herbs and cheese', price: '9.20', badge: 'chef' },
      { nameAr: 'كرواسون الزبدة', nameEn: 'Butter Croissant', descAr: 'يقدم مع المربى والزبدة', descEn: 'Served with butter and jam', price: '3.90' },
      { nameAr: 'بان كيك الفانيلا', nameEn: 'Vanilla Pancakes', descAr: 'مع عسل طبيعي وكريمة', descEn: 'With honey and cream', price: '7.80', badge: 'new' },
      { nameAr: 'توست أفوكادو', nameEn: 'Avocado Toast', descAr: 'خبز محمص مع أفوكادو وليمون', descEn: 'Toasted bread with avocado and lemon', price: '6.40' }
    ],
    rightItems: [
      { nameAr: 'سلطة المنزل', nameEn: 'House Salad', descAr: 'خس، خيار، طماطم، صوص خاص', descEn: 'Lettuce, cucumber, tomato, house dressing', price: '7.00' },
      { nameAr: 'سلطة يونانية', nameEn: 'Greek Salad', descAr: 'جبن فيتا، زيتون، خيار، طماطم', descEn: 'Feta, olives, cucumber, tomato', price: '8.50' },
      { nameAr: 'سلطة الروكا', nameEn: 'Rocket Salad', descAr: 'جرجير، رمان، بارميزان', descEn: 'Rocket leaves, pomegranate, parmesan', price: '8.90', badge: 'chef' },
      { nameAr: 'سلطة السيزر', nameEn: 'Caesar Salad', descAr: 'خس، دجاج، خبز محمص، بارميزان', descEn: 'Lettuce, chicken, croutons, parmesan', price: '9.80' },
      { nameAr: 'سلطة الكينوا', nameEn: 'Quinoa Salad', descAr: 'كينوا ملونة وخضار طازجة', descEn: 'Mixed quinoa with fresh vegetables', price: '10.20', badge: 'new' }
    ]
  },
  {
    leftTitleKey: 'soups',
    rightTitleKey: 'baguettes',
    leftItems: [
      { nameAr: 'شوربة العدس', nameEn: 'Lentil Soup', descAr: 'كلاسيكية كريمية مع ليمون', descEn: 'Creamy classic with lemon', price: '5.20' },
      { nameAr: 'شوربة الطماطم', nameEn: 'Tomato Soup', descAr: 'محضرة يوميًا وتقدم ساخنة', descEn: 'Freshly prepared and served warm', price: '5.90' },
      { nameAr: 'شوربة الفطر', nameEn: 'Mushroom Soup', descAr: 'بطعم غني وكريمة ناعمة', descEn: 'Rich flavor with smooth cream', price: '6.30', badge: 'chef' },
      { nameAr: 'شوربة الدجاج', nameEn: 'Chicken Soup', descAr: 'مرق غني مع خضار طازجة', descEn: 'Rich broth with fresh vegetables', price: '6.00' }
    ],
    rightItems: [
      { nameAr: 'باغيت جبن', nameEn: 'Cheese Baguette', descAr: 'جبن مذاب بخبز باغيت هش', descEn: 'Melted cheese in crispy baguette', price: '7.10' },
      { nameAr: 'باغيت دجاج', nameEn: 'Chicken Baguette', descAr: 'شرائح دجاج وصوص خاص', descEn: 'Chicken slices with house sauce', price: '8.40' },
      { nameAr: 'باغيت روست بيف', nameEn: 'Roast Beef Baguette', descAr: 'لحم بقري مشوي وخردل ناعم', descEn: 'Roast beef with light mustard', price: '9.30', badge: 'chef' },
      { nameAr: 'باغيت تونة', nameEn: 'Tuna Baguette', descAr: 'تونة مع خس وبصل أحمر', descEn: 'Tuna with lettuce and red onion', price: '7.90' },
      { nameAr: 'باغيت سبايسي', nameEn: 'Spicy Baguette', descAr: 'دجاج حار وجبن مدخن', descEn: 'Spicy chicken with smoked cheese', price: '8.80', badge: 'spicy' }
    ]
  },
  {
    leftTitleKey: 'mains',
    rightTitleKey: 'signature',
    leftItems: [
      { nameAr: 'فيليه مشوي', nameEn: 'Grilled Fillet', descAr: 'مع خضار موسمية وصوص فلفل', descEn: 'With seasonal vegetables and pepper sauce', price: '18.50', badge: 'chef' },
      { nameAr: 'دجاج بالكريمة', nameEn: 'Creamy Chicken', descAr: 'صدر دجاج مع صوص الفطر', descEn: 'Chicken breast with mushroom cream sauce', price: '15.40' },
      { nameAr: 'باستا ألفريدو', nameEn: 'Alfredo Pasta', descAr: 'باستا طازجة مع كريمة وجبن', descEn: 'Fresh pasta with cream and cheese', price: '13.90' },
      { nameAr: 'ستيك مشوي', nameEn: 'Grilled Steak', descAr: 'مطهو حسب الطلب مع بطاطا', descEn: 'Cooked to preference with potatoes', price: '22.00' },
      { nameAr: 'سمك اليوم', nameEn: 'Catch of the Day', descAr: 'يقدم مع صوص زبدة الليمون', descEn: 'Served with lemon butter sauce', price: '19.70', badge: 'new' }
    ],
    rightItems: [
      { nameAr: 'طبق السيغنتشر', nameEn: 'Signature Plate', descAr: 'تجربة طبق فاخر متكاملة', descEn: 'A complete premium signature experience', price: '24.50', badge: 'chef' },
      { nameAr: 'ريزوتو الزعفران', nameEn: 'Saffron Risotto', descAr: 'أرز كريمي بنكهة الزعفران', descEn: 'Creamy rice infused with saffron', price: '17.20' },
      { nameAr: 'روبيان حار', nameEn: 'Spicy Prawns', descAr: 'صوص خاص ولمسة فلفل حار', descEn: 'House sauce with a spicy kick', price: '21.10', badge: 'spicy' },
      { nameAr: 'طبق البحر', nameEn: 'Sea Platter', descAr: 'تشكيلة بحرية مختارة', descEn: 'Selected seafood assortment', price: '26.80' }
    ]
  },
  {
    leftTitleKey: 'desserts',
    rightTitleKey: 'drinks',
    leftItems: [
      { nameAr: 'تشيز كيك', nameEn: 'Cheesecake', descAr: 'ناعم ويقدم مع صوص التوت', descEn: 'Smooth and served with berry sauce', price: '6.50' },
      { nameAr: 'فوندان الشوكولاتة', nameEn: 'Chocolate Fondant', descAr: 'قلب سائل مع آيس كريم', descEn: 'Molten center with ice cream', price: '7.10', badge: 'chef' },
      { nameAr: 'تيراميسو', nameEn: 'Tiramisu', descAr: 'إيطالي كلاسيكي بلمسة فاخرة', descEn: 'Classic Italian with a premium twist', price: '6.90' },
      { nameAr: 'كريمة بروليه', nameEn: 'Crème Brûlée', descAr: 'قشرة كراميل مقرمشة', descEn: 'Crunchy caramelized top', price: '6.80' }
    ],
    rightItems: [
      { nameAr: 'إسبريسو', nameEn: 'Espresso', descAr: 'قهوة مركزة', descEn: 'Rich short coffee', price: '3.20' },
      { nameAr: 'كابتشينو', nameEn: 'Cappuccino', descAr: 'رغوة حليب ناعمة', descEn: 'Smooth milk foam', price: '4.10' },
      { nameAr: 'شاي فاخر', nameEn: 'Premium Tea', descAr: 'اختيار من أصناف الشاي', descEn: 'Selection of fine teas', price: '3.60' },
      { nameAr: 'عصير موسمي', nameEn: 'Seasonal Juice', descAr: 'طازج يوميًا', descEn: 'Freshly prepared daily', price: '4.50', badge: 'new' },
      { nameAr: 'موهيتو', nameEn: 'Mojito', descAr: 'منعش بالنعناع والليمون', descEn: 'Refreshing mint and lime', price: '5.20' }
    ]
  }
]
