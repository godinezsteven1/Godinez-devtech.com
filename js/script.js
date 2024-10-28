import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Raycaster } from 'three';





/**
 * Loading screen
 */
// div highest class
const loadingTerminal = document.getElementById('loadingTerminal');
// p text that will do the loading
const loadingText = document.getElementById('loadingText');
// p warning text that will load to
const loadingWarning = document.getElementById('loadingWarning');
// start button
const startButton = document.getElementById('startButton');
let loaders = false;

// type writrter effect
function writtingEffects(text, element, speed = 50 , callback) {
    let u = 0;
    function type() {
        if (u < text.length) {
            element.innerHTML += text.charAt(u);
            u++; // inccccreemetnt
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}
function showWarningText() {
    loadingWarning.style.display = 'block';
    startButton.style.display = 'inline-block';
}
writtingEffects("Loading Project Models...", loadingText, 80, showWarningText);






/**
 * GLTF Loader
 */
const modelLoader = new GLTFLoader();
modelLoader.load(
    './Static/Models/desk.glb',
    (gltf) => {
        // When the model is loaded, add it to the scene
        const desk = gltf.scene;
        desk.scale.set(0.05, 0.05, 0.05);
        desk.position.set(-0.5, -1, -1);
        desk.rotation.y = (Math.PI / 2) + (Math.PI / 4);
        desk.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        scene.add(desk);
    },
    null,
    (error) => {
        console.error('An error occurred loading the model:', error);
    }
);





/**
 * Start Experience Button Handler
 */
function startExperience() {
    loadingTerminal.style.display = 'none'; // Hide loading screen
    showInfoBox(); // shows info box error. debug log
    tick();
}
window.startExperience = startExperience;





/**
 * Back arrow neccesities
 */
window.zoomOut = zoomOut;
let isZoomedIn = false;

function showBackArrow() {
    const backArrow = document.getElementById('backArrow');
    backArrow.style.display = 'flex'; // used to be block
    controls.enabled = false;
    // console.log("back arrow showing now "); // console debug
}
function hideBackArrow() {
    const backArrow = document.getElementById('backArrow');
    backArrow.style.display = 'none'; // hide arrow
    controls.enabled = true;
}
function hideInfoBox() {
    const infoBox = document.querySelector('.info');
    if (infoBox) {
        infoBox.style.display = 'none'; // Hide the info box
    }
}
function showInfoBox() {
    const infoBox = document.querySelector('.info');
    if (infoBox) {
        infoBox.style.display = 'block'; // show box
    }
}
hideInfoBox();



/**
 * Scene
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;





/**
 * Orbit Controls
 */
const controls = new OrbitControls(perspectiveCamera, renderer.domElement);
controls.enableDamping = true;
controls.minPolarAngle = Math.PI / 6;
controls.maxPolarAngle = Math.PI / 2;// - Math.PI / 15;





/**
 * Raycaster
 */
const raycaster = new Raycaster();
const mouse = new THREE.Vector2();
let compScreen;





/**
 * Light
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
directionalLight.shadow.bias = -0.001;
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);




/**
 * floor
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
floor.receiveShadow = true;
scene.add(floor);





/**
 * Models helper
 */
function findScreenObj(object) {
    if (object.name && object.name.toLowerCase().includes("screen")) {
        return object;
    } // do not know how to manipulate hiarchy in blender so manually find it.
    for (let i = 0; i < object.children.length; i++) {
        const found = findScreenObj(object.children[i]);
        if (found) return found;
    }
    return null;
}





/**
 * Models
 * loading Desk set up from 'Nyangire' - 'https://sketchfab.com/Nyangire'
 * loading monitor set up from 'Ethica' - 'https://sketchfab.com/Ethica'
 */
const loader = new GLTFLoader();
loader.load('./Static/models/desk.glb', (gltf) => {
    const desk = gltf.scene;
    desk.scale.set(0.05, 0.05, 0.05);
    desk.position.set(-0.5, -1, -1);
    desk.rotation.y = (Math.PI / 2) + (Math.PI / 4);
    desk.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    scene.add(desk);
    compScreen = findScreenObj(desk);
    if (compScreen) {
        compScreen.userData.isScreen = true;
        // console.log("marked");
    } else {
        console.error("check blender for screen hiearchy");
    }
    });



/**
 * Screen handler
 */
// TBI


/**
 * Zoom to Screen Animation
 */
const targetPosition = new THREE.Vector3(1.567, 3.817, -3.404);
const targetLookAt = new THREE.Vector3(0.240, 3.644, -2.115);
let zooming = false;
let zoomStartTime;
const zoomDuration = 1.5;
// Zoom animation function
const animateZoom = (currentTime) => {
    const elapsedTime = (currentTime - zoomStartTime) / 1000;
    const t = Math.min(elapsedTime / zoomDuration, 1);

    perspectiveCamera.position.lerpVectors(perspectiveCamera.position, targetPosition, t);
    controls.target.lerpVectors(controls.target, targetLookAt, t);
    controls.update();

    if (t < 1) {
        requestAnimationFrame(animateZoom);
    } else {
        zooming = false;
        isZoomedIn = true;
        showBackArrow();
    }
};
// zoom out animation
const originalPosition = new THREE.Vector3(8.4661, 5.6467, -5.1474);
const originalTarget = new THREE.Vector3(-0.5249, -0.0701, -1.4007);

function zoomOut() {
    if (isZoomedIn) {
        zooming = true;
        zoomStartTime = performance.now();
        hideBackArrow();
        isZoomedIn = false;
        showInfoBox();
        const zoomOutAnimation = (currentTime) => {
            const elapsedTime = (currentTime - zoomStartTime) / 1000;
            const t = Math.min(elapsedTime / zoomDuration, 1); // Interpolation factor
            perspectiveCamera.position.lerpVectors(targetPosition, originalPosition, t);
            controls.target.lerpVectors(targetLookAt, originalTarget, t);
            controls.update();

            if (t < 1) {
                requestAnimationFrame(zoomOutAnimation);
            } else {
                zooming = false;
                controls.enabled = true;
                perspectiveCamera.position.copy(originalPosition);
                controls.target.copy(originalTarget);
                controls.update();
            }
        };
        requestAnimationFrame(zoomOutAnimation);
    }
}





/**
 * Handle Screen Click for Zoom
 */
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, perspectiveCamera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    const screenIntersect = intersects.find(intersect => intersect.object.userData.isScreen);

    if (screenIntersect && !zooming && !isZoomedIn) {
        zooming = true;
        zoomStartTime = performance.now();
        hideInfoBox();
        requestAnimationFrame(animateZoom);
    }
});




/**
 * Animation loop
 */
const time = new THREE.Clock();
const tick = () => {
    controls.update();
    renderer.render(scene, perspectiveCamera);
    window.requestAnimationFrame(tick);
};

// tick();



/**
 * Handle Window Resize
 */
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    perspectiveCamera.aspect = window.innerWidth / window.innerHeight;
    perspectiveCamera.updateProjectionMatrix();
});


// function logCameraInfo() {
//     console.log("Camera Position:", perspectiveCamera.position);
//     console.log("Camera Target:", controls.target);
// }
// Update to load onto this vector....
// // Camera Position: _Vector3 {x: 1.5415020379380533, y: 3.709810641159292, z: -3.123318171491635}
// // Camera Target: _Vector3 {x: -0.4790411468026463, y: 3.5714155694274528, z: -1.0755573422150415}
//
// window.addEventListener('keydown', (event) => {
//     if (event.key === 'k') {
//         logCameraInfo();
//     }
// });