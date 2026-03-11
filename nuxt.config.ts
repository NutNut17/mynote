export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', '@nuxt/content', 'motion-v/nuxt'],
  css: ['~/assets/css/main.css', 'katex/dist/katex.min.css'],
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
    '/': { redirect: '/en/getting-started/introduction' }
  },
  // docus: {
  //   aside: {
  //     level: 0,
  //     collapsed: true
  //   }
  // },
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
  extends: '@nuxt-themes/docus',
  app: {
    baseURL: '/',
    // buildAssetsDir: 'assets',
  },
  // image: {
  //   provider: 'ipx',
  //   ipx: {
  //     // This ensures IPX looks in the right spot regardless of the baseURL
  //     baseURL: '/'
  //   }
  // },
  nitro: {
    // preset: 'github-pages'
    preset: 'aws-amplify'
  },
  robots: { robotsTxt: false },
})
