// import * as THREE from 'three' // was loading before
// import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
// import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/loaders/GLTFLoader.js';
// import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/controls/OrbitControls.js';
// import { CSS3DRenderer, CSS3DObject } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/renderers/CSS3DRenderer.js';
// import * as THREE from './three.module.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js'; //try again
import { GLTFLoader } from './loaders/GLTFLoader.js';
import { OrbitControls } from './controls/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from './renderers/CSS3DRenderer.js';




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
document.getElementById('compscreen-container').style.display = 'block';





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

// this is the initial camera view : )
perspectiveCamera.position.set(-185, 234.67, 287.22); // les position it
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
controls.enablePan = false;  // 2 finger move x axis
controls.minPolarAngle = Math.PI / 6;
controls.maxPolarAngle = Math.PI / 2;// - Math.PI / 15;
controls.target.set(-0.5249, -0.0701, -1.4007);
controls.update();

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
    desk.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    scene.add(desk);

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

        // issue regarding screen spread
        const screenContainer = document.getElementById('compscreen-container');
        const containerWidth = screenContainer.offsetWidth;
        const containerHeight = screenContainer.offsetHeight;

        cssObject.position.y += 95;
        cssObject.position.z += 40;
        cssObject.position.x += 1;
        cssObject.scale.set(0.09, 0.1, 0.09); // this scaler
        scene.add(cssObject);
    }
    });





/**
 * Zoom to Screen Animation
 */
const targetPosition = new THREE.Vector3(1.64740, 90.80558, 70.21327);
const targetLookAt = new THREE.Vector3(3.21295, 90.09702, -16.02079);
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
const originalPosition = new THREE.Vector3(-185, 234.67, 287.22);
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
 * Zoom in handler
 */
const bottomBox = document.querySelector('.bottom-text');
bottomBox.addEventListener('click', () => {
    if(!zooming && !isZoomedIn) {
        zooming = true;
        zoomStartTime = performance.now();
        hideIntroBoxes();
        requestAnimationFrame(animateZoom);
    }
})


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