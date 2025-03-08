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
                      <Link href={`/posts/${id}`} className="block">
                        <div className="relative w-40 h-24 sm:w-48 sm:h-28 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                            alt={title}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black bg-opacity-60 rounded-full p-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="white"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
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
