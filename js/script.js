import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75, // fov
    window.innerWidth / window.innerHeight, //aspect
    0.1, //near
    1000); // far
camera.position.z = 5;

// 3. Create the Renderer and Attach It to the DOM
const renderer = new THREE.WebGLRenderer(
    { canvas: document.querySelector('.webgl') });
renderer.setSize(window.innerWidth, window.innerHeight);


const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);


function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();


window.addEventListener('resize', () => {

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
