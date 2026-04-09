import type { MenuBook } from '~/types'
import { useApi } from '~/composables/useApi'

export const useBooks = () => {
  const books = useState<MenuBook[]>('books', () => [])
  const loading = useState<boolean>('books-loading', () => false)
  const { request, getAssetUrl } = useApi()

  const fallbackBooks: MenuBook[] = [
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
      pages: [
        { id: 'p1', title: 'Cover', imageUrl: '/demo/cover.jpg', order: 1 },
        { id: 'p2', title: 'Breakfast', imageUrl: '/demo/page-1.jpg', order: 2 },
        { id: 'p3', title: 'Main Dishes', imageUrl: '/demo/page-2.jpg', order: 3 },
        { id: 'p4', title: 'Desserts', imageUrl: '/demo/page-3.jpg', order: 4 }
      ]
    }
  ]

  const normalizeBook = (item: any): MenuBook => ({
    id: String(item.id),
    restaurantName: item.restaurantName,
    title: item.title,
    slug: item.slug,
    description: item.description,
    coverImageUrl: getAssetUrl(item.coverImageUrl),
    themeId: item.themeId,
    status: item.status,
    pageCount: item.pageCount ?? item.pages?.length ?? 0,
    views: item.views ?? 0,
    updatedAt: item.updatedAtUtc ?? item.updatedAt ?? new Date().toISOString(),
    pages: (item.pages || []).sort((a: any, b: any) => a.order - b.order).map((page: any) => ({
      id: String(page.id),
      title: page.title,
      imageUrl: getAssetUrl(page.imageUrl),
      order: page.order
    }))
  })

  const loadBooks = async () => {
    if (loading.value) return
    loading.value = true
    try {
      const data = await request<any[]>('/menubooks')
      books.value = data.map(normalizeBook)
    } catch {
      books.value = fallbackBooks
    } finally {
      loading.value = false
    }
  }

  const getBookBySlug = async (slug: string) => {
    try {
      const data = await request<any>(`/menubooks/${slug}`)
      return normalizeBook(data)
    } catch {
      return books.value.find((b) => b.slug === slug) || fallbackBooks[0]
    }
  }

  const getBookById = async (id: string) => {
    const data = await request<any>(`/menubooks/id/${id}`)
    return normalizeBook(data)
  }

  const createBook = async (payload: any) => {
    const created = await request<any>('/menubooks', { method: 'POST', body: payload })
    await loadBooks()
    return normalizeBook(created)
  }

  const updateBook = async (id: string, payload: any) => {
    const updated = await request<any>(`/menubooks/${id}`, { method: 'PUT', body: payload })
    await loadBooks()
    return normalizeBook(updated)
  }

  const addPages = async (id: string, payload: any) => {
    const updated = await request<any>(`/menubooks/${id}/pages`, { method: 'POST', body: payload })
    await loadBooks()
    return normalizeBook(updated)
  }

  const deletePage = async (bookId: string, pageId: string) => {
    await request(`/menubooks/${bookId}/pages/${pageId}`, { method: 'DELETE' })
    await loadBooks()
  }

  const deleteBook = async (id: string) => {
    await request(`/menubooks/${id}`, { method: 'DELETE' })
    await loadBooks()
  }

  return { books, loading, loadBooks, getBookBySlug, getBookById, createBook, updateBook, addPages, deletePage, deleteBook }
}
