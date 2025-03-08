import Link from 'next/link'
import { getAllPostIds, getPostData } from '@/lib/posts'
import { Header } from '@/components/header'
import { Markdown } from '@/components/markdown'

export async function generateStaticParams() {
  const paths = getAllPostIds()
  return paths
}

export default async function Post({ params }: { params: { id: string } }) {
  const postData = await getPostData(params.id)

  // 날짜를 YYYY년 MM월 DD일 형식으로 변환하는 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-8 max-w-4xl mx-auto">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 md:p-8">
            <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
              <h1 className="text-3xl font-bold mb-3">{postData.title}</h1>
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                {formatDate(postData.date)}
              </div>
              {postData.description && (
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {postData.description}
                </p>
              )}

              {postData.videoId && (
                <div className="mt-6">
                  <a
                    href={`https://www.youtube.com/watch?v=${postData.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                    유튜브에서 영상 보기
                  </a>
                </div>
              )}
            </header>

            <Markdown content={postData.content} />
          </div>
        </article>

        <div className="mt-8 flex justify-between">
          <Link
            href="/posts"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            목록으로 돌아가기
          </Link>
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  )
}
