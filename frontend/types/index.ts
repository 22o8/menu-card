export type ThemePreset = 'classic-luxury' | 'clean-modern' | 'dark-elegant' | 'arabic-premium'

export interface ThemeConfig {
  id: string
  name: string
  preset: ThemePreset
  background: string
  pageTexture: string
  accent: string
  shadowStrength: number
  openCoverAnimation: boolean
  flipSound: boolean
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
  description?: string
  coverImageUrl?: string
  themeId: string
  status: 'draft' | 'published'
  pageCount: number
  views: number
  updatedAt: string
  pages: MenuPageItem[]
}
