import type { NuxtUIOptions } from '@nuxt/ui/vite'
import type { Plugin } from 'vite'
import type { Options } from './types'
import { readFileSync } from 'node:fs'
import { cloudflare } from '@cloudflare/vite-plugin'
import ui from '@nuxt/ui/vite'
import soubiranComposablesImports from '@soubiran/ui/imports'
import soubiranResolver from '@soubiran/ui/resolver'
import soubiranWrapperClasses from '@soubiran/ui/wrapper-classes'
import { unheadVueComposablesImports } from '@unhead/vue'
import vue from '@vitejs/plugin-vue'
import { defu } from 'defu'
import matter from 'gray-matter'
import fonts from 'unplugin-fonts/vite'
import icons from 'unplugin-icons/vite'
import markdown from 'unplugin-vue-markdown/vite'
import router from 'vue-router/vite'
import { componentIncludePatterns, vueIncludePatterns } from './constants'
import { markdownFrontmatterFactory } from './markdown/frontmatter'
import { markdownRulesFactory } from './markdown/rules'
import api from './plugins/api'
import config from './plugins/config'
import deadLinks from './plugins/dead-links'
import meta from './plugins/meta'
import promise from './plugins/promise'
import rawMarkdown from './plugins/raw-markdown'
import sitemap from './plugins/sitemap'
import ssg from './plugins/ssg'

export function factory(options: Options): Plugin[] {
  const plugins = []

  if (options.router !== false) {
    plugins.push(
      router({
        extensions: ['.vue', '.md'],
        routesFolder: 'src/app/pages',
        dts: 'src/app/route-map.d.ts',
        extendRoute(route) {
          const path = route.components.get('default')
          if (!path)
            return

          if (path.endsWith('.vue') && options.router && options.router.extractPage) {
            route.addToMeta({
              frontmatter: {
                page: options.router.extractPage(path),
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
    )
  }

  plugins.push(
    vue({
      include: vueIncludePatterns,
    }),
  )

  const imports: Required<NuxtUIOptions>['autoImport']['imports'] = [
    'vue',
    '@vueuse/core',
    {
      from: 'tailwind-variants',
      imports: ['tv'],
    },
    unheadVueComposablesImports,
    soubiranComposablesImports,
  ]

  if (options.router !== false) {
    imports.push('vue-router')
  }

  plugins.push(
    ui(defu(options.ui, {
      scanPackages: ['@soubiran/ui'],
      router: options.router !== false,
      autoImport: {
        dts: 'src/app/auto-imports.d.ts',
        dirs: [
          'src/app/utils',
          'src/app/composables',
          'src/shared/utils',
          'src/shared/types',
        ],
        imports,
      },
      components: {
        include: componentIncludePatterns,
        dirs: [
          'src/app/components',
        ],
        dts: 'src/app/components.d.ts',
        resolvers: [
          soubiranResolver(),
        ],
      },
      ui: {
        colors: {
          neutral: 'neutral',
        },
      },
    })),
  )

  if (options.markdown !== false) {
    plugins.push(deadLinks())

    plugins.push(
      markdown({
        headEnabled: true,
        wrapperClasses: soubiranWrapperClasses,
        transforms: options.markdown?.options?.transforms ?? {},
        wrapperComponent: options.markdown?.options?.wrapperComponent,
        markdownItSetup: markdownRulesFactory(options.hostname),
        frontmatterPreprocess: markdownFrontmatterFactory({
          title: options.title,
          hostname: options.hostname,
          extractPage: options.markdown.extractPage,
          assertRules: options.seo?.assert?.rules,
          getPageConfig: options.seo?.structuredData?.pageConfig,
        }),
      }),
    )
  }

  plugins.push(fonts({
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
  }))

  plugins.push(icons({
    autoInstall: true,
  }))

  plugins.push(config())

  if (options.ssg !== false) {
    plugins.push(ssg())
  }

  if (options.meta !== false) {
    plugins.push(meta({
      hostname: options.meta?.hostname || options.hostname,
    }))
  }

  if (options.api !== false) {
    plugins.push(api({
      categories: options.api?.categories,
    }))
  }

  if (options.markdown !== false)
    plugins.push(rawMarkdown())

  if (options.sitemap !== false) {
    plugins.push(sitemap({
      hostname: options.sitemap?.hostname || options.hostname,
    }))
  }

  plugins.push(promise())

  plugins.push(cloudflare())

  return plugins
}
