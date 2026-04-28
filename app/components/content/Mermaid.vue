<template>
  <div class="mermaid-diagram flex justify-center my-8">
    <img 
      :src="`/mermaid/${name}.svg`" 
      :alt="`Mermaid Diagram: ${name}`" 
      :style="{ width: width || '100%', height: height || 'auto' }"
      class="max-w-full"
    />
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  width: {
    type: String,
    default: null
  },
  height: {
    type: String,
    default: null
  }
})
</script>
