import type { LocaleMessages } from './type'
import { defineLocale } from '@nuxt/ui/composables/defineLocale'

export default defineLocale<LocaleMessages>({
  name: 'English',
  code: 'en',
  dir: 'ltr',
  messages: {
    Editor: {
      placeholder: 'Write something...',
      write: {
        help: 'You can use Markdown syntax to format the content.',
      },
      preview: {
        loading: 'Loading preview...',
        placeholder: 'No content to preview.',
      },
      tabs: {
        write: 'Write',
        preview: 'Preview',
      },
    },
    LoginRequired: {
      text: 'You need to be logged in to access this feature.',
      action: 'Log in',
    },
    ConfirmModal: {
      actions: {
        cancel: 'Cancel',
        confirm: 'Confirm',
      },
    },
    comments: {
      Comment: {
        actions: {
          edit: 'Edit',
          delete: 'Delete',
        },
        actionMenu: 'Comment actions',
      },
      CommentConfirmDelete: {
        title: 'Delete comment',
        description: 'Are you sure you want to delete this comment? This action cannot be undone.',
        successMessage: 'The comment has been successfully deleted.',
        errorMessage: 'An error occurred while deleting the comment.',
      },
      CommentFormSection: {
        title: 'Add a comment',
      },
      CommentHeader: {
        author: 'Author',
        publishedAt: 'Published at',
      },
      CommentLike: {
        title: 'Like this comment',
      },
      CommentUnlike: {
        title: 'Remove your like',
      },
      CommentRepliesCount: {
        replies: '{count} replies',
        reply: '{count} reply',
      },
      CommentForm: {
        actions: {
          add: 'Comment',
          reply: 'Reply',
          edit: 'Edit',
          cancel: 'Cancel',
        },
      },
      errors: {
        create: 'An error occurred while adding the comment.',
        update: 'An error occurred while editing the comment.',
        delete: 'An error occurred while deleting the comment.',
        like: 'An error occurred while adding the like.',
        unlike: 'An error occurred while removing the like.',
      },
    },
    discussions: {
      DiscussionReply: {
        reply: 'Reply to this discussion...',
      },
      DiscussionsSection: {
        empty: 'No discussions yet.',
      },
      DiscussionsSectionTitle: {
        title: 'Discussions',
      },
      DiscussionsSectionSubtitle: {
        comments: {
          plural: '{count} comments',
          singular: '{count} comment',
        },
        replies: {
          plural: '{count} replies',
          singular: '{count} reply',
        },
      },
    },
    state: {
      empty: 'No data to display.',
      error: 'An error occurred while loading the data.',
      pending: 'Loading data...',
    },
  },
})
