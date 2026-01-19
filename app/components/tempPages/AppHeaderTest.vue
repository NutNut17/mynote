<script setup lang="ts">
const appConfig = useAppConfig()
const { locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()

// Toggle between available locales
const toggleLocale = () => {
    const currentIndex = locales.value.findIndex(l => l.code === locale.value)
    const nextIndex = (currentIndex + 1) % locales.value.length
    setLocale(locales.value[nextIndex].code)
}

const customLinks = [
    { label: 'Blog', to: '/blog' },
    { label: 'About Me', to: '/aboutme' }
]
</script>

<template>
    <UHeader :ui="{ center: 'flex-1' }" :to="localePath('/')" :title="appConfig.header?.title">
        <!-- Center: Custom Navigation Tabs -->
        <div class="hidden lg:flex items-center gap-4 justify-center w-full">
            <UButton v-for="link in customLinks" :key="link.to" :to="localePath(link.to)" color="gray" variant="ghost"
                class="text-sm font-medium">
                {{ link.label }}
            </UButton>
        </div>

        <!-- Title/Logo Slot -->
        <template #title>
            <AppHeaderLogo class="h-6 w-auto shrink-0" />
        </template>

        <!-- Right Slot: Search + Language + Theme -->
        <template #right>
            <!-- Search Button (Always visible here now, or just desktop?) 
           User moved it to 'reserved CTA component' spot. 
           UContentSearchButton usually handles its own responsiveness, 
           checking existing code it had class="lg:hidden" meaning it was ONLY on mobile before? 
           And the desktop search was elsewhere? 
           Original: <AppHeaderCTA /> in right, and <UContentSearchButton class="lg:hidden" />
           This implies desktop search was either in CTA or Center.
           Docus usually has a search input in the center.
           We'll simply put the search button here for all sizes or specialized.
           UContentSearchButton triggers the palette.
      -->
            <UContentSearchButton label="Search" />

            <!-- Language Switcher: Custom EN text -->
            <template v-if="locales.length > 1">
                <UButton color="gray" variant="ghost" @click="toggleLocale" class="font-bold">
                    <!-- Display uppercase code, e.g. EN -->
                    {{ locale.toUpperCase() }}
                </UButton>
                <USeparator orientation="vertical" class="h-8 mx-2" />
            </template>

            <UColorModeButton />

            <!-- Mobile Toggle -->
        </template>

        <!-- Mobile Menu Toggle -->
        <template #toggle="{ open, toggle }">
            <IconMenuToggle :open="open" class="lg:hidden" @click="toggle" />
        </template>

        <!-- Mobile Body -->
        <template #body>
            <!-- Replicate mobile body logic or usage AppHeaderBody if available -->
            <AppHeaderBody />
        </template>
    </UHeader>
</template>
