import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import ThreeClassSceneManager from "./ThreeClassSceneManager";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import snowdropTextureImg from "./Texture/snowflake1.png";

const SnowingScene = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const sceneManager = new ThreeClassSceneManager(containerRef, THREE);
    const scene = sceneManager.getScene();
    const camera = sceneManager.getCamera();
    const renderer = sceneManager.getRenderer();
    const effect = sceneManager.getEffect();
    let sky, sun;

    const requestPermission = () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === "granted") {
              window.addEventListener("devicemotion", (e) => {
                // Handle 'e' here (e.g., update UI based on motion data)
              });
            }
          })
          .catch(console.error);
      } else {
        alert("DeviceMotionEvent is not defined");
      }
    };
    const btn = document.getElementById("request");
    btn.addEventListener("click", requestPermission);

    requestPermission();

    // Add Sky
    sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);
    sun = new THREE.Vector3();
    const effectController = {
      turbidity: 0,
      rayleigh: 0.165,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
      elevation: 2,
      azimuth: 180,
    };

    function updateSky() {
      const uniforms = sky.material.uniforms;
      uniforms["turbidity"].value = effectController.turbidity;
      uniforms["rayleigh"].value = effectController.rayleigh;
      uniforms["mieCoefficient"].value = effectController.mieCoefficient;
      uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;
      const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
      const theta = THREE.MathUtils.degToRad(effectController.azimuth);
      sun.setFromSphericalCoords(1, phi, theta);
      uniforms["sunPosition"].value.copy(sun);
      renderer.render(scene, camera);
    }

    updateSky();

    // Creating snowdrop particles
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = Math.random() * 6000 - 3000;
      positions[i + 1] = Math.random() * 6000 - 3000;
      positions[i + 2] = Math.random() * 6000 - 3000;
    }
    const particles = new THREE.BufferGeometry();
    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Load snowdrop texture
    const textureLoader = new THREE.TextureLoader();
    const snowdropTexture = textureLoader.load(snowdropTextureImg); // Use imported variable here
    const snowdropMaterial = new THREE.PointsMaterial({
      map: snowdropTexture, // Apply the texture to the points
      color: 0xfffafa,
      size: 60,
      blending: THREE.AdditiveBlending,
      transparent: 0.05,
    });
    const snowflakes = new THREE.Points(particles, snowdropMaterial);
    scene.add(snowflakes);

    const animate = () => {
      requestAnimationFrame(animate);
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 5;
        if (positions[i + 1] < -3000) {
          positions[i] = Math.random() * 7000 - 3000;
          positions[i + 1] = Math.random() * 7000 + 3000;
          positions[i + 2] = Math.random() * 7000 - 3000;
        }
      }
      particles.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      // effect.render(scene, camera);
    };

    animate();

    // Device Orientation Logic
    const handleDeviceOrientation = (event) => {
      const { alpha, beta, gamma } = event;

      // Example: Rotate the camera based on device orientation
      scene.rotation.x = (beta * Math.PI) / 180; // Convert degrees to radians
      scene.rotation.y = (gamma * Math.PI) / 180;
      scene.rotation.z = (alpha * Math.PI) / 180;

      console.log("x", camera.rotation.x);
      console.log("y", camera.rotation.y);
      console.log("z", camera.rotation.z);
      // Render the updated scene
      renderer.render(scene, camera);

      // You may need to adjust this logic depending on your specific requirements
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleDeviceOrientation);
    } else {
      console.log("Device orientation not supported");
    }

    return () => {
      // Clean up Three.js resources if needed
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} />
      <button id="request">Request Permission</button>
    </>
  );
};
export default SnowingScene;
