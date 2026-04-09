export async function pdfToImages(file: File, scale = 1.8) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.mjs', import.meta.url).toString()

  const data = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data }).promise
  const pages: Array<{ title: string; imageBase64: string; order: number }> = []

  for (let index = 1; index <= pdf.numPages; index++) {
    const page = await pdf.getPage(index)
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    canvas.width = Math.ceil(viewport.width)
    canvas.height = Math.ceil(viewport.height)
    await page.render({ canvasContext: context, viewport }).promise
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.92)
    pages.push({ title: `Page ${index}`, imageBase64, order: index })
  }

  return { pageCount: pdf.numPages, pages }
}
