import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const DemoOrientation = () => {
  const [orientationData, setOrientationData] = useState(null);
  const [motionData, setMotionData] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return; // Ensure canvasRef is initialized

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create 3 rectangles
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const rect1 = new THREE.Mesh(geometry, material);
    const rect2 = new THREE.Mesh(geometry, material);
    const rect3 = new THREE.Mesh(geometry, material);
    scene.add(rect1, rect2, rect3);

    // Set initial camera position
    camera.position.z = 5;

    // Function to update Camera based on device orientation
    const updateCamera = () => {
      if (orientationData) {
        // Update camera based on device orientation
        camera.rotation.x = orientationData.beta;
        camera.rotation.y = orientationData.gamma;
        camera.rotation.z = orientationData.alpha;
      }
    };

    // Function to animate the scene
    const animate = () => {
      requestAnimationFrame(animate);
      updateCamera();
      renderer.render(scene, camera);
    };

    animate();
    ////// DeviceOrientation //////
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

    const handleDeviceOrientation = (event) => {
      const alpha = event.alpha; // rotation around the z-axis
      const beta = event.beta; // rotation around the x-axis
      const gamma = event.gamma; // rotation around the y-axis
      setOrientationData({ alpha, beta, gamma });

      // Use the orientation data as needed
    };

    const handleDeviceMotion = (event) => {
      const acceleration = event.acceleration; // Acceleration data
      const accelerationIncludingGravity = event.accelerationIncludingGravity; // Acceleration data including gravity
      const rotationRate = event.rotationRate; // Device rotation rate

      // Use the motion data as needed
      setMotionData({
        acceleration,
        accelerationIncludingGravity,
        rotationRate,
      });
    };

    window.addEventListener("deviceorientation", handleDeviceOrientation, true);
    window.addEventListener("devicemotion", handleDeviceMotion, true);

    requestPermission();

    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      window.removeEventListener("devicemotion", handleDeviceMotion);
    };
  }, [orientationData]);

  return (
    <div>
      <h1>Device Orientation & Motion Demo 🤓</h1>
      <div>
        <h2>Orientation Data</h2>
        {orientationData && (
          <ul>
            <li>Alpha: {orientationData.alpha}</li>
            <li>Beta: {orientationData.beta}</li>
            <li>Gamma: {orientationData.gamma}</li>
          </ul>
        )}
      </div>
      <div>
        <h2>Motion Data</h2>
        {motionData && (
          <ul>
            <li>Acceleration: {JSON.stringify(motionData.acceleration)}</li>
            <li>
              Acceleration Including Gravity:{" "}
              {JSON.stringify(motionData.accelerationIncludingGravity)}
            </li>
            <li>Rotation Rate: {JSON.stringify(motionData.rotationRate)}</li>
          </ul>
        )}
        <button id="request">Request Permission</button>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default DemoOrientation;
