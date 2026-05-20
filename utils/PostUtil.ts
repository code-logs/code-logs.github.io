import path from 'path'
import { Post } from '../config/posts.config'

class PostUtil {
  public static normalizeTitle(title: string) {
    return title
      .replace(/\s/g, '-')
      .replace(/[?#/\\%]/g, '')
      .toLowerCase()
  }

  public static getMarkdownFilePath(post: Post) {
    return path.join('../posts', post.category, post.fileName)
  }

  public static buildLinkURLByTitle(title: string) {
    return `/${encodeURIComponent(this.normalizeTitle(title))}`
  }

  public static readablePublishedAt({ publishedAt }: Post, separator = '.') {
    const date = new Date(publishedAt)
    const year = String(date.getFullYear()).slice(2)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return [year, month, day].join(separator)
  }
}

export default PostUtil
