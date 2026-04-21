const normalizeApiBase = (raw: string) => {
  const trimmed = String(raw || '').trim()
  if (!trimmed) return 'http://localhost:5117'

  let value = trimmed
    .replace(/^['"]|['"]$/g, '')
    .replace(/\/$/, '')

  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value.replace(/^\/+/, '')}`
  }

  value = value.replace(/\/api\/?$/i, '')
  return value
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = computed(() => normalizeApiBase(String(config.public.apiBase || '')))

  const getApiUrl = (path: string) => {
    const clean = path.startsWith('/') ? path : `/${path}`
    if (/^https?:\/\//i.test(clean)) return clean
    return clean.startsWith('/api/') ? `${apiBase.value}${clean}` : `${apiBase.value}/api${clean}`
  }

  const getAssetUrl = (path?: string | null) => {
    if (!path) return ''
    if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path
    return `${apiBase.value}${path.startsWith('/') ? path : `/${path}`}`
  }

  const adminKey = useState<string>('admin-key', () => '')

  const request = async <T>(path: string, options: any = {}) => {
    const headers = new Headers(options.headers || {})
    if (adminKey.value) headers.set('x-admin-key', adminKey.value)
    return await $fetch<T>(getApiUrl(path), {
      ...options,
      headers
    })
  }

  return { apiBase, adminKey, getApiUrl, getAssetUrl, request }
}
