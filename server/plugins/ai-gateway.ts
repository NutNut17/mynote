export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()
  if (config.aiGatewayApiKey && !process.env.AI_GATEWAY_API_KEY) {
    process.env.AI_GATEWAY_API_KEY = config.aiGatewayApiKey as string
  }
})
