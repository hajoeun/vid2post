'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, FileText } from 'lucide-react'
import { Markdown } from '@/components/markdown'

interface ApiResponse {
  markdown: string
  description?: string
  meta?: {
    usedMockData: boolean
    captionsCount: number
    timestampsCount: number
    groupsCount: number
  }
  videoId?: string
}

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [aiProvider, setAiProvider] = useState('ollama')
  const [isLoading, setIsLoading] = useState(false)
  const [markdownResult, setMarkdownResult] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<ApiResponse['meta']>()
  const [videoId, setVideoId] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMarkdownResult('')
    setVideoId('')
    setDescription('')
    setMeta(undefined)

    if (!youtubeUrl) {
      setError('유튜브 URL을 입력해주세요')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtubeUrl, aiProvider }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || '게시글 생성 중 오류가 발생했습니다.'
        )
      }

      const data: ApiResponse = await response.json()
      setMarkdownResult(data.markdown)
      setVideoId(data.videoId || '')
      setDescription(data.description || '')
      setMeta(data.meta)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('알 수 없는 오류가 발생했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!markdownResult || !videoId) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/publish-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markdown: markdownResult,
          videoId,
          description,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || '게시글 발행 중 오류가 발생했습니다.'
        )
      }

      const data = await response.json()
      alert(`게시글이 성공적으로 발행되었습니다: ${data.filename}`)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('알 수 없는 오류가 발생했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container py-10 max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center mb-10 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Vid2Post</h1>
          <p className="text-muted-foreground text-lg">
            유튜브 영상을 블로그 게시글로 변환하세요
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>새 게시글 생성</CardTitle>
            <CardDescription>
              유튜브 URL을 입력하면 자동으로 게시글을 생성합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="youtubeUrl" className="text-sm font-medium">
                  유튜브 URL 입력
                </label>
                <div className="flex gap-2">
                  <Input
                    id="youtubeUrl"
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1"
                    required
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? '처리 중...' : '생성하기'}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="aiProvider" className="text-sm font-medium">
                  AI 제공자 선택
                </label>
                <select
                  id="aiProvider"
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="ollama">Ollama (기본값)</option>
                  <option value="openai" disabled>
                    OpenAI (준비 중)
                  </option>
                  <option value="gemini" disabled>
                    Gemini (준비 중)
                  </option>
                  <option value="claude" disabled>
                    Claude (준비 중)
                  </option>
                </select>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/posts" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                게시글 목록 보기
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {markdownResult && (
          <Card className="mt-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  생성된 게시글
                </CardTitle>
                <Button onClick={handlePublish} disabled={isLoading}>
                  {isLoading ? '발행 중...' : '게시글 발행하기'}
                </Button>
              </div>
              {meta && (
                <CardDescription>
                  <div className="mt-2 p-3 bg-secondary rounded-md text-sm">
                    <h3 className="font-medium mb-1">처리 정보</h3>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-1">
                        <span className="text-muted-foreground">
                          예시 데이터:
                        </span>
                        <span>
                          {meta.usedMockData ? '사용함' : '사용 안함'}
                        </span>
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="text-muted-foreground">자막:</span>
                        <span>{meta.captionsCount}개</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="text-muted-foreground">
                          타임스탬프:
                        </span>
                        <span>{meta.timestampsCount}개</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="text-muted-foreground">그룹:</span>
                        <span>{meta.groupsCount}개</span>
                      </li>
                    </ul>
                  </div>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <Markdown content={markdownResult} />
              </div>
            </CardContent>
            <CardFooter>
              <details className="w-full">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  마크다운 소스 보기
                </summary>
                <pre className="mt-2 p-3 bg-muted rounded-md text-sm whitespace-pre-wrap w-full overflow-auto">
                  {markdownResult}
                </pre>
              </details>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  )
}
