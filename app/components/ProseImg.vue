<template>
  <!--
    Override ProseImg to rewrite /images/* src to absolute S3 URLs.
    All other attributes (style, class, width, height, max-width, etc.)
    are passed through automatically via Vue attribute inheritance ($attrs).
  -->
  <img v-bind="$attrs" :src="resolvedSrc" :alt="alt" />
</template>

<script setup lang="ts">
// inheritAttrs must stay true (default) so style/class/etc pass through automatically
const S3_BASE = 'https://mynote-storage.s3.ap-northeast-1.amazonaws.com/public'

const props = defineProps<{
  src?: string
  alt?: string
}>()

const resolvedSrc = computed(() => {
  if (!props.src) return ''
  if (props.src.startsWith('http')) return props.src
  if (props.src.startsWith('/images/')) return `${S3_BASE}${props.src}`
  return props.src
})
</script>
