<template>
    <div v-if="isMounted"
        class="fixed top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none z-[-100]"
        :style="{ opacity: opacity, transition: 'opacity 2s ease-in-out' }">
        <Motion ref="blobEl" tag="div" class="blob" :animate="{ rotate: `${angle}rad`, transition: { duration: 2 } }">
        </Motion>
    </div>
</template>

<script lang="ts" setup>
import { Motion } from "motion-v";
import { ref, onMounted, onUnmounted } from 'vue';

const blobEl = ref<any>(null);
const isMounted = ref(false);
const previousAngle = ref(0);
const totalRotation = ref(0);
const angle = ref(0);
const opacity = ref(1);

const props = withDefaults(defineProps<{ size?: string; blur?: number; scaleAmplitude?: number }>(), {
    size: "200px",
    scaleAmplitude: 0.2,
    blur: 10,
});

let observer: IntersectionObserver | null = null;
let timeoutId: any = null;
let morphAnimationFrameId: any = null;

onMounted(() => {
    isMounted.value = true;
    setTimeout(() => {
        morphAnimationFrameId = requestAnimationFrame(morph);
    }, 400);

    window.addEventListener("mousemove", mouseMove);

    const targetSection = document.getElementById('field-of-study');
    if (targetSection) {
        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Wait 2 seconds, then fade out
                    timeoutId = setTimeout(() => {
                        opacity.value = 0;
                    }, 2000);
                    // Stop observing once triggered
                    if (observer) observer.disconnect();
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% visible
        observer.observe(targetSection);
    }
});

onUnmounted(() => {
    window.removeEventListener("mousemove", mouseMove);
    if (observer) observer.disconnect();
    if (timeoutId) clearTimeout(timeoutId);
    if (morphAnimationFrameId) cancelAnimationFrame(morphAnimationFrameId);
});

function remap(v: number, domain: [number, number], newDomain: [number, number]): number {
    return newDomain[0] + (v - domain[0]) * ((newDomain[1] - newDomain[0]) / (domain[1] - domain[0]));
}

function getSmoothAngle(angle: number) {
    let angleDiff = angle - previousAngle.value;
    if (angleDiff > Math.PI) {
        angleDiff -= 2 * Math.PI;
    } else if (angleDiff < -Math.PI) {
        angleDiff += 2 * Math.PI;
    }
    totalRotation.value += angleDiff;
    previousAngle.value = angle;
    return totalRotation.value;
}

function mouseMove(ev: MouseEvent) {
    if (!blobEl.value?.$el) return;
    const rect = blobEl.value.$el.getBoundingClientRect();
    const deltaX = ev.clientX - (rect.left + rect.width / 2);
    const deltaY = ev.clientY - (rect.top + rect.height / 2);
    angle.value = getSmoothAngle(Math.atan2(deltaY, deltaX));
}

function randomScale(): string {
    if (!blobEl.value) return "1 1 1";
    const magnitude = props.scaleAmplitude;
    return `${remap(Math.random(), [0, 1], [1 - magnitude, 1 + magnitude])} ${remap(Math.random(), [0, 1], [1 - magnitude, 1 + magnitude])} ${remap(
        Math.random(),
        [0, 1],
        [1 - magnitude, 1 + magnitude]
    )}`;
}

function randomBorderRadius(): string {
    if (!blobEl.value) return "0deg";
    return `${remap(Math.random(), [0, 1], [10, 80])}% ${remap(Math.random(), [0, 1], [10, 80])}% ${remap(Math.random(), [0, 1], [10, 80])}% ${remap(
        Math.random(),
        [0, 1],
        [10, 80]
    )}% / ${remap(Math.random(), [0, 1], [10, 80])}% ${remap(Math.random(), [0, 1], [10, 80])}% ${remap(Math.random(), [0, 1], [10, 80])}% ${remap(
        Math.random(),
        [0, 1],
        [10, 80]
    )}%`;
}

function morph() {
    if (!blobEl.value) return;
    blobEl.value.$el.style.scale = randomScale();
    blobEl.value.$el.style.borderRadius = randomBorderRadius();
    blobEl.value.$el.style.filter = `blur(${props.blur}px)`;

    setTimeout(
        () => {
            morphAnimationFrameId = requestAnimationFrame(morph);
        },
        Math.random() * 2000 + 2500
    );
}
</script>

<style lang="css" scoped>
/* @reference "~/assets/css/main.css"; */

.blob {
    transform-origin: center !important;
    filter: blur(0px);
    border-radius: 36%;
    z-index: -100 !important;
    animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
    background: linear-gradient(var(--color-violet-500), var(--ui-primary));
    color: transparent;
    width: v-bind('props.size');
    height: v-bind('props.size');
    transition:
        filter 3s,
        scale 3s,
        border-radius 3s;
}
</style>
