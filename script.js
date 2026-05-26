const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x03000a, 0.0015);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 40;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const mainGroup = new THREE.Group();
scene.add(mainGroup);

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);
const colorsArray = new Float32Array(particlesCount * 3);
const color1 = new THREE.Color(0xff007f);
const color2 = new THREE.Color(0x00f3ff);
const color3 = new THREE.Color(0x8a2be2);

for(let i = 0; i < particlesCount * 3; i+=3) {
const r = 40 + Math.random() * 20;
const theta = 2 * Math.PI * Math.random();
const phi = Math.acos(2 * Math.random() - 1);
const x = r * Math.sin(phi) * Math.cos(theta);
const y = r * Math.sin(phi) * Math.sin(theta);
const z = r * Math.cos(phi);
posArray[i] = x;
posArray[i+1] = y;
posArray[i+2] = z;
const mixedColor = new THREE.Color();
const rand = Math.random();
if(rand < 0.33) mixedColor.copy(color1);
else if(rand < 0.66) mixedColor.copy(color2);
else mixedColor.copy(color3);
colorsArray[i] = mixedColor.r;
colorsArray[i+1] = mixedColor.g;
colorsArray[i+2] = mixedColor.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
size: 0.15,
vertexColors: true,
transparent: true,
opacity: 0.8,
blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
mainGroup.add(particlesMesh);

const torusGeometry = new THREE.TorusKnotGeometry(15, 3, 100, 16);
const torusMaterial = new THREE.MeshBasicMaterial({
color: 0x8a2be2,
wireframe: true,
transparent: true,
opacity: 0.1
});
const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
mainGroup.add(torusMesh);

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
mouseX = (event.clientX - windowHalfX);
mouseY = (event.clientY - windowHalfY);
});

const clock = new THREE.Clock();

function animate() {
requestAnimationFrame(animate);
const elapsedTime = clock.getElapsedTime();

targetX = mouseX * 0.001;
targetY = mouseY * 0.001;

mainGroup.rotation.y += 0.001;
mainGroup.rotation.x += 0.0005;

torusMesh.rotation.y = elapsedTime * 0.1;
torusMesh.rotation.z = elapsedTime * 0.05;

camera.position.x += (mouseX * 0.01 - camera.position.x) * 0.05;
camera.position.y += (-mouseY * 0.01 - camera.position.y) * 0.05;
camera.lookAt(scene.position);

const positions = particlesGeometry.attributes.position.array;
for(let i = 0; i < particlesCount; i++) {
const i3 = i * 3;
const x = positions[i3];
const y = positions[i3+1];
const z = positions[i3+2];
positions[i3+1] = y + Math.sin(elapsedTime * 0.5 + x) * 0.01;
}
particlesGeometry.attributes.position.needsUpdate = true;

renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
});

const phrases = ["Développeur Front-End", "Développeur Back-End", "Créateur d'Interfaces", "Solutions pour PME", "Algorithmes Prédictifs", "Interfaces sur-mesure"];
let phraseIndex = 0;
let letterIndex = 0;
let currentText = "";
let isDeleting = false;
const typeElement = document.getElementById('typewriter');

function type() {
const currentPhrase = phrases[phraseIndex];
if (isDeleting) {
currentText = currentPhrase.substring(0, letterIndex - 1);
letterIndex--;
} else {
currentText = currentPhrase.substring(0, letterIndex + 1);
letterIndex++;
}
typeElement.textContent = currentText;
let typeSpeed = 100;
if (isDeleting) {
typeSpeed /= 2;
}
if (!isDeleting && currentText === currentPhrase) {
typeSpeed = 2000;
isDeleting = true;
} else if (isDeleting && currentText === "") {
isDeleting = false;
phraseIndex = (phraseIndex + 1) % phrases.length;
typeSpeed = 500;
}
setTimeout(type, typeSpeed);
}
setTimeout(type, 1000);

function revealElements() {
const reveals = document.querySelectorAll(".reveal");
const windowHeight = window.innerHeight;
const elementVisible = 150;
for (let i = 0; i < reveals.length; i++) {
const elementTop = reveals[i].getBoundingClientRect().top;
if (elementTop < windowHeight - elementVisible) {
reveals[i].classList.add("active");
}
}
}
window.addEventListener("scroll", revealElements);
revealElements();

