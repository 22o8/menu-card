const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '')

export const useApi = () => {
  const config = useRuntimeConfig()
  const base = stripTrailingSlash(config.public.apiBase || 'http://localhost:5117')

  const buildUrl = (path: string) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    const apiBase = base.endsWith('/api') ? base : `${base}/api`
    return `${apiBase}${normalizedPath}`
  }

  const toPublicAssetUrl = (path?: string | null) => {
    if (!path) return ''
    if (/^https?:\/\//i.test(path)) return path
    if (path.startsWith('/demo/')) return path
    const normalized = path.startsWith('/') ? path : `/${path}`
    return `${base}${normalized}`
  }

  return {
    apiBase: base,
    buildUrl,
    toPublicAssetUrl
  }
}
