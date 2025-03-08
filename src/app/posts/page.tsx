import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Home, Play } from 'lucide-react'

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
      <main className="container py-10 max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center mb-10 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">게시글 목록</h1>
          <p className="text-muted-foreground text-lg">
            생성된 모든 게시글을 확인하세요
          </p>
        </div>

        {allPostsData.length === 0 ? (
          <Card className="text-center py-10">
            <CardContent>
              <p className="text-muted-foreground">
                아직 게시된 글이 없습니다.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {allPostsData.map(({ id, date, title, description, videoId }) => (
              <Card key={id} className="overflow-hidden h-full flex flex-col">
                {videoId && (
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                      alt={title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="bg-black/60 rounded-full p-3">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                )}
                <CardHeader>
                  <div className="text-sm text-muted-foreground mb-1">
                    {formatDate(date)}
                  </div>
                  <CardTitle className="line-clamp-2">{title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto pt-0">
                  <Button asChild variant="secondary" className="w-full">
                    <Link href={`/posts/${id}`}>게시글 읽기</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
