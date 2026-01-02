/// <reference types="vite-ssg" />
import type { Options as MarkdownOptions } from 'unplugin-vue-markdown/types'
import type { UserConfig } from 'vite'
import type { AssertFn } from './src/assert'
import type { StructuredDataPageConfig } from './src/structured-data'
import type { PersonOptions } from './src/structured-data/person'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import ui from '@nuxt/ui/vite'
import soubiranComposablesImports from '@soubiran/ui/imports'
import soubiranResolver from '@soubiran/ui/resolver'
import { unheadVueComposablesImports } from '@unhead/vue'
import vue from '@vitejs/plugin-vue'
import matter from 'gray-matter'
import fonts from 'unplugin-fonts/vite'
import icons from 'unplugin-icons/vite'
import markdown from 'unplugin-vue-markdown/vite'
import vueRouter from 'unplugin-vue-router/vite'
import { defineConfig, mergeConfig } from 'vite'
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

/**
 * Main configuration interface for the infrastructure status app.
 */
interface Options {
  /**
   * Extracts the page identifier from a given file path or id.
   * @param id - The file path or identifier.
   * @returns The extracted page name, or null if not found.
   */
  extractPage: (id: string) => string | null

  /**
   * Markdown rendering options for unplugin-vue-markdown.
   */
  markdown?: MarkdownOptions

  /**
   * SEO and structured data configuration.
   */
  seo?: {
    /**
     * Person information for Schema.org structured data.
     */
    person?: PersonOptions

    /**
     * Custom validation rules for frontmatter fields.
     */
    assert?: {
      /**
       * Validation rules function for frontmatter.
       */
      rules?: AssertFn
    }

    /**
     * Structured data generation configuration.
     */
    structuredData?: {
      /**
       * Callback to determine page type and configuration for structured data generation.
       * @param page - The page name or null.
       * @param frontmatter - The frontmatter data for the page.
       * @returns Structured data configuration for the page.
       */
      pageConfig?: (page: string | null, frontmatter: Record<string, any>) => StructuredDataPageConfig
    }
  }

  /**
   * Categories to generate API JSON files for (e.g., ['websites', 'platforms']).
   */
  apiCategories?: string[]
}

export default (title: string, hostname: string, options: Options, config: UserConfig = {}) => {
  const seo = {
    person: {
      name: 'Estéban Soubiran',
      sameAs: [
        'https://x.com/soubiran_',
        'https://www.linkedin.com/in/esteban25',
        'https://www.twitch.tv/barbapapazes',
        'https://www.youtube.com/@barbapapazes',
        'https://github.com/barbapapazes',
        'https://soubiran.dev',
        'https://esteban-soubiran.site',
        'https://barbapapazes.dev',
      ],
    },
  }

  return mergeConfig(defineConfig({
  // define: {
  //   __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
  // },
  // build: {
  //   minify: false,
  // },
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
        transforms: options.markdown?.transforms ?? {},
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
          const assert = createAssert(options.seo?.assert?.rules)
          assert(id, frontmatter)
          og(id, frontmatter, hostname)
          canonical(id, frontmatter, hostname)
          structuredData(id, frontmatter, {
            name: title,
            hostname,
            person: options.seo?.person ?? seo.person,
            extractPage: options.extractPage,
            getPageConfig: options.seo?.structuredData?.pageConfig,
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
      exclude: [
      // Must be excluded as it is a linked package
        '@soubiran/ui',
      ],
    },

    resolve: {
      alias: {
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
  }), config)
}
