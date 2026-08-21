<script lang="ts">
import UAvatar from '@nuxt/ui/components/Avatar.vue'
import { useQuery } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useCommentsContext } from '../../composables/comments/context'
import { useLocale } from '../../composables/useLocale'
import { currentUserQuery } from '../../queries/users.ts'
import LoginRequired from '../LoginRequired.vue'
import CommentForm from './CommentForm.vue'

const commentFormSection = tv({
  slots: {
    base: 'space-y-2',
    header: 'flex items-center gap-2',
    title: 'font-medium text-default',
  },
})

export interface CommentFormSectionProps {
  class?: any
  ui?: Partial<typeof commentFormSection.slots>
}
export interface CommentFormSectionEmits {}
export interface CommentFormSectionSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<CommentFormSectionProps>()
defineEmits<CommentFormSectionEmits>()
defineSlots<CommentFormSectionSlots>()

const { t } = useLocale()

const { pageId } = useCommentsContext()

const { data: user } = useQuery(currentUserQuery)

const ui = computed(() => commentFormSection())
</script>

<template>
  <section :class="ui.base({ class: [props.ui?.base, props.class] })">
    <div :class="ui.header({ class: props.ui?.header })">
      <UAvatar
        v-if="user"
        :src="user.avatar"
        :title="user.name"
      />
      <h3 :class="ui.title({ class: props.ui?.title })">
        {{ t('comments.CommentFormSection.title') }}
      </h3>
    </div>

    <LoginRequired v-if="!user" fragment="comments" />

    <CommentForm
      v-else
      :id="pageId"
    />
  </section>
</template>
