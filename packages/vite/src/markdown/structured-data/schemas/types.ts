export interface ArticleData {
  '@type': 'Article'
  '@id': string
  'headline': string
  'description': string
  'isPartOf': {
    '@id': string
  }
  'mainEntityOfPage': {
    '@id': string
  }
  'datePublished'?: string
  'author': {
    '@id': string
  }
  'publisher': {
    '@id': string
  }
  'inLanguage': string
  // 'potentialAction': {
  //   '@type': 'CommentAction'
  //   'name': string
  //   'target': string[]
  // }[]
}

export interface BreadcrumbData {
  '@type': 'BreadcrumbList'
  '@id': string
  'itemListElement': {
    '@type': 'ListItem'
    'position': number
    'name': string
    'item'?: {
      '@type': 'WebSite' | 'WebPage'
      '@id': string
    }
  }[]
}

export interface BreadcrumbItem {
  title: string
  type?: 'WebSite' | 'WebPage'
  url?: string
}

export interface PersonData {
  '@type': 'Person'
  '@id': string
  'name': string
  'sameAs': string[]
}

export interface WebPageData {
  '@type': 'WebPage' | 'CollectionPage'
  '@id': string
  'url': string
  'name': string
  'description': string
  'isPartOf': {
    '@id': string
  }
  'inLanguage': string
  'potentialAction'?: {
    '@type': 'ReadAction'
    'target': string[]
  }[]
  'datePublished'?: string
  'keywords'?: string[]
  'breadcrumb'?: {
    '@id': string
  }
}

export interface WebsiteData {
  '@type': 'WebSite'
  '@id': string
  'url': string
  'name': string
  'inLanguage': string[]
  'publisher': {
    '@id': string
  }
}
