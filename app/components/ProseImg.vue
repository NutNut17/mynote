<template>
  <!-- Render images as plain <img> tags pointing directly to S3.
       This bypasses the Amplify image optimizer which can't fetch from Lambda.
       Wrapped in a block element so margin: 0 auto centering works. -->
  <img
    :src="resolvedSrc"
    :alt="alt"
    :style="resolvedStyle"
    :class="[$attrs.class, 'max-w-full']"
    v-bind="extraAttrs"
  />
</template>

<script setup lang="ts">
const S3_BASE = 'https://mynote-storage.s3.ap-northeast-1.amazonaws.com/public'

const props = defineProps<{
  src?: string
  alt?: string
  style?: string
  // max-width can come as an attribute (MDC syntax: max-width="80px")
  'max-width'?: string
  width?: string | number
  height?: string | number
}>()

const attrs = useAttrs()

// Pass through extra attributes but strip ones we handle explicitly
const extraAttrs = computed(() => {
  const { class: _, style: __, 'max-width': _mw, width: _w, height: _h, ...rest } = attrs as Record<string, unknown>
  return rest
})

// Merge style prop + max-width attribute into a single style string
const resolvedStyle = computed(() => {
  const parts: string[] = []
  if (props.style) parts.push(props.style)
  // max-width="80px" MDC attribute → inline style
  const mw = props['max-width'] || (attrs['max-width'] as string)
  if (mw) parts.push(`max-width: ${mw}`)
  if (props.width) parts.push(`width: ${typeof props.width === 'number' ? props.width + 'px' : props.width}`)
  if (props.height) parts.push(`height: ${typeof props.height === 'number' ? props.height + 'px' : props.height}`)
  // Ensure display:block so margin:0 auto centering works
  if (parts.some(p => p.includes('margin'))) parts.push('display: block')
  return parts.join('; ')
})

const resolvedSrc = computed(() => {
  if (!props.src) return ''
  if (props.src.startsWith('http')) return props.src
  if (props.src.startsWith('/images/')) return `${S3_BASE}${props.src}`
  return props.src
})
</script>
