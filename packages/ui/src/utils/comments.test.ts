import type { Comment } from '../types/comment'
import { describe, expect, it } from 'vitest'
import {
  getCommentById,
  patchCommentLike,
  replaceComment,
} from './comments'

function createComment(id: number, replies: Comment[] = [], likes = 0): Comment {
  return {
    html_id: `comment-${id}`,
    id,
    content: `Comment ${id}`,
    content_html: `<p>Comment ${id}</p>`,
    user: {
      id: 1,
      name: 'Ada',
      avatar: '/ada.png',
      can: { view_admin: false },
    },
    createdAt: new Date('2026-08-19T00:00:00Z'),
    can: {
      update: true,
      delete: true,
      like: true,
      unlike: false,
    },
    replies,
    likes,
  }
}

describe('comment tree helpers', () => {
  it('finds root comments and replies with explicit parent semantics', () => {
    const reply = createComment(2)
    const comments = [createComment(1, [reply])]

    expect(getCommentById(comments, 1)).toBe(comments[0])
    expect(getCommentById(comments, 2, 1)).toBe(reply)
    expect(getCommentById(comments, 2, 0)).toBeUndefined()
  })

  it('replaces roots and replies immutably', () => {
    const reply = createComment(2)
    const comments = [createComment(1, [reply])]
    const replacement = { ...reply, content: 'Edited' }

    const replaced = replaceComment(comments, replacement, 1)

    expect(replaced[0]?.replies[0]).toBe(replacement)
    expect(comments[0]?.replies[0]).toBe(reply)
  })

  it('returns the original array when a target is absent', () => {
    const comments = [createComment(1)]

    expect(replaceComment(comments, createComment(9))).toBe(comments)
  })

  it('toggles permissions and never decrements likes below zero', () => {
    const comments = [createComment(1)]
    const liked = patchCommentLike(comments, 1, true)
    const unliked = patchCommentLike(comments, 1, false)

    expect(liked[0]?.likes).toBe(1)
    expect(liked[0]?.can).toMatchObject({ like: false, unlike: true })
    expect(unliked[0]?.likes).toBe(0)
    expect(unliked[0]?.can).toMatchObject({ like: true, unlike: false })
  })
})
