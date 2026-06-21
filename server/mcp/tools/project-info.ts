import { z } from 'zod'

export default defineMcpTool({
  name: 'get-project-info',
  description: 'Get information about this project, including its name and description.',
  inputSchema: {
  },
  handler: async () => {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          name: 'MyNote',
          description: 'A high-performance, aesthetically driven knowledge engine and documentation site built with Nuxt and Docus.',
          features: [
            'Docus/Nuxt framework',
            'Automated Mermaid diagram rendering',
            'AI-powered assistant and MCP support',
            'Optimized navigation'
          ]
        }, null, 2)
      }]
    }
  }
})
