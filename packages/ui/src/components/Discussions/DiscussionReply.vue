<script lang="ts">
import type { Comment } from '../../types/comment'
import UButton from '@nuxt/ui/components/Button.vue'
import { useOverlay } from '@nuxt/ui/composables/useOverlay'
import { useQuery } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import { useLocale } from '../../composables/useLocale'
import { currentUserQuery } from '../../queries/users'
import CommentForm from '../Comments/CommentForm.vue'
import LoginModal from '../LoginModal.vue'

const discussionReply = tv({
  slots: {
    button: 'justify-start text-neutral-500 dark:text-neutral-400',
  },
})

export interface DiscussionReplyProps {
  parentComment: Comment
  class?: any
  ui?: Partial<typeof discussionReply.slots>
}
export interface DiscussionReplyEmits {}
export interface DiscussionReplySlots {}
</script>

<script lang="ts" setup>
const props = defineProps<DiscussionReplyProps>()
defineEmits<DiscussionReplyEmits>()
defineSlots<DiscussionReplySlots>()

const { t } = useLocale()

const form = useTemplateRef('form')

const isFormShown = ref(false)
const { data: user } = useQuery(currentUserQuery)

const overlay = useOverlay()
function showForm() {
  if (!user.value) {
    return overlay
      .create(LoginModal, {
        props: {
          fragment: 'comments',
        },
        destroyOnClose: true,
      })
      .open()
  }

  isFormShown.value = true

  nextTick(() => form.value?.focus())
}
function hideForm() {
  isFormShown.value = false
}

function onSuccess() {
  isFormShown.value = false
}

const ui = computed(() => discussionReply())
</script>

<template>
  <CommentForm
    v-if="isFormShown"
    ref="form"
    cancelable
    :parent-comment="props.parentComment"
    @success="onSuccess"
    @cancel="hideForm"
  />

  <UButton
    v-else
    color="neutral"
    variant="link"
    block
    :class="ui.button({ class: props.ui?.button })"
    @click="showForm"
  >
    {{ t('discussions.DiscussionReply.reply') }}
  </UButton>
</template>
