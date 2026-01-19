<script setup lang="ts">
const config = useAppConfig()
</script>

<template>
    <UFooter>
        <template #left>
            <p class="text-sm text-gray-500 dark:text-gray-400">
                Copyright © {{ new Date().getFullYear() }} Nut17. All rights reserved.
            </p>
        </template>

        <template #right>
            <div class="flex items-center gap-2">
                <!-- Socials from config if needed -->
                <UButton v-if="config.socials?.github" :to="`https://github.com/${config.socials.github}`"
                    target="_blank" icon="i-simple-icons-github" color="gray" variant="ghost" />
            </div>
        </template>
    </UFooter>
</template>
