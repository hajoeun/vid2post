import ReactMarkdown from 'react-markdown'
import {
  H1,
  H2,
  H3,
  H4,
  P,
  Blockquote,
  List,
  InlineCode,
} from '@/components/ui/typography'
import { cn } from '@/lib/utils'
import { ComponentPropsWithoutRef } from 'react'

interface MarkdownProps {
  content: string
  className?: string
}

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn('space-y-6 text-foreground', className)}>
      <ReactMarkdown
        components={{
          h1: ({ className, ...props }: ComponentPropsWithoutRef<'h1'>) => (
            <H1 className={className} {...props} />
          ),
          h2: ({ className, ...props }: ComponentPropsWithoutRef<'h2'>) => (
            <H2 className={className} {...props} />
          ),
          h3: ({ className, ...props }: ComponentPropsWithoutRef<'h3'>) => (
            <H3 className={className} {...props} />
          ),
          h4: ({ className, ...props }: ComponentPropsWithoutRef<'h4'>) => (
            <H4 className={className} {...props} />
          ),
          p: ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
            <P
              className={cn(
                'leading-7 text-foreground [&:not(:first-child)]:mt-6',
                className
              )}
              {...props}
            />
          ),
          blockquote: ({
            className,
            ...props
          }: ComponentPropsWithoutRef<'blockquote'>) => (
            <Blockquote
              className={cn(
                'mt-6 border-l-2 border-gray-300 dark:border-gray-600 pl-6 italic text-foreground',
                className
              )}
              {...props}
            />
          ),
          ul: ({ className, ...props }: ComponentPropsWithoutRef<'ul'>) => (
            <List
              className={cn(
                'my-6 ml-6 list-disc [&>li]:mt-2 text-foreground',
                className
              )}
              {...props}
            />
          ),
          code: ({
            className,
            inline,
            ...props
          }: ComponentPropsWithoutRef<'code'> & { inline?: boolean }) =>
            inline ? (
              <InlineCode className={className} {...props} />
            ) : (
              <pre
                className="p-4 rounded-md bg-gray-100 dark:bg-gray-800 overflow-x-auto text-foreground"
                {...props}
              />
            ),
          a: ({ className, ...props }: ComponentPropsWithoutRef<'a'>) => (
            <a
              className={cn(
                'text-blue-600 dark:text-blue-400 hover:underline font-medium',
                className
              )}
              target={props.href?.startsWith('http') ? '_blank' : undefined}
              rel={
                props.href?.startsWith('http')
                  ? 'noopener noreferrer'
                  : undefined
              }
              {...props}
            />
          ),
          img: ({ className, ...props }: ComponentPropsWithoutRef<'img'>) => (
            <img
              className={cn(
                'rounded-md mx-auto my-6 max-w-full h-auto',
                className
              )}
              alt={props.alt || ''}
              {...props}
            />
          ),
          hr: ({ className, ...props }: ComponentPropsWithoutRef<'hr'>) => (
            <hr
              className={cn(
                'my-8 border-gray-200 dark:border-gray-700',
                className
              )}
              {...props}
            />
          ),
          strong: ({
            className,
            ...props
          }: ComponentPropsWithoutRef<'strong'>) => (
            <strong
              className={cn('font-bold text-foreground', className)}
              {...props}
            />
          ),
          em: ({ className, ...props }: ComponentPropsWithoutRef<'em'>) => (
            <em
              className={cn('italic text-foreground', className)}
              {...props}
            />
          ),
          table: ({
            className,
            ...props
          }: ComponentPropsWithoutRef<'table'>) => (
            <div className="overflow-x-auto my-6">
              <table
                className={cn(
                  'w-full border-collapse text-sm text-foreground',
                  className
                )}
                {...props}
              />
            </div>
          ),
          thead: ({
            className,
            ...props
          }: ComponentPropsWithoutRef<'thead'>) => (
            <thead
              className={cn(
                'bg-gray-100 dark:bg-gray-800 text-foreground',
                className
              )}
              {...props}
            />
          ),
          tbody: ({
            className,
            ...props
          }: ComponentPropsWithoutRef<'tbody'>) => (
            <tbody className={cn('text-foreground', className)} {...props} />
          ),
          tr: ({ className, ...props }: ComponentPropsWithoutRef<'tr'>) => (
            <tr
              className={cn(
                'border-b border-gray-200 dark:border-gray-700 text-foreground',
                className
              )}
              {...props}
            />
          ),
          th: ({ className, ...props }: ComponentPropsWithoutRef<'th'>) => (
            <th
              className={cn(
                'text-left p-3 font-semibold text-foreground',
                className
              )}
              {...props}
            />
          ),
          td: ({ className, ...props }: ComponentPropsWithoutRef<'td'>) => (
            <td className={cn('p-3 text-foreground', className)} {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
