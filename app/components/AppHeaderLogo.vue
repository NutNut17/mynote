<script setup lang="ts">
const appConfig = useAppConfig()
onMounted(() => {
  const error = useError()
  if (error.value && error.value.statusCode === 404) {
    if (window.location.pathname.startsWith('/en')) {
      clearError({ redirect: '/' })
    }
  }
})
</script>

<template>
  <div class="flex items-center gap-2">
    <object type="image/svg+xml" data="/images/nyancat.svg" class="h-8 w-auto pointer-events-none"></object>
    <span class="text-xl font-bold">Nut17 Notes</span>
  </div>
</template>