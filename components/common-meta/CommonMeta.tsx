import Head from 'next/head'
import { ReactElement } from 'react'
import blogConfig from '../../config/blog.config'
import useAdsense from '../../hooks/useAdsense'

export interface CommonMetaProps {
  title: string
  description: string
  keywords?: string[]
  url: string
  imageURL: string
  customMeta?: ReactElement
}

const CommonMeta = (props: CommonMetaProps) => {
  const { title, description, keywords, url, imageURL, customMeta } = props
  useAdsense(blogConfig.googleAdsense.adClient)

  return (
    <Head>
      <link rel="canonical" href={url} />

      {/* PWA */}
      <link rel="apple-touch-icon" href={blogConfig.appleTouchIconPath} />
      <link rel="manifest" href="/manifest.json" />
      {/* theme-color is owned by `_document.tsx` with a light/dark media split
          (issue #148). A static, media-less meta here would inject after the
          _document head and unconditionally override the dark variant. */}

      {/* Common meta */}
      {/* Static meta */}
      <meta property="og:type" key="og:type" content="website" />
      <meta property="og:site_name" key="og:site_name" content={blogConfig.title} />
      <meta name="author" key="author" content={blogConfig.author} />
      <meta name="viewport" content="width=device-width, user-scalable=no" />

      {/* Dynamic meta */}
      {keywords?.length && <meta name="keyword" key="keyword" content={keywords!.join(', ')} />}
      <meta name="description" key="description" content={description} />
      <meta property="og:description" key="og:description" content={description} />
      <meta property="og:title" key="og:title" content={title} />
      <meta property="og:url" key="og:url" content={url} />
      <meta property="og:image" key="og:image" content={imageURL} />

      {customMeta && customMeta}

      <title>{title}</title>
    </Head>
  )
}

export default CommonMeta
