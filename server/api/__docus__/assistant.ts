import { streamText, convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse } from 'ai'
import type { UIMessageStreamWriter, ToolCallPart, ToolSet } from 'ai'
import { createGateway } from '@ai-sdk/gateway'
import { createMCPClient } from '@ai-sdk/mcp'

// Overrides docus's built-in handler so we can pass the API key explicitly
// via runtimeConfig (NUXT_AI_GATEWAY_API_KEY) rather than relying on
// process.env auto-detection, which doesn't work inside the Nitro Lambda bundle.

const MAX_STEPS = 10

function stopWhenResponseComplete({ steps }: { steps: any[] }): boolean {
  const lastStep = steps.at(-1)
  if (!lastStep) return false
  const hasText = Boolean(lastStep.text && lastStep.text.trim().length > 0)
  const hasNoToolCalls = !lastStep.toolCalls || lastStep.toolCalls.length === 0
  if (hasText && hasNoToolCalls) return true
  return steps.length >= MAX_STEPS
}

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)
  const config = useRuntimeConfig()
  const siteConfig = getSiteConfig(event)
  const siteName = siteConfig.name || 'Documentation'

  const mcpServer = config.assistant.mcpServer
  const isExternalUrl = mcpServer.startsWith('http://') || mcpServer.startsWith('https://')
  const baseURL = config.app?.baseURL?.replace(/\/$/, '') || ''
  const mcpUrl = isExternalUrl
    ? mcpServer
    : import.meta.dev
      ? `http://localhost:3000${baseURL}${mcpServer}`
      : `${getRequestURL(event).origin}${baseURL}${mcpServer}`

  const httpClient = await createMCPClient({
    transport: { type: 'http', url: mcpUrl },
  })
  const mcpTools = await httpClient.tools()

  const gateway = createGateway({ apiKey: config.aiGatewayApiKey as string })

  const stream = createUIMessageStream({
    execute: async ({ writer }: { writer: UIMessageStreamWriter }) => {
      const modelMessages = await convertToModelMessages(messages)
      const result = streamText({
        model: gateway(config.assistant.model as string),
        maxOutputTokens: 4000,
        maxRetries: 2,
        stopWhen: stopWhenResponseComplete,
        system: `You are the documentation assistant for ${siteName}. Help users navigate and understand the project documentation. Be concise, helpful, and direct. Never use markdown headings. Use bullet points for lists.`,
        messages: modelMessages,
        tools: mcpTools as ToolSet,
        onStepFinish: ({ toolCalls }: { toolCalls: ToolCallPart[] }) => {
          if (toolCalls.length === 0) return
          writer.write({
            id: toolCalls[0]?.toolCallId,
            type: 'data-tool-calls',
            data: {
              tools: toolCalls.map((tc: ToolCallPart) => ({
                toolName: tc.toolName,
                toolCallId: tc.toolCallId,
                args: 'args' in tc ? tc.args : {},
              })),
            },
          })
        },
      })
      writer.merge(result.toUIMessageStream())
    },
    onFinish: async () => {
      await httpClient.close()
    },
  })

  return createUIMessageStreamResponse({ stream })
})
