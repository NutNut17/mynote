<template>
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
  // style can arrive as a string OR an object from MDC
  style?: string | Record<string, string>
  'max-width'?: string
  width?: string | number
  height?: string | number
}>()

const attrs = useAttrs()

const extraAttrs = computed(() => {
  const { class: _, style: __, 'max-width': _mw, width: _w, height: _h, ...rest } = attrs as Record<string, unknown>
  return rest
})

const resolvedStyle = computed(() => {
  // Start with whatever style was passed (string or object)
  const base: Record<string, string> = {}

  if (props.style) {
    if (typeof props.style === 'string') {
      // Parse "max-width: 192px; margin: 0 auto" into object
      props.style.split(';').forEach((rule) => {
        const [k, v] = rule.split(':').map(s => s.trim())
        if (k && v) base[k] = v
      })
    }
    else {
      Object.assign(base, props.style)
    }
  }

  // max-width="80px" MDC attribute → style
  const mw = props['max-width'] || (attrs['max-width'] as string | undefined)
  if (mw) base['max-width'] = mw

  if (props.width) base['width'] = typeof props.width === 'number' ? `${props.width}px` : props.width
  if (props.height) base['height'] = typeof props.height === 'number' ? `${props.height}px` : props.height

  // margin: 0 auto only works on block elements
  if ('margin' in base || Object.values(base).some(v => v.includes('auto'))) {
    base['display'] = 'block'
  }

  return base
})

const resolvedSrc = computed(() => {
  if (!props.src) return ''
  if (props.src.startsWith('http')) return props.src
  if (props.src.startsWith('/images/')) return `${S3_BASE}${props.src}`
  return props.src
})
</script>
