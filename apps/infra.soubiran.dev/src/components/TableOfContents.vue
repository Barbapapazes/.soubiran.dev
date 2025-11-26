<script lang="ts">
const tableOfContents = tv({
  slots: {
    base: 'space-y-1 text-sm text-dimmed font-medium',
    title: '',
    list: 'font-sofia',
    link: 'flex gap-1 px-0 py-1 text-dimmed hover:text-default active:text-default transition-colors focus:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-inverted data-active:text-default rounded-md',
  },
})

export interface TableOfContentsItem {
  level: number
  anchor: string | null
  text: string
  children?: TableOfContentsItem[]
}

export interface TableOfContentsProps {
  toc: TableOfContentsItem[]
  class?: any
  ui?: Partial<typeof tableOfContents.slots>
}
export interface TableOfContentsEmits {}
export interface TableOfContentsSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<TableOfContentsProps>()
defineEmits<TableOfContentsEmits>()
defineSlots<TableOfContentsSlots>()

const route = useRoute()

function track(text: string, hash: string) {
  window.umami?.track('table_of_contents_click', {
    page_path: route.path,
    toc_text: text,
    toc_hash: hash,
  })
}

const { activeHeadings } = useTableOfContents()

const ui = computed(() => tableOfContents())
</script>

<template>
  <div :class="ui.base({ class: [props.ui?.base, props.class] })">
    <div :class="ui.title({ class: props.ui?.title })">
      Table of Contents
    </div>
    <ul :class="ui.list({ class: props.ui?.list })">
      <li v-for="(item, index) in props.toc" :key="item.anchor || index">
        <!-- Cannot use RouterLink as the anchor will be prefixed with the route path. -->
        <a
          v-if="item.anchor"
          custom
          variant="link"
          color="neutral"
          :href="`#${item.anchor}`"
          :data-active="activeHeadings.includes(item.anchor || '') ? true : undefined"
          :class="ui.link({ class: props.ui?.link })"
          @click="track(item.text, item.anchor)"
        >
          <span>{{ index + 1 }}.</span>
          {{ item.text }}
        </a>
      </li>
    </ul>
  </div>
</template>
