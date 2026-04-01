import type { CreateMenuBookPayload, MenuBook } from '~/types'
import { useApi } from './useApi'

const demoPages = [
  { id: 'p1', title: 'Cover', imageUrl: '/demo/cover.jpg', order: 1 },
  { id: 'p2', title: 'Breakfast', imageUrl: '/demo/page-1.jpg', order: 2 },
  { id: 'p3', title: 'Main Dishes', imageUrl: '/demo/page-2.jpg', order: 3 },
  { id: 'p4', title: 'Desserts', imageUrl: '/demo/page-3.jpg', order: 4 }
]

const demoBooks: MenuBook[] = [
  {
    id: 'book-1',
    restaurantName: 'Blossom House',
    title: 'Main Menu 2026',
    slug: 'blossom-house-main-menu',
    description: 'منيو المطعم الرئيسي المصمم بأسلوب أنيق وجاهز للمشاركة عبر الرابط أو QR.',
    coverImageUrl: '/demo/cover.jpg',
    themeId: 'theme-1',
    status: 'published',
    pageCount: 4,
    views: 1248,
    updatedAtUtc: '2026-03-29T11:00:00Z',
    pages: demoPages
  },
  {
    id: 'book-2',
    restaurantName: 'Blossom House',
    title: 'Dessert Book',
    slug: 'blossom-house-dessert-book',
    description: 'نسخة مختصرة لمنيو الحلويات والمشروبات.',
    coverImageUrl: '/demo/cover-2.jpg',
    themeId: 'theme-4',
    status: 'draft',
    pageCount: 3,
    views: 87,
    updatedAtUtc: '2026-03-28T09:20:00Z',
    pages: demoPages.slice(0, 3)
  }
]

const normalizeBook = (book: MenuBook): MenuBook => ({
  ...book,
  pageCount: book.pageCount ?? book.pages?.length ?? 0,
  updatedAt: book.updatedAt ?? book.updatedAtUtc,
  updatedAtUtc: book.updatedAtUtc ?? book.updatedAt,
  pages: [...(book.pages || [])].sort((a, b) => a.order - b.order)
})

export const useBooks = () => {
  const { buildUrl } = useApi()
  const books = useState<MenuBook[]>('books', () => demoBooks.map(normalizeBook))
  const pending = useState<boolean>('books-pending', () => false)
  const loaded = useState<boolean>('books-loaded', () => false)
  const errorMessage = useState<string | null>('books-error', () => null)

  const loadBooks = async (force = false) => {
    if (loaded.value && !force) return books.value
    pending.value = true
    errorMessage.value = null

    try {
      const data = await $fetch<MenuBook[]>(buildUrl('/MenuBooks'))
      books.value = data.map(normalizeBook)
      loaded.value = true
    } catch (error: any) {
      errorMessage.value = error?.data?.message || error?.message || 'تعذر تحميل المنيوهات من الـ API.'
      books.value = demoBooks.map(normalizeBook)
    } finally {
      pending.value = false
    }

    return books.value
  }

  const createBook = async (payload: CreateMenuBookPayload) => {
    pending.value = true
    errorMessage.value = null

    try {
      const created = await $fetch<MenuBook>(buildUrl('/MenuBooks'), {
        method: 'POST',
        body: payload
      })
      books.value = [normalizeBook(created), ...books.value]
      loaded.value = true
      return { ok: true, data: normalizeBook(created) }
    } catch (error: any) {
      const fallbackBook: MenuBook = normalizeBook({
        id: crypto.randomUUID(),
        restaurantName: payload.restaurantName,
        title: payload.title,
        slug: payload.slug,
        description: payload.description,
        coverImageUrl: '/demo/cover.jpg',
        themeId: payload.themeId,
        status: 'draft',
        pageCount: 0,
        views: 0,
        updatedAtUtc: new Date().toISOString(),
        pages: []
      })
      books.value = [fallbackBook, ...books.value]
      errorMessage.value = error?.data?.message || error?.message || 'تم الحفظ محليًا بسبب عدم توفر الـ API.'
      return { ok: false, data: fallbackBook }
    } finally {
      pending.value = false
    }
  }

  const publishBook = async (id: string) => {
    try {
      const updated = await $fetch<MenuBook>(buildUrl(`/MenuBooks/${id}/publish`), { method: 'PATCH' })
      books.value = books.value.map((book) => book.id === id ? normalizeBook(updated) : book)
      return true
    } catch {
      books.value = books.value.map((book) => book.id === id ? { ...book, status: 'published', updatedAtUtc: new Date().toISOString() } : book)
      return false
    }
  }

  const getBookBySlug = (slug: string) => books.value.find((book) => book.slug === slug)

  return {
    books,
    pending,
    loaded,
    errorMessage,
    loadBooks,
    createBook,
    publishBook,
    getBookBySlug
  }
}
