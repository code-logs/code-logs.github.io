import { config as loadEnv } from 'dotenv'
import fs from 'fs'
import path from 'path'

// dotenv must run before blogConfig is imported — blogConfig reads process.env at module eval.
loadEnv({ path: path.join(__dirname, '../.env.production') })
loadEnv({ path: path.join(__dirname, '../.env') })

import blogConfig from '../config/blog.config'
import { Post, posts } from '../config/posts.config'
import PostUtil from '../utils/PostUtil'

const DOCUMENT_PATH = path.join(__dirname, '../docs')
const EXCLUDE_FILE_PATTERNS = [/^(google760f3a7b88ebe070|naver07d3a889618f31ffdab8dc562554ed65)/]

const xmlEscape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const buildUrlSet = (loc: string, lastModified: string) => {
  const location = `${blogConfig.baseURL.replace(/\/$/, '')}/${loc.replace(/^\//, '')}`
  return `<url><loc>${xmlEscape(location)}</loc><lastmod>${xmlEscape(lastModified)}</lastmod></url>`
}

const sitemapGenerator = async () => {
  if (!process.env.NEXT_PUBLIC_BASE_URL?.trim()) {
    throw new Error(
      'NEXT_PUBLIC_BASE_URL is not set. Sitemap generation requires the canonical base URL — set it in .env.production or the CI environment.'
    )
  }

  const htmlFullPathList = readDirectoryFiles(DOCUMENT_PATH, 'html')

  if (htmlFullPathList.length === 0) {
    throw new Error(
      'No HTML files found under ./docs. Run `pnpm run build` (or `pnpm run docs`) before generating the sitemap.'
    )
  }

  const normalizedPostMap = new Map<string, Post>()
  for (const post of posts) {
    const key = PostUtil.normalizeTitle(post.title)
    if (normalizedPostMap.has(key)) {
      throw new Error(`Duplicate normalized post title "${key}" from "${post.title}" — two posts cannot share the same URL slug.`)
    }
    normalizedPostMap.set(key, post)
  }

  const today = new Date()
  const todayYyyymmdd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const urlEntries = htmlFullPathList.map((htmlFullPath) => {
    const htmlBaseName = path.basename(htmlFullPath, '.html')
    const foundPostConfig = normalizedPostMap.get(htmlBaseName)

    if (foundPostConfig) {
      return { loc: PostUtil.buildLinkURLByTitle(foundPostConfig.title), lastmod: foundPostConfig.publishedAt }
    }

    const relativePath = path.relative(DOCUMENT_PATH, htmlFullPath).split(path.sep).join('/')
    const htmlPath = `/${relativePath}`.replace(/index\.html$/, '').replace(/\.html$/, '')
    const encodedPath = htmlPath
      .split('/')
      .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
      .join('/')
    return { loc: encodedPath, lastmod: todayYyyymmdd }
  })

  urlEntries.sort((a, b) => (a.loc < b.loc ? -1 : a.loc > b.loc ? 1 : 0))

  const urlSets = urlEntries.map(({ loc, lastmod }) => buildUrlSet(loc, lastmod))
  const siteMap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlSets.join('')}</urlset>`

  fs.writeFileSync(path.join(DOCUMENT_PATH, 'sitemap.xml'), siteMap, { encoding: 'utf8' })
}

const readDirectoryFiles = (directoryPath: string, ext: string) => {
  const matchedFilePaths: string[] = []
  const files = fs.readdirSync(directoryPath)

  files
    .filter((file) => EXCLUDE_FILE_PATTERNS.every((reg) => !reg.test(file)))
    .forEach((target) => {
      const targetPath = path.join(directoryPath, target)
      const fileStat = fs.lstatSync(targetPath)

      if (fileStat.isDirectory()) {
        matchedFilePaths.push(...readDirectoryFiles(targetPath, ext))
      } else if (path.extname(targetPath) === `.${ext}`) {
        matchedFilePaths.push(targetPath)
      }
    })

  return matchedFilePaths
}

sitemapGenerator().catch((err) => {
  console.error(err)
  process.exit(1)
})
