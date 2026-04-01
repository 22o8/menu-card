export type ThemePreset = 'classic-luxury' | 'clean-modern' | 'dark-elegant' | 'arabic-premium'

export interface ThemeConfig {
  id: string
  name: string
  preset: ThemePreset
  background: string
  pageTexture: string
  accent: string
  shadowStrength: number
  openCoverAnimation?: boolean
  flipSound?: boolean
}

export interface MenuPageItem {
  id: string
  title: string
  imageUrl: string
  order: number
}

export interface MenuBook {
  id: string
  restaurantName: string
  title: string
  slug: string
  description?: string | null
  coverImageUrl?: string | null
  themeId: string
  status: 'draft' | 'published'
  pageCount?: number
  views: number
  updatedAt?: string
  updatedAtUtc?: string
  pages: MenuPageItem[]
}

export interface AssetItem {
  id: string
  name: string
  type: string
  url: string
  sizeInBytes: number
  uploadedAtUtc: string
}

export interface DashboardSummary {
  totalBooks: number
  publishedBooks: number
  draftBooks: number
  totalPages: number
  totalViews: number
  totalThemes: number
  totalAssets: number
}

export interface CreateMenuBookPayload {
  restaurantName: string
  title: string
  slug: string
  description?: string
  themeId: string
}
