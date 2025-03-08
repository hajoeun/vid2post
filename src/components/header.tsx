import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          유튜브 영상 게시글 생성기
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/posts"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            게시글 목록
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
