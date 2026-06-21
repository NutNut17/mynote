import { join } from 'node:path'

const isProd = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  modules: [
    // @nuxthub/core is dev-only: it tries to connect to Cloudflare on init
    // which hangs AWS Lambda cold starts in production
    ...(isProd ? [] : ['@nuxthub/core']),
    '@nuxtjs/i18n',
    '@nuxt/content',
    'motion-v/nuxt',
    '@nuxtjs/mcp-toolkit',
    // nuxt-studio is dev-only
    ...(isProd ? [] : ['nuxt-studio']),
  ],
  css: ['@/assets/css/main.css', 'katex/dist/katex.min.css'],
  i18n: {
    defaultLocale: 'en',
    locales: [{
      code: 'en',
      name: 'English',
    }, {
      code: 'fr',
      name: 'Français',
    }],
  },
  routeRules: {
    '/': { redirect: '/en' },
    '/llm.txt': { redirect: '/llms.txt' },
  },
  content: {
    build: {
      markdown: {
        remarkPlugins: {
          "remark-math": {},
        },
        rehypePlugins: {
          "rehype-katex": {}
        },
      },
    },
  },
  extends: 'docus',
  app: {
    baseURL: '/',
  },
  // image module kept minimal - ProseImg.vue override handles S3 URLs directly
  // Docus AI assistant - reads AI_GATEWAY_API_KEY from env
  mcp: {
    enabled: true,
  },
  assistant: {
    model: 'openai/gpt-4o-mini',
    mcpServer: '/mcp',
    apiPath: '/__docus__/assistant',
  },
  llms: {
    domain: 'https://mynote.dev',
    title: 'MyNote',
    description: 'A high-performance, aesthetically driven knowledge engine built to bridge the gap between raw ideas and polished presentation.',
    full: {
      title: 'MyNote Full Documentation',
      description: 'The complete documentation for MyNote, including getting started guides, core concepts, and custom features.',
    },
  },
  nitro: {
    preset: 'aws-amplify',
    awsAmplify: {
      // node:sqlite requires Node 22+ (cast needed as types lag behind)
      runtime: 'nodejs22.x' as 'nodejs20.x',
    },
    externals: {
      external: ['secure-exec'],
      inline: ['tailwindcss/colors'],
    },
  },
  // Studio config (dev-only module, but config is safe to keep)
  studio: {
    repository: {
      provider: 'github',
      owner: 'NutNut17',
      repo: 'mynote'
    },
    media: {
      external: true
    }
  },
  robots: { robotsTxt: false },
  runtimeConfig: {
    aiGatewayApiKey: process.env.AI_GATEWAY_API_KEY || '',
  },
})
