'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Header } from '@/components/header'

interface ApiResponse {
  markdown: string
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
  const [isLoading, setIsLoading] = useState(false)
  const [markdownResult, setMarkdownResult] = useState('')
  const [error, setError] = useState('')
  const [meta, setMeta] = useState<ApiResponse['meta']>()
  const [videoId, setVideoId] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMarkdownResult('')
    setMeta(undefined)
    setVideoId('')

    try {
      // 유튜브 URL 유효성 검사
      if (
        !youtubeUrl.includes('youtube.com') &&
        !youtubeUrl.includes('youtu.be')
      ) {
        throw new Error('유효한 유튜브 URL을 입력해주세요.')
      }

      // API 호출
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtubeUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || '게시글 생성 중 오류가 발생했습니다.'
        )
      }

      const data: ApiResponse = await response.json()
      setMarkdownResult(data.markdown)
      setMeta(data.meta)
      setVideoId(data.videoId || '')
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
        body: JSON.stringify({ markdown: markdownResult, videoId }),
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
      <main className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          유튜브 영상 게시글 생성기
        </h1>

        <div className="mb-4 text-center">
          <a href="/posts" className="text-blue-600 hover:underline">
            게시글 목록 보기
          </a>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col gap-4">
            <label htmlFor="youtubeUrl" className="font-medium">
              유튜브 URL 입력
            </label>
            <input
              id="youtubeUrl"
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="p-3 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 text-white p-3 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? '처리 중...' : '게시글 생성하기'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {markdownResult && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">생성된 게시글</h2>
              <button
                onClick={handlePublish}
                disabled={isLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? '발행 중...' : '게시글 발행하기'}
              </button>
            </div>

            {meta && (
              <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-md border border-blue-200 dark:border-blue-800 mb-4 text-sm text-blue-800 dark:text-blue-200">
                <h3 className="font-bold mb-1">처리 정보</h3>
                <ul>
                  <li>
                    예시 데이터 사용: {meta.usedMockData ? '예' : '아니오'}
                  </li>
                  <li>자막 수: {meta.captionsCount}개</li>
                  <li>타임스탬프 수: {meta.timestampsCount}개</li>
                  <li>그룹 수: {meta.groupsCount}개</li>
                </ul>
              </div>
            )}

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{markdownResult}</ReactMarkdown>
              </div>
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400">
                  마크다운 소스 보기
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                  {markdownResult}
                </pre>
              </details>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
