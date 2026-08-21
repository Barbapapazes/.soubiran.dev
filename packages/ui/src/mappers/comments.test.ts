import type { CommentResponse } from '../api/comments'
import { describe, expect, it } from 'vitest'
import { mapCommentResponse } from './comments'

function createCommentResponse(id: number, replies: CommentResponse[] = []): CommentResponse {
  return {
    html_id: `comment-${id}`,
    id,
    content: `Comment ${id}`,
    content_html: `<p>Comment ${id}</p>`,
    user: {
      id: 1,
      name: 'Ada',
      avatar: '/ada.png',
      admin_url: '/admin/users/1',
      github_id: 'ada',
      can: { view_admin: true },
    },
    created_at: id === 1 ? '2026-08-19T10:00:00.000Z' : '2026-08-19T10:01:00.000Z',
    can: {
      update: true,
      delete: false,
      like: false,
      unlike: true,
    },
    replies,
    likes: 3,
  }
}

describe('mapCommentResponse', () => {
  it('maps transport comments, nested users, and recursive ISO timestamps', () => {
    const response = createCommentResponse(1, [createCommentResponse(2)])

    expect(mapCommentResponse(response)).toEqual({
      html_id: 'comment-1',
      id: 1,
      content: 'Comment 1',
      content_html: '<p>Comment 1</p>',
      user: {
        id: 1,
        name: 'Ada',
        avatar: '/ada.png',
        admin_url: '/admin/users/1',
        google_id: undefined,
        github_id: 'ada',
        can: { view_admin: true },
      },
      createdAt: new Date('2026-08-19T10:00:00.000Z'),
      can: {
        update: true,
        delete: false,
        like: false,
        unlike: true,
      },
      replies: [expect.objectContaining({
        id: 2,
        createdAt: new Date('2026-08-19T10:01:00.000Z'),
      })],
      likes: 3,
    })
  })
})
