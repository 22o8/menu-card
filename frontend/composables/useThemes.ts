import type { ThemeConfig } from '~/types'
import { useApi } from './useApi'

const demoThemes: ThemeConfig[] = [
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

export const useThemes = () => {
  const { buildUrl } = useApi()
  const themes = useState<ThemeConfig[]>('themes', () => demoThemes)
  const pending = useState<boolean>('themes-pending', () => false)
  const loaded = useState<boolean>('themes-loaded', () => false)

  const loadThemes = async (force = false) => {
    if (loaded.value && !force) return themes.value
    pending.value = true

    try {
      themes.value = await $fetch<ThemeConfig[]>(buildUrl('/Themes'))
      loaded.value = true
    } catch {
      themes.value = demoThemes
    } finally {
      pending.value = false
    }

    return themes.value
  }

  const getThemeById = (id: string) => themes.value.find((theme) => theme.id === id) || themes.value[0]

  return {
    themes,
    pending,
    loaded,
    loadThemes,
    getThemeById
  }
}
