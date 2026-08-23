import type { InjectionKey, Ref } from 'vue'
import type { LocaleCode } from '../../locale/type'
import type { CommentsBannerController } from './useCommentsBanner'
import { inject, provide } from 'vue'

export interface CommentsContext {
  pageId: Readonly<Ref<string>>
  locale: Readonly<Ref<LocaleCode>>
  banner: CommentsBannerController
}

const commentsContextInjectionKey: InjectionKey<CommentsContext> = Symbol('soubiran-ui.comments-context')

export function provideCommentsContext(context: CommentsContext) {
  provide(commentsContextInjectionKey, context)
}

export function useCommentsContext() {
  const context = inject(commentsContextInjectionKey)

  if (!context) {
    throw new Error('Comments components must be rendered inside <Comments>.')
  }

  return context
}
