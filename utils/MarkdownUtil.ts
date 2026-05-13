import fs from 'fs'
import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'
import path from 'path'

export class MarkdownUtil {
  static readonly publicPath: string = './public'

  static getMarkdownContent(mdFilePath: string): string {
    const html = marked(this.readFileSync(mdFilePath)) as string
    return DOMPurify.sanitize(html)
  }

  static readFileSync(filePath: string): string {
    return fs.readFileSync(path.resolve(this.publicPath, filePath), 'utf8')
  }
}
