import * as THREE from "/node_modules/three/build/three.module.js"

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
const torusGeo = new THREE.TorusKnotGeometry( 3, 0.7, 200, 20 );
const material = new THREE.MeshPhongMaterial( { color: 0x222222 } );
material.flatShading = false;
material.shininess = 40000;
material.wireframe = false;
const torusKnot = new THREE.Mesh(torusGeo, material);
scene.add(torusKnot);
torusKnot.position.set(0, 0, -1)

// Create a light that follows the mouse
var brightness = 30;
const light = new THREE.PointLight( 0xffffff, brightness, 4);
scene.add(light);
light.position.setZ(5)

const centerLight = new THREE.PointLight( 0x222222, brightness, 4);
scene.add(centerLight);
centerLight.position.setZ(2)

const directionalLight = new THREE.DirectionalLight( 0xffffff, .4);
scene.add(directionalLight);
directionalLight.position.set(10,-300,0)

// Add an event listener to the canvas that listens for mouse movements.
renderer.domElement.addEventListener('mousemove', onMouseMove, false);
function onMouseMove(event) {
  var x = (event.clientX / window.innerWidth) * 2 - 1;
  var y = - (event.clientY / window.innerHeight) * 2 + 1;
  var vector = new THREE.Vector3(x, y, 0.5);
  vector.unproject(camera);
  var dir = vector.sub(camera.position).normalize();
  var distance = - camera.position.z / dir.z;
  var pos = camera.position.clone().add(dir.multiplyScalar(distance));
  light.position.copy(pos);
}

var colorSwitch = 0
window.addEventListener("click", function() {
  const colors = [0xffffff, 0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff]
  colorSwitch++
  if(colorSwitch > 6) {
    colorSwitch = 0
  }
  light.color.set(colors[colorSwitch])
} );

function animate() {
  requestAnimationFrame(animate)
  torusKnot.rotation.x += 0.002
  torusKnot.rotation.y += 0.002

  renderer.render(scene, camera)
}
animate()

