export default defineAppConfig({
    socials: {
        x: 'https://x.com/nuxt_js',
        discord: 'https://discord.com/invite/ps2h6QT',
        nuxt: 'https://nuxt.com',
    },
    github: {
        url: 'https://github.com/NutNut17/mynote',
        branch: 'main',
        rootDir: '/'
    },
    assistant: {
        // Floating input bar at the bottom of doc pages
        floatingInput: true,
        // "Explain with AI" button in the sidebar TOC
        explainWithAi: true,
        // Suggested questions shown when chat is empty
        faqQuestions: [
            'How do I get started?',
            'What topics are covered in this documentation?',
        ],
        shortcuts: {
            focusInput: 'meta_i'
        }
    }
})
