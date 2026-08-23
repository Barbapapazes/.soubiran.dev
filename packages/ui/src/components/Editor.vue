<script lang="ts">
import type { TextareaProps } from '@nuxt/ui/components/Textarea.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UIcon from '@nuxt/ui/components/Icon.vue'
import UTextarea from '@nuxt/ui/components/Textarea.vue'
import { useQuery } from '@pinia/colada'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { tv } from 'tailwind-variants'
import { computed, nextTick, useTemplateRef } from 'vue'
import infoDuotone from '~icons/ph/info-duotone'
import { getMarkdown } from '../api/comments'
import { useLocale } from '../composables/useLocale'
import { prose } from '../wrapper-classes'

const editor = tv({
  slots: {
    root: 'overflow-hidden border border-muted rounded-md',
    tabs: 'mb-[-1px] ml-[-1px] mt-[-1px] bg-muted text-sm space-x-1',
    tab: 'relative border-x rounded-t-md px-4 py-2 text-sm text-dimmed data-[state=active]:border-t data-[state=active]:border-muted data-[state=inactive]:border-transparent data-[state=active]:bg-default data-[state=active]:text-default hover:text-default focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:ring-inverted',
    content: 'data-[state=active]:p-2 flex flex-col gap-1 border-t border-muted bg-default',
    preview: '',
    prose: 'w-full rounded-md p-2 text-sm',
  },
})

type EditorTextareaProps = Omit<
  TextareaProps<string>,
  'modelValue' | 'defaultValue' | 'modelModifiers'
>

export interface EditorProps {
  class?: any
  textarea?: EditorTextareaProps
  error?: string
  ui?: Partial<typeof editor.slots>
}
export interface EditorEmits {}
export interface EditorSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<EditorProps>()
defineEmits<EditorEmits>()
defineSlots<EditorSlots>()

const content = defineModel<string>('content', { default: '', required: true })

const { code, t } = useLocale()

const { data: preview, isLoading: isPreviewLoading, refresh: refreshPreview } = useQuery({
  enabled: false,
  staleTime: 1000 * 60 * 5, // 5 minutes to avoid unnecessary requests
  key: () => ['preview', code.value, content.value],
  query: async () => {
    if (!content.value) {
      return Promise.resolve(`<p>${t('Editor.preview.placeholder')}</p>`)
    }

    return getMarkdown(content.value, code.value === 'fr' ? 'fr' : 'en').then(response => response.data)
  },
})

function onFetchPreview() {
  refreshPreview()
}

function onUpdateModelValue(value: string) {
  if (value === 'write') {
    // `nextTick` does not work here
    setTimeout(() => {
      focus()
    }, 0)
  }
}

const textarea = useTemplateRef('textarea')
function focus() {
  nextTick(() => {
    textarea.value?.textareaRef?.focus()
  })
}
defineExpose({ focus })

const ui = computed(() => editor())
</script>

<template>
  <TabsRoot default-value="write" :class="ui.root({ class: [props.ui?.root, props.class] })" @update:model-value="onUpdateModelValue">
    <TabsList :class="ui.tabs({ class: props.ui?.tabs })">
      <TabsTrigger value="write" :class="ui.tab({ class: props.ui?.tab })">
        {{ t('Editor.tabs.write') }}
      </TabsTrigger>
      <TabsTrigger value="preview" :class="ui.tab({ class: props.ui?.tab })" @mouseenter="onFetchPreview" @focus="onFetchPreview">
        {{ t('Editor.tabs.preview') }}
      </TabsTrigger>
    </TabsList>

    <TabsContent value="write" :class="ui.content({ class: props.ui?.content })" tabindex="-1">
      <UFormField :ui="{ help: 'flex items-center gap-1' }" :error="props.error" :help="t('Editor.write.help')">
        <UTextarea
          ref="textarea"
          v-model="content"
          variant="none"
          :ui="{ root: 'flex', base: 'w-full resize-none' }"
          :rows="4"
          :placeholder="t('Editor.placeholder')"
          v-bind="props.textarea"
        />

        <template #help="{ help }">
          <UIcon :name="infoDuotone" class="inline-block size-4" />
          <span>{{ help }}</span>
        </template>
      </UFormField>
    </TabsContent>
    <TabsContent value="preview" :class="ui.content({ class: props.ui?.content })" tabindex="-1">
      <div v-if="isPreviewLoading" :class="ui.prose({ class: [prose, props.ui?.prose] })">
        <p>
          {{ t('Editor.preview.loading') }}
        </p>
      </div>
      <div v-else :class="ui.prose({ class: [prose, props.ui?.prose] })" v-html="preview" />
    </TabsContent>
  </TabsRoot>
</template>
