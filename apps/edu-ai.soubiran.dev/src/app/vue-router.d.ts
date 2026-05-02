import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    frontmatter: {
      page: string
      title: string
      description: string
    }
  }
}
