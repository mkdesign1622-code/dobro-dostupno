// ============================================================
// 3D Carousel — Three.js, 5 GLB models
// Управление: стрелки клавиатуры, свайп, кнопки prev/next, точки
// ============================================================

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const MODELS = [
  { file: 'heart',    label: 'Сердце доверия',   desc: 'Каждый рубль виден.' },
  { file: 'urn',      label: 'Урна прозрачности', desc: 'Финансовые отчёты автоматически.' },
  { file: 'hand',     label: 'Ладонь помощи',     desc: 'Эмпатия в каждом решении.' },
  { file: 'door',     label: 'Дверь возможностей',desc: 'Открываем доступ к помощи.' },
  { file: 'document', desc: 'Документ отчёта',    label: 'Документ отчёта' },
];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let scene, camera, renderer, controls;
let currentMesh = null;
const loadedModels = new Map();
let currentIndex = 0;
let isRendering = false;
let rotation = 0;
let canvasEl;

function init(container) {
  canvasEl = container.querySelector('canvas');
  if (!canvasEl) {
    canvasEl = document.createElement('canvas');
    container.appendChild(canvasEl);
  }
  const rect = container.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  scene = new THREE.Scene();
  scene.background = null;

  camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
  camera.position.set(0, 0.5, 4);

  renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Lighting
  const ambient = new THREE.AmbientLight(0x5B8CFF, 0.6);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0x00C2FF, 1.4);
  key.position.set(3, 4, 5);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xB8AFFF, 0.8);
  rim.position.set(-3, -2, -4);
  scene.add(rim);

  const fill = new THREE.PointLight(0x1B47FF, 1.2, 10);
  fill.position.set(0, 0, 3);
  scene.add(fill);

  // Controls
  controls = new OrbitControls(camera, canvasEl);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = 1.2;

  window.addEventListener('resize', onResize);
}

function onResize() {
  if (!renderer || !canvasEl) return;
  const rect = canvasEl.parentElement.getBoundingClientRect();
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
  renderer.setSize(rect.width, rect.height, false);
}

async function loadModel(file) {
  if (loadedModels.has(file)) return loadedModels.get(file);
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      `models/${file}.glb`,
      (gltf) => {
        const root = gltf.scene;

        // Center + scale to fit
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        root.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        root.scale.setScalar(scale);

        loadedModels.set(file, root);
        resolve(root);
      },
      undefined,
      (err) => reject(err),
    );
  });
}

async function setActive(i) {
  if (i < 0) i = MODELS.length - 1;
  if (i >= MODELS.length) i = 0;
  currentIndex = i;

  // Update UI
  document.querySelectorAll('.carousel-dot').forEach((d, idx) => {
    d.classList.toggle('active', idx === i);
    d.setAttribute('aria-current', idx === i ? 'true' : 'false');
  });
  const label = document.querySelector('.carousel-label');
  const desc = document.querySelector('.carousel-desc');
  const counter = document.querySelector('.carousel-counter');
  if (label) label.textContent = MODELS[i].label;
  if (desc) desc.textContent = MODELS[i].desc;
  if (counter) counter.textContent = `${i + 1} / ${MODELS.length}`;

  // Swap model
  try {
    const model = await loadModel(MODELS[i].file);
    if (currentMesh) scene.remove(currentMesh);
    currentMesh = model;
    scene.add(currentMesh);
  } catch (e) {
    console.error('GLB load failed:', e);
    const fallback = createFallbackHeart();
    if (currentMesh) scene.remove(currentMesh);
    currentMesh = fallback;
    scene.add(currentMesh);
  }
}

function createFallbackHeart() {
  // Simple sphere if GLB fails
  const geo = new THREE.IcosahedronGeometry(1, 1);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x00C2FF,
    emissive: 0x1B47FF,
    emissiveIntensity: 0.3,
    metalness: 0.4,
    roughness: 0.5,
  });
  return new THREE.Mesh(geo, mat);
}

function animate() {
  if (!isRendering) return;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function start() {
  if (isRendering) return;
  isRendering = true;
  animate();
}

function stop() {
  isRendering = false;
}

// Touch swipe
function attachSwipe(el) {
  let startX = 0;
  let dx = 0;
  el.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    dx = 0;
  }, { passive: true });
  el.addEventListener('touchmove', (e) => {
    dx = e.touches[0].clientX - startX;
  }, { passive: true });
  el.addEventListener('touchend', () => {
    if (Math.abs(dx) > 60) {
      setActive(currentIndex + (dx > 0 ? -1 : 1));
    }
  }, { passive: true });
}

// Public init
export async function initCarousel() {
  const container = document.querySelector('.carousel-canvas');
  if (!container) return;

  init(container);

  // Wire prev/next
  document.querySelector('.carousel-prev')?.addEventListener('click', () => setActive(currentIndex - 1));
  document.querySelector('.carousel-next')?.addEventListener('click', () => setActive(currentIndex + 1));

  // Wire dots
  document.querySelectorAll('.carousel-dot').forEach((d, i) => {
    d.addEventListener('click', () => setActive(i));
  });

  // Keyboard
  container.setAttribute('tabindex', '0');
  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); setActive(currentIndex - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); setActive(currentIndex + 1); }
  });

  // Touch swipe
  attachSwipe(container);

  // Start/stop on visibility
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) start();
      else stop();
    });
  }, { threshold: 0.1 });
  io.observe(container);

  // Initial load
  await setActive(0);
}
