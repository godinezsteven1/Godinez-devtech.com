import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Raycaster } from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';





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





/**
 * text load
 */
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
    // startButton.style.display = 'inline-block';
    setTimeout(() => {
        document.getElementById("startButton").style.display = 'inline-block';
    }, 100);
}
writtingEffects("Loading Project Models...", loadingText, 80, showWarningText);





/**
 * GLTF Loader for main screen
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
    loadingTerminal.style.display = 'none';
    document.querySelector('.webgl').style.display = 'block';
    const compscreenContainer = document.getElementById('compscreen-container');
    compscreenContainer.style.display = 'block';
    showIntroBoxes(); // shows info box error. debug log
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
    backArrow.style.display = 'none';
    controls.enabled = true;
}
function hideIntroBoxes() {
    const infoBox = document.querySelector('.info');
    const bottomText = document.querySelector('.bottom-text');
    if (infoBox) {
        infoBox.style.display = 'none';
    }
    if (bottomText) {
        bottomText.style.display = 'none';
    }
}
function showIntroBoxes() {
    const infoBox = document.querySelector('.info');
    const bottomText = document.querySelector('.bottom-text');
    if (infoBox) {
        infoBox.style.display = 'block';
    }
    if (bottomText) {
        bottomText.style.display = 'block';
    }
}
hideIntroBoxes();



/**
 * Scene
 */
const scene = new THREE.Scene();
const perspectiveCamera = new THREE.PerspectiveCamera(
    75, // fov
    window.innerWidth / window.innerHeight, // aspect
    0.1, // near
    1000); // far
perspectiveCamera.position.set(10.5788, 6.68453, -4.7782); // les position it
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
controls.target.set(-0.5249, -0.0701, -1.4007);
controls.update();






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
    // console.log("checking for ," , object);
    if (object.name && object.name.toLowerCase().includes("screen")) {
        console.log("found screen object" , object.name);
        return object;
    }
    if (object.children) {
        for (let i = 0; i < object.children.length; i++) {
            const found = findScreenObj(object.children[i]);
            if (found) return found;
        }
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
    controls.enablePan = false;

    compScreen = findScreenObj(desk);
    console.log("found compscreen line 282" , compScreen);

    if (compScreen) {
        compScreen.userData.isScreen = true;
        const screenElement = document.getElementById('compscreen-container');
        console.log("marked");
        if (!screenElement) {
            console.error("Cant find compscreen-container");
            return;
        }

        const cssObject = new CSS3DObject(screenElement);

        const worldPos = new THREE.Vector3();
        const worldQuat = new THREE.Quaternion();
        compScreen.getWorldPosition(worldPos);
        compScreen.getWorldQuaternion(worldQuat);


        cssObject.position.copy(worldPos);
        cssObject.quaternion.copy(worldQuat);
        cssObject.position.y += 3.3;
        cssObject.position.z += 2.405;
        cssObject.translateX(2.0);
        cssObject.rotation.x += Math.PI * 0.5;
        cssObject.rotation.y += Math.PI * 0.75;
        cssObject.rotation.z -= Math.PI * 0.25;
        cssObject.scale.set(0.004, 0.005, 0.005);
        cssObject.translateX(0.7);
        cssObject.position.y += 0.2;






        scene.add(cssObject);
        console.log("CSS3D object added to scene");
    }
    });



/**
 * Zoom to Screen Animation
 */
const targetPosition = new THREE.Vector3(1.5415, 3.7098, -3.1233);
const targetLookAt = new THREE.Vector3(-0.4790, 3.5714, -1.0756);
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
        // screen work when zoom in
        document.getElementById('compscreen-container').classList.add('active');
    }
};
// zoom out animation
const originalPosition = new THREE.Vector3(10.5788, 6.68453, -4.7782);
const originalTarget = new THREE.Vector3(-0.5249, -0.0701, -1.4007);

function zoomOut() {
    if (isZoomedIn) {
        // no interaction
        document.getElementById('compscreen-container').classList.remove('active');
        zooming = true;
        zoomStartTime = performance.now();
        hideBackArrow();
        isZoomedIn = false;
        showIntroBoxes();
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
        hideIntroBoxes();


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
    cssRenderer.render(scene, perspectiveCamera);

    window.requestAnimationFrame(tick);
};




/**
 * Handle Window Resize
 */
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    perspectiveCamera.aspect = window.innerWidth / window.innerHeight;
    perspectiveCamera.updateProjectionMatrix();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);

});


function logCameraInfoHelp() {
    console.log("Camera Position:", perspectiveCamera.position);
    console.log("Camera Target:", controls.target);
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'k') {
        logCameraInfoHelp();
    }
});





/**
 * Screen handler
 */
const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
cssRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(cssRenderer.domElement);