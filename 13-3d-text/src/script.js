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
// Axes Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader()
fontLoader.load(
    'fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new THREE.TextBufferGeometry(
            'Hello',
            {
                font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        );
        textGeometry.computeBoundingBox();
        console.log(textGeometry.boundingBox);
        textGeometry.translate(
            -textGeometry.boundingBox.max.x * 0.5,
            -textGeometry.boundingBox.max.y * 0.5,
            -textGeometry.boundingBox.max.z * 0.5,
        );
        // 等同于
        textGeometry.center();
        // const textMaterial = new THREE.MeshBasicMaterial();
        const textMaterial = new THREE.MeshMatcapMaterial();
        // textMaterial.wireframe = true;
        const text = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(text);

        for (let i = 0; i < 100; i++) {
            const dountGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
            const dountMaterial = new THREE.MeshMatcapMaterial();
            const dount = new THREE.Mesh(dountGeometry, dountMaterial);
            dount.position.x = (Math.random() - 0.5) * 10;
            dount.position.y = (Math.random() - 0.5) * 10;
            dount.position.z = (Math.random() - 0.5) * 10;

            dount.rotation.x = Math.random() * Math.PI;
            dount.rotation.y = Math.random() * Math.PI;
            dount.rotation.z = Math.random() * Math.PI;

            const scale = Math.random();
            dount.scale.x = scale;
            dount.scale.y = scale;
            dount.scale.z = scale;
            // dount.scale.set(scale, scale, scale);
            scene.add(dount);

        }
    }
)
/**
 * Object
 */
const cube = new THREE.Mesh(
    // new THREE.BoxGeometry(1, 1, 1),
    // new THREE.MeshBasicMaterial()
)

scene.add(cube)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()