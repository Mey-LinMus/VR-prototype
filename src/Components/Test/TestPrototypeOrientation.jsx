import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const PrototypeOrientation = () => {
  const [orientationData, setOrientationData] = useState(null);
  const [motionData, setMotionData] = useState(null);

  const canvasRef = useRef(null);
  const spheres = useRef([]);
  
  const orientationDataRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x011c47);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x5391f5),
      roughness: 1,
      metalness: 1,
      opacity: 1,
      emissive: new THREE.Color(0x5391f5),
      fog: true,
    });
    // Creating a sphere geometry

    const geometry = new THREE.SphereGeometry(150);

    for (let i = 0; i < 500; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = Math.random() * 10000 - 5000;
      mesh.position.y = Math.random() * 10000 - 5000;
      mesh.position.z = Math.random() * 10000 - 5000;
      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 2 + 1;
      scene.add(mesh);
      spheres.current.push(mesh);
    }

    const light = new THREE.DirectionalLight(0xffffff, 6);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    camera.position.z = 5;

    const updateCamera = () => {
      if (orientationData) {
        const smoothingFactor = 0.1;

        // Smoothly interpolate between current rotation and new rotation
        camera.rotation.x +=
          (orientationData.beta / 5 - camera.rotation.x) * smoothingFactor;
        camera.rotation.y +=
          (orientationData.gamma / 5 - camera.rotation.y) * smoothingFactor;
        camera.rotation.z +=
          (orientationData.alpha / 5 - camera.rotation.z) * smoothingFactor;
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      updateCamera();
      renderer.render(scene, camera);
      render();
    };

    const render = () => {
      // Rendering function
      const timer = 0.00001 * Date.now();

      camera.lookAt(scene.position);
      // Moving spheres in a circular pattern
      for (let i = 0, il = spheres.current.length; i < il; i++) {
        const sphere = spheres.current[i];
        sphere.position.x = 1000 * Math.cos(timer + i);
        sphere.position.y = 1000 * Math.sin(timer + i * 1.1);
      }
    };

    animate();

    const requestPermission = () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === "granted") {
              window.addEventListener("devicemotion", handleDeviceMotion);
            }
          })
          .catch(console.error);
      } else {
        alert("DeviceMotionEvent is not defined");
      }
    };

    const handleDeviceOrientation = (event) => {
      const alpha = event.alpha;
      const beta = event.beta;
      const gamma = event.gamma;
      orientationDataRef.current = { alpha, beta, gamma };
      setOrientationData({ alpha, beta, gamma });
    };

    const handleDeviceMotion = (event) => {
      const acceleration = event.acceleration;
      const accelerationIncludingGravity = event.accelerationIncludingGravity;
      const rotationRate = event.rotationRate;

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
      if (canvasRef.current) {
        window.removeEventListener(
          "deviceorientation",
          handleDeviceOrientation
        );
        window.removeEventListener("devicemotion", handleDeviceMotion);
      }
    };
  }, []);

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
              Acceleration Including Gravity:
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

export default PrototypeOrientation;
