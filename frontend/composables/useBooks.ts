import type { MenuBook } from '~/types'

const demoPages = [
  { id: 'p1', title: 'Cover', imageUrl: '/demo/cover.jpg', order: 1 },
  { id: 'p2', title: 'Breakfast', imageUrl: '/demo/page-1.jpg', order: 2 },
  { id: 'p3', title: 'Main Dishes', imageUrl: '/demo/page-2.jpg', order: 3 },
  { id: 'p4', title: 'Desserts', imageUrl: '/demo/page-3.jpg', order: 4 }
]

export const useBooks = () => {
  const books = useState<MenuBook[]>('books', () => [
    {
      id: 'book-1',
      restaurantName: 'Blossom House',
      title: 'Main Menu 2026',
      slug: 'blossom-house-main-menu',
      description: 'منيو المطعم الرئيسي',
      coverImageUrl: '/demo/cover.jpg',
      themeId: 'theme-1',
      status: 'published',
      pageCount: 4,
      views: 1248,
      updatedAt: '2026-03-29T11:00:00Z',
      pages: demoPages
    },
    {
      id: 'book-2',
      restaurantName: 'Blossom House',
      title: 'Dessert Book',
      slug: 'blossom-house-dessert-book',
      description: 'منيو الحلويات',
      coverImageUrl: '/demo/cover-2.jpg',
      themeId: 'theme-4',
      status: 'draft',
      pageCount: 3,
      views: 87,
      updatedAt: '2026-03-28T09:20:00Z',
      pages: demoPages.slice(0,3)
    }
  ])

  return { books }
}
