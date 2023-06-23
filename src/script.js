import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0x999999, 1);
scene.add(ambientLight);

var lights = [];
lights[0] = new THREE.DirectionalLight(0xffffff, 1);
lights[0].position.set(-1, 0, 0);
lights[1] = new THREE.DirectionalLight(0x11e8bb, 1);
lights[1].position.set(-0.75, 1, 0.5);
lights[2] = new THREE.DirectionalLight(0x8200c9, 1);
lights[2].position.set(0.75, -1, 0.3);
lights[3] = new THREE.DirectionalLight(0x11e8bb, 1);
lights[3].position.set(0.75, 1, -0.1);
lights[4] = new THREE.DirectionalLight(0x11e8bb, 0.45);
lights[4].position.set(0.5, 2, -4);
scene.add(lights[0], lights[1], lights[2], lights[3], lights[4]);

/**
 * Sphere
 */
const sphereGroup = new THREE.Group();
scene.add(sphereGroup);
const sphere = new THREE.Mesh(
  new THREE.TetrahedronGeometry(3.5, 4),
  new THREE.MeshPhongMaterial({
    color: 0xffffff,
  })
);
sphereGroup.add(sphere);

const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(5, 9, 9, 1.4, 6.3, 0, 3.1),
  new THREE.MeshPhongMaterial({ wireframe: true, side: THREE.DoubleSide })
);
sphereGroup.add(sphere2);

const crystalGroup = new THREE.Group();
scene.add(crystalGroup);
const crystalGeometry = new THREE.TetrahedronGeometry(1, 0);
const crystalMaterial = new THREE.MeshBasicMaterial({ color: 0x11e8bb });
for (let i = 0; i < 20000; i++) {
  const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
  crystal.position.set(
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 100
  );
  crystal.rotation.set(Math.random() * Math.PI, 0, Math.random() * Math.PI);

  crystal.scale.set(
    Math.random() * 0.1,
    Math.random() * 0.1,
    Math.random() * 0.1
  );
  crystalGroup.add(crystal);
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Events
 */

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 3, -20);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;
controls.enabled = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  crystalGroup.rotation.y = -elapsedTime * Math.PI * 0.05;
  sphere.rotation.y = -elapsedTime * Math.PI * 0.05;
  sphere2.rotation.y = -elapsedTime * Math.PI * 0.05;
  sphere2.rotation.x = elapsedTime * Math.PI * 0.03;
  // camera.position.x = Math.cos(elapsedTime * Math.PI * 0.08) * 15;
  // camera.position.z = Math.sin(elapsedTime * Math.PI * 0.08) * 15;
  // camera.position.y = 0;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
