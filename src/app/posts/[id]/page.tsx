import Link from 'next/link'
import { getAllPostIds, getPostData } from '@/lib/posts'
import { Header } from '@/components/header'
import { Markdown } from '@/components/markdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ArrowLeft, Home, Youtube } from 'lucide-react'

export async function generateStaticParams() {
  const paths = getAllPostIds()
  return paths
}

// Next.js 15에서 요구하는 타입 정의
type Params = Promise<{ id: string }>

interface PageProps {
  params: Params
}

export default async function Post({ params }: PageProps) {
  // params가 Promise이므로 await로 값을 추출
  const { id } = await params
  const postData = await getPostData(id)

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
        <Card className="overflow-hidden shadow-md">
          {postData.videoId && (
            <div className="relative aspect-video w-full overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${postData.videoId}`}
                title={postData.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full border-0"
              />
            </div>
          )}

          <CardHeader className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {formatDate(postData.date)}
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                {postData.title}
              </h1>
            </div>

            {postData.description && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {postData.description}
              </p>
            )}

            {postData.videoId && (
              <div className="flex justify-end">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://www.youtube.com/watch?v=${postData.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Youtube className="h-4 w-4 text-red-600" />
                    YouTube에서 보기
                  </a>
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent className="text-foreground">
            <div className="max-w-none">
              <Markdown content={postData.content} />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between py-6 border-t">
            <Button variant="outline" asChild>
              <Link href="/posts" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                목록으로 돌아가기
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                홈으로 돌아가기
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
