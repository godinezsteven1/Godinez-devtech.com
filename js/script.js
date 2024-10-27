import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Raycaster } from 'three';

/**
 * Back arrow
 */
let isZoomedIn = false;
function showBackArrow() {
    document.getElementById('backArrow').style.display = 'block';
    controls.enabled = false;
}
function hideBackArrow() {
    document.getElementById('backArrow').style.display = 'none';
    controls.enabled = true;
}
// Show the info box when zooming out
function showInfoBox() {
    const infoBox = document.querySelector('.info');
    if (infoBox) {
        infoBox.style.display = 'block';
    }
}



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
// controls.maxPolarAngle = Math.PI / 2 - Math.PI / 9;




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
floor.position.y = -1.0;
floor.receiveShadow = true;
scene.add(floor);





/**
 * Models helper
 */

function findScreenObj(object) {
    if (object.name && object.name.toLowerCase().includes("screen")) {
        return object;
    }
    for (let i = 0; i < object.children.length; i++) {
        const found = findScreenObj(object.children[i]);
        if (found) return found;
    }
    return null;
}





/**
 * Models
 */
const loader = new GLTFLoader();
// loading Desk set up from 'Nyangire' - 'https://sketchfab.com/Nyangire'
// loading monitor set up from 'Ethica' - 'https://sketchfab.com/Ethica'
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
function zoomOut() {
    if (isZoomedIn) {
        zooming = true;
        zoomStartTime = performance.now();
        hideBackArrow();
        isZoomedIn = false;

        const zoomOutAnimation = (currentTime) => {
            const elapsedTime = (currentTime - zoomStartTime) / 1000;
            const t = 1 - Math.min(elapsedTime / zoomDuration, 1);

            perspectiveCamera.position.lerpVectors(targetPosition, perspectiveCamera.position, t);
            controls.target.lerpVectors(targetLookAt, controls.target, t);
            controls.update();

            if (t > 0) {
                requestAnimationFrame(zoomOutAnimation);
            } else {
                zooming = false;
                controls.enabled = true;
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

tick();



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
//
//
// window.addEventListener('keydown', (event) => {
//     if (event.key === 'k') {
//         logCameraInfo();
//     }
// });

/**
 * Click event Hide box
 */
function hideInfoBox() {
    const infoBox = document.querySelector('.info');
    if (infoBox) {
        infoBox.style.display = 'none'; // Hide the info box
    }
}
window.zoomOut = zoomOut();