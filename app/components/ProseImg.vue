<template>
  <!--
       Override ProseImg to rewrite /images/* src to absolute S3 URLs.
       This bypasses the Amplify image optimizer which can't fetch from Lambda.
       SVGs and raster images both work via the public S3 bucket. -->
  <img
    :src="resolvedSrc"
    :alt="alt"
    :style="style"
    :class="$attrs.class"
    v-bind="extraAttrs"
  />
</template>

<script setup lang="ts">
const S3_BASE = 'https://mynote-storage.s3.ap-northeast-1.amazonaws.com/public'

const props = defineProps<{
  src?: string
  alt?: string
  style?: string
}>()

// Pass through any extra attributes (max-width, className, etc.)
const attrs = useAttrs()
const extraAttrs = computed(() => {
  const { class: _, style: __, ...rest } = attrs as Record<string, unknown>
  return rest
})

const resolvedSrc = computed(() => {
  if (!props.src) return ''
  // If already absolute, use as-is
  if (props.src.startsWith('http')) return props.src
  // Map /images/* to S3 only in production
  if (!import.meta.dev && props.src.startsWith('/images/')) {
    return `${S3_BASE}${props.src}`
  }
  return props.src
})
</script>
