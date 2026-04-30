import type { PluginOption } from 'vite'
import type { Options } from './types'
import { readFileSync } from 'node:fs'
import ui from '@nuxt/ui/vite'
import soubiranComposablesImports from '@soubiran/ui/imports'
import soubiranResolver from '@soubiran/ui/resolver'
import soubiranWrapperClasses from '@soubiran/ui/wrapper-classes'
import { unheadVueComposablesImports } from '@unhead/vue'
import vue from '@vitejs/plugin-vue'
import matter from 'gray-matter'
import fonts from 'unplugin-fonts/vite'
import icons from 'unplugin-icons/vite'
import markdown from 'unplugin-vue-markdown/vite'
import vueRouter from 'unplugin-vue-router/vite'
import { componentIncludePatterns, vueIncludePatterns } from './constants'
import { markdownFrontmatterFactory } from './markdown/frontmatter'
import { markdownRulesFactory } from './markdown/rules'
import api from './plugins/api'
import config from './plugins/config'
import meta from './plugins/meta'
import promise from './plugins/promise'
import rawMarkdown from './plugins/raw-markdown'
import sitemap from './plugins/sitemap'
import ssg from './plugins/ssg'

export default function soubiran(title: string, hostname: string, options: Options): PluginOption[] {
  return [
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
      include: vueIncludePatterns,
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
        include: componentIncludePatterns,
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
      wrapperClasses: soubiranWrapperClasses,
      transforms: options.markdown?.transforms ?? {},
      wrapperComponent: options.markdown?.wrapperComponent,
      markdownItSetup: markdownRulesFactory(hostname),
      frontmatterPreprocess: markdownFrontmatterFactory({
        title,
        hostname,
        extractPage: options.extractPage,
        assertRules: options.seo?.assert?.rules,
        getPageConfig: options.seo?.structuredData?.pageConfig,
      }),
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

    config(),
    ssg(),
    meta(hostname),
    api(options.api?.categories),
    rawMarkdown(),
    sitemap(hostname),
    promise(),
  ]
}
