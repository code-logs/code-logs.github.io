import fs from 'fs'
import path from 'path'
import { exit } from 'process'
import { Post } from '../config/posts.config'
import PostUtil from '../utils/PostUtil'

const BASE_URL = 'https://code-logs.github.io'
const DOCUMENT_PATH = path.join(__dirname, '../docs')
const EXCLUDE_FILE_PATTERNS = [/^(google760f3a7b88ebe070|naver07d3a889618f31ffdab8dc562554ed65)/]

const xmlEscape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const buildUrlSet = (loc: string, lastModified: string) => {
  const location = `${BASE_URL.replace(/\/$/, '')}/${loc.replace(/^\//, '')}`
  return `<url><loc>${xmlEscape(location)}</loc><lastmod>${xmlEscape(lastModified)}</lastmod></url>`
}

const sitemapGenerator = async () => {
  const htmlFullPathList = readDirectoryFiles(DOCUMENT_PATH, 'html')
  const { posts } = await import(path.join(__dirname, '../config/posts.config.ts'))
  const normalizedPostTiles = new Set(posts.map((post: Post) => `${PostUtil.normalizeTitle(post.title)}`))

  const urlSets = htmlFullPathList.map((htmlFullPath) => {
    const basePath = path.join(__dirname, '../docs')
    const htmlFileName = htmlFullPath.replace(/.+docs\/|.html$/g, '')
    const isPostingHtml = normalizedPostTiles.has(htmlFileName)
    const today = new Date()
    const yyyymmdd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    if (isPostingHtml) {
      const foundPostConfig: Post | undefined = posts.find((post: Post) => PostUtil.normalizeTitle(post.title) === htmlFileName)
      if (!foundPostConfig) throw new Error('Failed to find matched posting config')

      return buildUrlSet(PostUtil.buildLinkURLByTitle(foundPostConfig.title), foundPostConfig.publishedAt)
    } else {
      const htmlPath = htmlFullPath
        .replace(basePath, '')
        .replace(/index.html$/, '')
        .replace(/.html$/, '')
      const encodedPath = htmlPath
        .split('/')
        .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
        .join('/')
      return buildUrlSet(encodedPath, yyyymmdd)
    }
  })

  const siteMap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlSets.join('')}</urlset>`

  fs.writeFileSync(path.join(DOCUMENT_PATH, 'sitemap.xml'), siteMap, { encoding: 'utf8' })
  exit(0)
}

const readDirectoryFiles = (directoryPath: string, ext: string) => {
  let matchedFilePaths: string[] = []
  const files = fs.readdirSync(directoryPath)

  files
    .filter((file) => EXCLUDE_FILE_PATTERNS.every((reg) => !reg.test(file)))
    .forEach((target) => {
      const targetPath = path.join(directoryPath, target)
      const fileStat = fs.lstatSync(path.join(targetPath))
      const isDirectory = fileStat.isDirectory()
      if (isDirectory) {
        matchedFilePaths = [...matchedFilePaths, ...readDirectoryFiles(targetPath, ext)]
      }

      const targetExt = path.extname(targetPath)
      if (targetExt === ext || targetExt === `.${ext}`) {
        matchedFilePaths.push(targetPath)
      }
    })

  return matchedFilePaths
}

sitemapGenerator()
