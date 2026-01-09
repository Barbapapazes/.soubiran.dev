<script lang="ts">
import type { TextareaProps } from '@nuxt/ui/components/Textarea.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UIcon from '@nuxt/ui/components/Icon.vue'
import UTextArea from '@nuxt/ui/components/Textarea.vue'
import { useQuery } from '@pinia/colada'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { tv } from 'tailwind-variants'
import { computed, nextTick, useTemplateRef } from 'vue'
import infoDuotone from '~icons/ph/info-duotone'
import { fetchMarkdown } from '../api/comments'
import { useLocale } from '../composables/useLocale'

// TODO: update styles with the new design system
const editor = tv({
  slots: {
    root: 'overflow-hidden border border-neutral-200 rounded-md dark:border-neutral-600 ',
    tabs: 'mb-[-1px] ml-[-1px] mt-[-1px] bg-neutral-100 text-sm space-x-1 dark:bg-neutral-800',
    tab: 'relative border-x border-neutral-200 rounded-t-md px-4 py-2 text-sm text-neutral-500 data-[state=active]:border-t dark:border-neutral-600 data-[state=inactive]:border-transparent data-[state=active]:bg-white dark:text-neutral-400 data-[state=active]:text-neutral-800 hover:text-neutral-800 dark:data-[state=active]:bg-neutral-900 dark:data-[state=active]:text-neutral-200 dark:hover:text-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-neutral-200 dark:focus-visible:outline-white',
    content: 'data-[state=active]:p-2 flex flex-col gap-1 border-t border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-900',
    preview: '',
    prose: 'w-full rounded-md p-2 text-sm',
  },
})

export interface EditorProps {
  class?: any
  textarea?: TextareaProps
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

const content = defineModel<string>('content', { default: '' })

const { t } = useLocale()

const { data: preview, isLoading: isPreviewLoading, refresh: refreshPreview } = useQuery({
  enabled: false,
  staleTime: 1000 * 60 * 5, // 5 minutes to avoid unnecessary requests
  key: () => ['preview', content.value],
  query: async () => {
    if (!content.value) {
      return Promise.resolve(`<p>${t('Editor.preview.placeholder')}</p>`)
    }

    return fetchMarkdown(content.value).then(response => response.data)
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
        <UTextArea
          ref="textarea"
          v-model="content"
          variant="none"
          :ui="{ root: 'flex', base: 'w-full' }"
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
      <!-- TODO: manage prose without-margin -->
      <Prose without-margin :class="ui.prose({ class: props.ui?.prose })">
        <p v-if="isPreviewLoading">
          {{ t('Editor.preview.loading') }}
        </p>
        <div v-else v-html="preview" />
      </Prose>
    </TabsContent>
  </TabsRoot>
</template>
