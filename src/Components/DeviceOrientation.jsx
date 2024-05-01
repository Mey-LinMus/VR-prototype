import * as THREE from "three";

const DeviceOrientation = () => {
  const scene = new THREE.Scene(); // Create a scene
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add rectangles
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red
  const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green
  const material3 = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue
  const rectangle1 = new THREE.Mesh(geometry, material1);
  const rectangle2 = new THREE.Mesh(geometry, material2);
  const rectangle3 = new THREE.Mesh(geometry, material3);
  rectangle1.position.set(0, 0, -5);
  rectangle2.position.set(-2, 0, -5);
  rectangle3.position.set(2, 0, -5);
  scene.add(rectangle1, rectangle2, rectangle3);

  function handleDeviceOrientation(event) {
    const alpha = event.alpha || 0; // Rotation around the z-axis
    const beta = event.beta || 0; // Rotation around the x-axis
    const gamma = event.gamma || 0; // Rotation around the y-axis

    // Update camera rotation based on device orientation
    camera.rotation.set(beta, alpha, -gamma);
  }

  window.addEventListener("deviceorientation", handleDeviceOrientation, true);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
};

export default DeviceOrientation;
