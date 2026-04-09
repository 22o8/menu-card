import type { ThemeConfig } from '~/types'
import { useApi } from '~/composables/useApi'

export const useThemes = () => {
  const themes = useState<ThemeConfig[]>('themes', () => [])
  const loading = useState<boolean>('themes-loading', () => false)
  const { request, getAssetUrl } = useApi()

  const fallbackThemes: ThemeConfig[] = [
    {
      id: 'theme-1',
      name: 'Classic Luxury',
      preset: 'classic-luxury',
      background: 'radial-gradient(circle at top, #3b2b17 0%, #120d08 55%, #060505 100%)',
      pageTexture: '/demo/paper-light.jpg',
      accent: '#d6b36a',
      shadowStrength: 0.65,
      openCoverAnimation: true,
      flipSound: true
    },
    {
      id: 'theme-2',
      name: 'Clean Modern',
      preset: 'clean-modern',
      background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
      pageTexture: '/demo/paper-white.jpg',
      accent: '#202020',
      shadowStrength: 0.35,
      openCoverAnimation: true,
      flipSound: true
    },
    {
      id: 'theme-3',
      name: 'Dark Elegant',
      preset: 'dark-elegant',
      background: 'radial-gradient(circle at center, #242424 0%, #101010 70%, #000000 100%)',
      pageTexture: '/demo/paper-dark.jpg',
      accent: '#f1e1b0',
      shadowStrength: 0.75,
      openCoverAnimation: true,
      flipSound: true
    },
    {
      id: 'theme-4',
      name: 'Arabic Premium',
      preset: 'arabic-premium',
      background: 'radial-gradient(circle at top, #18403b 0%, #0b1f1d 58%, #030808 100%)',
      pageTexture: '/demo/paper-cream.jpg',
      accent: '#f0d28c',
      shadowStrength: 0.6,
      openCoverAnimation: true,
      flipSound: true
    }
  ]

  const normalize = (items: any[]) => items.map((item) => ({
    ...item,
    background: item.background === 'dark'
      ? 'radial-gradient(circle at top, #3b2b17 0%, #120d08 55%, #060505 100%)'
      : item.background === 'light'
        ? 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)'
        : item.background === 'green'
          ? 'radial-gradient(circle at top, #18403b 0%, #0b1f1d 58%, #030808 100%)'
          : 'radial-gradient(circle at center, #242424 0%, #101010 70%, #000000 100%)',
    pageTexture: getAssetUrl(item.pageTexture),
    openCoverAnimation: true,
    flipSound: true
  }))

  const loadThemes = async () => {
    if (loading.value) return
    loading.value = true
    try {
      const data = await request<any[]>('/themes')
      themes.value = normalize(data)
    } catch {
      themes.value = fallbackThemes
    } finally {
      loading.value = false
    }
  }

  return { themes, loading, loadThemes, fallbackThemes }
}
