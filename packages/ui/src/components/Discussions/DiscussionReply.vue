<script lang="ts">
import type { Comment } from '../../types/comment'
import UButton from '@nuxt/ui/components/Button.vue'
import { useToast } from '@nuxt/ui/composables/useToast'
import { useQuery } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import { useLocale } from '../../composables/useLocale'
import { getLoginErrorMessageKey, useLogin } from '../../composables/useLogin'
import { currentUserQuery } from '../../queries/users.ts'
import CommentForm from '../Comments/CommentForm.vue'

const discussionReply = tv({
  slots: {
    button: 'justify-start text-muted',
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
const toast = useToast()
const { data: user } = useQuery(currentUserQuery)

const { error: loginError, openLoginWindow } = useLogin()

const form = useTemplateRef('form')

const isFormShown = ref(false)

async function showForm() {
  if (!user.value) {
    const isLoggedIn = await openLoginWindow()
    if (!isLoggedIn && loginError.value) {
      toast.add({
        color: 'error',
        description: t(getLoginErrorMessageKey(loginError.value)),
      })
    }
    return
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
