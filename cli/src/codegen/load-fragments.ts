import type { ExtraFragments } from "./fragments-types.js"
import { fragmentRegistry } from "./fragments-registry.js"

export function loadFragments(
  template: string,
  extras: readonly string[],
): ExtraFragments[] {
  const templateFragments = fragmentRegistry[template]
  if (!templateFragments) {
    return []
  }

  const result: ExtraFragments[] = []
  const selected = new Set(extras)

  for (const extra of extras) {
    const fragments = templateFragments[extra]
    if (!fragments) continue

    if (fragments.extra !== extra) {
      throw new Error(
        `Fragment registry mismatch: extra '${extra}' has fragments declaring extra '${fragments.extra}'`,
      )
    }

    if (fragments.requires) {
      for (const required of fragments.requires) {
        if (!selected.has(required)) {
          throw new Error(
            `Extra '${extra}' requires '${required}', but it was not selected`,
          )
        }
      }
    }

    result.push(fragments)
  }

  return result
}
