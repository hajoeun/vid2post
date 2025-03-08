import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'
import { Header } from '@/components/header'

export default function Posts() {
  const allPostsData = getSortedPostsData()

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
        <h1 className="text-3xl font-bold mb-8 text-center">게시글 목록</h1>

        {allPostsData.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">
              아직 게시된 글이 없습니다.
            </p>
          </div>
        ) : (
          <ul className="space-y-6">
            {allPostsData.map(({ id, date, title, description, videoId }) => (
              <li
                key={id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <Link href={`/posts/${id}`} className="block">
                      <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(date)}
                      </div>
                      <h2 className="text-xl font-bold mb-2">{title}</h2>
                      <p className="text-gray-700 dark:text-gray-300">
                        {description}
                      </p>
                    </Link>
                  </div>

                  {videoId && (
                    <div className="flex-shrink-0">
                      <a
                        href={`https://www.youtube.com/watch?v=${videoId}`}
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
                        유튜브 보기
                      </a>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  )
}
