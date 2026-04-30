export const markdownExtensionRE = /\.md$/
export const vueExtensionRE = /\.vue$/
export const indexSuffixRE = /index$/

export const vueIncludePatterns = [
  vueExtensionRE,
  markdownExtensionRE,
]
export const componentIncludePatterns = [
  vueExtensionRE,
  /\.vue\?vue/,
  markdownExtensionRE,
]
