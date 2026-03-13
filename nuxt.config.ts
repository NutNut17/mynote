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
    '/': { redirect: '/en' }
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
  },

  nitro: {
    preset: 'aws-amplify'
  },
  robots: { robotsTxt: false },
})
