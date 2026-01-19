<script setup lang="ts">
definePageMeta({
  layout: 'docs',
//   layout: 'default',
  header: true,
  footer: true,
})
</script>

<template>
  <main class="custom-layout">
    <slot />
  </main>
</template>
