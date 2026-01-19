<template>
    <section class="py-12">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                About Me
            </h2>
            <p class="mt-4 text-xl text-gray-500 dark:text-gray-400">
                Hi, I'm a passionate developer building cool things with Nuxt and Vue.
            </p>

            <div class="mt-8 flex justify-center gap-4">
                <UButton to="https://github.com" target="_blank" icon="i-simple-icons-github" color="gray">
                    GitHub
                </UButton>
                <UButton to="https://twitter.com" target="_blank" icon="i-simple-icons-twitter" color="gray">
                    Twitter
                </UButton>
            </div>

            <div class="mt-12 text-left prose dark:prose-invert mx-auto">
                <slot />
            </div>
        </div>
    </section>
</template>
