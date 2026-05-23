import type { ExtraFragments, PrismaModelEdit } from "./fragments-types.js"

interface ParsedField {
  name: string
  type: string
  attrs: string
}

interface ParsedModel {
  name: string
  fields: ParsedField[]
  blockAttrs: string[]
}

function parseField(line: string): ParsedField {
  const trimmed = line.trim()
  const parts = trimmed.split(/\s+/)
  if (parts.length < 2) {
    throw new Error(`Invalid Prisma field: '${line}'`)
  }
  const name = parts[0] ?? ""
  const type = parts[1] ?? ""
  const attrs = parts.slice(2).join(" ")
  return { name, type, attrs }
}

function parseModel(modelText: string): ParsedModel {
  const match = modelText.match(/^model\s+(\w+)\s*\{([\s\S]*)\}\s*$/)
  if (!match) {
    throw new Error(`Invalid Prisma model: '${modelText.slice(0, 80)}'`)
  }
  const name = match[1] ?? ""
  const body = match[2] ?? ""
  const lines = body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
  const fields: ParsedField[] = []
  const blockAttrs: string[] = []
  for (const line of lines) {
    if (line.startsWith("@@")) blockAttrs.push(line)
    else fields.push(parseField(line))
  }
  return { name, fields, blockAttrs }
}

function renderModel(model: ParsedModel): string {
  if (model.fields.length === 0) {
    const block =
      model.blockAttrs.length > 0
        ? "\n" + model.blockAttrs.map((a) => `  ${a}`).join("\n")
        : ""
    return `model ${model.name} {${block}\n}`
  }

  const maxName = Math.max(...model.fields.map((f) => f.name.length))
  const maxType = Math.max(...model.fields.map((f) => f.type.length))

  const fieldLines = model.fields.map((f) => {
    const namePad = f.name.padEnd(maxName)
    if (f.attrs.length === 0) {
      return `  ${namePad} ${f.type}`
    }
    const typePad = f.type.padEnd(maxType)
    return `  ${namePad} ${typePad} ${f.attrs}`
  })

  let out = `model ${model.name} {\n${fieldLines.join("\n")}`
  if (model.blockAttrs.length > 0) {
    out +=
      "\n\n" + model.blockAttrs.map((a) => `  ${a}`).join("\n")
  }
  out += "\n}"
  return out
}

interface MergeResult {
  models: ParsedModel[]
  enums: string[]
}

export function mergePrismaFragments(
  fragments: readonly ExtraFragments[],
): MergeResult {
  const modelOrder: string[] = []
  const modelMap = new Map<string, ParsedModel>()
  const pendingEdits = new Map<string, PrismaModelEdit[]>()
  const enums: string[] = []

  for (const frag of fragments) {
    const ps = frag.prismaSchema
    if (!ps) continue
    if (ps.models) {
      for (const modelText of ps.models) {
        const parsed = parseModel(modelText)
        if (modelMap.has(parsed.name)) {
          throw new Error(
            `Duplicate Prisma model '${parsed.name}' contributed by '${frag.extra}'`,
          )
        }
        modelMap.set(parsed.name, parsed)
        modelOrder.push(parsed.name)
      }
    }
    if (ps.modelEdits) {
      for (const [modelName, edit] of Object.entries(ps.modelEdits)) {
        const list = pendingEdits.get(modelName) ?? []
        list.push(edit)
        pendingEdits.set(modelName, list)
      }
    }
    if (ps.enums) {
      for (const e of ps.enums) enums.push(e)
    }
  }

  for (const [modelName, edits] of pendingEdits) {
    const model = modelMap.get(modelName)
    if (!model) {
      throw new Error(
        `Prisma modelEdit references unknown model '${modelName}'`,
      )
    }
    for (const edit of edits) {
      if (edit.fields) {
        for (const fieldLine of edit.fields) {
          model.fields.push(parseField(fieldLine))
        }
      }
      if (edit.attributes) {
        for (const attr of edit.attributes) {
          model.blockAttrs.push(attr.trim())
        }
      }
    }
  }

  return {
    models: modelOrder.map((name) => {
      const m = modelMap.get(name)
      if (!m) throw new Error(`Internal: missing model '${name}'`)
      return m
    }),
    enums,
  }
}

export function renderModels(models: readonly ParsedModel[]): string[] {
  return models.map(renderModel)
}
