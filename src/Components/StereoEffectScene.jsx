import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { StereoEffect } from "three/examples/jsm/effects/StereoEffect.js";

const StereoEffectScene = () => {
  const containerRef = useRef(null);
  const spheres = useRef([]);
  const cameraRef = useRef(null);

  const [orientationData, setOrientationData] = useState(null);
  const [motionData, setMotionData] = useState(null);

  useEffect(() => {
    let camera, scene, renderer, effect, directionalLight;

    const init = () => {
      const container = containerRef.current;

      // Creating a perspective camera
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        100000
      );
      camera.position.z = 3200;
      cameraRef.current = camera; // Store camera reference

      // Creating a scene
      scene = new THREE.Scene();
      // Loading a cube texture as background
      // Setting background color to blue
      scene.background = new THREE.Color(0x011c47); // 0x0000ff represents blue color in hexadecimal

      // Creating a directional light
      directionalLight = new THREE.DirectionalLight(0xffffff, 6);
      directionalLight.position.set(1, 1, 1).normalize();
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0xffffff, 2);
      pointLight.position.set(1, 5, 0);
      scene.add(pointLight);

      // Creating a sphere geometry
      const geometry = new THREE.SphereGeometry(150);

      // Creating a basic material with red color
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x5391f5),
        roughness: 1,
        metalness: 1,
        opacity: 1,
        emissive: new THREE.Color(0x5391f5),
        fog: true,
      });

      // Creating and adding spheres to the scene
      for (let i = 0; i < 200; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 10000 - 5000;
        mesh.position.y = Math.random() * 10000 - 5000;
        mesh.position.z = Math.random() * 10000 - 5000;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 2 + 1;
        scene.add(mesh);
        spheres.current.push(mesh);
      }

      // Creating a WebGL renderer
      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight); // Set renderer size to window size
      container.appendChild(renderer.domElement);

      // Creating a stereo effect
      effect = new StereoEffect(renderer);
      effect.setSize(window.innerWidth, window.innerHeight);
    };

    // Function to update Camera based on device orientation
    const updateCamera = () => {
      if (orientationData) {
        // Update camera based on device orientation
        camera.rotation.x = orientationData.beta;
        camera.rotation.y = orientationData.gamma;
        camera.rotation.z = orientationData.alpha;
      }
    };

    const animate = () => {
      // Recursive animation function
      requestAnimationFrame(animate);
      render();
      updateCamera();
      // renderer.render(scene, camera);
    };

    const render = () => {
      // Rendering function
      const timer = 0.00001 * Date.now();

      // Moving spheres in a circular pattern
      for (let i = 0, il = spheres.current.length; i < il; i++) {
        const sphere = spheres.current[i];
        sphere.position.x = 5000 * Math.cos(timer + i);
        sphere.position.y = 5000 * Math.sin(timer + i * 1.1);
      }

      // Rendering scene with stereo effect
      effect.render(scene, camera);
    };

    // Initializing the scene and starting animation
    init();
    animate();

    ////// DeviceOrientation //////

    // Function to request permission for accessing device orientation
    const requestPermission = () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === "granted") {
              // If permission granted, listen for device motion events
              window.addEventListener("devicemotion", handleDeviceMotion);
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

    // Add event listeners for device orientation and motion
    window.addEventListener("deviceorientation", handleDeviceOrientation, true);
    window.addEventListener("devicemotion", handleDeviceMotion, true);

    // Cleanup: remove event listeners when component unmounts
    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      window.removeEventListener("devicemotion", handleDeviceMotion);
    };
  }, []); // Empty dependency array ensures useEffect runs only once

  // Returning a div container for the scene
  return (
    <div
      ref={containerRef}
      id="info"
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100%",
        margin: 0,
      }}
    >
      <button id="request">Request Permission</button>
    </div>
  );
};

export default StereoEffectScene;
