<script lang="ts">
import UAvatar from '@nuxt/ui/components/Avatar.vue'
import { useQuery } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useLocale } from '../../composables/useLocale'
import { currentUserQuery } from '../../queries/users'
import LoginRequired from '../LoginRequired.vue'
import CommentForm from './CommentForm.vue'

const commentFormSection = tv({
  slots: {
    base: 'space-y-2',
    header: 'flex items-center gap-2',
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

const { data: user } = useQuery(currentUserQuery)

const ui = computed(() => commentFormSection())
</script>

<template>
  <section :class="ui.base({ class: [props.ui?.base, props.class] })">
    <div :class="ui.header({ class: props.ui?.header })">
      <UAvatar
        v-if="user"
        :src="user.data.avatar"
        :title="user.data.name"
      />
      <!-- TODO: How to manage this Heading3? -->
      <Heading3>
        {{ t('comments.CommentFormSection.title') }}
      </Heading3>
    </div>

    <LoginRequired v-if="!user" fragment="comments" />

    <CommentForm v-else />
  </section>
</template>
