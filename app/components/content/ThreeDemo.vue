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
// import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

const container = ref(null)
let renderer, scene, camera, animationFrameId, controls

function grid_pos(x, y) {
    return [(x - 2) * 4 + 2, 1, (y - 2) * 4 + 2];
}

function rand(n) {
    return Math.floor(Math.random() * n);
}

const handleResize = () => {
    if (!container.value) return
    const w = container.value.clientWidth
    const h = 500
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
}

onMounted(() => {
    if (!container.value) return

    scene = new THREE.Scene();

    const width = container.value.clientWidth
    const height = 500

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(15, 16, 13);
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;   // Enable Shadow
    renderer.setPixelRatio(window.devicePixelRatio);

    container.value.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Geometry + Material = Mesh
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = 0;
    scene.add(plane);

    const colors = [0xff0000, 0x0088aa, 0xaaaaaa, 0xdddd00]; // Red, blue, grey, yellow
    const cl = colors.length;

    const materials = [
        new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
        new THREE.MeshPhongMaterial({
            specular: 0xffffff, shininess: 100,
            side: THREE.DoubleSide // for drawing the inside of the tube
        }),
        new THREE.MeshStandardMaterial({
            metalness: 0.9, roughness: 0.4,
            side: THREE.DoubleSide
        }),
        new THREE.MeshLambertMaterial({
            wireframe: true, wireframeLinewidth: 2,
            side: THREE.DoubleSide
        })
    ];
    const ml = materials.length;

    const geometries = [
        new THREE.SphereGeometry(1, 16, 8),
        new THREE.ConeGeometry(1, 2, 16),
        new THREE.BoxGeometry(1.5, 1.5, 1.5),
        new THREE.CylinderGeometry(1, 1, 2, 16),
        new THREE.RingGeometry(0.3, 1, 16),
        new THREE.TorusGeometry(1, 0.5, 16, 16),
        new THREE.TorusKnotGeometry(1, 0.3, 128, 8),
        new THREE.IcosahedronGeometry(1),
        new THREE.DodecahedronGeometry(1),
        new THREE.OctahedronGeometry(1),
        new THREE.TetrahedronGeometry(1),
    ]

    var items = []
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            var geometry = geometries[(i * 4 + j) % geometries.length];
            var material = materials[rand(ml)];
            var item = new THREE.Mesh(geometry, material);
            var pos = grid_pos(i, j);
            item.position.set(pos[0], pos[1], pos[2]);
            item.material.color.set(colors[rand(cl)]);
            item.castShadow = true;
            item.receiveShadow = true;
            scene.add(item);
            items.push(item);
        }
    }

    const distance = 50;
    const angle = Math.PI / 16;
    const penumbra = 0.5;
    const decay = 0.1;

    const spotLight = new THREE.SpotLight(0xffffff, 10, distance, angle, penumbra, decay);
    spotLight.position.set(10, 20, -20);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const ambientLight = new THREE.AmbientLight(0x101010);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x886200, 1);
    directionalLight.position.set(10, 20, 20);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const light = new THREE.PointLight(0xE11584, 1, 100);
    light.position.set(0, 5, 0);
    light.castShadow = true;
    scene.add(light);

    const rectAreaLight = new THREE.RectAreaLight(0xff0000, 1.0, 200, 200);
    rectAreaLight.position.set(-10, 20, -20);
    rectAreaLight.lookAt(0, 0, 0);
    scene.add(rectAreaLight);


    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    const yGrid = new THREE.GridHelper(10, 10);
    yGrid.rotation.x = Math.PI / 2; // Rotate the grid to align with the Y-axis
    scene.add(yGrid);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const cameraHelper = new THREE.CameraHelper(camera); // Helps visualize camera frustum - actually visualizes the MAIN camera here which is odd, but following original code intent where likely they wanted to visualize shadow camera or similar. Leaving as is.
    scene.add(cameraHelper);

    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);

    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    scene.add(directionalLightHelper);

    const pointLightHelper = new THREE.PointLightHelper(light);
    scene.add(pointLightHelper);

    var ypos = [];
    for (let i = 0; i < 16; i++) {
        ypos.push(Math.random());
    }

    const animate = function () {
        if (!renderer) return;
        animationFrameId = requestAnimationFrame(animate);

        var time = performance.now() * 0.001; // Get current time in seconds
        var amplitude = 1;
        var frequency = 1;
        for (var i = 0; i < items.length; i++) {
            var yOffset = 2 + Math.sin(time * frequency + ypos[i] * 10) * amplitude; // Calculate y offset based on sine function
            items[i].rotation.y += 0.01;
            items[i].position.y = yOffset;
        }

        if (controls) controls.update();
        renderer.render(scene, camera);
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
