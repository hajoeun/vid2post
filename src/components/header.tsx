import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Menu } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-border bg-card text-card-foreground shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="m7 4 10 8-10 8V4Z" />
          </svg>
          <span>Vid2Post</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/posts">게시글 목록</Link>
            </Button>
            <ThemeToggle />
          </div>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">메뉴 열기</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/posts">게시글 목록</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ThemeToggle />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
