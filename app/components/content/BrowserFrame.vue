<script setup lang="ts">

// const colorMode = useColorMode()

defineProps<{
  title?: string
}>()
</script>
<template>
  <!-- Use 'dark:border-zinc-800' and 'dark:bg-zinc-900' for better dark mode support -->
  <div
    class="w-fit rounded-xl border border-muted bg-accented shadow-md overflow-hidden px-2 pb-2 dark:border-zinc-800 dark:bg-zinc-900">
    <div
      class="flex justify-between items-center px-2 py-2 bg-accented border-accented border-b dark:bg-zinc-900 dark:border-zinc-800">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 bg-red-500 rounded-full" />
        <span class="w-3 h-3 bg-yellow-500 rounded-full" />
        <span class="w-3 h-3 bg-green-500 rounded-full" />
      </div>
      <div class="text-muted text-sm font-medium dark:text-zinc-400">
        {{ title }}
      </div>
    </div>
    <!-- Crucial: change from bg-white to something dark in dark mode -->
    <div class="bg-white dark:bg-zinc-950 rounded-lg overflow-hidden">
      <slot mdc-unwrap="p" />
    </div>
  </div>
</template>

<style scoped>
/* Use Docus/Nuxt UI built-in variables if available, or toggle based on .dark class */
.bg-accented {
  background-color: var(--u-bg-accented, #f3f4f6);
}

.border-accented {
  border-color: var(--u-border-accented, #e5e7eb);
}

/* Example of responding to theme in CSS */
:root.dark .bg-accented {
  background-color: #1f2937;
  /* zinc-800 or similar */
}

:root.dark .border-accented {
  border-color: #1f2937;
}
</style>