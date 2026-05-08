function normalizePath(filePath) {
  return filePath.replaceAll('\\', '/')
}

function createRestrictedRelativeImportRule({
  allowedFile,
  importPattern,
  message,
}) {
  return {
    meta: {
      type: 'problem',
      docs: {
        description: message,
      },
      schema: [],
      messages: {
        restricted: message,
      },
    },
    create(context) {
      const filename = normalizePath(context.filename)

      if (allowedFile(filename)) {
        return {}
      }

      function check(node) {
        const importSource = node.source?.value

        if (typeof importSource !== 'string') {
          return
        }

        if (!importPattern.test(importSource.trim())) {
          return
        }

        context.report({
          node: node.source,
          messageId: 'restricted',
        })
      }

      return {
        ImportDeclaration: check,
        ExportAllDeclaration: check,
        ExportNamedDeclaration(node) {
          if (node.source) {
            check(node)
          }
        },
      }
    },
  }
}

export const serverLayeringPlugin = {
  rules: {
    'repositories-only-in-services': createRestrictedRelativeImportRule({
      allowedFile: filePath => filePath.includes('/src/server/services/'),
      importPattern: /^(?:\.{1,2}\/)+repositories\/[^/]+\.repository$/u,
      message: 'Repositories can only be imported from services.',
    }),
    'services-only-in-controllers': createRestrictedRelativeImportRule({
      allowedFile: (filePath) => {
        return filePath.includes('/src/server/controllers/')
          || filePath.includes('/src/server/mappers/')
          || filePath.includes('/src/server/workflows/')
          || filePath.endsWith('/src/server/index.ts')
      },
      importPattern: /^(?:\.{1,2}\/)+services\/[^/]+\.service$/u,
      message: 'Services can only be imported from controllers, mappers, workflows, or the worker entrypoint.',
    }),
  },
}
