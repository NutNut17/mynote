<template>
    <div class="w-full py-8 px-4">
        <div ref="container"
            class="canvas-container w-full rounded-xl overflow-hidden border border-muted/50 shadow-inner bg-black/5">
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const container = ref(null)
let renderer, scene, camera, animationFrameId, controls

onMounted(() => {
    if (!container.value) return

    // Get container dimensions
    const width = container.value.clientWidth
    const height = 500 // Fixed height for the component

    scene = new THREE.Scene()
    scene.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });


    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.outputColorSpace = THREE.SRGBColorSpace

    container.value.appendChild(renderer.domElement)

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(15, 16, 13)
    camera.lookAt(scene.position)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // Plane
    const planeGeometry = new THREE.PlaneGeometry(20, 20)
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x989898, side: THREE.DoubleSide })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    plane.position.y = 0
    plane.rotation.x = -Math.PI / 2
    scene.add(plane)

    class Path1 extends THREE.Curve {
        constructor(scale = 1) {
            super()
            this.scale = scale
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = t
            const ty = Math.cos(0.5 * Math.PI * t)
            const tz = - Math.cos(0.5 * Math.PI * t)
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale)
        }
    }
    class Path2 extends THREE.Curve {
        constructor(scale = 1) {
            super()
            this.scale = scale
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = - t
            const ty = Math.cos(0.5 * Math.PI * t)
            const tz = - Math.cos(0.5 * Math.PI * t)
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale)
        }
    }

    const path1 = new Path1(1)
    const path2 = new Path2(1)

    const geometries = [
        new THREE.DodecahedronGeometry(2.1),
        new THREE.BoxGeometry(3.0, 1.2, 0.5),
        new THREE.TorusGeometry(0.4, 0.1, 4, 16),
        new THREE.TorusGeometry(0.4, 0.1, 4, 16),
        new THREE.CylinderGeometry(0.4, 0.5, 0.2, 16),
        new THREE.CylinderGeometry(0.4, 0.5, 0.2, 16),
        new THREE.TubeGeometry(path1, 20, 0.17, 8, false),
        new THREE.TubeGeometry(path2, 20, 0.17, 8, false),
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.SphereGeometry(0.3, 16, 16),
    ]

    const positions = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0.7, 1.6),
        new THREE.Vector3(0.7, 0.7, 1.9),
        new THREE.Vector3(-0.7, 0.7, 1.9),
        new THREE.Vector3(1.95, 0, 0),
        new THREE.Vector3(-1.95, 0, 0),
        new THREE.Vector3(2.05, -1, 1),
        new THREE.Vector3(-2.05, -1, 1),
        new THREE.Vector3(3.05, -1, 1),
        new THREE.Vector3(-3.05, -1, 1),
    ]

    const materials = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        metalness: 0.9, roughness: 0.1,
        side: THREE.DoubleSide
    });

    const items = [];
    for (let i = 0; i < geometries.length; i++) {
        const geometry = geometries[i];
        const material = materials.clone();
        const item = new THREE.Mesh(geometry, material);
        item.castShadow = true;
        item.position.set(positions[i].x, positions[i].y, positions[i].z);
        scene.add(item);
        items.push(item);
    }

    items[4].rotation.z = -Math.PI / 2
    items[5].rotation.z = Math.PI / 2
    items[1].material.color.set(0x414548)
    items[2].material.metalness = 0.8
    items[3].material.metalness = 0.8
    items[4].material.color.set(0xff4554)
    items[4].material.metalness = 0.8
    items[5].material.color.set(0x00c3e3)
    items[5].material.metalness = 0.8
    items[8].material.color.set(0xff4554)
    items[8].material.metalness = 0.8
    items[9].material.color.set(0x00c3e3)
    items[9].material.metalness = 0.8

    // Lights
    let ambientLight, pointLight, hemiLight;
    ambientLight = new THREE.AmbientLight(0x252525, 1);
    scene.add(ambientLight);

    // Helpers
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);

    hemiLight = new THREE.HemisphereLight(0x101010, 0x101010, 2);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    scene.add(hemiLight);

    pointLight = new THREE.PointLight(0xffffff, 10, 1000);
    pointLight.position.y = 5;
    pointLight.castShadow = true;
    scene.add(pointLight);

    const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
    scene.add(pointLightHelper);

    const sphere = new THREE.SphereGeometry(0.5, 16, 8);
    const colors = [0xff0040, 0x0040ff, 0x80ff80, 0xffaa00];
    const lights = []
    for (let i = 0; i < 4; i++) {
        const light = new THREE.PointLight(colors[i], 100);
        light.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: colors[i] })));
        light.castShadow = true;
        scene.add(light);
        lights.push(light);
    }

    const animate = () => {
        if (!renderer) return;
        animationFrameId = requestAnimationFrame(animate);

        const time = performance.now() * 0.001;
        const amplitude = 1;
        const frequency = 1;
        const yOffset = 3 + Math.sin(time * frequency) * amplitude;

        for (let i = 0; i < items.length; i++) {
            items[i].position.y = positions[i].y + yOffset;
        }

        pointLight.position.x = Math.sin(time * 0.2) * 20;
        pointLight.position.z = Math.cos(time * 0.2) * 20;

        lights[0].position.x = Math.sin(time * 0.7) * 30;
        lights[0].position.y = Math.cos(time * 0.5) * 40;
        lights[0].position.z = Math.cos(time * 0.3) * 30;

        lights[1].position.x = Math.cos(time * 0.3) * 30;
        lights[1].position.y = Math.sin(time * 0.5) * 40;
        lights[1].position.z = Math.sin(time * 0.7) * 30;

        lights[2].position.x = Math.sin(time * 0.7) * 30;
        lights[2].position.y = Math.cos(time * 0.3) * 40;
        lights[2].position.z = Math.sin(time * 0.5) * 30;

        lights[3].position.x = Math.sin(time * 0.3) * 30;
        lights[3].position.y = Math.cos(time * 0.7) * 40;
        lights[3].position.z = Math.sin(time * 0.5) * 30;

        for (let i = 0; i < lights.length; i++) {
            lights[i].position.x *= 0.5;
            lights[i].position.y *= 0.5;
            lights[i].position.z *= 0.5;
        }

        if (controls) controls.update();
        renderer.render(scene, camera);
    }

    function handleResize() {
        if (!container.value) return
        const w = container.value.clientWidth
        const h = 500
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    animate();
    window.addEventListener('resize', handleResize);
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    cancelAnimationFrame(animationFrameId)
    if (renderer) {
        renderer.dispose()
        renderer.forceContextLoss()
        renderer = null
    }
    if (controls) {
        controls.dispose()
        controls = null
    }
    scene = null
    camera = null
})
</script>

<style scoped>
.canvas-container {
    height: 500px;
}

.canvas-container :deep(canvas) {
    display: block;
    width: 100% !important;
    height: 100% !important;
}
</style>
