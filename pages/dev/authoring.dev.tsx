import type { GetStaticProps, NextPage } from 'next'
import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'
import hljs from 'highlight.js'
import { ChangeEvent, ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import { CATEGORIES } from '../../config/posts.config'
import { GeneratedPost, GeneratedPostMetadata } from '../../utils/dev/types'

// Production guard — belt-and-suspenders alongside pageExtensions filtering.
export const getStaticProps: GetStaticProps = async () => {
  if (process.env.NODE_ENV === 'production') return { notFound: true }
  return { props: {} }
}

type Stage = 'input' | 'generating' | 'preview' | 'publishing' | 'done'

const STAGE_STEPS: { key: Stage[]; label: string }[] = [
  { key: ['input', 'generating'], label: '입력' },
  { key: ['preview', 'publishing'], label: '검토' },
  { key: ['done'], label: '게시' },
]

const AuthoringPage: NextPage = (): ReactElement => {
  // ── Inputs ────────────────────────────────────────────────────────────
  const [topic, setTopic] = useState('')
  const [additionalInstruction, setAdditionalInstruction] = useState('')
  const [corePrompt, setCorePrompt] = useState('')
  const [promptLoading, setPromptLoading] = useState(true)
  const [promptLoadError, setPromptLoadError] = useState('')

  // ── Generation state ───────────────────────────────────────────────────
  const [stage, setStage] = useState<Stage>('input')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [generateError, setGenerateError] = useState('')

  // ── Generated post (editable) ──────────────────────────────────────────
  const [post, setPost] = useState<GeneratedPost | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<keyof typeof CATEGORIES>('javascript')
  const [fileName, setFileName] = useState('')
  const [publishedAt, setPublishedAt] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [refsInput, setRefsInput] = useState('')
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

  // ── Fetch core prompt on mount (read-only reference) ──────────────────
  async function fetchCorePrompt() {
    setPromptLoading(true)
    setPromptLoadError('')
    try {
      const res = await fetch('/api/dev/default-prompt')
      const data = await res.json()
      if (!res.ok) {
        setPromptLoadError(data.error ?? 'Core 프롬프트를 불러오지 못했습니다.')
        return
      }
      setCorePrompt(data.prompt as string)
    } catch (err) {
      setPromptLoadError(err instanceof Error ? err.message : String(err))
    } finally {
      setPromptLoading(false)
    }
  }
  useEffect(() => { fetchCorePrompt() }, [])

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

  async function handleGenerate() {
    if (!topic.trim()) return
    setGenerateError('')
    setPublishError('')
    setPublishedUrl('')
    setStage('generating')
    startTimer()

    try {
      const res = await fetch('/api/dev/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, additionalInstruction }),
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

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      const base64 = result.split(',')[1]
      setUploadedBase64(base64)
    }
    reader.readAsDataURL(file)
  }

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

  return (
    <div className="space-y-8 pb-12">
        {/* Header */}
        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              DEV ONLY
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">production export에 포함되지 않습니다</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Codex 글 작성</h1>
          <Stepper stage={stage} />
        </header>

        {/* Section A — Input */}
        {(stage === 'input' || stage === 'generating') && (
          <div className="space-y-6">
            {/* Core prompt — read-only reference */}
            <Card>
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none -m-6 p-6 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">READ-ONLY</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">Core 프롬프트</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">참조용</span>
                  </div>
                  <Chevron />
                </summary>
                <div className="mt-4 space-y-3">
                  {promptLoadError && (
                    <Alert tone="error">
                      <span>{promptLoadError}</span>
                      <button
                        type="button"
                        onClick={fetchCorePrompt}
                        className="underline font-medium cursor-pointer shrink-0"
                      >
                        다시 시도
                      </button>
                    </Alert>
                  )}
                  <textarea
                    readOnly
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-4 font-mono text-xs leading-relaxed h-80 resize-y bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 focus:outline-none"
                    placeholder={promptLoading ? 'Core 프롬프트를 불러오는 중...' : ''}
                    value={corePrompt}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <LockIcon />
                    이 영역은 수정할 수 없습니다. 주제와 추가 인스트럭션은 아래 필드에 입력하세요.
                  </p>
                </div>
              </details>
            </Card>

            {/* Topic — required */}
            <Card>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-100" htmlFor="topic">
                    주제
                    <span className="ml-1.5 text-red-500" aria-label="required">*</span>
                  </label>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{topic.length}자</span>
                </div>
                <textarea
                  id="topic"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm h-24 resize-y bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="예: React 19의 useActionState 사용법 정리"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={stage === 'generating'}
                />
              </div>
            </Card>

            {/* Additional instruction — optional */}
            <Card>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-100" htmlFor="additional-instruction">
                    추가 인스트럭션
                    <span className="ml-1.5 text-xs font-normal text-slate-400 dark:text-slate-500">선택</span>
                  </label>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{additionalInstruction.length}자</span>
                </div>
                <textarea
                  id="additional-instruction"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm h-32 resize-y bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="예: 톤은 캐주얼하게, 길이는 500자 내외, 코드 예제 위주로"
                  value={additionalInstruction}
                  onChange={(e) => setAdditionalInstruction(e.target.value)}
                  disabled={stage === 'generating'}
                />
              </div>
            </Card>

            {generateError && (
              <Alert tone="error" block>
                <pre className="whitespace-pre-wrap font-mono text-xs overflow-auto">{generateError}</pre>
              </Alert>
            )}

            {/* Generating state */}
            {stage === 'generating' ? (
              <Card>
                <div className="flex items-center gap-4 py-2">
                  <Spinner color="blue" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 dark:text-slate-100">Codex가 포스트를 작성하는 중...</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">경과 시간 {elapsedSeconds}초</p>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="flex justify-end">
                <PrimaryButton onClick={handleGenerate} disabled={!topic.trim()}>
                  생성
                </PrimaryButton>
              </div>
            )}
          </div>
        )}

        {/* Section C — Preview */}
        {(stage === 'preview' || stage === 'publishing' || stage === 'done') && (
          <div className="space-y-6">
            {stage === 'preview' && (
              <button
                onClick={() => setStage('input')}
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition"
              >
                <span aria-hidden>←</span> 다시 작성
              </button>
            )}

            {/* Metadata editor */}
            <Card>
              <details open>
                <summary className="cursor-pointer list-none flex items-center justify-between -m-6 p-6 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">메타데이터</span>
                  <Chevron />
                </summary>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="제목" full>
                    <TextInput value={title} onChange={setTitle} />
                  </Field>
                  <Field label="설명" full>
                    <TextArea value={description} onChange={setDescription} rows={3} />
                  </Field>
                  <Field label="카테고리">
                    <select
                      className={inputClass}
                      value={category}
                      onChange={(e) => setCategory(e.target.value as keyof typeof CATEGORIES)}
                    >
                      {Object.entries(CATEGORIES).map(([key, val]) => (
                        <option key={key} value={key}>{key} — {val}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="publishedAt">
                    <input type="date" className={inputClass} value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
                  </Field>
                  <Field label="fileName" full>
                    <TextInput value={fileName} onChange={setFileName} mono />
                  </Field>
                  <Field label="태그 (쉼표 구분)" full>
                    <TextInput value={tagsInput} onChange={setTagsInput} />
                  </Field>
                  <Field label="references (JSON 배열)" full>
                    <TextArea
                      value={refsInput}
                      onChange={setRefsInput}
                      rows={4}
                      mono
                      placeholder='[{"title":"...", "url":"..."}]'
                    />
                  </Field>
                </div>
              </details>
            </Card>

            {/* Thumbnail */}
            <Card>
              <details open>
                <summary className="cursor-pointer list-none flex items-center justify-between -m-6 p-6 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">썸네일</span>
                  <Chevron />
                </summary>
                <div className="mt-5 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <RadioPill checked={thumbnailMode === 'reuse'} onChange={() => setThumbnailMode('reuse')}>
                      기존 파일 재사용
                    </RadioPill>
                    <RadioPill checked={thumbnailMode === 'generate'} onChange={() => setThumbnailMode('generate')}>
                      이미지 업로드
                    </RadioPill>
                  </div>
                  {thumbnailMode === 'reuse' && (
                    <div className="space-y-3">
                      <TextInput value={reuseFileName} onChange={setReuseFileName} placeholder="예: react-thumbnail.png" />
                      {reuseFileName && (
                        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-slate-900">
                          <img
                            src={`/assets/images/${reuseFileName}`}
                            alt="thumbnail preview"
                            className="h-32 object-contain rounded"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {thumbnailMode === 'generate' && (
                    <div className="space-y-3">
                      {generatePrompt && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 italic border-l-2 border-slate-300 dark:border-slate-600 pl-3">
                          Codex 제안: {generatePrompt}
                        </p>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="text-sm text-slate-600 dark:text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900/40 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/60 file:cursor-pointer"
                      />
                      {uploadedFile && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-medium">{uploadedFile.name}</span> · {Math.round(uploadedFile.size / 1024)}KB
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </details>
            </Card>

            {/* Markdown editor */}
            <Card>
              <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">본문</h2>
              <textarea
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-3 font-mono text-sm h-72 resize-y bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition leading-relaxed"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
              />
            </Card>

            {/* Preview */}
            <Card>
              <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">미리보기</h2>
              <div
                ref={previewRef}
                className="prose dark:prose-invert max-w-none post-body border border-slate-200 dark:border-slate-700 rounded-lg p-5 bg-white dark:bg-slate-900"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </Card>

            {publishError && (
              <Alert tone="error" block>
                <pre className="whitespace-pre-wrap font-mono text-xs overflow-auto">{publishError}</pre>
              </Alert>
            )}

            {stage === 'done' && publishedUrl && (
              <Card>
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                    <CheckIcon />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">게시 완료!</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      <a href={publishedUrl} className="text-blue-600 dark:text-blue-400 hover:underline break-all">
                        {publishedUrl}
                      </a>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      변경 사항을 커밋해 주세요 — <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">posts/</code>, <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">config/posts.config.ts</code>, 썸네일 업로드 시 <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">public/assets/images/</code>
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {stage === 'preview' && (
              <div className="flex justify-end">
                <PrimaryButton onClick={handlePublish} tone="green">게시</PrimaryButton>
              </div>
            )}

            {stage === 'publishing' && (
              <Card>
                <div className="flex items-center gap-4 py-2">
                  <Spinner color="green" />
                  <p className="font-medium text-slate-800 dark:text-slate-100">게시 중...</p>
                </div>
              </Card>
            )}
          </div>
        )}
    </div>
  )
}

// ── Subcomponents ────────────────────────────────────────────────────────

const inputClass = 'w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'

function Card({ children }: { children: ReactNode }) {
  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      {children}
    </section>
  )
}

function Field({ label, full, children }: { label: string; full?: boolean; children: ReactElement }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function TextInput({
  value, onChange, placeholder, mono,
}: { value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean }) {
  return (
    <input
      className={`${inputClass} ${mono ? 'font-mono' : ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}

function TextArea({
  value, onChange, rows = 3, mono, placeholder,
}: { value: string; onChange: (v: string) => void; rows?: number; mono?: boolean; placeholder?: string }) {
  return (
    <textarea
      className={`${inputClass} resize-y ${mono ? 'font-mono' : ''}`}
      style={{ minHeight: `${rows * 1.75}rem` }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}

function PrimaryButton({
  children, onClick, disabled, tone = 'blue',
}: { children: ReactNode; onClick: () => void; disabled?: boolean; tone?: 'blue' | 'green' }) {
  const colors = tone === 'green'
    ? 'bg-green-600 hover:bg-green-700 active:bg-green-800'
    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${colors} px-6 py-2.5 text-white font-medium rounded-lg shadow-sm transition cursor-pointer disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:shadow-none`}
    >
      {children}
    </button>
  )
}

function RadioPill({ checked, onChange, children }: { checked: boolean; onChange: () => void; children: ReactNode }) {
  return (
    <label className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border cursor-pointer text-sm transition ${
      checked
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
    }`}>
      <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
      <span className={`w-2 h-2 rounded-full ${checked ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
      {children}
    </label>
  )
}

function Alert({ tone, block, children }: { tone: 'error'; block?: boolean; children: ReactNode }) {
  const toneClasses = tone === 'error'
    ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300'
    : ''
  return (
    <div className={`border rounded-lg p-3 text-sm ${toneClasses} ${block ? '' : 'flex items-center gap-3'}`}>
      {children}
    </div>
  )
}

function Spinner({ color }: { color: 'blue' | 'green' }) {
  const c = color === 'green' ? 'border-green-500' : 'border-blue-500'
  return <div className={`w-6 h-6 border-[3px] ${c} border-t-transparent rounded-full animate-spin`} />
}

function Chevron() {
  return (
    <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4L8.5 12l6.8-6.7a1 1 0 011.4 0z" clipRule="evenodd" />
    </svg>
  )
}

function Stepper({ stage }: { stage: Stage }) {
  const currentIndex = STAGE_STEPS.findIndex((s) => s.key.includes(stage))
  return (
    <ol className="flex items-center gap-2 text-xs">
      {STAGE_STEPS.map((step, i) => {
        const isActive = i === currentIndex
        const isDone = i < currentIndex
        return (
          <li key={step.label} className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-semibold ${
              isActive
                ? 'bg-blue-600 text-white'
                : isDone
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}>
              {isDone ? '✓' : i + 1}
            </span>
            <span className={`font-medium ${isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
              {step.label}
            </span>
            {i < STAGE_STEPS.length - 1 && (
              <span className={`w-8 h-px ${isDone ? 'bg-blue-300 dark:bg-blue-700' : 'bg-slate-200 dark:bg-slate-700'}`} />
            )}
          </li>
        )
      })}
    </ol>
  )
}

export default AuthoringPage
