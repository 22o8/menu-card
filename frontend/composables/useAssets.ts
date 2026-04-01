import type { AssetItem } from '~/types'
import { useApi } from './useApi'

const fallbackAssets: AssetItem[] = [
  { id: '1', name: 'cover.jpg', type: 'Image', url: '/demo/cover.jpg', sizeInBytes: 324000, uploadedAtUtc: '2026-03-27T10:10:00Z' },
  { id: '2', name: 'page-1.jpg', type: 'Image', url: '/demo/page-1.jpg', sizeInBytes: 415000, uploadedAtUtc: '2026-03-28T10:10:00Z' },
  { id: '3', name: 'paper-light.jpg', type: 'Texture', url: '/demo/paper-light.jpg', sizeInBytes: 96000, uploadedAtUtc: '2026-03-28T10:10:00Z' },
  { id: '4', name: 'menu.pdf', type: 'PDF', url: '/demo/menu.pdf', sizeInBytes: 1850000, uploadedAtUtc: '2026-03-29T10:10:00Z' }
]

export const useAssets = () => {
  const { buildUrl } = useApi()
  const assets = useState<AssetItem[]>('assets', () => fallbackAssets)
  const pending = useState<boolean>('assets-pending', () => false)
  const loaded = useState<boolean>('assets-loaded', () => false)

  const loadAssets = async (force = false) => {
    if (loaded.value && !force) return assets.value
    pending.value = true

    try {
      assets.value = await $fetch<AssetItem[]>(buildUrl('/Assets'))
      loaded.value = true
    } catch {
      assets.value = fallbackAssets
    } finally {
      pending.value = false
    }

    return assets.value
  }

  return {
    assets,
    pending,
    loaded,
    loadAssets
  }
}
