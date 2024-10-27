import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Raycaster } from 'three';





/**
 * Scene & renderer
 */
const scene = new THREE.Scene();
const perspectiveCamera = new THREE.PerspectiveCamera(
    75, // fov
    window.innerWidth / window.innerHeight, // aspect
    0.1, // near
    1000); // far
perspectiveCamera.position.set(8,5,-1) // les position it
const renderer = new THREE.WebGLRenderer({
                                             canvas: document.querySelector('.webgl'),
                                             antialias: true,
                                             alpha: true
                                         });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;





/**
 * Orbit Controls
 */
const controls = new OrbitControls(perspectiveCamera, renderer.domElement);
controls.enableDamping = true;





/**
 * Raycaster
 */
const raycaster = new Raycaster();
const mouse = new THREE.Vector2();




/**
 * Monitors info
//  */
const textureLoader = new THREE.TextureLoader();
const defaultTexture = textureLoader.load('./Static/LeftMonitor/LeftMonitorDefault.jpg',
                                          (texture) => {
    texture.encoding = THREE.sRGBEncoding;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
});
let leftMonitor, rightMonitor




/**
 * Light
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);





/**
 * Models
 */
const loader = new GLTFLoader();
// loading Desk set up from 'Ankledot' - 'https://sketchfab.com/Ankledot'
loader.load('./Static/models/desk_asset.glb', (gltf) => {
    const desk = gltf.scene;
    desk.scale.set(0.05, 0.05, 0.05);
    desk.position.set(-0.5, -1, -1);
    desk.rotation.y = (Math.PI / 2) + (Math.PI / 4);
    scene.add(desk);

    // Creator of file nested the screen under the monitor child instead of having it as a parent.
    const parent = desk.getObjectByName("1");
    leftMonitor = parent.getObjectByName("LeftMonitorScreen");
    rightMonitor = desk.getObjectByName("Monitor_Wide_M_Monitor_Wide_Screen_0");

    leftMonitor.material = new THREE.MeshBasicMaterial({ map: defaultTexture });
});
// loading chair from 'thethieme' - 'https://sketchfab.com/thethieme'
loader.load('./Static/models/chair.glb', (gltf) => {
    const chair = gltf.scene;
    chair.scale.set(4,4,4);
    chair.position.set(-0.5, -2.5, -1);
    chair.rotation.y = Math.PI + (Math.PI / 2);
    scene.add(chair);
}, undefined, (error) => {
    console.error('Error loading chair, check loader:', error);
});




/**
 * Animate
 */
const time = new THREE.Clock();
let oldElapsedTime = 0;
const tick = () => {
    const elapsedTime = time.getElapsedTime()

    controls.update();


    renderer.render(scene,perspectiveCamera);
    window.requestAnimationFrame(tick);
}

// start animation loop
tick();





/**
 * Handle Window Resize
 */
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    perspectiveCamera.aspect = window.innerWidth / window.innerHeight;
    perspectiveCamera.updateProjectionMatrix();
});