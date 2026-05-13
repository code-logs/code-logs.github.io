import type { GetStaticProps, NextPage } from 'next'
import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'
import hljs from 'highlight.js'
import { ChangeEvent, ReactElement, useEffect, useRef, useState } from 'react'
import { CATEGORIES } from '../../config/posts.config'
import { GeneratedPost, GeneratedPostMetadata } from '../../utils/dev/types'

// Production guard — belt-and-suspenders alongside pageExtensions filtering.
export const getStaticProps: GetStaticProps = async () => {
  if (process.env.NODE_ENV === 'production') return { notFound: true }
  return { props: {} }
}

type Stage = 'input' | 'generating' | 'preview' | 'publishing' | 'done'

const AuthoringPage: NextPage = (): ReactElement => {
  // ── Prompt editor ─────────────────────────────────────────────────────
  const [prompt, setPrompt] = useState('')
  const [promptDirty, setPromptDirty] = useState(false)
  const [promptLoading, setPromptLoading] = useState(true)
  const [promptLoadError, setPromptLoadError] = useState('')

  // ── Generation state ───────────────────────────────────────────────────
  const [stage, setStage] = useState<Stage>('input')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [generateError, setGenerateError] = useState('')

  // ── Generated post (editable) ──────────────────────────────────────────
  const [post, setPost] = useState<GeneratedPost | null>(null)
  // Editable metadata fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<keyof typeof CATEGORIES>('javascript')
  const [fileName, setFileName] = useState('')
  const [publishedAt, setPublishedAt] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [refsInput, setRefsInput] = useState('') // JSON array string
  const [markdown, setMarkdown] = useState('')

  // ── Thumbnail ──────────────────────────────────────────────────────────
  const [thumbnailMode, setThumbnailMode] = useState<'reuse' | 'generate'>('reuse')
  const [reuseFileName, setReuseFileName] = useState('')
  const [generatePrompt, setGeneratePrompt] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedBase64, setUploadedBase64] = useState('')

  // ── Preview ────────────────────────────────────────────────────────────
  const [renderedHtml, setRenderedHtml] = useState('')
  const previewRef = useRef<HTMLDivElement>(null)

  // ── Publish ────────────────────────────────────────────────────────────
  const [publishError, setPublishError] = useState('')
  const [publishedUrl, setPublishedUrl] = useState('')

  // ── Elapsed timer ──────────────────────────────────────────────────────
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function startTimer() {
    setElapsedSeconds(0)
    timerRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1)
    }, 1000)
  }
  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }
  useEffect(() => () => stopTimer(), [])

  // ── Fetch default prompt on mount ──────────────────────────────────────
  async function fetchDefaultPrompt() {
    setPromptLoading(true)
    setPromptLoadError('')
    try {
      const res = await fetch('/api/dev/default-prompt')
      const data = await res.json()
      if (!res.ok) {
        setPromptLoadError(data.error ?? '기본 프롬프트를 불러오지 못했습니다.')
        return
      }
      setPrompt(data.prompt as string)
      setPromptDirty(false)
    } catch (err) {
      setPromptLoadError(err instanceof Error ? err.message : String(err))
    } finally {
      setPromptLoading(false)
    }
  }
  useEffect(() => { fetchDefaultPrompt() }, [])

  // ── Sync markdown preview ──────────────────────────────────────────────
  useEffect(() => {
    if (!markdown) { setRenderedHtml(''); return }
    setRenderedHtml(DOMPurify.sanitize(marked(markdown) as string))
  }, [markdown])

  useEffect(() => {
    if (stage === 'preview' && previewRef.current) {
      hljs.highlightAll()
    }
  }, [stage, renderedHtml])

  // ── Populate editable fields from generated post ───────────────────────
  function populateFromPost(generated: GeneratedPost) {
    setPost(generated)
    const m = generated.metadata
    setTitle(m.title)
    setDescription(m.description)
    setCategory(m.category)
    setFileName(m.fileName)
    setPublishedAt(m.publishedAt)
    setTagsInput(m.tags.join(', '))
    setRefsInput(m.references ? JSON.stringify(m.references, null, 2) : '')
    setMarkdown(generated.markdown)
    setThumbnailMode(generated.thumbnail.mode)
    setReuseFileName(generated.thumbnail.reuseFileName ?? '')
    setGeneratePrompt(generated.thumbnail.generatePrompt ?? '')
  }

  // ── Generate handler ───────────────────────────────────────────────────
  async function handleGenerate() {
    if (prompt.trim().length < 50) return
    setGenerateError('')
    setPublishError('')
    setPublishedUrl('')
    setStage('generating')
    startTimer()

    try {
      const res = await fetch('/api/dev/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (!res.ok) {
        setGenerateError(data.error + (data.detail ? `\n\n${data.detail}` : ''))
        setStage('input')
        return
      }
      populateFromPost(data.post as GeneratedPost)
      setStage('preview')
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : String(err))
      setStage('input')
    } finally {
      stopTimer()
    }
  }

  // ── File upload handler ────────────────────────────────────────────────
  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      // result is data:image/png;base64,XXXX — strip prefix
      const base64 = result.split(',')[1]
      setUploadedBase64(base64)
    }
    reader.readAsDataURL(file)
  }

  // ── Build metadata from editable fields ───────────────────────────────
  function buildMetadata(): GeneratedPostMetadata {
    let refs: { title: string; url: string }[] | undefined
    if (refsInput.trim()) {
      try {
        refs = JSON.parse(refsInput)
      } catch {
        refs = undefined
      }
    }
    return {
      title,
      description,
      category,
      fileName,
      publishedAt,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      references: refs,
    }
  }

  // ── Publish handler ────────────────────────────────────────────────────
  async function handlePublish() {
    setPublishError('')
    setStage('publishing')

    const updatedPost: GeneratedPost = {
      ...post!,
      metadata: buildMetadata(),
      markdown,
      thumbnail: {
        mode: thumbnailMode,
        reuseFileName: thumbnailMode === 'reuse' ? reuseFileName : undefined,
        generatePrompt: thumbnailMode === 'generate' ? generatePrompt : undefined,
      },
    }

    const body: Record<string, unknown> = { post: updatedPost }
    if (thumbnailMode === 'generate') {
      if (!uploadedBase64) {
        setPublishError('썸네일 이미지를 업로드해 주세요.')
        setStage('preview')
        return
      }
      body.thumbnailBase64 = uploadedBase64
      body.thumbnailMimeType = uploadedFile?.type ?? 'image/png'
    }

    try {
      const res = await fetch('/api/dev/publish-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setPublishError(data.error)
        setStage('preview')
        return
      }
      setPublishedUrl(data.url)
      setStage('done')
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : String(err))
      setStage('preview')
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">글 작성 (Dev only)</h1>
        <p className="text-sm text-gray-500 mt-1">이 페이지는 production export에 포함되지 않습니다.</p>
      </div>

      {/* Section A — Input */}
      {(stage === 'input' || stage === 'generating') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block font-semibold" htmlFor="prompt">
              Codex 프롬프트
            </label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">{prompt.length}자</span>
              <button
                type="button"
                onClick={() => {
                  if (promptDirty) {
                    if (!window.confirm('편집 내용을 버리고 기본값으로 되돌릴까요?')) return
                  }
                  fetchDefaultPrompt()
                }}
                disabled={stage === 'generating' || promptLoading}
                className="text-xs text-blue-500 underline cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                기본값으로 되돌리기
              </button>
            </div>
          </div>
          {promptLoadError && (
            <div className="flex items-center gap-3 bg-red-50 text-red-700 p-3 rounded text-sm">
              <span>{promptLoadError}</span>
              <button
                type="button"
                onClick={fetchDefaultPrompt}
                className="underline cursor-pointer shrink-0"
              >
                다시 시도
              </button>
            </div>
          )}
          <textarea
            id="prompt"
            className="w-full border rounded p-3 font-mono text-sm h-[60vh] resize-y"
            placeholder={promptLoading ? '기본 프롬프트를 불러오는 중...' : '프롬프트를 입력하세요 (최소 50자)'}
            value={prompt}
            onChange={(e) => { setPrompt(e.target.value); setPromptDirty(true) }}
            disabled={stage === 'generating' || promptLoading}
          />
          {generateError && (
            <pre className="bg-red-50 text-red-700 p-3 rounded text-sm whitespace-pre-wrap overflow-auto">
              {generateError}
            </pre>
          )}
          <button
            onClick={handleGenerate}
            disabled={stage === 'generating' || promptLoading || prompt.trim().length < 50}
            className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {stage === 'generating' ? '생성 중...' : '생성'}
          </button>
        </div>
      )}

      {/* Section B — Generating spinner */}
      {stage === 'generating' && (
        <div className="flex items-center gap-4 text-gray-600">
          <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span>Codex가 포스트를 작성하는 중입니다… ({elapsedSeconds}초)</span>
        </div>
      )}

      {/* Section C — Preview */}
      {(stage === 'preview' || stage === 'publishing' || stage === 'done') && (
        <div className="space-y-8">
          {/* Back button */}
          {stage === 'preview' && (
            <button
              onClick={() => setStage('input')}
              className="text-sm text-blue-600 underline cursor-pointer"
            >
              ← 다시 작성
            </button>
          )}

          {/* Metadata editor */}
          <details open className="border rounded p-4 space-y-4">
            <summary className="font-semibold cursor-pointer">메타데이터 편집</summary>
            <div className="space-y-3 mt-3">
              <Field label="제목">
                <input className="w-full border rounded p-2 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} />
              </Field>
              <Field label="설명">
                <textarea className="w-full border rounded p-2 text-sm h-20 resize-y" value={description} onChange={(e) => setDescription(e.target.value)} />
              </Field>
              <Field label="카테고리">
                <select
                  className="border rounded p-2 text-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as keyof typeof CATEGORIES)}
                >
                  {Object.entries(CATEGORIES).map(([key, val]) => (
                    <option key={key} value={key}>{key} — {val}</option>
                  ))}
                </select>
              </Field>
              <Field label="fileName">
                <input className="w-full border rounded p-2 text-sm font-mono" value={fileName} onChange={(e) => setFileName(e.target.value)} />
              </Field>
              <Field label="publishedAt">
                <input type="date" className="border rounded p-2 text-sm" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
              </Field>
              <Field label="태그 (쉼표 구분)">
                <input className="w-full border rounded p-2 text-sm" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
              </Field>
              <Field label="references (JSON 배열)">
                <textarea
                  className="w-full border rounded p-2 text-sm font-mono h-28 resize-y"
                  value={refsInput}
                  onChange={(e) => setRefsInput(e.target.value)}
                  placeholder='[{"title":"...", "url":"..."}]'
                />
              </Field>
            </div>
          </details>

          {/* Thumbnail */}
          <details open className="border rounded p-4 space-y-4">
            <summary className="font-semibold cursor-pointer">썸네일</summary>
            <div className="mt-3 space-y-3">
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="reuse" checked={thumbnailMode === 'reuse'} onChange={() => setThumbnailMode('reuse')} />
                  기존 파일 재사용
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="generate" checked={thumbnailMode === 'generate'} onChange={() => setThumbnailMode('generate')} />
                  이미지 업로드 (직접 제공)
                </label>
              </div>
              {thumbnailMode === 'reuse' && (
                <div className="space-y-2">
                  <input
                    className="w-full border rounded p-2 text-sm"
                    value={reuseFileName}
                    onChange={(e) => setReuseFileName(e.target.value)}
                    placeholder="예: react-thumbnail.png"
                  />
                  {reuseFileName && (
                    <img
                      src={`/assets/images/${reuseFileName}`}
                      alt="thumbnail preview"
                      className="h-32 object-contain border rounded"
                    />
                  )}
                </div>
              )}
              {thumbnailMode === 'generate' && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Codex 제안 프롬프트: <em>{generatePrompt}</em></p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-sm"
                  />
                  {uploadedFile && (
                    <p className="text-xs text-gray-500">{uploadedFile.name} ({Math.round(uploadedFile.size / 1024)}KB) 선택됨</p>
                  )}
                </div>
              )}
            </div>
          </details>

          {/* Markdown editor + preview */}
          <div className="space-y-4">
            <h2 className="font-semibold">본문 편집</h2>
            <textarea
              className="w-full border rounded p-3 font-mono text-sm h-64 resize-y"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold">미리보기</h2>
            <div
              ref={previewRef}
              className="prose max-w-none post-body border rounded p-4"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          </div>

          {/* Errors & publish */}
          {publishError && (
            <pre className="bg-red-50 text-red-700 p-3 rounded text-sm whitespace-pre-wrap overflow-auto">
              {publishError}
            </pre>
          )}

          {stage === 'done' && publishedUrl && (
            <div className="bg-green-50 text-green-800 p-4 rounded">
              <p className="font-semibold">게시 완료!</p>
              <p className="text-sm mt-1">
                <a href={publishedUrl} className="underline">{publishedUrl}</a> 에서 확인하세요.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                변경 사항을 커밋해 주세요: posts/, config/posts.config.ts, public/assets/images/ (썸네일 업로드 시)
              </p>
            </div>
          )}

          {stage === 'preview' && (
            <button
              onClick={handlePublish}
              className="px-6 py-2 bg-green-600 text-white rounded cursor-pointer"
            >
              게시
            </button>
          )}

          {stage === 'publishing' && (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-5 h-5 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
              <span>게시 중...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactElement }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )
}

export default AuthoringPage
