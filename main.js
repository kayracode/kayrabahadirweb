import * as THREE from "/three.js"

// Create the scene and the camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, (innerWidth)  / (innerHeight ), 0.1, 1000)
camera.position.setZ(5)
// Create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth * 1, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

// Create the torusknot
const torusGeo = new THREE.TorusKnotGeometry( 2.3, 0.8, 200, 20 );
const material = new THREE.MeshPhongMaterial( { color: 0x222222 } );
material.flatShading = false;
material.shininess = 40000;
material.wireframe = true;

const torusKnot = new THREE.Mesh(torusGeo, material);
scene.add(torusKnot);
torusKnot.position.set(0.5, 0, -2)

// Create a light that follows the mouse
var brightness = 40;
const light = new THREE.PointLight( 0xffffff, brightness, 4);
scene.add(light);
light.position.setZ(1)
light.position.setX(3)
light.position.setY(-1)

// Add an event listener to the canvas that listens for mouse movements.
renderer.domElement.addEventListener('mousemove', onMouseMove, false);
function onMouseMove(event) {
  var x = (event.clientX / window.innerWidth) * 2 - 1;
  var y = - (event.clientY / window.innerHeight) * 2 + 1;
  var vector = new THREE.Vector3(x, y, 1);
  vector.unproject(camera);
  var dir = vector.sub(camera.position).normalize();
  var distance = - camera.position.z / dir.z;
  var pos = camera.position.clone().add(dir.multiplyScalar(distance));
  light.position.copy(pos);
}

// For mobile
// Add an event listener to the canvas that listens for touch scrolls.
renderer.domElement.addEventListener('touchstart', onTouchStart, false);
function onTouchStart(event) {
  updateLightPosition(event.touches[0].clientX, event.touches[0].clientY);
}
renderer.domElement.addEventListener('touchmove', onTouchMove, false);
function onTouchMove(event) {
  event.preventDefault();
  updateLightPosition(event.touches[0].clientX, event.touches[0].clientY);
}
function updateLightPosition(x, y) {
  const vector = new THREE.Vector3(
    (x / window.innerWidth) * 2 - 1,
    - (y / window.innerHeight) * 2 + 1,
    0.5
  );
  vector.unproject(camera);
  const direction = vector.sub(camera.position).normalize();
  const distance = -camera.position.z / direction.z;
  const position = camera.position.clone().add(direction.multiplyScalar(distance));
  light.position.copy(position);
}

// For the color of the light to flick
// Also turns on wireframe when color options finish
var colorSwitch = 0
window.addEventListener("click", function() {
  const colors = [0xffffff, 0x836953, 0x4C0013, 0x192841]
  colorSwitch++
  if(colorSwitch > colors.length - 1) {
    colorSwitch = 0
    if(material.wireframe) {
      material.wireframe = false;
      material.flatShading = false; 
    } else {
      material.wireframe = true;
      material.flatShading = true; 
    }
  }
  light.color.set(colors[colorSwitch])
} );

// The main animate function
function animate() {
  requestAnimationFrame(animate)
  torusKnot.rotation.x += 0.002
  torusKnot.rotation.y += 0.002

  renderer.render(scene, camera)
}
animate()


document.body.onmousemove = function(e) {
  document.documentElement.style.setProperty (
    '--x', (
      e.clientX+window.scrollX
    )
    + 'px'
  );
  document.documentElement.style.setProperty (
    '--y', (
      e.clientY+window.scrollY
    ) 
    + 'px'
  );
}