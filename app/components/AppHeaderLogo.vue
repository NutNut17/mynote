<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <!-- <UColorModeImage
    v-if="appConfig.header?.logo?.dark || appConfig.header?.logo?.light"
    :light="appConfig.header?.logo?.light || appConfig.header?.logo?.dark"
    :dark="appConfig.header?.logo?.dark || appConfig.header?.logo?.light"
    :alt="appConfig.header?.logo?.alt || appConfig.header?.title"
    class="h-6 w-auto shrink-0"
  />
  <span v-else>
    {{ appConfig.header?.title || '{appConfig.header.title}' }}
  </span> -->
  <div class="flex items-center gap-2">
    <img src="/images/nyancat.svg" alt="Logo" class="h-8 w-auto" />
    <span class="text-xl font-bold">Nut17 Notes</span>
  </div>
</template>