import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/textures/particles/2.png');

/**
 * Particles
 */


// Geometry
const particlesGeometry = new THREE.SphereBufferGeometry();
const count = 5000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
}
particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
);
// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.2,
    // Perspective 有远近的观感
    sizeAttenuation: true
});
particlesMaterial.color = new THREE.Color('#ff88cc');
particlesMaterial.map = particleTexture;
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;
// particlesMaterial.alphaTest = 0.01;
// WebGL使用dpeth buffer，图像中元素按照depth buffer 显示，图像中物体以距离显示
// 问题是完全无遮挡，不够realistic，整个页面处于一个完全透明的状态
// particlesMaterial.depthTest = false;
// 此方法解决上面的问题
particlesMaterial.depthWrite = false;
// 重叠的位置，颜色会更亮，但是此方法有性能问题
particlesMaterial.blending = THREE.AdditiveBlending;
particlesMaterial.vertexColors = true;


// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // const x = particlesGeometry.attributes.position.array[i3];
        // @ts-ignore
        // particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
    }
    particlesGeometry.attributes.position.needsUpdate = true
    // particles.rotation.y = elapsedTime * 0.25;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()