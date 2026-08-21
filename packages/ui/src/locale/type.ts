export type LocaleCode = 'en' | 'fr'

export type DeepPartial<T>
  = T extends readonly unknown[]
    ? T
    : T extends object
      ? { [Key in keyof T]?: DeepPartial<T[Key]> }
      : T

export interface LocaleMessages {
  Editor: {
    placeholder: string
    write: {
      help: string
    }
    preview: {
      loading: string
      placeholder: string
    }
    tabs: {
      write: string
      preview: string
    }
  }
  LoginRequired: {
    text: string
    action: string
  }
  ConfirmModal: {
    actions: {
      cancel: string
      confirm: string
    }
  }
  comments: {
    Comment: {
      actions: {
        edit: string
        delete: string
      }
      actionMenu: string
    }
    CommentConfirmDelete: {
      title: string
      description: string
      successMessage: string
      errorMessage: string
    }
    CommentFormSection: {
      title: string
    }
    CommentHeader: {
      author: string
      publishedAt: string
    }
    CommentLike: {
      title: string
    }
    CommentUnlike: {
      title: string
    }
    CommentRepliesCount: {
      replies: string
      reply: string
    }
    CommentForm: {
      actions: {
        add: string
        reply: string
        edit: string
        cancel: string
      }
    }
    errors: {
      create: string
      update: string
      delete: string
      like: string
      unlike: string
    }
  }
  discussions: {
    DiscussionReply: {
      reply: string
    }
    DiscussionsSection: {
      empty: string
    }
    DiscussionsSectionTitle: {
      title: string
    }
    DiscussionsSectionSubtitle: {
      comments: {
        singular: string
        plural: string
      }
      replies: {
        singular: string
        plural: string
      }
    }
  }
  state: {
    empty: string
    error: string
    pending: string
  }
}
