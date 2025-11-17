<script lang="ts">
const page = tv({
  slots: {
    base: 'py-12',
    header: 'max-w-3xl mx-auto xl:max-w-none xl:grid xl:grid-cols-[256px_768px_256px]',
    headerInner: 'xl:col-start-2',
    content: 'mt-6 max-w-3xl mx-auto xl:max-w-none xl:grid xl:grid-cols-[256px_768px_256px] xl:mx-auto',
    contentInner: 'xl:col-start-2',
    right: 'hidden xl:block xl:col-start-3 xl:pl-8 xl:h-full',
    rightInner: 'sticky top-4',
  },
})

export interface PageProps {
  class?: any
  ui?: Partial<typeof page.slots>
}
export interface PageEmits {}
export interface PageSlots {
  default: (props: any) => any
  header: (props: any) => any
  right: (props: any) => any
  bottom: (props: any) => any
}
</script>

<script lang="ts" setup>
const props = defineProps<PageProps>()
defineEmits<PageEmits>()
defineSlots<PageSlots>()

const ui = computed(() => page())
</script>

<template>
  <div :class="ui.base({ class: [props.ui?.base, props.class] })">
    <Container>
      <div :class="ui.header({ class: props.ui?.header })">
        <div :class="ui.headerInner({ class: props.ui?.headerInner })">
          <slot name="header" />
        </div>
      </div>

      <div :class="ui.content({ class: props.ui?.content })">
        <div :class="ui.contentInner({ class: props.ui?.contentInner })">
          <slot />
        </div>

        <div :class="ui.right({ class: props.ui?.right })">
          <div :class="ui.rightInner({ class: props.ui?.rightInner })">
            <slot name="right" />
          </div>
        </div>
      </div>
    </Container>

    <slot name="bottom" />
  </div>
</template>
