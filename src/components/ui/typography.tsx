import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { forwardRef, HTMLAttributes } from 'react'

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  asChild?: boolean
}

const H1 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'h1'
    return (
      <Comp
        className={cn(
          'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
H1.displayName = 'H1'

const H2 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'h2'
    return (
      <Comp
        className={cn(
          'scroll-m-20 border-b border-gray-200 dark:border-gray-700 pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10 mb-6',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
H2.displayName = 'H2'

const H3 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'h3'
    return (
      <Comp
        className={cn(
          'scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
H3.displayName = 'H3'

const H4 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'h4'
    return (
      <Comp
        className={cn(
          'scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-3',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
H4.displayName = 'H4'

const P = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'p'
    return (
      <Comp
        className={cn(
          'leading-7 text-gray-700 dark:text-gray-300 [&:not(:first-child)]:mt-6',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
P.displayName = 'P'

const Blockquote = forwardRef<HTMLQuoteElement, TypographyProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'blockquote'
    return (
      <Comp
        className={cn(
          'mt-6 border-l-2 border-gray-300 dark:border-gray-600 pl-6 italic text-gray-800 dark:text-gray-200',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Blockquote.displayName = 'Blockquote'

const List = forwardRef<HTMLUListElement, TypographyProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'ul'
    return (
      <Comp
        className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}
        ref={ref}
        {...props}
      />
    )
  }
)
List.displayName = 'List'

const InlineCode = forwardRef<HTMLElement, TypographyProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'code'
    return (
      <Comp
        className={cn(
          'relative rounded bg-gray-100 dark:bg-gray-800 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-gray-900 dark:text-gray-100',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
InlineCode.displayName = 'InlineCode'

const Lead = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'p'
    return (
      <Comp
        className={cn('text-xl text-gray-700 dark:text-gray-300', className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Lead.displayName = 'Lead'

const Muted = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'p'
    return (
      <Comp
        className={cn('text-sm text-gray-500 dark:text-gray-400', className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Muted.displayName = 'Muted'

export { H1, H2, H3, H4, P, Blockquote, List, InlineCode, Lead, Muted }
