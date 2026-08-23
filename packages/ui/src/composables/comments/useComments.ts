import type { LocaleCode } from '../../locale/type.ts'
import CommentDeleteConfirmModal from '../../components/Comments/CommentDeleteConfirmModal.vue'
import { useCommentsContext } from './context.ts'

export function useComments() {
  const overlay = useOverlay()
  const { banner } = useCommentsContext()

  function confirmDeleteComment(pageId: string, commentId: number, locale: LocaleCode) {
    overlay
      .create(CommentDeleteConfirmModal, {
        destroyOnClose: true,
        props: {
          pageId,
          commentId,
          locale,
          show: banner.show,
        },
      })
      .open()
  }

  return {
    confirmDeleteComment,
    show: banner.show,
  }
}
