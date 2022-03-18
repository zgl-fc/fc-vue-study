import { NodeTypes } from './ast'

const enum TagType {
  Start,
  End,
}

export function baseParse(content: string) {
  // 创建解析过程中的上下文
  const context = createParserContext(content)
  // 创建根节点
  return createRoot(parseChildren(context))
}

function parseChildren(context) {
  const nodes: any = []

  let node
  const s = context.source as string
  if (s.startsWith('{{')) {
    node = parseInterpolation(context)
  } else if (s[0] === '<') {
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context)
    }
  }

  if (!node) {
    node = parseText(context)
  }

  nodes.push(node)
  return nodes
}

function parseText(context: any) {
  // 1. 获取content
  const content = parseTextData(context, context.source.length)

  return {
    type: NodeTypes.TEXT,
    content,
  }
}

function parseTextData(context: any, length) {
  const content = context.source.slice(0, length)

  // 2. 推进
  advanceBy(context, length)
  return content
}

function parseElement(context: any) {
  const element = parseTag(context, TagType.Start)

  parseTag(context, TagType.End)

  return element
}

function parseTag(context: any, type: TagType) {
  // <div></div>
  const match: any = /^<\/?([a-z]*)/i.exec(context.source)
  console.log(match)
  const tag = match[1]
  advanceBy(context, match[0].length)
  advanceBy(context, 1)

  if (type === TagType.End) return

  return {
    type: NodeTypes.ELEMENT,
    tag,
  }
}

function parseInterpolation(context) {
  const openDelimiter = '{{'
  const closeDelimiter = '}}'

  // indexof 第二个参数是开始位置
  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  )
  advanceBy(context, openDelimiter.length)

  const rawContentLength = closeIndex - openDelimiter.length

  const rawContent = parseTextData(context, rawContentLength)

  const content = rawContent.trim()

  advanceBy(context, closeDelimiter.length)

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  }
}

function advanceBy(context: any, length: number) {
  context.source = context.source.slice(length)
}

function createRoot(children) {
  return {
    children,
  }
}

function createParserContext(content: string): any {
  return {
    source: content,
  }
}
