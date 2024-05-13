import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeScene = () => {
  const canvasRef = useRef(null);
  let renderer, camera, scene;

  useEffect(() => {
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
    // Initialize Three.js scene
    initScene();

    // Start listening for device orientation changes
    window.addEventListener("deviceorientation", handleDeviceOrientation);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, []);

  const initScene = () => {
    // Set up renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Set up camera
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Set up scene
    scene = new THREE.Scene();

    // Add objects to the scene
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Render the scene
    renderer.render(scene, camera);
  };

  const handleDeviceOrientation = (event) => {
    // Update scene based on device orientation
    const { alpha, beta, gamma } = event;

    // Example: Rotate cube based on device orientation
    scene.rotation.x = (beta * Math.PI) / 180; // Convert degrees to radians
    scene.rotation.y = (gamma * Math.PI) / 180;
    scene.rotation.z = (alpha * Math.PI) / 180;

    // Render the updated scene
    renderer.render(scene, camera);
  };

  return (
    <>
      {" "}
      <canvas ref={canvasRef} />{" "}
      <button id="request">Request Permission</button>
    </>
  );
};

export default ThreeScene;
