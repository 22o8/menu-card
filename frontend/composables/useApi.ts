export const useApi = () => {
  const config = useRuntimeConfig()
  const base = computed(() => String(config.public.apiBase || '').replace(/\/$/, ''))

  const getApiUrl = (path: string) => {
    const clean = path.startsWith('/') ? path : `/${path}`
    if (/\/api\//.test(clean)) return `${base.value}${clean}`
    return `${base.value}/api${clean}`
  }

  const getAssetUrl = (path?: string | null) => {
    if (!path) return ''
    if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path
    const origin = base.value.replace(/\/api$/, '')
    return `${origin}${path.startsWith('/') ? path : `/${path}`}`
  }

  const adminKey = useState<string>('admin-key', () => '')

  const request = async <T>(path: string, options: any = {}) => {
    const headers = new Headers(options.headers || {})
    if (adminKey.value) headers.set('x-admin-key', adminKey.value)
    return await $fetch<T>(getApiUrl(path), { ...options, headers })
  }

  return { base, adminKey, getApiUrl, getAssetUrl, request }
}
