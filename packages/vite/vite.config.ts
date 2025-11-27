import type { Options as MarkdownOptions } from 'unplugin-vue-markdown/types'
/// <reference types="vite-ssg" />
import type { UserConfig } from 'vite'
import type { AssertFn } from './src/assert'
import type { StructuredDataPageConfig } from './src/structured-data'
import type { PersonOptions } from './src/structured-data/person'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ui from '@nuxt/ui/vite'
import { unheadVueComposablesImports } from '@unhead/vue'
import vue from '@vitejs/plugin-vue'
import matter from 'gray-matter'
import fonts from 'unplugin-fonts/vite'
import icons from 'unplugin-icons/vite'
import markdown from 'unplugin-vue-markdown/vite'
import vueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import soubiranComposablesImports from '../ui/src/imports'
import soubiranResolver from '../ui/src/resolver'
import { createAssert } from './src/assert'
import { canonical } from './src/canonical'
import { customImage, customLink, githubAlerts, implicitFiguresRule, linkAttributesRule, shikiHighlight, tableOfContentsRule } from './src/markdown-it'
import { og } from './src/og'
import { apiPlugin } from './src/plugins/api'
import { markdownPlugin } from './src/plugins/markdown'
import { metaPlugin } from './src/plugins/meta'
import { resolveAll } from './src/promise'
import { routes, sitemap } from './src/sitemap'
import { structuredData } from './src/structured-data'

export type { StructuredDataPageConfig } from './src/structured-data'
export type { BreadcrumbItem } from './src/structured-data/breadcrumb'
export type { PersonOptions } from './src/structured-data/person'

interface Options {
  extractPage: (id: string) => string | null
  markdown?: MarkdownOptions
  person: PersonOptions
  getPageConfig: (page: string | null, frontmatter: Record<string, any>) => StructuredDataPageConfig
  assert?: AssertFn
  apiCategories?: string[]
}

const config: UserConfig = {}

export default (title: string, hostname: string, options: Options) => defineConfig({
  plugins: [
    vueRouter({
      extensions: ['.vue', '.md'],
      routesFolder: 'pages',
      dts: 'src/typed-router.d.ts',
      extendRoute(route) {
        const path = route.components.get('default')
        if (!path)
          return

        if (path.endsWith('.vue')) {
          route.addToMeta({
            frontmatter: {
              page: options.extractPage(path),
            },
          })
        }

        if (path.endsWith('.md')) {
          const { data } = matter(readFileSync(path, 'utf-8'))
          route.addToMeta({
            frontmatter: data,
          })
        }
      },
    }),

    vue({
      include: [/\.vue$/, /\.md$/],
    }),

    ui({
      autoImport: {
        dts: 'src/auto-imports.d.ts',
        dirs: [
          'src/composables',
        ],
        imports: [
          'vue',
          'vue-router',
          '@vueuse/core',
          unheadVueComposablesImports,
          {
            from: 'tailwind-variants',
            imports: ['tv'],
          },
          soubiranComposablesImports,
        ],
      },
      components: {
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/components.d.ts',
        resolvers: [
          soubiranResolver(),
        ],
      },
      ui: {
        colors: {
          neutral: 'neutral',
        },
      },
    }),

    markdown({
      headEnabled: true,
      wrapperClasses: [
        'slide-enter-content',
        'max-w-none',
        'prose prose-neutral dark:prose-invert',
        'prose-headings:text-default prose-h2:text-[1.125em] prose-h2:mb-[0.5em] prose-h3:text-[1em]',
        'prose-p:my-[1em] dark:prose-p:text-muted',
        'dark:prose-ul:text-muted dark:prose-ol:text-muted',
        'dark:prose-strong:text-default',
        'dark:prose-a:text-muted prose-a:font-semibold prose-a:no-underline prose-a:border-b prose-a:border-muted prose-a:transition-colors prose-a:duration-300 prose-a:ease-out prose-a:hover:border-[var(--ui-text-dimmed)]',
        'prose-hr:max-w-1/2 prose-hr:mx-auto prose-hr:my-[2em]',
        'prose-figure:bg-neutral-100 dark:prose-figure:bg-neutral-800 prose-figure:rounded-lg',
        'prose-img:rounded-lg prose-img:border prose-img:border-accented prose-img:shadow-md',
        'prose-video:rounded-lg prose-video:border prose-video:border-accented prose-video:shadow-md',
        'prose-figcaption:text-center prose-figcaption:py-1 prose-figcaption:m-0',
        '[&_:first-child]:mt-0 [&_:last-child]:mb-0',
      ],
      transforms: options.markdown?.transforms,
      wrapperComponent: options.markdown?.wrapperComponent,
      async markdownItSetup(md) {
        githubAlerts(md)
        implicitFiguresRule(md)
        linkAttributesRule(md)
        tableOfContentsRule(md)
        customLink(md, hostname)
        customImage(md, hostname)
        await shikiHighlight(md)
      },

      frontmatterPreprocess(frontmatter, frontmatterOptions, id, defaults) {
        const assert = createAssert(options.assert)
        assert(id, frontmatter)
        og(id, frontmatter, hostname)
        canonical(id, frontmatter, hostname)
        structuredData(id, frontmatter, {
          name: title,
          hostname,
          person: options.person,
          extractPage: options.extractPage,
          getPageConfig: options.getPageConfig,
        })

        const page = options.extractPage(id)
        frontmatter.page = page

        const head = defaults(frontmatter, frontmatterOptions)
        return { head, frontmatter }
      },
    }),

    fonts({
      google: {
        families: [
          {
            name: 'DM Sans',
            styles: 'ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000',
          },
          {
            name: 'DM Mono',
            styles: 'ital,wght@0,300;0,400;0,500;1,300;1,400;1,500',
          },
          {
            name: 'Sofia Sans',
            styles: 'ital,wght@0,1..1000;1,1..1000',
          },
        ],
      },
    }),

    icons({
      autoInstall: true,
    }),

    apiPlugin(options.apiCategories),
    markdownPlugin(),
    metaPlugin(hostname),

    {
      name: 'await',
      async closeBundle() {
        await resolveAll()
      },
    },

    {
      name: 'extract-config',
      configResolved(resolvedConfig) {
        Object.assign(config, resolvedConfig)
      },
    },
  ],

  optimizeDeps: {
    include: [
      'vue',
      'scule',
      'vue-router',
      '@unhead/vue',
      'partysocket',
      '@iconify/vue',
      '@dagrejs/dagre',
      '@vue-flow/core',
      '@vue-flow/background',
    ],
  },

  resolve: {
    alias: {
      '@soubiran/ui': fileURLToPath(new URL('../ui/src', import.meta.url)),
      '@': resolve('./src'),
    },
  },

  ssgOptions: {
    formatting: 'minify',
    onPageRendered(route, renderedHTML) {
      routes.add(route)
      return renderedHTML
    },
    onFinished() {
      sitemap(config, hostname, Array.from(routes))
    },
  },
})
