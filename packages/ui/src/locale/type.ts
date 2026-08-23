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
    errors: {
      popupBlocked: string
      popupClosed: string
      refreshFailed: string
    }
  }
  LoginCallback: {
    success: string
    error: string
  }
  ConfirmModal: {
    actions: {
      cancel: string
      confirm: string
    }
  }
  Feedback: {
    action: string
  }
  FeedbackCard: {
    placeholder: string
    action: string
    ratings: {
      hate: string
      poor: string
      okay: string
      love: string
    }
    success: {
      received: string
      thanks: string
    }
    errors: {
      notFound: string
      unavailable: string
      unexpected: string
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
    CommentDeleteConfirmModal: {
      title: string
      description: string
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
    success: {
      delete: string
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
