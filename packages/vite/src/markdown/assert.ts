export type AssertFn = (id: string, frontmatter: Record<string, any>) => void

export function createAssert(customAssert?: AssertFn): AssertFn {
  return (id: string, frontmatter: Record<string, any>) => {
    // Validate description length if present
    if (frontmatter.description) {
      const descLength = frontmatter.description.length
      if (descLength < 110 || descLength > 160) {
        throw new Error(
          `Description length must be between 110 and 160 characters. `
          + `Current length: ${descLength} in file: ${id}`,
        )
      }
    }

    // Run custom assertions if provided
    customAssert?.(id, frontmatter)
  }
}
